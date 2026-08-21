'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

/**
 * 마케팅 사이트용 헤더/푸터를 /admin 영역에서는 숨긴다.
 *
 * 루트 레이아웃이 Header/Footer 를 직접 렌더하고 있어서, 관리자 레이아웃을
 * 중첩해도 사이트 헤더가 같이 나온다. 기존 페이지 10여 개를 (site) 라우트 그룹으로
 * 옮기는 대신, 경로만 보고 렌더 여부를 결정하는 얇은 래퍼를 둔다.
 * (라우트 그룹 이전은 URL 변화는 없지만 파일 이동 범위가 커서 이번엔 보류)
 */
function isAdminArea(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith('/admin')
}

export function SiteHeader() {
  if (isAdminArea(usePathname())) return null
  return <Header />
}

export function SiteFooter() {
  if (isAdminArea(usePathname())) return null
  return <Footer />
}

/** 관리자 영역에서는 <main> 의 사이트 여백도 빼준다 */
export function SiteMain({ children }: { children: React.ReactNode }) {
  const admin = isAdminArea(usePathname())
  return <main className={admin ? 'admin-main' : undefined}>{children}</main>
}
