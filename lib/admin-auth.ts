import 'server-only'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'
import { ADMIN_ROLES, type AdminRole, type AdminAuthDenial } from './admin-auth-messages'

export {
  ADMIN_ROLES,
  ADMIN_ROLE_LABEL,
  ADMIN_DENIAL_MESSAGE,
} from './admin-auth-messages'
export type { AdminRole, AdminAuthDenial } from './admin-auth-messages'

export interface AdminUser {
  id: string
  auth_id: string
  name: string
  email: string
  role: AdminRole
  department: string | null
  is_active: boolean
}

/**
 * 현재 세션의 관리자 정보를 조회한다.
 * 관리자가 아니면 사유와 함께 null 을 돌려준다 (리다이렉트하지 않음).
 *
 * admins 테이블 RLS 는 `auth_id = auth.uid() OR is_admin()` 이라
 * 본인 행은 is_active 와 무관하게 읽을 수 있다.
 * 덕분에 "관리자가 아님" 과 "비활성 관리자" 를 구분해 안내할 수 있다.
 */
export async function getAdminUser(): Promise<
  { admin: AdminUser; denial: null } | { admin: null; denial: AdminAuthDenial }
> {
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { admin: null, denial: 'no_session' }

  const { data } = await supabase
    .from('admins')
    .select('id, auth_id, name, email, role, department, is_active, deleted_at')
    .eq('auth_id', user.id)
    .maybeSingle()

  if (!data || data.deleted_at) return { admin: null, denial: 'not_admin' }
  if (!data.is_active) return { admin: null, denial: 'inactive' }

  return {
    admin: {
      id: data.id,
      auth_id: data.auth_id,
      name: data.name,
      email: data.email,
      role: data.role as AdminRole,
      department: data.department,
      is_active: data.is_active,
    },
    denial: null,
  }
}

/**
 * 관리자 전용 페이지/액션의 진입 가드.
 *
 * ⚠️ service_role 클라이언트를 쓰는 모든 서버 액션은 가장 먼저 이 함수를 호출해야 한다.
 *    service_role 은 RLS 를 전부 우회하므로 여기가 유일한 방어선이다.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const { admin, denial } = await getAdminUser()
  if (!admin) {
    redirect(`/admin/login?denied=${denial}`)
  }
  return admin
}

/** super_admin 전용 작업 가드 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin()
  if (admin.role !== ADMIN_ROLES.SUPER_ADMIN) {
    redirect('/admin/institutions?error=super_admin_required')
  }
  return admin
}
