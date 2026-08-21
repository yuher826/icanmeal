import type {
  NavItem,
  AllergenLabel,
  Allergen,
  ProductLine,
  InstitutionType,
  Difficulty,
  StorageType,
} from '@/types'

/* ============================================================
   SITE CONFIG
   ============================================================ */
export const SITE_CONFIG = {
  name: 'ICANMEAL',
  tagline: '만들고, 나누고, 기억에 남는 경험',
  description:
    '아이는 오감을 키우고, 어르신은 추억을 되찾는 — 키즈·실버 특화 쿠킹키트를 기관에 공급하는 푸드에듀케이션 브랜드입니다.',
  url: 'https://icanmeal.kr',
  email: 'partner@icanmeal.kr',
  phone: '1588-0000',
  address: '서울특별시',
  businessNumber: '000-00-00000',
  hours: '평일 09:00–18:00',
} as const

/* ============================================================
   BRAND ASSETS (로고 · 마스코트)
   ============================================================ */
export const BRAND_ASSETS = {
  logoMark: '/images/brand/logo_mark.png',
  logoWordmark: '/images/brand/logo_wordmark.png',
  mascotChef: '/images/brand/mascot_chef.png',
  mascotGroup: '/images/brand/mascot_group.png',
  mascotLemon: '/images/brand/mascot_lemon.png',
  mascotEgg: '/images/brand/mascot_egg.png',
} as const

/* ============================================================
   SUPABASE STORAGE — 공개 미디어 base URL

   프로젝트 URL을 하드코딩하지 않는다.
   법인 분리 시 Supabase 프로젝트 ref가 바뀌는데, 하드코딩돼 있으면
   코드를 뒤져가며 전부 고쳐야 한다 (CLAUDE.md「법인 분리 계획」원칙 3).
   경로 규칙(media/videos/{kids|silver}/)은 원칙 4에 따라 유지 —
   새 프로젝트로 파일만 복사하면 그대로 동작한다.
   ============================================================ */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const MEDIA_BASE = `${SUPABASE_URL}/storage/v1/object/public/media`

/* ============================================================
   HERO VIDEOS (Supabase Storage)
   ============================================================ */
export const HERO_VIDEOS = {
  home: `${MEDIA_BASE}/videos/home_hero_opening.mp4`,
  kids: `${MEDIA_BASE}/videos/kids/kids_class.mp4`,
  silver: `${MEDIA_BASE}/videos/silver/silver_class.mp4`,
} as const

/* ============================================================
   NAVIGATION  (ICANMEAL_몰_검수용_1.html 상단 GNB 기준)
   ============================================================ */
export const NAV_ITEMS: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '키즈 쿠킹키트', href: '/kids' },
  { label: '실버 쿠킹키트', href: '/silver' },
  { label: '월간 프로그램', href: '/program' },
  { label: '활동가이드·사례', href: '/guide' },
  { label: '기관 주문·문의', href: '/inquiry' },
]

/* ============================================================
   PRODUCT LINE LABELS
   ============================================================ */
export const LINE_LABELS: Record<ProductLine, { label: string; en: string }> = {
  kids:   { label: '키즈',  en: 'Kids' },
  silver: { label: '실버', en: 'Silver' },
}

/* ============================================================
   DIFFICULTY LABELS
   ============================================================ */
export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; emoji: string }> = {
  easy:   { label: '쉬움',   emoji: '⭐' },
  medium: { label: '보통',   emoji: '⭐⭐' },
  hard:   { label: '어려움', emoji: '⭐⭐⭐' },
}

/* ============================================================
   STORAGE LABELS
   ============================================================ */
export const STORAGE_LABELS: Record<StorageType, { label: string; emoji: string; color: string }> = {
  refrigerated: { label: '냉장', emoji: '❄️',  color: '#E8F4FD' },
  frozen:       { label: '냉동', emoji: '🧊',  color: '#D6EAF8' },
  room_temp:    { label: '실온', emoji: '🌡️', color: '#FDEBD0' },
}

/* ============================================================
   ALLERGENS (14대 알레르기)
   ============================================================ */
