/**
 * 기관 관련 표시용 상수. 서버·클라이언트 양쪽에서 쓴다.
 * DB CHECK 제약(_0002_institutions.sql)과 값이 일치해야 한다.
 */

export const INSTITUTION_STATUSES = [
  'pending',
  'reviewing',
  'approved',
  'rejected',
  'suspended',
] as const

export type InstitutionStatus = (typeof INSTITUTION_STATUSES)[number]

export const INSTITUTION_STATUS_LABEL: Record<InstitutionStatus, string> = {
  pending: '승인 대기',
  reviewing: '검토 중',
  approved: '승인 완료',
  rejected: '반려',
  suspended: '정지',
}

/** globals.css 의 .status-* 클래스와 대응 */
export const INSTITUTION_STATUS_CLASS: Record<InstitutionStatus, string> = {
  pending: 'status-pending',
  reviewing: 'status-reviewing',
  approved: 'status-approved',
  rejected: 'status-rejected',
  suspended: 'status-suspended',
}

export const INSTITUTION_TYPE_LABEL: Record<string, string> = {
  daycare: '어린이집',
  kindergarten: '유치원',
  elementary: '초등학교',
  welfare_center: '복지관',
  senior_center: '노인복지센터',
  hospital: '병원·요양원',
  other: '기타',
}

export const PRICE_TIER_LABEL: Record<string, string> = {
  standard: '기본',
  preferred: '우대',
  partner: '파트너',
}

/** 목록 정렬 옵션 */
export const SORT_OPTIONS = {
  created_desc: { label: '가입일 최신순', column: 'created_at', ascending: false },
  created_asc: { label: '가입일 오래된순', column: 'created_at', ascending: true },
  name_asc: { label: '기관명 가나다순', column: 'name', ascending: true },
  name_desc: { label: '기관명 역순', column: 'name', ascending: false },
} as const

export type SortKey = keyof typeof SORT_OPTIONS

export const DEFAULT_SORT: SortKey = 'created_desc'
export const PAGE_SIZE = 20
