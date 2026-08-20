import Link from 'next/link'
import { SITE_CONFIG, FOOTER_LINKS } from '@/constants'

const COLUMNS = [
  { title: 'BRAND',   links: FOOTER_LINKS.brand },
  { title: 'SUPPORT', links: FOOTER_LINKS.support },
  { title: 'COMPANY', links: FOOTER_LINKS.company },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--ink)',
        color: 'rgba(244,242,238,0.55)',
        padding: '52px 0 30px',
        marginTop: 40,
      }}
    >
      <div className="wrap">
        <div
          className="footer-top-grid"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 40,
            marginBottom: 32,
          }}
        >
          {/* 브랜드 */}
          <div style={{ minWidth: 240, maxWidth: 340 }}>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: 'var(--kids-coral-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                👨‍🍳
              </span>
              ICANMEAL
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.75 }}>
              만들고, 나누고, 기억에 남는 경험 — 아이와 어르신이 직접 만들고 함께 나누는 쿠킹클래스 키트 브랜드
            </p>
          </div>

          {/* 링크 컬럼들 */}
          <div className="footer-cols" style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h6
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: 14,
                    letterSpacing: '0.06em',
                  }}
                >
                  {col.title}
                </h6>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} style={{ fontSize: 13.5, transition: 'color 0.2s' }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.10)', marginBottom: 20 }} />

        <p style={{ fontSize: 12.5 }}>
          © {year} {SITE_CONFIG.name}. 본 화면은 제작 검토용 시안이며 실제 운영 화면과 다를 수 있습니다.
        </p>
      </div>

      <style>{`
        footer a { color: rgba(244,242,238,0.6); }
        footer a:hover { color: #fff; }
        @media (max-width: 720px) {
          .footer-top-grid { flex-direction: column; }
          .footer-cols     { gap: 32px; }
        }
      `}</style>
    </footer>
  )
}
