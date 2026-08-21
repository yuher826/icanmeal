# 아이캔밀 DB 설계 (DB_DESIGN_DRAFT)

작성일: 2026-08-21 · 갱신: 2026-08-22
상태: **Q1~Q7 결정 완료 → 마이그레이션 SQL 작성 완료 (아직 미실행)**

| | |
|---|---|
| 설계 근거 | 이 문서 |
| 실제 SQL | `supabase/migrations/2026082200*.sql` |
| 실행 절차·롤백 | `docs/MIGRATION_GUIDE.md` |

> ⚠️ SQL 은 **작성만** 되어 있고 실행하지 않았다.
> 실행 전 대시보드에서 기존 테이블 유무를 반드시 확인할 것 (0-4 / 실행 가이드 0장).

## 결정 사항 요약 (2026-08-22 확정)

| Q | 결정 | 이 문서 반영 |
|---|---|---|
| Q1 문의 통합 | **회원/비회원 한 테이블** | 4-7 |
| Q2 영상 게이트 | **히어로 public 유지 + `materials` private 신설** | 6-3, 0-5 |
| Q3 사업자번호 | **UNIQUE 안 걸기** (분원 각각 가입) | 4-2 |
| Q4 민감컬럼 | **`REVOKE UPDATE` 방식** | 6-3 ① |
| Q5 기관별 단가 | **차등 있음 — Phase 1 으로 승격** ★ | 4-3b (신설) |
| Q6 최소주문/리드타임 | **전역 기본값 + 상품별 예외** | 4-3, 4-0 |
| Q7 URL 오타 | 처리 완료 | 0-1 |

> **조사 범위 고지**
> `kizmeal-renewal` 은 **읽기 전용**으로만 열람했다 (Read / Glob / Grep).
> 파일 생성·수정·삭제, git, npm, 빌드 일절 없음.

---

## 0. 조사하며 발견한 것 (먼저 봐야 할 것)

### ✅ 0-1. `.env.local` 의 Supabase URL 오타 — **2026-08-21 수정 완료**

| 항목 | 값 |
|---|---|
| 수정 전 `.env.local` | `https://uauprcrksii**l**uxhvrac.supabase.co` (i 2개) ❌ |
| ANON_KEY 안의 `ref` 클레임 (정본) | `uauprcrksii**il**uxhvrac` (i 3개) |
| CLAUDE.md 기재 | `uauprcrksiiiluxhvrac` (i 3개) ✅ 원래 정확했음 |
| 수정 후 `.env.local` | `https://uauprcrksiiiluxhvrac.supabase.co` ✅ |

`.env.local` 의 URL만 **`i` 가 한 글자 빠져 있었다.** 오타 URL은 DNS 해석 실패(`fetch failed`),
정정 후에는 Auth/Storage 모두 200 응답을 확인했다.

> 함께 처리: `constants/index.ts` 의 `HERO_VIDEOS` 3개에 프로젝트 URL이 하드코딩돼 있던 것을
> `process.env.NEXT_PUBLIC_SUPABASE_URL` 참조로 교체 (법인 분리 원칙 3).
> **Vercel 환경변수에도 같은 오타가 있는지는 대시보드에서 별도 확인 필요** (아래 0-4).

### ⚠️ 0-2. icanmeal Supabase 테이블 현황 — **미확정 (초판 기재 내용 정정)**

> **정정**: 초판에 "노출된 테이블/뷰 **0개** — 완전한 백지" 라고 적었으나 **이는 틀렸다.**
> `GET /rest/v1/` (OpenAPI) 는 `service_role` 키 전용 엔드포인트라 anon 키로는 401을 반환하는데,
> 확인 코드가 `Object.keys(json.paths || {})` 로 처리해 **에러 본문을 조용히 "0개"로 오독**했다.

anon 키로 다시 확인한 사실:

| 확인 | 결과 |
|---|---|
| 프로젝트 생존 여부 | `/auth/v1/health` → **200** (정상 가동 중) |
| `institutions`/`products`/`orders`/`inquiries`/`admins`/`profiles`/`users` 조회 | 전부 **404 `PGRST205`** (스키마 캐시에 없음) |
| 존재하지 않는 이름(`__probe__`) 조회 | 동일하게 404, `hint: null` (유사 테이블 제안 없음) |

→ **비어 있을 가능성이 높지만 확정은 아니다.** anon 키만으로는 테이블 목록을 열거할 수 없다.
**마이그레이션 1번을 실행하기 전에 대시보드에서 직접 확인할 것** (0-4 절차 참고).
확인 결과 테이블이 있다면 이 설계안의 테이블명 충돌 여부를 먼저 점검해야 한다.

### 🟢 0-3. `media` 버킷이 public 임을 실측 확인

`/storage/v1/object/public/media/videos/home_hero_opening.mp4` 가 **인증 없이 200**.
→ CLAUDE.md 기재대로 public 이 맞고, 아래 0-5(영상 게이트) 문제가 실재함을 확인.

### 📋 0-4. 대시보드에서 직접 확인해야 할 2가지

anon 키만으로는 확인이 불가능해 **사람이 직접 봐야 하는** 항목이다.

**(A) 기존 테이블 유무** — 마이그레이션 실행 전 필수
```
Supabase Dashboard → 프로젝트 icanmeal 선택
  → 좌측 Table Editor : public 스키마 테이블 목록 확인
  → 또는 SQL Editor 에서:
      SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' ORDER BY 1;
```

**(B) Vercel 환경변수의 URL 오타 여부** — 배포본이 지금 깨져 있을 수 있음
```
vercel.com → 프로젝트 icanmeal → Settings → Environment Variables
  → NEXT_PUBLIC_SUPABASE_URL 값 확인
  → 'uauprcrksiiiluxhvrac' (i 3개) 인지 확인. i 2개면 수정 후 재배포(Redeploy) 필요
  ※ Production / Preview / Development 3개 환경 각각 확인할 것
```

### 🟡 0-5. 영상 게이트는 현재 구조로는 원리적으로 불가능

`media` 버킷이 **public** 임을 0-3에서 실측 확인했다. public 버킷은 URL만 알면 누구나 받는다.
"주문 완료 기관만 영상 접근" 을 실제로 강제하려면 **private 버킷 + signed URL** 이 필요하다.
DB 설계(RLS)만으로는 해결되지 않는 문제라 별도 결정이 필요하다 → 질문 Q2.

---

## 1. 키즈밀에서 발견한 재활용 가능 패턴

코드를 베끼는 게 아니라 **검증된 설계 패턴**만 가져온다.

### 1-1. 그대로 가져올 것 ✅

| # | 패턴 | 출처 | 아이캔밀 적용 |
|---|---|---|---|
| 1 | `update_updated_at()` 공용 트리거 함수 | `phase1_schema.sql:12` | 전 테이블 `updated_at` 자동 갱신 |
| 2 | **`is_admin()` SECURITY DEFINER 헬퍼** | `phase1_schema.sql:311` | RLS 무한재귀 회피. 가장 중요한 패턴 |
| 3 | **`get_my_branch_id()` 헬퍼로 소속 판별 추상화** | `phase1_schema.sql:326` | `get_my_institution_id()` — 아래 1-4 참고 |
| 4 | 승인 워크플로우 컬럼 세트 | `parent_schema.sql:12-15` | `status` + `rejected_reason` + `approved_at` + `approved_by` |
| 5 | 스레드 + 메시지 2테이블 구조 | `inquiry_restructure.sql` | 1:1 문의 게시판 |
| 6 | 비정규화 unread 카운터 | `parent_inquiries.unread_count_*` | 목록에서 N+1 쿼리 없이 뱃지 표시 |
| 7 | `last_message_at` 정렬 컬럼 | `inquiries:149` | 목록 정렬 전용 (인덱스 포함) |
| 8 | 부분 인덱스 `WHERE is_read = FALSE` | `phase1_schema.sql:277` | 안읽음 조회 최적화 |
| 9 | `COMMENT ON TABLE/COLUMN` 습관 | 전반 | 대시보드에서 바로 읽힘 |
| 10 | 마스터계정 + 서브계정 + 초대토큰 | `branches`/`branch_members`/`branch_invitations` | 한 기관 여러 담당자 |
| 11 | `audit_logs` (actor 이름 스냅샷 포함) | `branch_management.sql:35` | 관리자 활동 추적 |
| 12 | 비회원 문의: 문의번호 + `password_hash` 조회 | `api/public-inquiry/submit` | bcrypt + 문의번호로 비로그인 조회 |
| 13 | 스팸 방어: honeypot + 동일 연락처 일일 제한 | 같은 파일 | 공개 문의 폼 필수 |
| 14 | Resend: `getResend()` 지연초기화 + `resolveRecipient()` 테스트모드 | `lib/email.ts:9-19` | 실수로 실고객에게 발송 방지 |
| 15 | 권한 상수 중앙화 + **capability 배열** | `lib/roles.ts` | `UPLOAD_ROLES` 처럼 "역할"이 아니라 "행위" 기준 |
| 16 | GitHub Actions `workflow_dispatch` + service key secret | `.github/workflows/generate-pptx.yml` | 교안 자동화 |
| 17 | DB 트리거로 알림 자동 생성 | `phase3_schema.sql:77` | 관리자 답변 시 알림 INSERT |

### 1-2. 키즈밀이 겪은 사고 — 반복하지 말 것 ⛔

