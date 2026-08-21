'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

interface NavItem {
  href: string
  label: string
  icon: string
  enabled: boolean
}

/** 사이드바 메뉴. 다음 세션에 붙일 화면은 enabled:false 로 자리만 잡아둔다. */
const NAV_ITEMS: NavItem[] = [
  { href: '/admin/institutions', label: '기관 관리', icon: '🏢', enabled: true },
  { href: '/admin/orders', label: '주문 관리', icon: '📦', enabled: false },
  { href: '/admin/inquiries', label: '문의 관리', icon: '💬', enabled: false },
]

interface Props {
  adminName: string
  adminRoleLabel: string
  children: React.ReactNode
}

export default function AdminChrome({ adminName, adminRoleLabel, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const active =
    NAV_ITEMS.find((i) => i.enabled && pathname?.startsWith(i.href)) ?? NAV_ITEMS[0]

  async function handleLogout() {
    setSigningOut(true)
    await createSupabaseBrowserClient().auth.signOut()
    // 서버 컴포넌트 캐시를 비우고 로그인 화면으로
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-shell">
      {/* ── 사이드바 ── */}
      <aside className="admin-sidebar">
        <Link href="/admin/institutions" className="admin-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo_mark.png"
            alt=""
            aria-hidden="true"
            style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }}
          />
          <span style={{ lineHeight: 1.25 }}>
            <span className="admin-brand-name">ICANMEAL</span>
            <br />
            <span className="admin-brand-tag">Admin</span>
          </span>
        </Link>

        <div className="admin-nav-section">운영</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map((item) =>
            item.enabled ? (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${item.href === active.href ? ' active' : ''}`}
                aria-current={item.href === active.href ? 'page' : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="admin-nav-link disabled"
                aria-disabled="true"
                title="다음 업데이트에 제공됩니다"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
                <span className="admin-nav-soon">준비중</span>
              </span>
            )
          )}
        </nav>
      </aside>

      {/* ── 본문 ── */}
      <div className="admin-body">
        <header className="admin-topbar">
          <span className="admin-topbar-title">{active.label}</span>

          <div className="admin-topbar-user">
            <span className="admin-avatar" aria-hidden="true">
              {adminName.charAt(0)}
            </span>
            <span>
              <strong style={{ fontWeight: 700 }}>{adminName}</strong>
              <span style={{ color: 'var(--ink-soft)', marginLeft: 6, fontSize: 12 }}>
                {adminRoleLabel}
              </span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              className="admin-btn admin-btn-ghost"
              style={{ padding: '7px 14px', fontSize: 12.5 }}
            >
              {signingOut ? '로그아웃 중…' : '로그아웃'}
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
