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

---

## 문서

| 파일 | 내용 | git |
|------|------|-----|
| `CLAUDE.md` | 개발 규칙·진행상황 (이 문서) | ✅ 커밋 |
| `docs/DB_DESIGN_DRAFT.md` | DB 설계 초안 (테이블·RLS·구현순서) | ✅ 커밋 |
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

### ✅ 완료
- Next.js + TS + Tailwind 세팅, Supabase 연동 (`lib/supabase.ts`)
- 전체 페이지 뼈대: 홈 / kids / silver / program / guide / inquiry / auth(login·register) / mypage
- Vercel 배포 + 환경변수 + Deployment Protection 해제
- Supabase Storage `media` 버킷 + videos/kids, videos/silver 폴더
- 시안 기준 전면 리디자인 (PR #1)
- 허이사님 에셋 수령 → 이미지 `public/images/` 배치, 동영상 Storage 업로드
- **이미지/동영상 전체 페이지 적용 완료** (PR #2)
  — 로고·마스코트, 키즈/실버 24종 제품 이미지, 활동사례 사진, 히어로 영상 3종
- **카드 디자인 시안 일치 완료** (PR #3 ~ #6)
  — `object-fit: contain` + 16:9 통일, 실버 배경 흰색 정규화, 카드 높이 정렬
- **계절 필터 버그 수정 완료** (PR #7)
  — `ScrollAnimation` 이 DOM 을 직접 조작해 `visible` 클래스가 리렌더링에 지워지던 문제.
    React state 로 전환. 키즈·실버 양쪽 해결
- **Supabase URL 오타 수정 완료** (PR #8) — `.env.local` + Vercel 환경변수
  — 더불어 `constants/index.ts` 의 Storage URL 하드코딩 제거
- **DB 설계 문서 작성 완료** — `docs/DB_DESIGN_DRAFT.md`
  — 테이블 10개 + Phase 2 대비 9개, RLS 초안, 법인분리 자체점검, 구현순서

### 🔄 진행 중
- 없음 (다음 단계 결정 대기)

### 📋 다음 할 일 (우선순위 순)
1. **`docs/DB_DESIGN_DRAFT.md` 의 Q1~Q7 결정** ← 지금 여기
2. 결정 반영해 **마이그레이션 SQL 작성** (`supabase/migrations/`)
   - 1차: 공통 기반(헬퍼 함수·admins·audit_logs) + institutions + products
   - ⚠️ 실행 전 대시보드에서 기존 테이블 유무 확인 (문서 0-4)
3. 기관 회원가입 · 승인 시스템 + 마이페이지
4. 상품 데이터 이관 (`constants/index.ts` → DB, 문서 7장)
5. 1:1 CS 게시판 (키즈밀 2패널 UI 패턴 재활용)
6. 주문 + 결제 (토스페이먼츠)
7. 영상 게이트 (주문 완료 기관만 접근) — Q2 결정 선행 필요
8. Resend 이메일 알림 + `email_logs`
9. 교안 자동화 (GitHub Actions + python-pptx)
10. 정기주문
11. 관리자 ERP

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