| # | 사고 | 근거 | 아이캔밀 규칙 |
|---|---|---|---|
| 1 | **인라인 CHECK 제약에 이름을 안 줘서 마이그레이션 지옥** | `20260619000001_fix_diet_review_items_status_constraint.sql` 전체가 이 사고 수습용. `pg_constraint` 를 뒤져 이름 패턴으로 DROP 하는 코드까지 등장 | **모든 CHECK 는 `CONSTRAINT 이름` 명시.** 이 문서의 모든 DDL이 그렇게 되어 있다 |
| 2 | **대시보드로만 만든 테이블은 SQL에 안 남는다** | `public_inquiries` 는 코드에서 쓰는데 `supabase/` 어디에도 CREATE 문이 없음 | 법인분리 원칙 2 그 자체. 예외 없이 마이그레이션 파일로 |
| 3 | **role 문자열 불일치** | `admins.role` CHECK 는 `'super_admin'` 인데 `audit_logs` RLS 는 `role = 'super'` 로 비교 → 그 정책은 **아무도 통과 못 함** | role 문자열은 `lib/roles.ts` 상수 + DB CHECK 를 한 곳에서 관리 |
| 4 | **다운로드 API에 권한 체크가 아예 없음** | `app/api/download/route.ts` — 임의 URL을 그대로 fetch 해서 프록시. 인증 없음 + SSRF | 교안/영상 다운로드는 **반드시** 세션 → 소유권 확인 → signed URL 순서 |
| 5 | **문의 시스템이 3벌로 갈라짐** | `inquiries` / `public_inquiries` / `parent_inquiries` + 관리자 페이지 3개 | 아이캔밀은 1벌로 통합 시도 → 질문 Q1 |
| 6 | 주문/문의번호 채번이 `count()+1` 이라 경쟁 조건 | `submit/route.ts:57-62`, 23505 나면 재시도로 땜빵 | 원자적 카운터 테이블 사용 (아래 4-4) |
| 7 | 이메일 본문에 사용자 입력을 이스케이프 없이 삽입 | `lib/email.ts` 의 `${content}` | HTML 이스케이프 후 삽입 |
| 8 | 이메일 발송 이력 테이블이 없음 | — | `email_logs` 를 처음부터 둠 |
| 9 | 하드코딩된 BASE_URL / 수신자 이메일 | `lib/email.ts:5,7,131` | 전부 환경변수 |

### 1-3. 아이캔밀 현재 코드에서 같이 고칠 것

`icanmeal/middleware.ts:4` 는 `PROTECTED_PATHS` **열거 방식**이다.
키즈밀은 정확히 이걸로 사고를 낸 뒤 주석까지 남겨두었다:

> `middleware.ts:55` — *"열거식 금지 — 공개 경로만 명시적으로 제외하고, 그 외 전부를 기본적으로 '보호 대상'으로 취급한다. 새 페이지가 추가돼도 자동으로 보호되어 이번 같은 누락이 재발하지 않는다."*

→ 아이캔밀도 **deny-by-default** 로 바꿔야 한다. (이번 턴 범위 밖, 구현 시 반영)

### 1-4. 가장 중요한 한 가지 — `get_my_institution_id()`

"한 기관에 담당자 여러 명" 을 **나중에** 붙이더라도, RLS 헬퍼 함수는 **처음부터** 만든다.

```sql
-- v1: institutions.auth_id 만 확인
-- v2: institution_members 조회를 이 함수 안에만 추가
--     → RLS 정책 수십 개를 한 줄도 고치지 않아도 됨
```

키즈밀이 `get_my_branch_id()` 안에서 마스터/서브계정을 모두 처리하는 것과 같은 구조다.
이 함수 하나가 "다계정 지원"의 마이그레이션 비용을 거의 0으로 만든다.

---

## 2. 텍스트 ERD

```
                         ┌──────────────┐
                         │  auth.users  │  ← Supabase 기본 (유일한 외부 의존)
                         └──────┬───────┘
              ┌─────────────────┼──────────────────┐
              │                 │                  │
      ┌───────▼──────┐  ┌───────▼────────┐  ┌──────▼──────────────┐
      │   admins     │  │ institutions   │  │ institution_members │ [P2]
      │  (관리자)     │  │  (기관 회원)    │◄─┤   (기관 담당자들)     │
      └───────┬──────┘  └───┬────────┬───┘  └─────────────────────┘
              │             │        │
              │             │        └──────────────┐
              │             │                       │
              │      ┌──────▼─────────┐    ┌────────▼───────────┐
              │      │shipping_       │    │    inquiries       │
              │      │addresses  [P2] │    │  (1:1 문의 스레드)   │
              │      └────────────────┘    └────────┬───────────┘
              │                                     │ 1:N
              │                            ┌────────▼───────────┐
              │                            │ inquiry_messages   │
              │                            └────────────────────┘
              │
              │      ┌──────────────┐         ┌────────────────────┐
              │      │   orders     │────1:N──│    order_items     │
              │      │   (주문)      │         │ (상품 스냅샷 보관)   │
              │      └──────┬───────┘         └─────────┬──────────┘
              │             │ 1:N                       │ N:1
              │      ┌──────▼───────┐                   │
              │      │  shipments   │         ┌─────────▼──────────┐
              │      │   (배송)      │         │     products       │
              │      └──────────────┘         │   (12개월 x 2라인)   │
              │                               └──┬──────────────┬──┘
              │                            1:N   │              │  1:N
      ┌───────▼──────┐   ┌──────────────┐  ┌─────▼──────────┐ ┌─▼──────────────────┐
      │  audit_logs  │   │  email_logs  │  │ product_prices │ │ product_materials  │
      │ (활동 추적)    │   │ (발송 이력)   │  │ 기관별 단가 ★Q5 │ │ (교안·활동지·영상)   │
      └──────────────┘   └──────────────┘  └─────┬──────────┘ └────────────────────┘
                                                 │ N:1 (institution_id, nullable)
                                                 └──────────▶ institutions

      ┌──────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐
      │ order_number_counters│  │inquiry_number_counters│  │  app_settings   │
      │  주문번호 원자적 채번   │  │   문의번호 채번         │  │ 전역 기본값(단일행)│
      └──────────────────────┘  └───────────────────────┘  └─────────────────┘

  [P2] = Phase 2 (지금은 안 만듦, 컬럼/함수만 대비)
  ★Q5 = 이번 결정으로 Phase 2 → Phase 1 승격
```

**관계 요약**

- `institutions 1 : N orders` — 기관이 여러 번 주문
- `orders 1 : N order_items` — 주문에 여러 상품
- `orders 1 : N shipments` — **분원 다중 배송 대비** (v1은 실질 1:1)
- `products 1 : N order_items` — `ON DELETE RESTRICT` (상품 하드삭제 금지)
- `products 1 : N product_materials` — 교안/활동지/PPT/영상
- **`products 1 : N product_prices`** — 등급가 또는 기관 전용가 (★Q5)
- **`institutions 0..1 : N product_prices`** — 기관 전용가일 때만 연결
- `inquiries 1 : N inquiry_messages`
- `institutions 0..1 : N inquiries` — **NULL 이면 비회원 문의**

### 가격 결정 흐름 (★Q5)

```
주문서에서 단가를 구할 때 — resolve_product_price(product_id, institution_id)

  ① product_prices 에 이 기관 전용가가 있나?  ──있음──▶ 그 값 사용
        │ 없음
        ▼
  ② product_prices 에 이 기관 등급(price_tier)의 가격이 있나? ──있음──▶ 그 값 사용
        │ 없음
        ▼
  ③ products.price (기본가) 사용

  → product_prices 가 비어 있어도 ③ 으로 폴백하므로 지금 당장 정상 동작한다.
    나중에 데이터만 넣으면 주문 로직 수정 없이 차등가가 적용된다.
```

---

## 3. 공통 규칙

### 3-1. 전 테이블 공통

| 규칙 | 내용 |
|---|---|
| PK | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| 시각 | `TIMESTAMPTZ` (절대 `TIMESTAMP` 금지 — 시간대 사고) |
| 금액 | `INTEGER` (원 단위 정수). `NUMERIC`/`FLOAT` 금지 |
| 생성/수정 | `created_at`, `updated_at` 전부 `NOT NULL DEFAULT NOW()` + 트리거 |
| CHECK | **반드시 이름 부여** (`CONSTRAINT xxx_yyy_check`) |
| 네이밍 | 테이블 복수형 snake_case, 컬럼 snake_case |
| 주석 | 주요 테이블/컬럼에 `COMMENT ON` |

### 3-2. `deleted_at` (소프트 삭제) — 선택적 적용 ⭐ 판단

전부에 다는 건 반대다. **성격에 따라 나눈다.**

| 구분 | 대상 | 방식 | 이유 |
|---|---|---|---|
| 소프트 삭제 O | `institutions`, `products`, `admins`, `product_materials` | `deleted_at TIMESTAMPTZ` | 마스터 데이터. 과거 주문이 참조 중이라 물리 삭제 불가 |
| 소프트 삭제 X | `orders`, `order_items`, `shipments` | `status='cancelled'` 로 관리 | 회계·전자상거래법상 기록 자체를 남겨야 함. `deleted_at` 은 오히려 혼란 |
| 소프트 삭제 X | `inquiry_messages`, `audit_logs`, `email_logs` | 삭제 없음 (append-only) | 로그의 존재 이유가 불변성 |

> 소프트 삭제를 쓰는 테이블은 RLS/쿼리에서 `deleted_at IS NULL` 을 빠뜨리기 쉽다.
> → **`v_active_products` 같은 뷰를 만들어 앱은 뷰만 보게** 하는 걸 권장.

