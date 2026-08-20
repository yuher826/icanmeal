'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/constants'

/* 로고마크 — 오렌지 셰프 모자 캐릭터 뱃지 */
function LogoMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        background: 'var(--kids-coral-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        flexShrink: 0,
      }}
    >
      👨‍🍳
    </span>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  /* 스크롤 감지 */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* 라우트 변경 시 모바일 메뉴 닫기 */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  /* 모바일 메뉴 열릴 때 배경 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(244,242,238,0.97)' : 'rgba(244,242,238,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--line)',
          transition: 'background 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--wrap-max)',
            margin: '0 auto',
            padding: '0 22px',
            height: 'var(--nav-h)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* ── 로고 ── */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              textDecoration: 'none',
              marginRight: 8,
            }}
          >
            <LogoMark />
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '0.01em',
                color: 'var(--kids-coral-deep)',
                whiteSpace: 'nowrap',
              }}
            >
              I CAN MEAL
            </span>
          </Link>

          {/* ── 데스크톱 네비 ── */}
          <nav
            aria-label="메인 메뉴"
            className="header-desktop-nav"
            style={{ display: 'flex', gap: 4, flex: 1 }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '9px 15px',
                    borderRadius: 100,
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s, color 0.2s',
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? '#fff' : 'var(--ink-soft)',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* ── 우측 액션 ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
            <Link
              href="/auth/login"
              className="btn-ghost header-desktop-only"
            >
              로그인
            </Link>
            <Link
              href="/inquiry"
              className="btn-cta header-desktop-only"
            >
              맞춤 제안 받기
            </Link>

            {/* 햄버거 (모바일) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileOpen}
              className="header-mobile-btn"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'none',       /* CSS로 모바일에서 flex로 변경 */
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileOpen ? 'var(--ink)' : 'var(--white)',
                border: '1px solid var(--line)',
                color: mobileOpen ? 'var(--cream)' : 'var(--ink)',
                transition: 'background 0.2s, color 0.2s',
                cursor: 'pointer',
              }}
            >
              {mobileOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── 모바일 드로어 ── */}
      {mobileOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(46,37,31,0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 98,
            }}
          />
          {/* 드로어 패널 */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="모바일 메뉴"
            style={{
              position: 'fixed',
              top: 'var(--nav-h)',
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'var(--cream)',
              borderBottom: '1px solid var(--line)',
              padding: '16px 24px 28px',
              animation: 'slideDown 0.22s ease',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      padding: '13px 16px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: active ? 'var(--kids-tint)' : 'transparent',
                      color: active ? 'var(--kids-coral-deep)' : 'var(--ink)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {item.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                )
              })}
            </nav>

            <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid var(--line)' }} />

            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                href="/auth/login"
                style={{
                  flex: 1, textAlign: 'center', padding: '13px',
                  borderRadius: 12, border: '1.5px solid var(--line)',
                  fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)',
                }}
              >
                로그인
              </Link>
              <Link
                href="/inquiry"
                style={{
                  flex: 1, textAlign: 'center', padding: '13px',
                  borderRadius: 12, background: 'var(--ink)',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                }}
              >
                맞춤 제안 받기
              </Link>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 980px) {
          .header-desktop-nav  { display: none !important; }
          .header-desktop-only { display: none !important; }
          .header-mobile-btn   { display: flex !important; }
        }
        /* 데스크톱: 네비 호버 */
        @media (min-width: 981px) {
          .header-desktop-nav a:hover {
            background: var(--cream-deep) !important;
            color: var(--ink) !important;
          }
        }
      `}</style>
    </>
  )
}