export const ALLERGENS: AllergenLabel[] = [
  { key: 'egg',       label: '난류',    emoji: '🥚' },
  { key: 'milk',      label: '우유',    emoji: '🥛' },
  { key: 'buckwheat', label: '메밀',    emoji: '🌾' },
  { key: 'peanut',    label: '땅콩',    emoji: '🥜' },
  { key: 'soy',       label: '대두',    emoji: '🫘' },
  { key: 'wheat',     label: '밀',      emoji: '🌾' },
  { key: 'mackerel',  label: '고등어',  emoji: '🐟' },
  { key: 'crab',      label: '게',      emoji: '🦀' },
  { key: 'shrimp',    label: '새우',    emoji: '🦐' },
  { key: 'pork',      label: '돼지고기', emoji: '🐷' },
  { key: 'peach',     label: '복숭아',  emoji: '🍑' },
  { key: 'tomato',    label: '토마토',  emoji: '🍅' },
  { key: 'walnut',    label: '호두',    emoji: '🌰' },
  { key: 'chicken',   label: '닭고기',  emoji: '🐔' },
  { key: 'beef',      label: '쇠고기',  emoji: '🥩' },
  { key: 'squid',     label: '오징어',  emoji: '🦑' },
  { key: 'shellfish', label: '조개류',  emoji: '🦪' },
  { key: 'pine_nut',  label: '잣',      emoji: '🌲' },
]

export const ALLERGEN_MAP: Record<Allergen, AllergenLabel> = Object.fromEntries(
  ALLERGENS.map((a) => [a.key, a])
) as Record<Allergen, AllergenLabel>

/* ============================================================
   INSTITUTION TYPE LABELS
   ============================================================ */
export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  daycare:        '어린이집',
  kindergarten:   '유치원',
  elementary:     '초등학교',
  welfare_center: '복지관',
  senior_center:  '노인복지센터',
  hospital:       '병원·요양원',
  other:          '기타',
}

/* ============================================================
   APPROVAL STATUS UI
   ============================================================ */
export const APPROVAL_STATUS_UI = {
  pending:   { label: '신청 완료',  desc: '검토 대기 중입니다.',            color: 'var(--gold)' },
  reviewing: { label: '검토 중',    desc: '담당자가 확인하고 있습니다.',    color: 'var(--kids-coral)' },
  approved:  { label: '승인 완료',  desc: '서비스를 이용하실 수 있습니다.', color: '#2D6A4F' },
  rejected:  { label: '승인 거절',  desc: '담당자에게 문의해 주세요.',      color: '#C0392B' },
} as const

/* ============================================================
   ORDER STATUS UI
   ============================================================ */
export const ORDER_STATUS_UI = {
  pending:   { label: '결제 대기', color: 'var(--gold)' },
  confirmed: { label: '주문 확인', color: 'var(--kids-coral)' },
  preparing: { label: '준비 중',   color: 'var(--silver-rose)' },
  shipped:   { label: '배송 중',   color: '#2980B9' },
  delivered: { label: '배송 완료', color: '#2D6A4F' },
  cancelled: { label: '취소됨',   color: '#95A5A6' },
} as const

/* ============================================================
   월간 쿠킹키트 — 시안 상품 데이터
   (12개월, 12가지 테마 / 키즈·실버 각 라인)
   ============================================================ */
export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export const SEASON_LABELS: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  fall:   '가을',
  winter: '겨울',
}

export function seasonOfMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

export interface MonthlyKit {
  id: string
  line: ProductLine
  month: number
  tagline: string
  name: string
  desc: string
  unit?: string
  price: number
  video: boolean
  image: string
}

