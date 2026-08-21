# 마이그레이션 실행 가이드

**상태: 작성만 완료 — 아직 실행하지 않음.**
아래 순서대로 직접 실행할 것. Claude 는 SQL 을 실행하지 않았다.

---

## 0. 실행 전 필수 확인 — 기존 테이블 유무

> 설계 문서 0-2 참고. anon 키로는 테이블 목록을 열거할 수 없어
> **반드시 대시보드에서 직접 확인**해야 한다.

Supabase Dashboard → 프로젝트 `icanmeal` → **SQL Editor** 에서:

```sql
-- ① public 스키마 테이블 목록
SELECT table_name
  FROM information_schema.tables
 WHERE table_schema = 'public'
 ORDER BY 1;

-- ② 함수 목록 (헬퍼 함수 충돌 확인)
SELECT routine_name
  FROM information_schema.routines
 WHERE routine_schema = 'public'
 ORDER BY 1;

-- ③ Storage 버킷 현황
SELECT id, name, public, file_size_limit
  FROM storage.buckets
 ORDER BY 1;
```

**판단 기준**

| ① 결과 | 조치 |
|---|---|
| 아무것도 없음 | ✅ 그대로 아래 1번 진행 |
| `media` 버킷만 있고 테이블 없음 | ✅ 정상. 그대로 진행 |
| 우리 설계와 같은 이름의 테이블이 있음 | ⛔ **중단하고 알려줄 것.** 이름 충돌 검토 필요 |
| 모르는 테이블이 있음 | ⛔ **중단.** 누가 왜 만들었는지 확인 먼저 |

---

## 1. 실행 순서

**SQL Editor 에서 파일 하나씩, 순서대로.** 한 파일이 성공한 걸 확인하고 다음으로 넘어간다.

| # | 파일 | 내용 | 의존 |
|---|---|---|---|
| 1 | `202608220001_foundation.sql` | 확장 · `update_updated_at()` · `admins` · `app_settings` · `audit_logs` · `email_logs` | — |
| 2 | `202608220002_institutions.sql` | 기관 회원 + 승인 워크플로우 | 1 |
| 3 | `202608220003_products.sql` | 상품 · **`product_prices`(Q5)** · 가격 조회 함수 · `product_materials` | 2 |
| 4 | `202608220004_orders.sql` | 주문 · 주문상세(스냅샷) · 배송 · 채번 함수 | 3 |
| 5 | `202608220005_inquiries.sql` | 문의(회원+비회원 통합) · 메시지 | 4 |
| 6 | `202608220006_rls.sql` | 헬퍼 함수 · RLS 정책 · **컬럼 권한 회수(Q4)** | 5 |
| 7 | `202608220007_storage.sql` | `media`(public) · **`materials`(private)** 버킷 + 정책 | 6 |
| 8 | `seeds/001_products.sql` | 상품 24종 시드 | 3 |

> 6번(RLS)은 반드시 모든 테이블이 만들어진 뒤에 실행해야 한다.
> 7번(Storage)은 헬퍼 함수(`is_admin`, `has_purchased_product`)를 쓰므로 6번 뒤여야 한다.

### 실행 후 검증

```sql
-- 테이블 15개가 생겼는지
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';

-- 상품 시드 확인 → kids 12 / silver 12
SELECT line, count(*) FROM products WHERE deleted_at IS NULL GROUP BY line;

-- RLS 가 전부 켜졌는지 (rowsecurity = false 인 게 있으면 안 됨)
SELECT tablename, rowsecurity
  FROM pg_tables WHERE schemaname = 'public' ORDER BY 1;

-- 헬퍼 함수 존재 확인
SELECT routine_name FROM information_schema.routines
 WHERE routine_schema = 'public' AND routine_name LIKE '%institution%';

-- 가격 조회 동작 확인 (product_prices 가 비어 있어도 기본가가 나와야 정상)
SELECT slug, price,
       public.resolve_product_price(id, NULL) AS resolved
  FROM products ORDER BY slug LIMIT 5;
```

마지막 쿼리에서 `price` 와 `resolved` 가 같으면 Q5 폴백이 정상 동작하는 것이다.

---

## 2. 최초 관리자 계정 만들기

RLS 때문에 관리자 없이는 아무것도 못 한다. **시드 직후 반드시 1명 등록.**

```
① Dashboard → Authentication → Users → Add user
   이메일/비밀번호로 계정 생성 → 생성된 UUID 복사
```

```sql
-- ② admins 에 등록 (UUID 와 이메일을 실제 값으로 교체)
INSERT INTO admins (auth_id, name, email, role)
VALUES ('붙여넣은-UUID', '유대표', 'you@example.com', 'super_admin');

-- ③ 확인 — TRUE 가 나와야 한다 (해당 계정으로 로그인한 세션에서)
SELECT public.is_admin(), public.is_super_admin();
```