---

## 4. 테이블 상세

범례: 🟢 **키즈밀 그대로** / 🟡 **수정해서** / 🔵 **새로 만듦**

### 4-1. `admins` — 🟢 키즈밀 그대로

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `auth_id` | UUID | Y | — | `auth.users(id)` UNIQUE, `ON DELETE SET NULL` |
| `name` | TEXT | N | — | 관리자 이름 |
| `email` | TEXT | N | — | UNIQUE |
| `role` | TEXT | N | `'admin'` | `super_admin` \| `admin` |
| `is_active` | BOOLEAN | N | `TRUE` | 비활성 시 즉시 권한 상실 |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**관리자 판별을 왜 별도 테이블로 하나 (⭐ 판단)**

| 방식 | 장점 | 단점 | 판정 |
|---|---|---|---|
| `auth.users.raw_app_meta_data.role` | JWT에 실려 RLS가 빠름 | 권한 변경 시 **재로그인 필요**, 대시보드 수정이 번거로움 | ✗ |
| **별도 `admins` 테이블** | 즉시 반영, `is_active` 로 즉시 차단, 이름·부서 등 확장 자유 | RLS에서 서브쿼리 (→ `is_admin()` SECURITY DEFINER 로 해결) | **✓ 채택** |

키즈밀에서 검증된 방식이고, 법인분리 원칙 5(`auth.users` 외 의존 없음)도 만족한다.

---

### 4-2. `institutions` — 🟡 수정해서 (`branches` + `parents` 혼합)

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `auth_id` | UUID | Y | — | `auth.users(id)` UNIQUE. **v1의 마스터 계정** |
| `name` | TEXT | N | — | 기관명 |
| `institution_type` | TEXT | N | — | `daycare`/`kindergarten`/`elementary`/`welfare_center`/`senior_center`/`hospital`/`other` |
| `business_number` | TEXT | Y | — | 사업자등록번호 (하이픈 제거 저장) → 질문 Q3 |
| `representative_name` | TEXT | Y | — | 대표자명 |
| `contact_name` | TEXT | N | — | 담당자명 |
| `contact_phone` | TEXT | N | — | 담당자 연락처 |
| `contact_email` | TEXT | N | — | 담당자 이메일 (로그인 이메일과 다를 수 있음) |
| `zip_code` | TEXT | Y | — | 기관 주소 |
| `address` | TEXT | Y | — | |
| `address_detail` | TEXT | Y | — | |
| `ship_same_as_address` | BOOLEAN | N | `TRUE` | 배송지가 기관주소와 동일한지 |
| `ship_recipient_name` | TEXT | Y | — | 배송지(기본) — 수령인 |
| `ship_phone` | TEXT | Y | — | |
| `ship_zip_code` | TEXT | Y | — | |
| `ship_address` | TEXT | Y | — | |
| `ship_address_detail` | TEXT | Y | — | |
| `tax_email` | TEXT | Y | — | 세금계산서 수신 이메일 |
| `tax_manager_name` | TEXT | Y | — | 계산서 담당자 |
| `tax_manager_phone` | TEXT | Y | — | |
| `status` | TEXT | N | `'pending'` | `pending`/`reviewing`/`approved`/`rejected`/`suspended` |
| `rejected_reason` | TEXT | Y | — | 반려 사유 |
| `approved_at` | TIMESTAMPTZ | Y | — | |
| `approved_by` | UUID | Y | — | `admins(id)` |
| `suspended_at` | TIMESTAMPTZ | Y | — | 정지 시각 |
| `suspended_reason` | TEXT | Y | — | |
| `price_tier` | TEXT | N | `'standard'` | 기관별 단가 차등 대비 → 질문 Q5 |
| `agreed_terms_at` | TIMESTAMPTZ | Y | — | 약관 동의 시각 (법적 증빙) |
| `agreed_privacy_at` | TIMESTAMPTZ | Y | — | |
| `agreed_marketing_at` | TIMESTAMPTZ | Y | — | NULL = 미동의 |
| `admin_memo` | TEXT | Y | — | 내부 메모 (기관에게 안 보임) |
| `anonymized_at` | TIMESTAMPTZ | Y | — | 탈퇴 후 개인정보 마스킹 완료 시각 |
| `deleted_at` | TIMESTAMPTZ | Y | — | 소프트 삭제 |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**현재 가입 폼(`app/auth/register/page.tsx`) 대비 추가된 것**
`representative_name`, 배송지 5종, 세금계산서 3종, 동의 시각 3종.
→ 가입 폼도 같이 손봐야 한다 (구현 단계에서).

**상태 전이**

```
       가입신청
          │
          ▼
      [pending] ──관리자 확인──▶ [reviewing]
          │                          │
          │                ┌─────────┴─────────┐
          │                ▼                   ▼
          └──────────▶ [approved]         [rejected]
                           │              (rejected_reason 필수)
                    정지 ──┤
                           ▼
                      [suspended] ──해제──▶ [approved]
```

`approved` 상태에서만 주문 가능. `pending`/`rejected`/`suspended` 는 로그인은 되되
안내 페이지로 리다이렉트 (키즈밀 `middleware.ts:127-145` 패턴).

---

### 4-3. `products` — 🔵 새로 만듦

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `slug` | TEXT | N | — | UNIQUE. `kids-01` 처럼 현 `constants` 의 id 재사용 |
| `line` | TEXT | N | — | `kids` \| `silver` |
| `month` | INT | N | — | 1~12 (CHECK) |
| `name` | TEXT | N | — | 상품명 (예: 만두 만들기) |
| `tagline` | TEXT | Y | — | 카피문구 (예: 복이 가득! 영양 가득!) |
| `description` | TEXT | Y | — | 카드 하단 설명 |
| `detail_html` | TEXT | Y | — | 상세페이지 본문 (시안 미수령 → 확장용) |
| `price` | INT | N | `0` | 단가(원, VAT 별도) |
| `unit_label` | TEXT | Y | — | `3개`, `150ml 내외` 등 표시용 |
| `portion_count` | INT | Y | — | 수치 필요 시 |
| `status` | TEXT | N | `'preparing'` | `selling`/`soldout`/`preparing`/`hidden` |
| `min_order_qty` | INT | N | `30` | **최소 주문 세트** (시안: 30세트) → 질문 Q6 |
| `lead_time_days` | INT | N | `10` | **배송 N영업일 전 주문** (시안: 10) |
| `cook_time_min` | INT | Y | — | 소요시간(분) |
| `difficulty` | TEXT | Y | — | `easy`/`medium`/`hard` |
| `age_min` / `age_max` | INT | Y | — | 대상 연령 |
| `allergens` | TEXT[] | N | `'{}'` | 14대 알레르기 코드 배열 (GIN 인덱스) |
| `ingredients` | JSONB | N | `'[]'` | 재료구성 `[{name, amount}]` |
| `steps` | JSONB | N | `'[]'` | 조리순서 `[{no, text, image_url}]` |
| `storage_type` | TEXT | Y | — | `refrigerated`/`frozen`/`room_temp` |
| `notice` | TEXT | Y | — | "기관 즉석취식 불가" 같은 안내 |
| `thumbnail_url` | TEXT | Y | — | `/images/products/...` |
| `images` | TEXT[] | N | `'{}'` | 추가 이미지 |
| `video_url` | TEXT | Y | — | Supabase Storage 영상 |
| `has_video` | BOOLEAN | N | `FALSE` | 카드의 "🎬 영상포함" 뱃지 |
| `stock_managed` | BOOLEAN | N | `FALSE` | 재고관리 사용 여부 (지금은 전부 false) |
| `stock_quantity` | INT | Y | — | 재고관리 시에만 사용 |
| `sort_order` | INT | N | `0` | 정렬 |
| `is_featured` | BOOLEAN | N | `FALSE` | 홈 "이번 달 추천" |
| `deleted_at` | TIMESTAMPTZ | Y | — | 소프트 삭제 |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

`UNIQUE (line, month)` 를 걸지는 **보류** — 한 달에 2종 이상 낼 가능성이 있어서
`sort_order` 로 정렬하고 유니크는 `slug` 에만 건다.

**⚠️ 알레르기 배열 vs 별도 테이블 (⭐ 판단)**
`TEXT[]` + GIN 인덱스 채택. 14개 고정 코드라 조인 테이블의 이득이 없고,
`allergens @> '{egg}'` 로 필터가 충분히 빠르다. `types/index.ts` 의 `Allergen` 유니온과도 맞는다.

**Q6 반영 — 최소주문/리드타임은 NULL 이 기본**
`min_order_qty` / `lead_time_days` 를 `NULL` 로 두면 `app_settings` 의 전역값
(30세트 / 10영업일)이 적용된다. 특정 상품만 예외를 두고 싶을 때 그 행에만 값을 넣는다.
조회는 `resolve_product_pricing()` 이 `COALESCE(상품값, 전역값)` 으로 처리한다.

---

### 4-3b. `product_prices` — 🔵 새로 만듦 ★Q5 (Phase 2 → Phase 1 승격)