export const KIDS_PRODUCTS: MonthlyKit[] = [
  { id: 'kids-01', line: 'kids', month: 1,  tagline: '복이 가득! 영양 가득!',   name: '만두 만들기',          desc: '기관 즉석취식 불가 · 별도 포장재로 가정에 배송', unit: '3개',        price: 5500, video: true, image: '/images/products/kids/kids_01_만두.png' },
  { id: 'kids-02', line: 'kids', month: 2,  tagline: '새콤달콤!',              name: '딸기 쌀강정 만들기',    desc: '월간 정규 캘린더 쿠킹키트',                      unit: '2개',        price: 4500, video: true, image: '/images/products/kids/kids_02_딸기쌀강정.png' },
  { id: 'kids-03', line: 'kids', month: 3,  tagline: '알록달록 영양소 가득',    name: '꼬마김밥 만들기',      desc: '월간 정규 캘린더 쿠킹키트',                      unit: '3개',        price: 4500, video: true, image: '/images/products/kids/kids_03_꼬마김밥.png' },
  { id: 'kids-04', line: 'kids', month: 4,  tagline: '봄이 왔어요!',           name: '봄나비 부르게스타 만들기', desc: '월간 정규 캘린더 쿠킹키트',                   unit: '2개',        price: 4000, video: true, image: '/images/products/kids/kids_04_봄나비부르게스타.png' },
  { id: 'kids-05', line: 'kids', month: 5,  tagline: '새콤달콤',               name: '레몬청 만들기',        desc: '기관 즉석취식 불가 · 보관용기로 가정에 배송',    unit: '150ml 내외', price: 4500, video: true, image: '/images/products/kids/kids_05_레몬청.png' },
  { id: 'kids-06', line: 'kids', month: 6,  tagline: '포실포실',               name: '햇감자샌드위치 만들기', desc: '월간 정규 캘린더 쿠킹키트',                     unit: '2개',        price: 4000, video: true, image: '/images/products/kids/kids_06_햇감자샌드위치.png' },
  { id: 'kids-07', line: 'kids', month: 7,  tagline: '달콤한 여름 디저트!',     name: '미니컵 파르페 만들기',  desc: '월간 정규 캘린더 쿠킹키트',                     unit: '150g 내외',  price: 5500, video: true, image: '/images/products/kids/kids_07_미니컵파르페.png' },
  { id: 'kids-08', line: 'kids', month: 8,  tagline: '건강한 여름나기',         name: '참외컵화채 만들기',    desc: '월간 정규 캘린더 쿠킹키트',                     unit: '150ml 내외', price: 4500, video: true, image: '/images/products/kids/kids_08_참외컵화채.png' },
  { id: 'kids-09', line: 'kids', month: 9,  tagline: '추석맞이!',              name: '한가위 송편 만들기',    desc: '월간 정규 캘린더 쿠킹키트',                     unit: '3개',        price: 5000, video: true, image: '/images/products/kids/kids_09_한가위송편.png' },
  { id: 'kids-10', line: 'kids', month: 10, tagline: '한국음식의 뿌리',         name: '전통 된장 만들기',      desc: '기관 즉석취식 불가 · 보관용기로 가정에 배송',    unit: '150g 내외',  price: 5500, video: true, image: '/images/products/kids/kids_10_전통된장.png' },
  { id: 'kids-11', line: 'kids', month: 11, tagline: '유산균이 톡톡!',          name: '김장 김치 만들기',      desc: '기관 즉석취식 불가 · 보관용기로 가정에 배송',    unit: '600g 내외',  price: 6000, video: true, image: '/images/products/kids/kids_11_김장김치.png' },
  { id: 'kids-12', line: 'kids', month: 12, tagline: '빛나는 코!',             name: '루돌프 컵케이크 만들기', desc: '월간 정규 캘린더 쿠킹키트',                    unit: '1개',        price: 4500, video: true, image: '/images/products/kids/kids_12_루돌프컵케이크.png' },
]

