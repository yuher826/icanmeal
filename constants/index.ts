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
    '키즈·실버 특화 쿠킹키트를 기관에 공급하는 B2B 푸드에듀케이션 브랜드입니다.',
  url: 'https://icanmeal.kr',
  email: 'hello@icanmeal.kr',
  phone: '02-000-0000',
  address: '서울특별시',
  businessNumber: '000-00-00000',
} as const

/* ============================================================
   NAVIGATION
   ============================================================ */
export const NAV_ITEMS: NavItem[] = [
  { label: '키즈 쿠킹키트', href: '/kids' },
  { label: '실버 쿠킹키트', href: '/silver' },
  { label: '월간 프로그램', href: '/program' },
  { label: '활동가이드', href: '/guide' },
  { label: '기관 문의', href: '/inquiry' },
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
   HOME PAGE — BRAND STEPS
   ============================================================ */
export const BRAND_STEPS = [
  {
    num: '01',
    title: '기관 가입·승인',
    desc: '사업자번호로 간편 가입 후 담당자 승인을 받으세요.',
  },
  {
    num: '02',
    title: '키트 선택·주문',
    desc: '연령별, 테마별 쿠킹키트를 골라 소량·대량 주문하세요.',
  },
  {
    num: '03',
    title: '수업 진행',
    desc: '전용 교안과 영상으로 누구나 쉽게 수업을 운영합니다.',
  },
  {
    num: '04',
    title: '기억에 남는 경험',
    desc: '아이들과 어르신들의 반짝이는 순간을 함께 만드세요.',
  },
]

/* ============================================================
   HOME PAGE — INSTITUTION FEATURES
   ============================================================ */
export const INSTITUTION_FEATURES = [
  {
    title: '전용 교안 · 활동지 제공',
    desc: '연령·수준별로 제작된 수업 교안, 활동지, PPT를 무료로 제공합니다.',
  },
  {
    title: '수업 영상 스트리밍',
    desc: '전문 강사의 시연 영상으로 비전문가도 자신 있게 수업하세요.',
  },
  {
    title: '기관별 최소 주문 수량 적용',
    desc: '소규모 기관도 부담 없이 주문할 수 있는 유연한 수량 정책.',
  },
  {
    title: '견적·B2B 결제 병행',
    desc: '온라인 결제와 세금계산서 발행, 견적서 발급을 모두 지원합니다.',
  },
  {
    title: '담당 매니저 1:1 지원',
    desc: '기관 전담 담당자가 수업 계획부터 사후 관리까지 도와드립니다.',
  },
]

/* ============================================================
   HOME PAGE — CASE GALLERY
   ============================================================ */
export const CASE_ITEMS = [
  {
    label: '어린이집 쿠킹클래스',
    bg: 'linear-gradient(150deg, var(--kids-tint) 0%, #f0c8a8 100%)',
  },
  {
    label: '노인복지센터 실버키트',
    bg: 'linear-gradient(150deg, var(--silver-tint) 0%, #c8b0e8 100%)',
  },
  {
    label: '초등학교 방과후 수업',
    bg: 'linear-gradient(150deg, #FFF3D6 0%, #e8c87a 100%)',
  },
  {
    label: '유치원 계절 테마 키트',
    bg: 'linear-gradient(150deg, var(--kids-tint) 0%, var(--kids-butter) 100%)',
  },
]

/* ============================================================
   FOOTER LINKS
   ============================================================ */
export const FOOTER_LINKS = {
  service: [
    { label: '키즈 쿠킹키트', href: '/kids' },
    { label: '실버 쿠킹키트', href: '/silver' },
    { label: '월간 프로그램', href: '/program' },
    { label: '활동가이드',    href: '/guide' },
  ],
  support: [
    { label: '기관 문의·주문', href: '/inquiry' },
    { label: '자주 묻는 질문', href: '/guide#faq' },
    { label: '기관 회원가입',  href: '/auth/register' },
    { label: '개인정보처리방침', href: '/privacy' },
  ],
} as const

/* ============================================================
   PAGINATION
   ============================================================ */
export const DEFAULT_PAGE_SIZE = 12
