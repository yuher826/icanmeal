/**
 * constants/index.ts 의 KIDS_PRODUCTS / SILVER_PRODUCTS 24개를
 * supabase/seeds/001_products.sql 로 변환한다.
 *
 * 손으로 24행 SQL 을 쓰면 오타가 난다. 항상 이 스크립트로 생성할 것.
 *
 *   node scripts/gen-product-seed.mjs
 *
 * 상품 정보가 바뀌면 constants/index.ts 를 고치고 이 스크립트를 다시 돌린다.
 * 생성된 SQL 은 slug 기준 UPSERT 라 몇 번을 실행해도 안전하다(멱등).
 */
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.join(process.cwd(), 'constants', 'index.ts')
const OUT = path.join(process.cwd(), 'supabase', 'seeds', '001_products.sql')

const source = fs.readFileSync(SRC, 'utf8')

/** `export const NAME: MonthlyKit[] = [ ... ]` 의 배열 리터럴만 잘라 평가 */
function extractArray(varName) {
  const start = source.indexOf(`export const ${varName}`)
  if (start === -1) throw new Error(`${varName} 를 찾을 수 없음`)
  // 타입 주석 `: MonthlyKit[]` 의 대괄호를 잡지 않도록 '=' 이후부터 탐색한다
  const eq = source.indexOf('=', start)
  if (eq === -1) throw new Error(`${varName} 의 '=' 를 찾을 수 없음`)
  const open = source.indexOf('[', eq)
  if (open === -1) throw new Error(`${varName} 의 '[' 를 찾을 수 없음`)

  // 문자열 리터럴 안의 괄호를 세지 않도록 상태를 추적하며 대응 괄호 탐색
  let depth = 0
  let quote = null
  for (let i = open; i < source.length; i++) {
    const ch = source[i]
    const prev = source[i - 1]
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue }
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        const literal = source.slice(open, i + 1)
        // 객체 리터럴만 있으므로 그대로 평가 가능
        return new Function(`return ${literal}`)()
      }
    }
  }
  throw new Error(`${varName} 의 배열이 닫히지 않음`)
}

const kids = extractArray('KIDS_PRODUCTS')
const silver = extractArray('SILVER_PRODUCTS')
const all = [...kids, ...silver]

if (all.length !== 24) {
  throw new Error(`상품이 24개가 아님: ${all.length}개 (kids ${kids.length} / silver ${silver.length})`)
}

/** SQL 문자열 리터럴 이스케이프 (작은따옴표 중복) */
const q = (v) => (v === undefined || v === null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)

const rows = all.map((p, i) => {
  // sort_order: 라인 내 월 순서 (kids 1~12, silver 1~12)
  const sortOrder = p.month
  return `  (${q(p.id)}, ${q(p.line)}, ${p.month}, ${q(p.name)}, ${q(p.tagline)}, ${q(p.desc)}, ` +
         `${q(p.unit)}, ${p.price}, ${p.video ? 'TRUE' : 'FALSE'}, ${q(p.image)}, 'selling', ${sortOrder})`
})

const sql = `-- ============================================================
-- 001_products.sql — 상품 시드 (키즈 12 + 실버 12 = 24종)
--
-- ⚠️ 이 파일은 자동 생성된다. 직접 수정하지 말 것.
--    생성: node scripts/gen-product-seed.mjs
--    원본: constants/index.ts 의 KIDS_PRODUCTS / SILVER_PRODUCTS
--
-- slug 기준 UPSERT 이므로 여러 번 실행해도 안전하다(멱등).
-- 관리자가 대시보드에서 바꾼 값은 재실행 시 덮어써지니 주의.
--
-- min_order_qty / lead_time_days 는 NULL 로 둔다
--   → app_settings 의 전역 기본값(30세트 / 10영업일)이 적용된다.
--   → 특정 상품만 예외를 두고 싶을 때 해당 행에만 값을 넣는다. (Q6 결정)
-- ============================================================

INSERT INTO products (
  slug, line, month, name, tagline, description,
  unit_label, price, has_video, thumbnail_url, status, sort_order
) VALUES
${rows.join(',\n')}
ON CONFLICT (slug) DO UPDATE SET
  line          = EXCLUDED.line,
  month         = EXCLUDED.month,
  name          = EXCLUDED.name,
  tagline       = EXCLUDED.tagline,
  description   = EXCLUDED.description,
  unit_label    = EXCLUDED.unit_label,
  price         = EXCLUDED.price,
  has_video     = EXCLUDED.has_video,
  thumbnail_url = EXCLUDED.thumbnail_url,
  sort_order    = EXCLUDED.sort_order,
  updated_at    = NOW();

-- 확인용
--   SELECT line, count(*) FROM products WHERE deleted_at IS NULL GROUP BY line;
--   → kids 12 / silver 12 가 나와야 한다.
`

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, sql, 'utf8')

console.log(`생성 완료: ${path.relative(process.cwd(), OUT)}`)
console.log(`  키즈 ${kids.length}종 / 실버 ${silver.length}종 = 총 ${all.length}종`)
console.log(`  가격 범위: ${Math.min(...all.map(p => p.price)).toLocaleString()}원 ~ ${Math.max(...all.map(p => p.price)).toLocaleString()}원`)