export const SILVER_PRODUCTS: MonthlyKit[] = [
  { id: 'silver-01', line: 'silver', month: 1,  tagline: '온가족이 둘러앉아 빚던 만두!',                 name: '떡만둣국 만들기',       desc: '온가족이 둘러앉아 만두 빚던 기억을 함께 나누는 회상 활동입니다.',       price: 5500, video: true, image: '/images/products/silver_illustration/silver_illust_01_떡만둣국.png' },
  { id: 'silver-02', line: 'silver', month: 2,  tagline: '고운 색동저고리 입던 날의 설렘',                name: '월남떡쌈 만들기',       desc: '색동저고리 입고 설레던 날을 함께 나누는 회상 활동입니다.',              price: 4000, video: true, image: '/images/products/silver_illustration/silver_illust_02_월남떡쌈.png' },
  { id: 'silver-03', line: 'silver', month: 3,  tagline: '꽃구경 가던 봄날의 기억',                       name: '화전 만들기',           desc: '꽃구경 가던 봄날의 기억을 함께 나누는 회상 활동입니다.',                price: 4500, video: true, image: '/images/products/silver_illustration/silver_illust_03_화전.png' },
  { id: 'silver-04', line: 'silver', month: 4,  tagline: '그 시절 흙내음 대신 달콤함 심는 날',             name: '식목일 텃밭케이크 만들기', desc: '흙내음 대신 달콤함을 심던 식목일을 함께 나누는 회상 활동입니다.',     price: 4500, video: true, image: '/images/products/silver_illustration/silver_illust_04_식목일텃밭케이크.png' },
  { id: 'silver-05', line: 'silver', month: 5,  tagline: '계란이 왔어요~ 맛있는 계란장이 왔어요!',         name: '계란장 만들기',         desc: '계란장 나누어 먹던 기억을 함께 나누는 회상 활동입니다.',                price: 5000, video: true, image: '/images/products/silver_illustration/silver_illust_05_계란장.png' },
  { id: 'silver-06', line: 'silver', month: 6,  tagline: '뉘 집 감자여~?',                                name: '감자사라다빵 만들기',    desc: '동네에서 감자 나눠 먹던 기억을 함께 나누는 회상 활동입니다.',           price: 4000, video: true, image: '/images/products/silver_illustration/silver_illust_06_감자사라다빵.png' },
  { id: 'silver-07', line: 'silver', month: 7,  tagline: '정겨운 여름 손맛',                              name: '열무김치 만들기',       desc: '여름철 열무김치 담그던 손맛을 함께 나누는 회상 활동입니다.',            price: 5000, video: true, image: '/images/products/silver_illustration/silver_illust_07_열무김치.png' },
  { id: 'silver-08', line: 'silver', month: 8,  tagline: '매미 울던 여름날',                              name: '수박 화채 만들기',      desc: '매미 울던 여름날의 시원함을 함께 나누는 회상 활동입니다.',              price: 4500, video: true, image: '/images/products/silver_illustration/silver_illust_08_수박화채.png' },
  { id: 'silver-09', line: 'silver', month: 9,  tagline: '한가위 달빛 아래 가족들과 만들었던!',            name: '송편 만들기',           desc: '한가위 달빛 아래 온가족이 빚던 송편을 함께 나누는 회상 활동입니다.',     price: 4000, video: true, image: '/images/products/silver_illustration/silver_illust_09_송편.png' },
  { id: 'silver-10', line: 'silver', month: 10, tagline: '무병장수 기원, 약(藥)이 되는 귀한',              name: '약밥 만들기',           desc: '무병장수를 기원하며 나누던 약밥을 함께 나누는 회상 활동입니다.',        price: 4500, video: true, image: '/images/products/silver_illustration/silver_illust_10_약밥.png' },
  { id: 'silver-11', line: 'silver', month: 11, tagline: '수확의 기쁨!',                                  name: '튀밥 과즐 만들기',      desc: '수확의 기쁨을 나누던 튀밥 과즐을 함께 나누는 회상 활동입니다.',         price: 4000, video: true, image: '/images/products/silver_illustration/silver_illust_11_튀밥과즐.png' },
  { id: 'silver-12', line: 'silver', month: 12, tagline: '할머니·할아버지가 구운 달콤한 크리스마스의 기적', name: '크리스마스쿠키 만들기', desc: '손주에게 전하는 달콤한 크리스마스를 함께 나누는 회상 활동입니다.',      price: 5500, video: true, image: '/images/products/silver_illustration/silver_illust_12_크리스마스쿠키.png' },
]

/** 홈 "이번 달 추천 쿠킹키트" 섹션에 노출할 기준 월 (시안 기준 8월 고정) */
export const FEATURED_MONTH = 8

/* ============================================================
   HOME PAGE — 4대 체크 특징 (히어로 하단 바)
   ============================================================ */
export const HOME_CHECK_FEATURES = [
  { title: '전문 영양사 교안·수업영상', desc: '모든 상품에 기본 제공' },
  { title: '위생·보관 기준 안내',       desc: '냉장·냉동·실온 / 유통기한 / 알러지' },
  { title: '기관 전용 주문',            desc: '카드·세금계산서 발행' },
  { title: '월간 운영 캘린더 제안',      desc: '매달 프로그램 고민 없이' },
]

/* ============================================================
   HOME PAGE — 아이캔밀이 제공하는 공통 경험 (4단계)
   ============================================================ */
export const BRAND_STEPS = [
  { num: '1', title: '준비하기',       desc: '재료와 도구가 모두 준비된 키트를 받습니다' },
  { num: '2', title: '만들기',         desc: '손으로 직접 만지고 완성해 나갑니다' },
  { num: '3', title: '함께 나누기',    desc: '완성한 결과물을 함께 나누는 시간을 갖습니다' },
  { num: '4', title: '기억으로 남기기', desc: '오늘의 활동이 사진과 이야기로 남습니다' },
]

/* ============================================================
   HOME PAGE — 키트만 보내지 않습니다 (기관 지원)
   ============================================================ */