> **결정 변경 기록**: 초판에서는 "기관별 단가 차등"을 `institutions.price_tier` 컬럼만
> 두고 Phase 2 로 미뤘다. 허이사님 확인 결과 **실제로 필요한 기능**으로 확정되어
> 테이블과 조회 로직을 **이번 마이그레이션에 포함**한다.
> 데이터는 비워둔 채 시작하고, 나중에 행만 넣으면 동작한다.

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `product_id` | UUID | N | — | `products(id)` `ON DELETE CASCADE` |
| `price_tier` | TEXT | Y | — | 등급가. `standard`/`preferred`/`partner` |
| `institution_id` | UUID | Y | — | 기관 전용가. `institutions(id)` `ON DELETE CASCADE` |
| `price` | INT | N | — | 단가(원, VAT 별도) |
| `valid_from` | DATE | Y | — | NULL = 과거부터 유효 |
| `valid_until` | DATE | Y | — | NULL = 무기한 |
| `memo` | TEXT | Y | — | "2026 연간계약가" 등 |
| `created_by` | UUID | Y | — | `admins(id)` |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**핵심 제약 — 등급가 XOR 기관전용가**

```sql
CONSTRAINT product_prices_target_check CHECK (
  (price_tier IS NOT NULL AND institution_id IS NULL)
  OR (price_tier IS NULL AND institution_id IS NOT NULL)
)
```

한 행은 **등급가이거나 기관전용가이지, 둘 다일 수 없다.** 이 제약이 없으면
"등급도 지정됐고 기관도 지정된" 행이 생겨 우선순위 판정이 모호해진다.

**왜 `products` 에 컬럼을 더하지 않고 별도 테이블인가 (⭐ 판단)**

| 방식 | 문제 |
|---|---|
| `products.price_preferred`, `price_partner` … 컬럼 추가 | 등급이 늘 때마다 **스키마 변경**. 기관 전용가는 아예 불가능 |
| 기관마다 상품 복제 | 24종 × 기관 수. 관리 불가 |
| **별도 `product_prices` 테이블** | 등급 추가·기관 전용가·유효기간 전부 데이터로 처리 ✅ |

**유효기간을 왜 넣나**
"3월부터 단가 인상" 같은 요구가 반드시 온다. 유효기간이 없으면
그날 수동으로 UPDATE 해야 하고, 과거 시점 가격을 재현할 수 없다.

**주문 시 스냅샷과의 관계**
`order_items.unit_price_snapshot` 에는 `resolve_product_price()` 결과(그 기관 실제 단가)를,
`base_price_snapshot` 에는 당시 정가를 넣는다. 두 값을 함께 남겨야
나중에 "이 기관에 얼마나 할인해줬나" 를 추적할 수 있다.

---

### 4-3c. `app_settings` — 🔵 새로 만듦 (Q6)

전역 운영 기본값을 담는 **단일 행** 테이블.

| 컬럼 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `id` | BOOLEAN | `TRUE` | PK. `CHECK (id = TRUE)` 로 단일 행 강제 |
| `default_min_order_qty` | INT | `30` | 기본 최소 주문 세트 (시안 기준) |
| `default_lead_time_days` | INT | `10` | 기본 리드타임 (영업일) |
| `free_shipping_threshold` | INT | `200000` | 무료배송 기준액 |
| `default_shipping_fee` | INT | `3000` | 기본 배송비 |
| `vat_rate` | NUMERIC(5,4) | `0.10` | 부가세율 |
| `price_includes_vat` | BOOLEAN | `FALSE` | 상품가가 VAT **별도**임을 명시 |

단일 행 강제는 `id BOOLEAN PRIMARY KEY CHECK (id = TRUE)` 관용구를 쓴다.
행이 여러 개 생겨 "어느 게 진짜 설정인가" 를 고민하는 사고를 원천 차단한다.

---

### 4-4. `orders` — 🔵 새로 만듦

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `order_number` | TEXT | N | — | UNIQUE. `ICM-2026-000123` |
| `institution_id` | UUID | N | — | `institutions(id)` `ON DELETE RESTRICT` |
| `created_by_auth_id` | UUID | Y | — | **누가 주문했는지.** 다계정 전환 대비 핵심 컬럼 |
| `order_type` | TEXT | N | `'one_time'` | `one_time` \| `subscription` (정기주문 대비) |
| `status` | TEXT | N | `'received'` | 아래 상태도 참고 |
| `ordered_at` | TIMESTAMPTZ | N | `NOW()` | |
| `desired_delivery_date` | DATE | Y | — | 희망 배송일 |
| `delivered_at` | TIMESTAMPTZ | Y | — | 실제 배송 완료 |
| `subtotal_amount` | INT | N | `0` | 상품 합계 |
| `discount_amount` | INT | N | `0` | 할인 (쿠폰 대비) |
| `shipping_fee` | INT | N | `0` | 배송비 (스냅샷) |
| `vat_amount` | INT | N | `0` | 부가세 |
| `total_amount` | INT | N | `0` | 최종 결제금액 |
| `payment_method` | TEXT | Y | — | `card`/`transfer`/`tax_invoice`/`quote` |
| `payment_status` | TEXT | N | `'unpaid'` | `unpaid`/`paid`/`failed`/`refunded`/`partially_refunded` |
| `toss_order_id` | TEXT | Y | — | UNIQUE. 토스에 넘기는 주문ID |
| `toss_payment_key` | TEXT | Y | — | 토스 `paymentKey` |
| `paid_at` | TIMESTAMPTZ | Y | — | |
| `receipt_url` | TEXT | Y | — | 영수증 URL |
| `refunded_amount` | INT | N | `0` | 누적 환불액 |
| `tax_invoice_requested` | BOOLEAN | N | `FALSE` | 계산서 요청 여부 |
| `tax_invoice_issued` | BOOLEAN | N | `FALSE` | 발행 여부 |
| `tax_invoice_issued_at` | TIMESTAMPTZ | Y | — | 발행일 |
| `tax_invoice_number` | TEXT | Y | — | 승인번호 |
| `ship_recipient_name` | TEXT | Y | — | **배송지 스냅샷** (기관 정보가 바뀌어도 주문은 불변) |
| `ship_phone` | TEXT | Y | — | |
| `ship_zip_code` | TEXT | Y | — | |
| `ship_address` | TEXT | Y | — | |
| `ship_address_detail` | TEXT | Y | — | |
| `institution_name_snapshot` | TEXT | Y | — | 기관명 스냅샷 (탈퇴/익명화 후에도 주문 조회 가능) |
| `customer_memo` | TEXT | Y | — | 기관 요청사항 |
| `admin_memo` | TEXT | Y | — | 내부 메모 |
| `cancelled_at` | TIMESTAMPTZ | Y | — | |
| `cancel_reason` | TEXT | Y | — | |
| `source_inquiry_id` | UUID | Y | — | 문의에서 전환된 주문 (nullable) |
| `source_quote_id` | UUID | Y | — | 견적에서 전환 (Phase 2 대비, FK는 나중에) |
| `subscription_id` | UUID | Y | — | 정기주문 대비 (FK 나중에) |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**주문 상태 전이**

```
 [received]  접수     ─┐
     │                │
     ▼                │
 [confirmed] 확인      ├──▶ [cancelled] 취소
     │                │      (취소는 delivered 전까지만)
     ▼                │
 [preparing] 배송준비  ─┘
     │
     ▼
 [shipping]  배송중
     │
     ▼
 [delivered] 완료 ────────▶ [returned] 반품
```

**주문번호 채번 — 키즈밀 방식을 쓰지 않는 이유 (⭐ 판단)**

키즈밀은 `count(*) + 1` 로 만들고 UNIQUE 충돌(23505) 나면 재시도한다.
동시 주문이 몰리면 계속 충돌하고, 최대 5회 후 실패한다.

→ **원자적 카운터 테이블** 채택:

```sql
CREATE TABLE order_number_counters (
  year      INT PRIMARY KEY,
  last_seq  INT NOT NULL DEFAULT 0
);

-- 한 문장으로 원자적 증가 + 값 획득 (경쟁 조건 없음)
INSERT INTO order_number_counters (year, last_seq)
VALUES (EXTRACT(YEAR FROM NOW())::INT, 1)
ON CONFLICT (year)
DO UPDATE SET last_seq = order_number_counters.last_seq + 1
RETURNING last_seq;
--  → 'ICM-' || year || '-' || LPAD(last_seq::TEXT, 6, '0')
```

연도별로 1부터 다시 시작하고, 번호가 연속이라 "올해 몇 건" 이 바로 보인다.

---

### 4-5. `order_items` — 🔵 새로 만듦 (스냅샷이 핵심)

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `order_id` | UUID | N | — | `orders(id)` `ON DELETE CASCADE` |
| `product_id` | UUID | Y | — | `products(id)` `ON DELETE RESTRICT` |
| `product_slug_snapshot` | TEXT | N | — | 주문 시점 slug |
| `product_name_snapshot` | TEXT | N | — | **주문 시점 상품명** |
| `product_line_snapshot` | TEXT | N | — | `kids`/`silver` |
| `product_month_snapshot` | INT | Y | — | |
| `unit_label_snapshot` | TEXT | Y | — | `3개` 등 |
| `unit_price_snapshot` | INT | N | — | **주문 시점 단가** |
| `thumbnail_url_snapshot` | TEXT | Y | — | 목록에서 이미지 유지 |
| `quantity` | INT | N | `1` | 수량 (CHECK > 0) |
| `subtotal` | INT | N | — | `unit_price_snapshot * quantity` |
| `created_at` | TIMESTAMPTZ | N | `NOW()` | |

