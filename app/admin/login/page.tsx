import type { Metadata } from 'next'
import AdminLoginForm from './AdminLoginForm'

export const metadata: Metadata = {
  title: '관리자 로그인 | ICANMEAL',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { denied?: string; next?: string }
}) {
  return (
    <AdminLoginForm
      denied={searchParams.denied}
      nextPath={searchParams.next ?? '/admin/institutions'}
    />
  )
}
