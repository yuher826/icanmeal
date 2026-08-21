import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminUser, ADMIN_ROLE_LABEL } from '@/lib/admin-auth'
import AdminChrome from './AdminChrome'

export const metadata: Metadata = {
  title: '관리자 | ICANMEAL',
  robots: { index: false, follow: false },
}

/** 관리자 세션은 요청마다 검증한다. 정적 캐시되면 안 된다. */
export const dynamic = 'force-dynamic'

/**
 * /admin/* 보호 레이아웃.
 *
 * /admin/login 은 이 라우트 그룹 밖에 있어서 이 가드를 타지 않는다.
 * (같은 폴더에 두면 로그인 화면 자체가 로그인 검사를 받아 무한 리다이렉트가 난다)
 *
 * 미들웨어는 "세션이 있는가"까지만 본다. "관리자인가"는 DB 조회가 필요해서
 * 여기서 판정한다 — deny-by-default 의 최종 방어선.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, denial } = await getAdminUser()

  if (!admin) {
    redirect(`/admin/login?denied=${denial}`)
  }

  return (
    <AdminChrome
      adminName={admin.name}
      adminRoleLabel={ADMIN_ROLE_LABEL[admin.role] ?? admin.role}
    >
      {children}
    </AdminChrome>
  )
}