> 요구사항의 **"나중에 상품 정보가 바뀌어도 과거 주문은 그대로"** 를 만족하는 지점.
> `product_id` 는 통계/재주문용으로 남기되, 표시는 **전부 스냅샷 컬럼**을 쓴다.
> 상품은 하드 삭제하지 않으므로(`deleted_at`) `RESTRICT` 로 안전.

---

### 4-6. `shipments` — 🔵 새로 만듦

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `order_id` | UUID | N | — | `orders(id)` `ON DELETE CASCADE` |
| `sequence_no` | INT | N | `1` | 분할배송 시 1,2,3… |
| `label` | TEXT | Y | — | `본원`, `○○분원` 등 |
| `carrier` | TEXT | Y | — | 택배사 (`cj`, `hanjin`, …) |
| `tracking_number` | TEXT | Y | — | 송장번호 |
| `tracking_url` | TEXT | Y | — | 조회 URL (택배사별 템플릿 조합) |
| `status` | TEXT | N | `'preparing'` | `preparing`/`shipped`/`in_transit`/`delivered`/`failed` |
| `recipient_name` | TEXT | Y | — | **배송지 스냅샷** (분원별로 다름) |
| `recipient_phone` | TEXT | Y | — | |
| `zip_code` / `address` / `address_detail` | TEXT | Y | — | |
| `shipped_at` / `delivered_at` | TIMESTAMPTZ | Y | — | |
| `memo` | TEXT | Y | — | |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**분원 다중 배송 — 지금 넣나? (⭐ 판단) → 구조만 지금, UI는 나중**

`orders 1 : N shipments` 로 **구조는 처음부터** 잡는다. v1 UI는 배송 1건만 만든다.
이유: 1:1(orders에 송장 컬럼 직접)로 시작하면 나중에 분할배송이 필요할 때
**주문 테이블 컬럼을 새 테이블로 옮기는 데이터 마이그레이션**이 필요하다.
반대로 1:N은 지금 비용이 거의 0이고(테이블 하나), 나중 비용도 0이다.
어린이집 분원·복지관 여러 층 배송은 B2B에서 충분히 흔하다.

**배송비 정책 (⭐ 판단) → 지금은 코드 상수, 테이블은 나중에**

`shipping_policies` 테이블은 **만들지 않는다.** v1은 코드 상수
(예: `20만원 이상 무료, 미만 3,000원`)로 계산하고 결과만 `orders.shipping_fee` 에 스냅샷.
이유: 정책이 자주 안 바뀌고, 주문에 결과가 남으면 과거 재현이 가능하다.
정책이 기관 등급별로 갈라지는 시점에 테이블로 승격하면 된다.

---

### 4-7. `inquiries` / `inquiry_messages` — 🟡 수정해서

