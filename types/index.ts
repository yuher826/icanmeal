/* ============================================================
   ICANMEAL — TypeScript 전체 타입 정의
   ============================================================ */

/* ── 제품 라인 ── */
export type ProductLine = 'kids' | 'silver'

/* ── 보관 방법 ── */
export type StorageType = 'refrigerated' | 'frozen' | 'room_temp'

/* ── 난이도 ── */
export type Difficulty = 'easy' | 'medium' | 'hard'

/* ── 14대 알레르기 ── */
export type Allergen =
  | 'egg' | 'milk' | 'buckwheat' | 'peanut' | 'soy' | 'wheat'
  | 'mackerel' | 'crab' | 'shrimp' | 'pork' | 'peach' | 'tomato'
  | 'walnut' | 'chicken' | 'beef' | 'squid' | 'shellfish' | 'pine_nut'

/* ── 알러지 UI 라벨 ── */
export interface AllergenLabel {
  key: Allergen
  label: string
  emoji: string
}

/* ── 제품 ── */
export interface Product {
  id: string
  slug: string
  line: ProductLine
  name: string
  subtitle: string
  description: string
  long_description?: string
  thumbnail_url?: string
  images: string[]

  age_min?: number
  age_max?: number
  cook_time_min: number
  difficulty: Difficulty
  storage: StorageType
  serving_size: number
  allergens: Allergen[]

  price: number
  min_order_qty: number
  unit: string

  ingredients?: string[]
  steps?: string[]
  learning_points?: string[]

  category_id?: string
  is_active: boolean
  is_featured: boolean
  sort_order: number

  created_at: string
  updated_at: string
}

/* ── 제품 카테고리 ── */
export interface ProductCategory {
  id: string
  name: string
  slug: string
  line: ProductLine
  description?: string
  sort_order: number
}

/* ── 기관 유형 ── */
export type InstitutionType =
  | 'daycare'
  | 'kindergarten'
  | 'elementary'
  | 'welfare_center'
  | 'senior_center'
  | 'hospital'
  | 'other'

/* ── 기관 승인 상태 ── */
export type ApprovalStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

/* ── 기관 프로필 ── */
export interface InstitutionProfile {
  id: string
  user_id: string
  institution_name: string
  institution_type: InstitutionType
  business_number: string
  representative_name: string
  contact_name: string
  contact_phone: string
  address: string
  address_detail?: string
  zip_code: string
  approval_status: ApprovalStatus
  approved_at?: string
  rejected_reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

/* ── 유저 역할 ── */
export type UserRole = 'super_admin' | 'staff' | 'institution' | 'guest'

/* ── 장바구니 ── */
export interface CartItem {
  product: Product
  quantity: number
}

/* ── 주문 상태 ── */
export type OrderStatus =
  | 'pending' | 'confirmed' | 'preparing'
  | 'shipped' | 'delivered' | 'cancelled'

/* ── 결제 방법 ── */
export type PaymentMethod = 'toss' | 'bank_transfer' | 'quote'

/* ── 주문 아이템 ── */
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

/* ── 주문 ── */
export interface Order {
  id: string
  order_number: string
  institution_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  total_amount: number
  items: OrderItem[]
  shipping_address: string
  shipping_note?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

/* ── 문의 유형 ── */
export type InquiryType = 'order' | 'product' | 'program' | 'partnership' | 'other'

/* ── 기관 문의 ── */
export interface Inquiry {
  id: string
  institution_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  institution_type: InstitutionType
  inquiry_type: InquiryType
  line_interest: ProductLine[]
  expected_quantity?: number
  message: string
  created_at: string
}

/* ── 월간 프로그램 ── */
export interface MonthlyProgram {
  id: string
  year: number
  month: number
  week: number
  title: string
  description: string
  line: ProductLine
  product_id?: string
  theme?: string
  created_at: string
}

/* ── 활동 가이드 ── */
export interface ActivityGuide {
  id: string
  title: string
  description: string
  line: ProductLine
  category: string
  thumbnail_url?: string
  file_url?: string
  video_url?: string
  requires_purchase: boolean
  created_at: string
}

/* ── 교안·다운로드 ── */
export interface TeachingMaterial {
  id: string
  title: string
  description: string
  file_url: string
  file_type: 'pdf' | 'pptx' | 'video' | 'zip'
  file_size?: number
  line: ProductLine
  product_id?: string
  is_premium: boolean
  created_at: string
}

/* ── 네비게이션 ── */
export interface NavItem {
  label: string
  href: string
}

/* ── API 응답 래퍼 ── */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

/* ── 페이지네이션 ── */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
