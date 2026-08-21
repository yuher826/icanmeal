# ICANMEAL (아이캔밀) 프로젝트

키즈/실버 쿠킹키트 B2B 쇼핑몰 + 홈페이지.
기획: 허이사님 / 개발 총괄: 유대표님

> 💼 **사업·행정 관련(사업체 관계, 세무, 비용, 명의, 법인 분리 실행 절차)은
> `docs/BUSINESS.md` 참고 — 로컬 전용, 미커밋.**

---

## 기술 스택

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (DB + Auth + Storage)
- Vercel 배포 (main 브랜치 push → 자동 배포)
- 결제: 토스페이먼츠 (예정)
- 이메일: Resend (예정)

## 링크

| 항목 | 주소 |
|------|------|
| GitHub | https://github.com/yuher826/icanmeal |
| Vercel | https://icanmeal-yuhers-projects.vercel.app |
| Supabase | https://uauprcrksiiiluxhvrac.supabase.co |
| 로컬 | C:\Users\Yuher\Projects\icanmeal |

> ⚠️ 프로젝트 ref 는 `uauprcrksiiiluxhvrac` — **`i` 가 3개**다.
> 과거 `.env.local` 에 `i` 2개로 잘못 들어가 Supabase 호출이 전부 실패한 적이 있다.
> 정본은 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 의 JWT `ref` 클레임이다.

## 환경변수

`.env.local` + Vercel 양쪽에 있어야 한다.

| 키 | 용도 | 공개 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 프로젝트 URL | 브라우저 노출 OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 익명 키 (RLS 적용) | 브라우저 노출 OK |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용.** 기관 승인/반려 등 RLS·컬럼권한을 우회해야 하는 작업 | ⛔ 절대 노출 금지 |

> `SUPABASE_SERVICE_ROLE_KEY` 는 **`NEXT_PUBLIC_` 접두사를 붙이면 안 된다.**
> 붙이는 순간 브라우저 번들에 들어가 DB 전체가 열린다.
> `lib/supabase-admin.ts` 가 `server-only` 로 방어하고 있지만, 키 이름 자체를 조심할 것.
> Dashboard → Settings → API → `service_role` 에서 복사.

---

## 문서

| 파일 | 내용 | git |
|------|------|-----|
| `CLAUDE.md` | 개발 규칙·진행상황 (이 문서) | ✅ 커밋 |
| `docs/DB_DESIGN_DRAFT.md` | DB 설계 (테이블·RLS·결정사항 Q1~Q7) | ✅ 커밋 |
| `docs/MIGRATION_GUIDE.md` | 마이그레이션 실행 순서·검증·롤백 | ✅ 커밋 |
| `supabase/migrations/` | 실제 스키마 SQL (법인 분리 원칙 2) | ✅ 커밋 |
| `docs/BUSINESS.md` | 사업·행정·세무 | ❌ 미커밋 (로컬 전용) |

---

## ⚠️ 미디어 파일 규칙 (중요)

**동영상(MP4)은 절대 GitHub에 커밋하지 않는다.**
반드시 Supabase Storage `media` 버킷에 업로드하고 URL로 참조한다.

### Storage 구조
```
media/                          (public 버킷)
└── videos/
    ├── home_hero_opening.mp4
    ├── kids/
    └── silver/
```

### 코드에서 URL 만드는 법 — 하드코딩 금지

프로젝트 URL을 문자열로 박지 않는다 (법인 분리 원칙 3).
`constants/index.ts` 의 `MEDIA_BASE` 를 재사용한다.

```ts
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const MEDIA_BASE = `${SUPABASE_URL}/storage/v1/object/public/media`

export const HERO_VIDEOS = {
  home:   `${MEDIA_BASE}/videos/home_hero_opening.mp4`,
  kids:   `${MEDIA_BASE}/videos/kids/kids_class.mp4`,
  silver: `${MEDIA_BASE}/videos/silver/silver_class.mp4`,
} as const
```