**회원·비회원 문의를 한 테이블로 통합**한다 (키즈밀은 3벌로 갈라져 고생 → 1-2의 사고 #5).

#### `inquiries`

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `inquiry_number` | TEXT | N | — | UNIQUE. `INQ-2026-000123` (비회원 조회용) |
| `institution_id` | UUID | Y | — | **NULL = 비회원 문의** |
| `created_by_auth_id` | UUID | Y | — | 회원 문의 시 작성자 |
| `source` | TEXT | N | `'web_form'` | `web_form`(공개 폼) \| `portal`(로그인 후) |
| `guest_name` | TEXT | Y | — | 비회원: 기관명/성함 |
| `guest_contact` | TEXT | Y | — | 비회원: 연락처 |
| `guest_email` | TEXT | Y | — | |
| `guest_password_hash` | TEXT | Y | — | bcrypt. 비회원 조회용 |
| `category` | TEXT | N | `'general'` | `proposal`(맞춤제안)/`order`/`product`/`delivery`/`complaint`/`general` |
| `title` | TEXT | N | — | |
| `status` | TEXT | N | `'pending'` | `pending`/`in_progress`/`resolved`/`closed` |
| `priority` | TEXT | N | `'medium'` | `low`/`medium`/`high` |
| `assigned_admin_id` | UUID | Y | — | `admins(id)` |
| `last_message_at` | TIMESTAMPTZ | Y | — | 목록 정렬용 |
| `unread_count_institution` | INT | N | `0` | 비정규화 뱃지 |
| `unread_count_admin` | INT | N | `0` | |
| `resolved_at` / `closed_at` | TIMESTAMPTZ | Y | — | |
| `ip_address` | TEXT | Y | — | 스팸 추적 |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

**맞춤 제안 폼 필드 매핑** (`app/inquiry/page.tsx` 현재 필드)
`기관명→guest_name` / `담당자명·연락처·이메일→guest_*` /
`대상라인·예상인원·희망일정·프로그램형태` → 아래 `meta JSONB` 로 수용:

| `meta` | JSONB | N | `'{}'` | `{kit_line, headcount, schedule, program_type}` — 카테고리별 가변 필드 |

> 키즈밀 `form_field_definitions` (동적 폼) 까지는 과하다. JSONB 한 칸이면 충분하다.

#### `inquiry_messages`

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `inquiry_id` | UUID | N | — | `inquiries(id)` `ON DELETE CASCADE` |
| `sender_type` | TEXT | N | — | `institution`/`guest`/`admin`/`system` |
| `sender_auth_id` | UUID | Y | — | system/guest 는 NULL |
| `sender_name_snapshot` | TEXT | Y | — | 계정 삭제 후에도 "누가" 남게 |
| `content` | TEXT | N | — | |
| `attachments` | JSONB | N | `'[]'` | `[{file_name, url, size, mime}]` |
| `is_internal` | BOOLEAN | N | `FALSE` | **내부 메모** (기관에게 안 보임) |
| `is_read` | BOOLEAN | N | `FALSE` | |
| `created_at` | TIMESTAMPTZ | N | `NOW()` | |

> `is_internal` 은 키즈밀 `phase2/phase3` 에서 뒤늦게 추가된 컬럼이다. 처음부터 넣는다.
> ⚠️ RLS에서 `is_internal = TRUE` 행이 기관에게 **절대** 안 나가게 하는 게 핵심 (6장 참고).

---

### 4-8. `product_materials` — 🔵 새로 만듦

마이페이지 "자료실" 탭이 이미 있고(`app/mypage`), 교안 자동화의 착지점이기도 하다.

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `product_id` | UUID | N | — | `products(id)` `ON DELETE CASCADE` |
| `type` | TEXT | N | — | `lesson_plan`(교안)/`worksheet`(활동지)/`ppt`/`video`/`photo_guide` |
| `title` | TEXT | N | — | |
| `storage_path` | TEXT | Y | — | **버킷 내부 경로** (signed URL 생성용) |
| `file_url` | TEXT | Y | — | public 자산일 때만 |
| `file_size` | INT | Y | — | bytes |
| `mime_type` | TEXT | Y | — | |
| `requires_purchase` | BOOLEAN | N | `TRUE` | 구매 기관만 접근 |
| `version` | INT | N | `1` | 교안 재생성 시 증가 |
| `is_active` | BOOLEAN | N | `TRUE` | 구버전 비활성 |
| `generated_by` | TEXT | Y | — | `manual` \| `auto` (교안 자동화 대비) |
| `generated_at` | TIMESTAMPTZ | Y | — | 자동 생성 시각 |
| `generation_status` | TEXT | Y | — | `queued`/`running`/`done`/`failed` (교안 자동화 대비) |
| `deleted_at` | TIMESTAMPTZ | Y | — | |
| `created_at` / `updated_at` | TIMESTAMPTZ | N | `NOW()` | |

> **8번 요구(교안 자동화 — 지금 만들지 않되 컬럼만)** 은
> `generated_by` / `generated_at` / `generation_status` / `version` 4개로 충족된다.
> 파이프라인(GitHub Actions)은 나중에 붙여도 스키마 변경이 필요 없다.

---

### 4-9. `audit_logs` — 🟡 수정해서

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `actor_auth_id` | UUID | Y | — | 행위자 |
| `actor_type` | TEXT | N | — | `admin`/`institution`/`system` |
| `actor_name_snapshot` | TEXT | Y | — | **계정 삭제돼도 남게** (키즈밀 패턴) |
| `action` | TEXT | N | — | `institution.approve`, `order.status_change` … |
| `target_table` | TEXT | Y | — | |
| `target_id` | UUID | Y | — | |
| `before` | JSONB | Y | — | 변경 전 (부분) |
| `after` | JSONB | Y | — | 변경 후 (부분) |
| `ip_address` | TEXT | Y | — | |
| `created_at` | TIMESTAMPTZ | N | `NOW()` | |

**판정: 필요 — 지금.** B2B에서 "누가 이 기관을 승인했나 / 누가 이 주문을 취소했나"는
분쟁 시 반드시 필요하다. 나중에 넣으면 그 이전 기록은 영원히 복원 불가다.
단, **v1은 관리자 행위만** 기록한다(승인/반려/상태변경/단가변경). 전 테이블 트리거는 과하다.

---

### 4-10. `email_logs` — 🔵 새로 만듦

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | UUID | N | `gen_random_uuid()` | PK |
| `to_email` | TEXT | N | — | |
| `template_key` | TEXT | N | — | `institution.approved`, `order.confirmed` … |
| `subject` | TEXT | Y | — | |
| `status` | TEXT | N | `'queued'` | `queued`/`sent`/`failed` |
| `provider_message_id` | TEXT | Y | — | Resend 메시지 ID |
| `error_message` | TEXT | Y | — | |
| `related_table` | TEXT | Y | — | |
| `related_id` | UUID | Y | — | |
| `sent_at` | TIMESTAMPTZ | Y | — | |
| `created_at` | TIMESTAMPTZ | N | `NOW()` | |

**판정: 필요 — 지금(단, 얇게).** 키즈밀에 없어서 아쉬운 대표 항목이다.
"승인 메일 안 왔다는데요?" 라는 CS가 반드시 온다. 그때 로그가 없으면 확인할 방법이 없다.
테이블 하나에 INSERT 한 줄이라 비용이 거의 없다.

**인앱 `notifications` 는 나중에.** v1은 기관 수가 적어 이메일로 충분하다.

---

### 4-11. Phase 2 대비 (지금 만들지 않음)

| 테이블 | 시점 | 지금 해둘 것 |
|---|---|---|
| `institution_members` | 기관당 담당자 2명 이상 요구 시 | `get_my_institution_id()` 함수 + `created_by_auth_id` 컬럼 |
| `institution_invitations` | 위와 동일 | 없음 (독립 테이블) |
| `shipping_addresses` | 배송지 저장 요구 시 | `shipments` 가 주소를 자체 보유 → 나중에 붙여도 무손실 |
| `quotes` / `quote_items` | 견적서 발행이 필요해질 때 | `orders.source_quote_id` 컬럼 |
| `subscriptions` | 정기주문 | `orders.order_type`, `orders.subscription_id` |
| `payments` | 부분환불/재시도 늘어날 때 | `orders` 의 결제 컬럼들 → 이관 |
| `returns` | 반품 프로세스 정식화 | `orders.status='returned'` |
| `notices` | 기관 공지 | 없음 |
| `product_access_grants` | 수동 영상 권한 부여 (샘플·프로모션) | 6-3 참고. `expires_at` 은 여기에 둔다 |

> ~~`product_prices`~~ 는 **Q5 결정으로 Phase 1 으로 옮겨졌다** (4-3b 참고).

### 4-12. 이번 마이그레이션으로 만드는 테이블 (총 15개)

| # | 테이블 | 파일 |
|---|---|---|
| 1 | `admins` | `_0001_foundation` |
| 2 | `app_settings` | `_0001_foundation` |
| 3 | `audit_logs` | `_0001_foundation` |
| 4 | `email_logs` | `_0001_foundation` |
| 5 | `institutions` | `_0002_institutions` |
| 6 | `products` | `_0003_products` |
| 7 | **`product_prices`** ★Q5 | `_0003_products` |
| 8 | `product_materials` | `_0003_products` |
| 9 | `orders` | `_0004_orders` |
| 10 | `order_items` | `_0004_orders` |
| 11 | `shipments` | `_0004_orders` |
| 12 | `order_number_counters` | `_0004_orders` |
| 13 | `inquiry_number_counters` | `_0004_orders` |
| 14 | `inquiries` | `_0005_inquiries` |
| 15 | `inquiry_messages` | `_0005_inquiries` |

함수 10개: `update_updated_at` · `is_admin` · `is_super_admin` · `get_my_institution_id` ·
`is_approved_institution` · `has_purchased_product` · `resolve_product_price` ·
`resolve_product_pricing` · `next_order_number` · `next_inquiry_number`

---

## 5. 5장 검토 항목 판단

| # | 항목 | 판단 | 이유 / 지금 해둘 것 |
|---|---|---|---|
| 1 | `created_at`/`updated_at` | **필요 — 지금** | 전 테이블 + `update_updated_at()` 트리거 |
| 2 | `deleted_at` 소프트삭제 | **선택 적용** | 마스터만. 주문/로그는 금지 (3-2 표 참고) |
| 3 | 관리자 활동 로그 | **필요 — 지금** | v1은 관리자 행위만. 소급 불가라 미루면 손해 |
| 4 | 이메일 발송 이력 | **필요 — 지금(얇게)** | `email_logs`. CS 대응에 필수 |
| 5 | 인앱 알림 | **나중에** | v1 이메일로 충분. `email_logs` 와 구조 유사해 확장 쉬움 |
| 6 | 정기주문(구독) | **나중에** | 지금: `orders.order_type`, `orders.subscription_id` 2컬럼만 |
| 7 | 장바구니 DB 저장 | **클라이언트(localStorage)** | B2B 주문은 세션 내 완결. 기기간 동기화 니즈 낮음. 이탈분석 필요해지면 그때 테이블 |
| 8 | 재고 관리 | **나중에** | 월 1종 캘린더라 재고보다 **주문 마감일**이 중요. 지금: `stock_managed`/`stock_quantity` 컬럼만 |
| 9 | 한 기관 여러 담당자 | **구조만 지금, 테이블은 나중** | `get_my_institution_id()` 헬퍼 + `created_by_auth_id`. 이 둘이면 나중 마이그레이션 비용 ≈ 0 |
| 10 | 상품 DB 이관 | **필요 — 지금** | 7장 참고 |
| 11 | RLS 정책 | **필요 — 지금** | 6장 참고 |
| 12 | 관리자 판별 방식 | **별도 `admins` 테이블** | 4-1 비교표 참고 |
| 13 | 개인정보 보관/탈퇴 | **필요 — 지금 설계만** | 8장 참고 |
| 14 | 분원 다중배송 | **구조만 지금** | `orders 1:N shipments` (4-6) |
| 15 | 배송비 정책 | **코드 상수 + 스냅샷** | 테이블은 등급별 차등 생길 때 (4-6) |
| 16 | 견적 → 주문 전환 | **나중에** | 지금은 `inquiries` 로 충분. `orders.source_inquiry_id` 만 |
| 17 | 영상 접근 권한 | **필요 — 지금** | 6-3. Q2 결정: `materials` private 버킷 + signed URL |
| 18 | 교안 자동화 | **컬럼만 지금** | `product_materials` 의 4개 컬럼 (4-8) |
| 19 | **기관별 단가 차등** | **필요 — 지금 ★변경** | Q5 결정으로 Phase 2 → Phase 1. `product_prices` + `resolve_product_price()` (4-3b) |
| 20 | 전역 운영 설정 | **필요 — 지금** | Q6 결정. `app_settings` 단일행 (4-3c) |

### 5-1. B2B 쇼핑몰로서 빠져 있던 것 (지적)

요구사항 목록에 없었지만 필요한 것들:

| 항목 | 판단 | 비고 |
|---|---|---|
| **최소 주문 수량 / 리드타임** | **지금** | 시안에 "최소 주문 30세트, 배송 10영업일 전" 명시됨. `products.min_order_qty`, `lead_time_days` 로 반영. 주문 검증 로직의 핵심 |
| **기관별 단가 차등** | **지금 ★** | Q5 확정. `institutions.price_tier` + `product_prices` 테이블 + `resolve_product_price()` |
| **VAT 처리** | **지금** | 상품가가 VAT 별도인지 포함인지 반드시 확정. `orders.vat_amount` 분리 보관 |
| **세금계산서 후불 결제** | **지금** | B2B는 "계산서 발행 후 월말 입금"이 흔함. `payment_method='tax_invoice'` + `payment_status='unpaid'` 조합으로 수용 |
| **주문 취소 가능 시점** | **지금(규칙만)** | `preparing` 이후 취소는 관리자 승인 필요 — 상태 전이도에 반영 |
| **동의 이력 (약관/개인정보)** | **지금** | `agreed_*_at` 3컬럼. 법적 증빙 |
| 쿠폰/할인 | 나중에 | `orders.discount_amount` 만 |
| 반품/교환 | 나중에 | `status='returned'` |
| 매출 리포트 | 나중에 | `orders` 집계로 커버 |
| 상품 카테고리/태그 | **불필요** | `line` + `month` 로 충분. 테이블 늘리지 말 것 |

---

## 6. RLS 정책 초안

### 6-1. 헬퍼 함수 (가장 먼저 만든다)

```sql
-- 활성 관리자인가
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins
                 WHERE auth_id = auth.uid() AND is_active = TRUE);
END; $$;

-- 내 기관 id  ★ Phase 2에서 이 함수 '안'만 고치면 정책 전부 그대로 산다
CREATE OR REPLACE FUNCTION get_my_institution_id() RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v UUID;
BEGIN
  SELECT id INTO v FROM institutions
   WHERE auth_id = auth.uid() AND deleted_at IS NULL LIMIT 1;
  -- [Phase 2] 여기에 institution_members 조회 추가
  RETURN v;
END; $$;

-- 승인된 기관인가 (주문 자격)
CREATE OR REPLACE FUNCTION is_approved_institution() RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM institutions
                 WHERE id = get_my_institution_id() AND status = 'approved');
END; $$;
```

> `SECURITY DEFINER` 가 핵심이다. 없으면 `institutions` 의 RLS가 다시 자기 자신을 호출해
> 무한재귀가 난다. `SET search_path` 는 스키마 하이재킹 방어.

### 6-2. 테이블별 정책

| 테이블 | 기관(institution) | 관리자 | 비로그인 |
|---|---|---|---|
| `institutions` | 본인 행 SELECT/UPDATE. **단 `status`·`price_tier`·`approved_*` 는 UPDATE 금지** | 전체 ALL | INSERT만 (가입신청) |
| `products` | `status='selling'` + `deleted_at IS NULL` SELECT | 전체 ALL | 위와 동일 SELECT |
| `product_materials` | `requires_purchase=FALSE` 이거나 **구매 이력 있을 때만** SELECT | 전체 ALL | ✗ |
| `orders` | `institution_id = get_my_institution_id()` SELECT. INSERT는 `is_approved_institution()` | 전체 ALL | ✗ |
| `order_items` | 상위 주문이 내 것일 때 SELECT | 전체 ALL | ✗ |
| `shipments` | 상위 주문이 내 것일 때 SELECT | 전체 ALL | ✗ |
| `inquiries` | 내 기관 문의 SELECT/INSERT | 전체 ALL | ✗ (비회원은 service_role API 경유) |
| `inquiry_messages` | 내 문의의 메시지 중 **`is_internal = FALSE`** 만 | 전체 ALL | ✗ |
| `admins` | ✗ | 본인 SELECT, `super_admin` 만 ALL | ✗ |
| `audit_logs` | ✗ | `super_admin` SELECT만 (INSERT는 service_role) | ✗ |
| `email_logs` | ✗ | 관리자 SELECT | ✗ |

### 6-3. 핵심 정책 3개 (실제 SQL)

**① 기관은 자기 status를 못 바꾼다** — 이게 없으면 스스로 `approved` 로 승격 가능

```sql
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY institutions_select_own ON institutions
  FOR SELECT USING (auth_id = auth.uid() OR is_admin());

CREATE POLICY institutions_update_own ON institutions
  FOR UPDATE
  USING  (auth_id = auth.uid())
  WITH CHECK (
    auth_id = auth.uid()
    -- 민감 컬럼은 기존 값과 같아야만 UPDATE 통과
    AND status      = (SELECT status      FROM institutions i WHERE i.id = institutions.id)
    AND price_tier  = (SELECT price_tier  FROM institutions i WHERE i.id = institutions.id)
    AND approved_by IS NOT DISTINCT FROM
        (SELECT approved_by FROM institutions i WHERE i.id = institutions.id)
  );

CREATE POLICY institutions_admin_all ON institutions
  FOR ALL USING (is_admin());
```

> 이 서브쿼리 방식이 번거로우면 대안은 **컬럼 UPDATE 권한 회수**다:
> `REVOKE UPDATE (status, price_tier, approved_by, approved_at) ON institutions FROM authenticated;`
> 더 단순하고 확실하다. **이쪽을 권장** (질문 Q4에서 함께 확인).

**② 내부 메모는 기관에게 절대 안 보인다**

```sql
CREATE POLICY inquiry_messages_select_own ON inquiry_messages
  FOR SELECT USING (
    is_internal = FALSE
    AND inquiry_id IN (
      SELECT id FROM inquiries WHERE institution_id = get_my_institution_id()
    )
  );

CREATE POLICY inquiry_messages_admin_all ON inquiry_messages
  FOR ALL USING (is_admin());
```

**③ 영상/교안 — 주문 완료 기관만**

```sql
CREATE POLICY product_materials_select_purchased ON product_materials
  FOR SELECT USING (
    deleted_at IS NULL AND is_active = TRUE
    AND (
      requires_purchase = FALSE
      OR is_admin()
      OR EXISTS (
        SELECT 1
          FROM order_items oi
          JOIN orders o ON o.id = oi.order_id
         WHERE oi.product_id     = product_materials.product_id
           AND o.institution_id  = get_my_institution_id()
           AND o.status IN ('confirmed','preparing','shipping','delivered')
      )
    )
  );
```

**접근 만료 기간 (⭐ 판단) → 두지 않기를 권장.**
기관은 다음 해에도 같은 교안을 재사용하고 싶어 한다. 만료를 걸면 "왜 안 열려요" CS가 늘고
이득은 거의 없다. 다만 정책이 바뀔 수 있으니 `product_materials` 가 아니라
**Phase 2의 `product_access_grants` 테이블에 `expires_at` 을 두는 형태**로 열어둔다
(수동 부여·샘플 제공·프로모션 용도까지 함께 커버).

> ⚠️ **RLS는 DB 행만 막는다.** `media` 버킷이 public 인 한 영상 URL을 아는 사람은 누구나 받는다.
> 진짜 게이트는 **private 버킷 + `createSignedUrl(path, 3600)`** 이 필요하다 → 질문 Q2.

---

## 7. 상품 데이터 이관 (constants → DB)

### 7-1. 현재 상태

`constants/index.ts` 에 `KIDS_PRODUCTS` 12 + `SILVER_PRODUCTS` 12 = **24행**.
필드: `id`, `line`, `month`, `tagline`, `name`, `desc`, `unit`, `price`, `video`, `image`.

### 7-2. 이관 방안 (권장)

1. **시드 생성 스크립트** — `scripts/gen-product-seed.mjs`
   `constants/index.ts` 를 import → `supabase/seeds/001_products.sql` 생성.
   손으로 24행 SQL 쓰지 않는다(오타 위험).
2. **`slug` 은 기존 `id` 를 그대로 사용** (`kids-01`, `silver-08`).
   → 프론트 코드의 참조가 안 깨지고, 재실행 시 `ON CONFLICT (slug) DO UPDATE` 로 멱등.
3. **이미지 경로 그대로** — `/images/products/...` 는 `public/` 에 이미 있으므로 변경 없음.
4. `desc` → `description`, `unit` → `unit_label`, `video` → `has_video` 로 매핑.
5. `status` 는 전부 `'selling'`, `min_order_qty=30`, `lead_time_days=10` 으로 시드.

```sql
INSERT INTO products (slug, line, month, name, tagline, description,
                      unit_label, price, has_video, thumbnail_url, status, sort_order)
VALUES ('kids-01','kids',1,'만두 만들기','복이 가득! 영양 가득!',
        '기관 즉석취식 불가 · 별도 포장재로 가정에 배송',
        '3개', 5500, TRUE, '/images/products/kids/kids_01_만두.png', 'selling', 1)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, price = EXCLUDED.price, ...;
```

### 7-3. ⚠️ 이관 시 놓치기 쉬운 것 — 렌더링 방식

지금 `/kids`, `/silver` 는 **완전 정적(SSG)** 이다 (빌드 로그상 `○ Static`).
DB로 옮기면 이 페이지들이 동적으로 바뀌어 **첫 로딩이 느려질 수 있다.**

→ 권장: `export const revalidate = 3600` (ISR). 상품 정보는 자주 안 바뀌므로
1시간 캐시로 정적에 준하는 속도를 유지하고, 관리자가 상품을 고치면
`revalidatePath('/kids')` 로 즉시 갱신한다.

### 7-4. 전환 순서

`constants` 를 **바로 지우지 않는다.**
① DB 시드 → ② 페이지를 DB 조회로 교체 → ③ 화면 동일 확인 → ④ 그때 `constants` 에서 상품 배열 제거.
(`CASE_ITEMS`, `HOME_CHECK_FEATURES` 등 마케팅 카피는 DB로 안 옮기고 `constants` 에 남긴다.)

---

## 8. 개인정보 보관 기간과 탈퇴 처리

### 8-1. 법정 보관 의무 (전자상거래법)

| 기록 | 보관 기간 |
|---|---|
| 계약·청약철회 기록 | **5년** |
| 대금결제·재화공급 기록 | **5년** |
| 소비자 불만·분쟁처리 기록 | **3년** |
| 표시·광고 기록 | 6개월 |

→ **탈퇴한다고 주문을 지울 수 없다.** 이걸 모르고 `ON DELETE CASCADE` 를 걸면 법 위반이다.
그래서 `orders.institution_id` 는 `ON DELETE RESTRICT` 다.

### 8-2. 탈퇴 처리 방식 (권장: 익명화)

```
탈퇴 요청
  ├─ auth.users 삭제               → 로그인 불가
  ├─ institutions
  │    ├─ contact_name  = '탈퇴회원'
  │    ├─ contact_phone = NULL
  │    ├─ contact_email = NULL
  │    ├─ business_number / representative_name / 주소 = NULL
  │    ├─ anonymized_at = NOW()
  │    └─ deleted_at    = NOW()
  ├─ orders                        → 그대로 유지
  │    └─ institution_name_snapshot 덕분에 "○○어린이집" 표시 유지
  └─ inquiry_messages              → sender_name_snapshot 유지, 본문은 보존
```

`orders.institution_name_snapshot` 컬럼이 여기서 값을 한다.
익명화 후에도 관리자 화면에서 과거 주문의 기관명이 보인다.

**보관 기간 경과 후 물리 삭제**는 배치로 처리 (Phase 2).

---

## 9. 법인 분리 대비 자체 점검

CLAUDE.md「분리 대비 필수 원칙」 5가지에 대한 이 설계안의 준수 여부.

| # | 원칙 | 준수 | 이 설계에서의 근거 |
|---|---|---|---|
| 1 | **kizmeal 테이블/스키마/함수를 절대 참조하지 않는다** | ✅ | 전 테이블의 FK가 **아이캔밀 자체 테이블 또는 `auth.users`** 뿐이다. 키즈밀 `brands`/`branches`/`admins` 를 일절 참조하지 않는다. 키즈밀 `phase1_schema.sql:628` 에 `('아이캔밀','ICANMEAL')` 을 brands에 넣는 주석이 있으나 **의도적으로 쓰지 않는다.** 아이캔밀은 단일 브랜드라 `brands` 테이블 자체가 불필요 |
| 2 | **모든 테이블은 `supabase/migrations/` 에 SQL로 남긴다** | ✅ (규칙화) | 대시보드 조작 금지를 명문화. 키즈밀이 `public_inquiries` 를 대시보드로만 만들어 SQL이 없는 사고를 목격했고, 이를 1-2의 사고 #2로 기록. 파일명 규칙: `YYYYMMDDHHMM_설명.sql` |
| 3 | **접속 정보는 환경변수로만** | ✅ | 스키마에 URL/키가 등장하지 않음. 단 **0-1의 `.env.local` 오타를 먼저 고쳐야** 한다 |
| 4 | **Storage 경로 규칙 유지** | ✅ | `media/videos/{kids\|silver}/` 유지. `product_materials.storage_path` 에 **버킷 내 상대경로**를 저장 → 새 프로젝트로 파일 복사만 하면 경로가 그대로 유효. 절대 URL을 저장하면 프로젝트 ref가 박혀 이전 시 전량 UPDATE 필요 (**그래서 `file_url` 이 아니라 `storage_path` 가 정본**) |
| 5 | **`auth.users` 외 외부 의존 없게** | ✅ | 유일한 외부 참조는 `auth.users(id)`. 전부 `ON DELETE SET NULL`/`CASCADE` 로 명시. `auth.users` 는 새 프로젝트에도 항상 존재하므로 이전 시 사용자 재생성만 하면 됨 |

**분리 실행일에 할 일 (이 설계 기준)**

1. 새 org/프로젝트 생성
2. `supabase/migrations/*.sql` 순서대로 실행 → 스키마 완전 재현
3. `pg_dump --data-only` 로 데이터 이관 (FK 순서: institutions → products → orders → order_items → …)
4. Storage `media` 버킷 파일 복사 (경로 동일하므로 `storage_path` 무수정)
5. `.env.local` + Vercel 환경변수 교체
6. **`auth.users` 는 이관 불가** → 기관에게 비밀번호 재설정 메일 발송 (이건 미리 각오해둘 것)

> ⚠️ 6번이 유일한 실질 리스크다. Supabase 프로젝트 간 `auth.users` 는 그대로 못 옮긴다.
> 기관 수가 적을 때 분리하는 게 유리하다.

---

## 10. 구현 순서 제안

| 단계 | 내용 | 왜 이 순서인가 |
|---|---|---|
| **0** | ~~`.env.local` URL 오타 수정~~ | ✅ 완료 (PR #8) |
| **1** | ~~설계 확정 (Q1~Q7)~~ | ✅ 완료 (11장) |
| **2** | ~~마이그레이션 SQL 작성~~ | ✅ 완료 — `supabase/migrations/` 7개 파일 |
| **3** | **SQL 실행** ← 지금 여기 | 대시보드에서 기존 테이블 확인 후. `docs/MIGRATION_GUIDE.md` 순서대로 |
| **4** | 최초 관리자 계정 등록 | RLS 때문에 관리자 없이는 아무 작업도 못 함. 실행 직후 필수 |
| **5** | `types/index.ts` 를 실제 스키마에 맞게 갱신 | 현재 타입은 설계 이전 것이라 컬럼이 다름 |
| **6** | 기관 가입/승인 플로우 + 가입 폼 필드 보강 | 승인된 기관이 없으면 주문 불가. 미들웨어 deny-by-default 전환도 여기서 |
| **7** | 상품 페이지를 DB 조회로 교체 (7장, ISR) | 화면이 이미 있어 **DB 붙이면 바로 티가 남** |
| **8** | 문의 게시판 (2패널 UI) | 주문과 독립적이라 병렬 가능. 폼이 이미 있어 가치가 빨리 나옴 |
| **9** | 주문 흐름 — **반드시 `resolve_product_pricing()` 경유** | Q5 단가 로직을 우회하면 안 됨 (11장) |
| **10** | 토스페이먼츠 결제 | 주문 흐름이 검증된 뒤에 붙임 |
| **11** | 영상/교안 게이트 (`materials` + signed URL) | Q2 결정 완료. 7·9에 의존 |
| **12** | Resend 알림 + `email_logs` 기록 | 6·9의 이벤트에 붙는 부가 기능 |
| **13** | 교안 자동화 (GitHub Actions) | 컬럼은 이미 준비됨 |
| **14** | 기관별 단가 데이터 입력 | 테이블은 준비됨. 등급 체계 확정 후 행만 넣으면 됨 |
| **15** | 정기주문 / 관리자 ERP 고도화 | 기관 30곳+ 시점 (CLAUDE.md 방침) |

**3~7 이 "기관 가입 → 승인 → 상품 조회" 최소 동작 경로**다.
여기까지 한 번에 검증하는 걸 권장한다.

---

## 11. 결정 완료 (2026-08-22)

Q1~Q7 전부 확정되어 마이그레이션 SQL에 반영했다.

| Q | 질문 | 결정 | 반영 위치 |
|---|---|---|---|
| **Q1** | 문의 통합 vs 분리 | **통합** — 회원/비회원 한 테이블. `institution_id` NULL 여부 + `source` 로 구분 | `_0005_inquiries.sql` |
| **Q2** | 영상 게이트 버킷 정책 | **A안** — 히어로는 `media`(public) 유지, 교안·수업영상은 `materials`(private) 신설 + signed URL | `_0007_storage.sql` |
| **Q3** | 사업자번호 UNIQUE | **안 걸기** — 분원 각각 가입 가능. 인덱스만 두고 중복은 승인 화면에서 경고 | `_0002_institutions.sql` |
| **Q4** | 민감컬럼 보호 방식 | **`REVOKE UPDATE`** — RLS 서브쿼리보다 단순·확실 | `_0006_rls.sql` [12] |
| **Q5** | 기관별 단가 차등 | **차등 있음 → Phase 1 승격** ★ `product_prices` + `resolve_product_price()` | `_0003_products.sql` |
| **Q6** | 최소주문/리드타임 | **전역 기본값 + 상품별 예외** — `app_settings` + `COALESCE` 폴백 | `_0001`, `_0003` |
| **Q7** | `.env.local` URL 오타 | 처리 완료 (PR #8) | 0-1 |

### Q5 결정으로 바뀐 것 (요약)

초판에서는 `institutions.price_tier` 컬럼만 두고 테이블은 Phase 2 로 미뤘다.
실제로 필요하다는 확인을 받아 **지금 만드는 것**으로 바꿨다.

| | 초판 | 변경 후 |
|---|---|---|
| 테이블 | 없음 (Phase 2) | `product_prices` 생성 |
| 가격 조회 | `products.price` 직접 참조 | `resolve_product_price(product_id, institution_id)` |
| 주문 스냅샷 | `unit_price_snapshot` 만 | `unit_price_snapshot` + `base_price_snapshot` (할인폭 추적) |
| RLS | — | 기관은 **자기에게 적용되는 가격만** 조회 가능 |
| 마이그레이션 테이블 수 | 14개 | **15개** |

**데이터는 비워둔 채 시작한다.** `product_prices` 가 비어 있으면
`resolve_product_price()` 가 `products.price` 로 폴백하므로 지금 당장 정상 동작하고,
나중에 행만 넣으면 주문 로직을 고치지 않고도 차등가가 적용된다.

### Q5 구현 시 반드시 지킬 것

주문 생성 코드에서 **`products.price` 를 직접 읽으면 안 된다.**
반드시 `resolve_product_price()` 를 거쳐야 기관별 단가가 적용된다.

```ts
// ❌ 이렇게 하면 기관 단가가 무시된다
const { data: p } = await supabase.from('products').select('price').eq('id', id).single()
const unitPrice = p.price

// ✅ 반드시 이렇게
const { data: pricing } = await supabase
  .rpc('resolve_product_pricing', { p_product_id: id, p_institution_id: institutionId })
  .single()
const unitPrice = pricing.unit_price      // 기관 전용가 > 등급가 > 기본가
const minQty   = pricing.min_order_qty    // 상품값 > 전역값 (Q6)
```

### 아직 정해지지 않은 것 (구현 단계에서 확인 필요)

| 항목 | 언제 필요한가 |
|---|---|
| 등급 이름 `standard`/`preferred`/`partner` 가 실제 운영 명칭과 맞는지 | 단가 데이터 입력 전 |
| 등급별 할인이 정률(%)인지 정액인지 | 지금은 **최종 단가를 직접 저장**하는 방식. 정률이 편하면 구조 변경 필요 |
| VAT 별도가 맞는지 (`price_includes_vat = FALSE`) | 결제 붙이기 전 |
| 무료배송 기준 20만원 / 배송비 3,000원 | 주문 화면 만들기 전 |

---

## 부록. 참조한 키즈밀 파일 (읽기 전용)

```
lib/roles.ts                              권한 상수 중앙화
lib/supabase.ts / lib/supabase-server.ts  browser/server 클라이언트 분리
lib/email.ts                              Resend 발송 구조
middleware.ts                             인증 라우팅 (deny-by-default 교훈)
supabase/phase1_schema.sql                핵심 — 게시판·RLS 헬퍼·인덱스
supabase/phase2_schema.sql                SLA·내부메모·is_internal
supabase/phase3_schema.sql                알림 트리거·스키마 보정
supabase/parent_schema.sql                승인 워크플로우(pending/approved/rejected)
supabase/migrations/inquiry_restructure.sql   스레드+메시지·unread 카운터
supabase/migrations/branch_management.sql     audit_logs
supabase/migrations/20260619000001_fix_...sql CHECK 이름 사고 (반면교사)
app/api/public-inquiry/submit/route.ts    비회원 문의·채번·스팸방어
app/api/download/route.ts                 권한 체크 누락 (반면교사)
.github/workflows/generate-pptx.yml       자동 생성 파이프라인
```

**변경 없음.** 위 파일은 전부 Read/Glob/Grep 으로만 열람했다.