---

## 3. Storage `materials` 버킷 — 실제 게이트 구현

7번 마이그레이션이 버킷과 정책을 만들지만, **그것만으로는 부족하다.**

### 경로 규칙 (반드시 지킬 것)

```
materials/{product_slug}/{type}/{파일명}
  예) materials/kids-01/lesson_plan/만두_교안.pdf
      materials/silver-08/video/수박화채_수업영상.mp4
```

정책이 **첫 번째 폴더명을 `products.slug` 로 해석**해 구매 여부를 판정한다.
경로 규칙이 깨지면 접근 제어가 통째로 무력화된다.

### 서버에서 파일 내려주는 올바른 순서

```ts
// app/api/materials/[id]/route.ts (예시 — 아직 미구현)
// 1) 세션 확인
const supabase = createServerClient(...)
const { data: { user } } = await supabase.auth.getUser()
if (!user) return new Response('Unauthorized', { status: 401 })

// 2) product_materials 조회 — RLS 가 구매 여부를 이미 걸러준다
const { data: material } = await supabase
  .from('product_materials')
  .select('storage_path, bucket_id, title')
  .eq('id', params.id)
  .single()
if (!material) return new Response('Not found', { status: 404 })

// 3) signed URL 발급 (1시간 만료)
const { data: signed } = await supabase.storage
  .from(material.bucket_id)
  .createSignedUrl(material.storage_path, 3600)

// 4) 클라이언트에는 signed URL 만 전달 (storage_path 노출 금지)
return Response.json({ url: signed.signedUrl })
```

> ⛔ 키즈밀 `app/api/download/route.ts` 를 복사하지 말 것.
> 인증이 없고 임의 URL 을 프록시해 SSRF 까지 열려 있다.

### 히어로 영상은 그대로 public

`media` 버킷은 마케팅 자산이라 공개가 맞다 (Q2 결정 A안).
`constants/index.ts` 의 `HERO_VIDEOS` 는 변경 불필요.

---

## 4. 롤백

### 부분 실패 시

각 파일은 `IF NOT EXISTS` / `DROP ... IF EXISTS` 로 작성돼 있어
**같은 파일을 다시 실행해도 안전**하다(멱등). 오류만 고쳐 재실행하면 된다.

### 전체 되돌리기

`ROLLBACK_all.sql` 실행. **⚠️ 데이터가 전부 지워진다.**

| 상황 | 롤백 가능? |
|---|---|
| 실데이터 없음 (지금) | ✅ 안전 |
| 기관 가입만 있음 | ⚠️ 가입 데이터 손실 — 백업 먼저 |
| 주문 발생 후 | ⛔ **금지.** 전자상거래법상 주문 기록 5년 보관 의무 |

`ROLLBACK_all.sql` 은 파일명이 타임스탬프로 시작하지 않는다.
"순서대로 실행" 대상이 아님을 파일명으로 구분하기 위함이다.
Storage 버킷은 기본적으로 **지우지 않는다** (업로드한 영상이 날아가므로).

---

## 5. 실행 후 할 일

- [ ] 최초 관리자 계정 등록 (위 2번)
- [ ] `SELECT public.is_admin()` → `TRUE` 확인
- [ ] 상품 24종 시드 확인 (kids 12 / silver 12)
- [ ] `resolve_product_price()` 가 기본가를 돌려주는지 확인
- [ ] `types/index.ts` 를 실제 스키마에 맞게 갱신
      (현재 타입 정의는 설계 이전 것이라 컬럼이 다르다)
- [ ] 가입 폼에 누락 필드 추가
      (대표자명 · 배송지 5종 · 세금계산서 3종 · 동의 시각 3종)
- [ ] `middleware.ts` 를 deny-by-default 로 전환
- [ ] 상품 페이지를 `constants` → DB 조회로 교체 (설계문서 7장, ISR 권장)

---

## 6. 참고

| 문서 | 내용 |
|---|---|
| `docs/DB_DESIGN_DRAFT.md` | 설계 근거 · 테이블 상세 · RLS 초안 · 법인분리 점검 |
| `CLAUDE.md` | 개발 규칙 · 법인 분리 5원칙 |
| `scripts/gen-product-seed.mjs` | 상품 시드 SQL 생성기 (`constants/index.ts` → SQL) |

상품 정보가 바뀌면:

```bash
# constants/index.ts 수정 후
node scripts/gen-product-seed.mjs
# → supabase/seeds/001_products.sql 재생성 (slug 기준 UPSERT 라 재실행 안전)
```