### 이미지는 GitHub public 폴더 OK
```
public/images/
├── brand/                 로고, 마스코트
├── cases/                 활동 사례 사진
└── products/
    ├── kids/                 키즈 12개월 일러스트
    ├── silver/               실버 제품 실사 사진 (현재 미사용)
    └── silver_illustration/  실버 12개월 일러스트 (현재 사용 중)
```

### 새 동영상 추가 시 순서
1. Supabase Storage 해당 폴더에 업로드
2. `constants/index.ts` 의 `MEDIA_BASE` 기준 경로만 추가 (URL 전체 X)
3. 로컬 `public/videos/` 파일은 git에 올리지 않기 (.gitignore 확인)

---

## 디자인 기준

허이사님이 제작한 검수용 HTML 시안이 **디자인 최종 기준**이다.
- `ICANMEAL_몰_검수용_1.html` (프로젝트 루트, 미커밋 — 용량 3.4MB)
- 색상/폰트/레이아웃은 `app/globals.css` + `tailwind.config.ts` 에 시안 기준으로 정의됨
- 새 페이지 만들 때 임의로 색상 추가하지 말고 기존 토큰 재사용

### 제품 카드 렌더링 규칙 (시안 실측 기준)

| 항목 | 값 | 비고 |
|------|-----|------|
| 이미지 컨테이너 | `aspect-ratio: 16/9` | 키즈·실버 공통 |
| `object-fit` | `contain` | 잘리지 않고 전체 표시 |
| 배경색 | 키즈 `--kids-tint` / 실버 `--white` | 실버 일러스트 PNG 배경이 흰색이라 맞춤 |
| padding | 없음 | 여백은 contain 의 자연스러운 결과 |