export const INSTITUTION_FEATURES = [
  { title: '교안 · 진행 카드 · 영상', desc: '교사·요양보호사가 바로 읽고 진행할 수 있는 단계별 카드와 수업용 영상을 함께 제공합니다.' },
  { title: '보관·위생 기준',          desc: '냉장·냉동·실온 보관, 유통기한, 알러지·주의사항을 명확히 안내합니다.' },
  { title: '보호자 공유 문구',        desc: '오늘의 활동을 보호자·가족에게 전달할 수 있는 사진 가이드와 문구를 제공합니다.' },
  { title: '월간 운영 캘린더',        desc: '매달 프로그램을 고민하지 않도록 월 단위 운영 계획을 제안합니다.' },
]

/* ============================================================
   HOME / GUIDE — 활동 사례 갤러리 (실제 기관 수업·완성작 사진)
   ============================================================ */
export const CASE_ITEMS = [
  { label: '만두 만들기 수업 현장',    image: '/images/cases/만두_수업현장.jpg' },
  { label: '만두 만들기 완성',        image: '/images/cases/만두_완성.jpg' },
  { label: '꼬마김밥 만들기 완성',    image: '/images/cases/꼬마김밥_완성.jpg' },
  { label: '미니컵 파르페 만들기 완성', image: '/images/cases/미니컵파르페_완성.jpg' },
  { label: '월남떡쌈 만들기 완성',    image: '/images/cases/월남떡쌈_완성.jpg' },
  { label: '튀밥 과즐 만들기 완성',   image: '/images/cases/튀밥과즐_완성.jpg' },
  { label: '타르트 만들기 수업 현장', image: '/images/cases/타르트_수업현장.jpg' },
]

/* ============================================================
   KIDS PAGE — KIDS ICANMEAL의 약속
   ============================================================ */
export const KIDS_PROMISE = [
  { icon: '🍽️', title: '밥상머리 교육',   desc: '함께 만들고 맛보며, 가족의 소중함과 예절을 배우는 시간입니다.' },
  { icon: '🥬',  title: '안전한 먹거리',   desc: '만들고 난 뒤에도 맛있고 안전하게 즐길 수 있도록 식재료를 꼼꼼히 준비합니다.' },
  { icon: '👩‍🍳', title: '전문 영양사 교안', desc: '전문 영양사팀이 만든 체계적인 교안으로 더 쉽고 전문적으로 진행하세요.' },
  { icon: '🇰🇷',  title: '한글·영문 교안',  desc: '요리 체험과 언어 경험을 함께 담은 한글·영문 교안을 제공합니다.' },
]

/* ============================================================
   SILVER PAGE — CORE VALUES (6개 알약형 배지)
   ============================================================ */
export const SILVER_CORE_VALUES = ['오감 활동', '손 조작', '정서적 완성감', '사회적 교류', '회상 대화', '보호자 공유']

/* ============================================================
   GUIDE PAGE — 기관 운영자의 실행 부담을 낮춥니다 (5종 자료)
   ============================================================ */
export const GUIDE_MATERIALS = [
  { icon: '📋', title: '교안 샘플',      desc: '교육목표, 활동 흐름, 대화 질문, 확장 활동까지 정리된 교안을 제공합니다.' },
  { icon: '🗂️', title: '진행 카드',      desc: '교사·요양보호사가 바로 읽고 진행할 수 있는 단계별 카드입니다.' },
  { icon: '📦', title: '보관·위생 안내', desc: '보관 온도, 유통기한, 알러지 정보를 명확하게 안내합니다.' },
  { icon: '📷', title: '사진 가이드',    desc: '손, 재료, 완성작, 함께 나누는 장면을 균형 있게 담는 촬영 가이드입니다.' },
  { icon: '🎬', title: '수업용 영상',    desc: '상품별 진행 영상, 완성 예시, 진행자 사전 준비용 영상을 제공합니다.' },
]

/* ============================================================
   FOOTER LINKS  (BRAND / SUPPORT / COMPANY)
   ============================================================ */
export const FOOTER_LINKS = {
  brand: [
    { label: '아이캔밀 소개', href: '/' },
    { label: '키즈 쿠킹키트', href: '/kids' },
    { label: '실버 쿠킹키트', href: '/silver' },
  ],
  support: [
    { label: '활동가이드·사례', href: '/guide' },
    { label: '월간 프로그램',   href: '/program' },
    { label: '기관 주문·문의',  href: '/inquiry' },
  ],
  company: [
    { label: '사업자 정보 표기 영역', href: '/company' },
    { label: '개인정보처리방침',      href: '/privacy' },
    { label: '이용약관',              href: '/terms' },
  ],
} as const

/* ============================================================
   PAGINATION
   ============================================================ */
export const DEFAULT_PAGE_SIZE = 12
