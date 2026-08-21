import { redirect } from 'next/navigation'

/** /admin → 기관 관리로. 미로그인이면 미들웨어가 먼저 로그인으로 보낸다. */
export default function AdminIndexPage() {
  redirect('/admin/institutions')
}