> 실버 일러스트 PNG 는 배경을 **순백(#FFFFFF)으로 정규화**해 두었다.
> 새 실버 이미지를 추가할 때도 배경을 순백으로 맞춰야 카드 경계선이 안 생긴다.

---

## 참조 코드베이스

`kizmeal-renewal` (키즈밀 프로젝트) — 검증된 **패턴**은 최대한 재활용한다.
분석 결과는 `docs/DB_DESIGN_DRAFT.md` 1장에 정리되어 있다
(가져올 패턴 17개 + 반면교사 9개).

---

## 진행 상황

> 최종 갱신: 2026-08-22

### ⛔ 지금 막혀 있는 것

- [ ] **Vercel 에 `SUPABASE_SERVICE_ROLE_KEY` 추가** — 아직 안 됨
  - 로컬(`.env.local`)에는 있어서 개발 중에는 승인 버튼이 동작하지만,
    **배포본에서는 기관 승인/반려가 실패한다**
  - `Vercel → icanmeal → Settings → Environment Variables`
    → `SUPABASE_SERVICE_ROLE_KEY` 추가 (Production/Preview 둘 다) → **Redeploy**
  - ⚠️ `NEXT_PUBLIC_` 접두사 절대 금지 (붙이면 브라우저에 노출되어 DB 전체가 열린다)

### ✅ 완료

**기반**
- Next.js + TS + Tailwind 세팅, Supabase 연동
- 전체 페이지 뼈대: 홈 / kids / silver / program / guide / inquiry / auth / mypage
- Vercel 배포 + Deployment Protection 해제
- Supabase Storage `media` 버킷

**디자인 (PR #1 ~ #7)**
- 시안 기준 전면 리디자인 (PR #1)
- 이미지/동영상 전체 페이지 적용 (PR #2)
  — 로고·마스코트, 키즈/실버 24종 제품 이미지, 활동사례 사진, 히어로 영상 3종
- 카드 디자인 시안 일치 (PR #3~#6)
  — `object-fit: contain` + 16:9 통일, 실버 배경 순백 정규화, 카드 높이 정렬
- 계절 필터 버그 수정 (PR #7)
  — `ScrollAnimation` 이 DOM 을 직접 조작해 `visible` 클래스가 리렌더링에 지워지던 문제

**인프라 (PR #8, #14)**
- Supabase URL 오타 수정 — `.env.local` + Vercel (PR #8)
  — `constants/index.ts` 의 Storage URL 하드코딩도 함께 제거
- Windows `.next` 파일 잠금(-4094) 근본 대응 (PR #14)
  — dev distDir 분리 + webpack 디스크캐시 비활성화 + `npm run dev:clean`

**DB (PR #10 ~ #12)**
- DB 설계 문서 — `docs/DB_DESIGN_DRAFT.md`
- Q1~Q7 설계 결정 완료 — Q5(기관별 단가)는 Phase 2 → **Phase 1 승격**
- 마이그레이션 SQL 작성 (PR #10) + Storage 정책 수정 (PR #11)
- **마이그레이션 실행 완료** ✅
  — 테이블 15 · 함수 10 · RLS 정책 38 · 인덱스 33
  — 버킷 2개 (`media` public / `materials` private) + Storage 정책 8개
  — 상품 시드 24종 (키즈 12 / 실버 12)
  — ⚠️ 버킷은 SQL 로 생성 불가라 대시보드에서 수동 생성함 (`MIGRATION_GUIDE` 3-A)
- 최초 관리자 계정 등록 완료 (`super_admin`)

**관리자 화면 (PR #13)**
- 관리자 로그인 `/admin/login` — 비관리자·비활성 계정 즉시 로그아웃
- `/admin/*` deny-by-default 보호 + 라우트 그룹 `(protected)` 로 가드 분리
- 사이드바 레이아웃 (주문·문의는 "준비중" 비활성 표시)
- 기관 승인 화면 `/admin/institutions`
  — 서버 사이드 페이지네이션(20건/페이지) · 검색(기관명/사업자번호/담당자)
  — 상태 필터 + 건수 · 정렬(가입일·기관명 양방향) · 빈 상태 2종
  — 상세 화면 + 승인/반려(사유 필수)/검토중/정지/정지해제
  — 상태 변경은 서버 액션 + `service_role` (REVOKE 때문에 클라이언트 UPDATE 불가)
  — 변경 시 `audit_logs` 에 before/after 기록

**동작 검증 완료** (2026-08-22)
- 관리자 로그인 성공
- 기관 목록 25건, 필터 건수 정확 (대기 9 / 검토 3 / 승인 9 / 반려 3 / 정지 1)
- 상세 화면 정상, 사업자번호 중복 경고 동작
- 승인 버튼 정상 — `service_role` 키 동작 확인
- 승인일·승인자 자동 기록 확인
- `audit_logs` 기록 확인 (`institution.approved`)

> ⚠️ 위 25건은 `supabase/seeds/002_test_institutions.sql` 로 넣은 **테스트 데이터**다.
> 실제 운영 시작 전에 반드시 지울 것:
> ```sql
> DELETE FROM institutions WHERE contact_email LIKE '%@test.icanmeal.local';
> ```

### 🔄 진행 중

- 없음

### 📋 다음 할 일 (우선순위 순)

1. **주문 관리 화면** (`/admin/orders`)
   - 사이드바에 자리는 잡혀 있음 (현재 비활성)
   - 목록/상세/상태 전이(접수→확인→배송준비→배송중→완료, 취소·반품)
   - 기관 화면과 같은 패턴 재사용: 서버 페이지네이션·검색·필터·정렬
   - 상태 변경은 동일하게 서버 액션 + `service_role` + `audit_logs`
2. **문의 관리 화면** (`/admin/inquiries`) — 2패널 UI
   - 왼쪽 스레드 목록 / 오른쪽 대화 (키즈밀 `board/customer` 패턴)
   - 회원·비회원 통합 테이블이므로 한 화면에서 처리 (Q1 결정)
   - `is_internal` 내부 메모는 기관에게 노출 금지 — RLS 로 이미 차단됨
   - `unread_count_admin` / `last_message_at` 갱신 로직 필요
3. **`institution_documents` 테이블 + 전용 버킷** (사업자등록증 첨부)
   - 현재 `institutions` 스키마에 첨부 컬럼이 없어 상세 화면에 "미지원" 표시 중
   - 새 마이그레이션 + private 버킷 (버킷은 대시보드 수동 생성)
   - 승인 심사에 사실상 필수
4. **기관 회원가입·로그인 실제 동작 연결**
   - 현재 `app/auth/register` 는 화면만 있고 `setTimeout` 목업 상태
   - 가입 폼 필드 보강 필요: 대표자명 · 배송지 5종 · 세금계산서 3종 · 동의시각 3종
   - 가입 → `institutions` INSERT(`status='pending'`) → 승인 대기 안내
   - 승인 상태별 리다이렉트 (pending/rejected/suspended 안내 페이지)
5. `types/index.ts` 를 실제 스키마에 맞게 갱신 (현재 설계 이전 버전이라 컬럼이 다름)
6. 상품 페이지를 DB 조회로 교체 (설계문서 7장, ISR 권장)
7. 주문 흐름 — **반드시 `resolve_product_pricing()` 경유** (Q5 단가 로직 우회 금지)
8. 결제 (토스페이먼츠)
9. 영상 게이트 — `materials` private 버킷 + signed URL
10. Resend 이메일 알림 + `email_logs` 기록
11. 교안 자동화 (GitHub Actions + python-pptx)
12. 기관별 단가 데이터 입력 (테이블 준비 완료, 등급 체계 확정 후)
13. 정기주문 / 관리자 ERP 고도화

---

## 🩺 로컬 개발 트러블슈팅 (Windows)

### 증상: `.next` 파일 잠금 에러가 반복된다

```
Error: UNKNOWN: unknown error, open
'C:\Users\Yuher\Projects\icanmeal\.next\static\chunks\app\layout.js'
errno: -4094, code: 'UNKNOWN'
```

`.next` 를 지우고 재시작하면 잠깐 되다가 또 난다.

### 원인 (2026-08-22 진단) — 하나가 아니라 셋이 겹쳐 있었다

| # | 원인 | 확인 결과 | 대응 |
|---|------|----------|------|
| ① | **webpack 디스크 캐시 쓰기 경합**<br>`.next/cache/webpack/*.pack.gz` 를 여러 워커가 동시에 쓰고 rename | 해당 파일 존재 확인 | ✅ 코드로 해결 |
| ② | **`next dev` 와 `next build` 가 같은 `.next` 를 동시 사용** | dev 서버가 떠 있는 채로 build 를 여러 번 돌린 이력 확인 | ✅ 코드로 해결 |
| ③ | **실시간 감시 백신(알약)이 파일을 잠금** | 알약이 활성(`0x41000`), Defender 실시간 보호는 꺼져 있음 | ⚠️ **수동 설정 필요** |

**확인했지만 원인이 아니었던 것**

- ❌ OneDrive 동기화 — 프로젝트는 `C:\Users\Yuher\Projects\icanmeal` 로 `%OneDrive%`(`C:\Users\Yuher\OneDrive`) 밖에 있다. 재분석 지점·클라우드 속성도 없음
- ❌ `.gitignore` 누락 — `/.next/` 는 처음부터 있었다 (애초에 gitignore 는 파일 잠금과 무관)
- ❌ `next.config.mjs` 의 충돌 설정 — 설정이 **비어 있었다**(`{}`). 문제는 잘못된 설정이 아니라 **Windows 대응이 아예 없던 것**
- ❌ dev 서버 중복 실행 — 확인 시점엔 1개만 떠 있었다 (npm → next CLI → 서버 워커 3개 프로세스는 정상)

### 해결 ①② — `next.config.mjs` (개발 모드 전용)

```js
if (isDev) {
  config.distDir = '.next-dev'              // ② dev/build 산출물 분리
  config.experimental = { workerThreads: false, cpus: 1 }
}
webpackConfig.cache = false                 // ① 디스크 캐시 끄고 메모리만
webpackConfig.watchOptions.ignored = [...]  // 워처 부하 감소
```

- **프로덕션 빌드·배포에는 영향 없다.** `next build` 는 그대로 `.next` 를 쓴다
- `distDir` 분리 덕분에 **dev 서버가 떠 있어도 `npm run build` 를 돌릴 수 있다**
- 키즈밀에서 같은 증상을 먼저 겪고 검증한 대응이다 (`kizmeal-renewal/next.config.mjs`)

검증: dev 실행 중 build 동시 실행 → 종료코드 0, 잠금 에러 0건, dev 서버 정상 유지.
`.next-dev/cache/webpack` 이 생성되지 않는 것으로 캐시 비활성화 확인.

### 해결 ③ — 백신(알약) 예외 등록 ⚠️ 직접 해주세요

코드로는 못 막는다. 알약이 webpack 이 빠르게 쓰는 파일을 스캔하며 잠그면 같은 에러가 난다.

```
알약 → 환경설정 → 실시간 검사 → 검사 제외 설정
  ├ 폴더 추가 : C:\Users\Yuher\Projects\icanmeal
  └ 폴더 추가 : C:\Users\Yuher\Projects\kizmeal-renewal   (같은 증상 예방)
```

Windows Defender 도 켜서 쓰게 되면 관리자 PowerShell 에서:

```powershell
Add-MpPreference -ExclusionPath  "C:\Users\Yuher\Projects"
Add-MpPreference -ExclusionProcess "node.exe"
```

> 개발 폴더만 제외하는 것이라 일반적인 보안 위험은 낮다.
> 다만 `node_modules` 에 악성 패키지가 들어오는 경우까지 막지는 못하니
> 의존성 추가 시에는 주의할 것.

### 재발 시 — `npm run dev:clean`

```bash
npm run dev:clean
```

1. 이 프로젝트의 좀비 next 프로세스 종료 (포트 3000 + 커맨드라인이 이 프로젝트인 것만)
2. `.next-dev`, `.next` 삭제
3. `next dev` 기동

PowerShell / cmd / Git Bash 어디서든 동작한다
(`package.json` 에 PowerShell 전용 문법을 넣으면 Git Bash 에서 깨지므로 node 스크립트로 뒀다).

**다른 프로젝트의 node 프로세스는 건드리지 않는다** — 커맨드라인에 이 프로젝트 경로가
포함된 것만 종료한다.

삭제가 실패하면 아직 파일을 잡고 있는 프로세스가 있다는 뜻이다.
편집기/터미널을 닫고 다시 시도하거나 위 백신 예외를 확인할 것.

### 습관으로 예방

- `npm run dev` 를 여러 개 띄우지 말 것 (포트가 3001로 밀리면 이미 하나 떠 있는 것)
- 작업 끝나면 `Ctrl+C` 로 dev 서버를 제대로 종료 (터미널 창만 닫으면 좀비가 남는다)
- `.next-dev` / `.next` 는 언제 지워도 되는 산출물이다. 지웠다고 잃는 것은 없다

---

## 작업 규칙

- 커밋 메시지는 한글 OK, prefix는 `feat:` `fix:` `chore:` `style:` 사용
- 큰 작업은 브랜치 파고 PR → main 머지
- 빌드(`npm run build`) 통과 확인 후 push
- 파일 삭제·구조 변경 같은 되돌리기 어려운 작업은 먼저 물어볼 것
- 미들웨어 라우트 보호는 **deny-by-default** 로 (공개 경로만 예외 처리).
  열거식으로 짜면 페이지 추가 시 보호 누락이 생긴다 — 키즈밀이 실제로 겪은 사고

---

## 🔀 법인 분리 대비 필수 원칙 (개발 시 반드시 지킬 것)

> 분리 시점·명의·실행 절차는 `docs/BUSINESS.md` 참고.

1. **kizmeal 프로젝트의 테이블/스키마/함수를 절대 참조하지 않는다**
   — "회원정보 공유하면 편한데?" 같은 유혹이 와도 절대 금지.
   이걸 어기는 순간 분리가 불가능해진다.

2. **모든 테이블은 `supabase/migrations/` 에 SQL 파일로 남긴다**
   — 대시보드 클릭으로만 만들면 새 프로젝트에 재현이 지옥이 된다.
   (키즈밀 `public_inquiries` 가 실제로 이 상태다 — 코드는 쓰는데 CREATE 문이 없다)

3. **Supabase 접속 정보는 반드시 환경변수로만**
   — 코드에 하드코딩 금지. Storage URL 도 포함이다.

4. **Storage 경로 규칙 유지** (`media/videos/{kids|silver}/`)
   — 파일 복사만으로 이전 가능하게.
   DB 에는 절대 URL 이 아니라 **버킷 내 상대경로(`storage_path`)** 를 저장한다.

5. **auth.users 외 외부 의존성 없게**

---

## 🗂️ 관리자 페이지 개발 방침

키즈밀 ERP를 통째로 이식하지 않는다. 구조가 다르다
(키즈밀=49개 지점 식단표 관리 / 아이캔밀=B2B 쇼핑몰).
재활용할 것은 **코드가 아니라 패턴**이다.

### 단계별 접근

| 단계 | 관리자 방식 | 시점 |
|------|-----------|------|
| 1 | Supabase 대시보드로 직접 관리 | 지금 ~ 첫 주문 |
| 2 | 최소 관리자 페이지 3개<br>(회원승인 / 주문목록 / 문의답변) | 기관 5~10곳 |
| 3 | 본격 ERP (키즈밀 패턴 이식) | 기관 30곳+ |

**단, DB 설계에는 처음부터 반영해둔다** (관리자 활동 로그,
주문 상태 전이, 승인/반려 상태 등). 나중에 컬럼 추가는 고통스럽다.

### 키즈밀에서 가져올 패턴

| 키즈밀 | 아이캔밀 적용 |
|--------|--------------|
| `lib/roles.ts` | 권한 상수 중앙화 (capability 배열 방식) |
| `is_admin()` SECURITY DEFINER | RLS 무한재귀 회피 — **가장 중요** |
| `get_my_branch_id()` | `get_my_institution_id()` — 다계정 확장 대비 |
| `board/customer/` 2패널 UI | 1:1 문의 게시판 |
| `parents` 승인 워크플로우 | **기관 회원 승인** (pending/approved/rejected) |
| `parent/(portal)/` 로그인 전용 영역 | **영상 게이트** |
| Resend 이메일 | 주문/승인 알림 |
| GitHub Actions + python-pptx | 교안 자동 생성 |

### ⛔ 키즈밀 코드 취급 규칙

`C:\Users\Yuher\Projects\kizmeal-renewal` 는 **운영 중인 실서비스**다.
Claude Code로 참조할 때 반드시 **읽기 전용**으로만 다룬다.
파일 생성·수정·삭제, git 명령, npm 실행, 빌드 전부 금지.
허용: 파일 읽기(Read)와 검색(Grep/Glob)뿐.

> ⚠️ `api/download/route.ts` 처럼 **그대로 베끼면 안 되는 코드**도 있다
> (권한 체크 없음 + SSRF). 반면교사 목록은 `docs/DB_DESIGN_DRAFT.md` 1-2 참고.

---

## 💡 향후 검토 사항

- 허이사님께 상품 **상세페이지 시안** 요청 (HTML)
  - 재료구성, 조리순서, 교안 미리보기, 소요시간, 대상연령,
    알레르기 정보, 영상 미리보기, 수량선택/주문
- 제품 카드 "🎬 영상포함" 배지 — 실제 영상은 홈/키즈/실버 3개뿐.
  배지 유지할지 허이사님 확인 필요
- 실버 실사 사진 12장은 `public/images/products/silver/` 에 보관 중
  (현재는 일러스트 사용). 필요 시 `constants/index.ts` 경로만 교체
- 최소 주문 30세트 / 배송 10영업일 전 주문 — 전역 정책인지 상품별인지 확정 필요
  (`docs/DB_DESIGN_DRAFT.md` Q6)
