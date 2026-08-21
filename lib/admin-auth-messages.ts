/**
 * 관리자 인증 관련 상수 중 **클라이언트에서도 쓰는 것**만 모은다.
 *
 * lib/admin-auth.ts 는 'server-only' 라서 클라이언트 컴포넌트가 import 하면
 * 빌드가 깨진다. 로그인 폼(클라이언트)이 거부 사유 메시지를 써야 해서 분리했다.
 */

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
} as const

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES]

export const ADMIN_ROLE_LABEL: Record<string, string> = {
  super_admin: '슈퍼관리자',
  admin: '관리자',
}

/** 로그인 거부 사유 */
export type AdminAuthDenial = 'no_session' | 'not_admin' | 'inactive'

export const ADMIN_DENIAL_MESSAGE: Record<AdminAuthDenial, string> = {
  no_session: '로그인이 필요합니다.',
  not_admin: '관리자 권한이 없는 계정입니다.',
  inactive: '비활성화된 관리자 계정입니다. 담당자에게 문의하세요.',
}
