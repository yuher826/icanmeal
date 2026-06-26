import Link from 'next/link'
import { SITE_CONFIG, FOOTER_LINKS } from '@/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--ink)',
        color: 'rgba(251,245,234,0.75)',
        padding: '56px 0 36px',
        marginTop: 40,
      }}
    >
      <div className="wrap">
        {/* ── 상단 그리드 ── */}
        <div
          className="footer-top-grid"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 40,
            marginBottom: 36,
            paddingBottom: 36,
            borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* 브랜드 */}
          <div style={{ minWidth: 220, maxWidth: 300 }}>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--cream)',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--kids-coral), var(--silver-rose))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: 'var(--sans)',
                  flexShrink: 0,
                }}
              >
                I
              </span>
              ICANMEAL
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.75,
                color: 'rgba(251,245,234,0.60)',
                marginBottom: 18,
              }}
            >
              {SITE_CONFIG.description}
            </p>
            {/* 라인 태그 */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href="/kids"
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '6px 13px',
                  borderRadius: 100,
                  background: 'rgba(227,107,59,0.18)',
                  color: 'var(--kids-butter)',
                  border: '1px solid rgba(227,107,59,0.28)',
                }}
              >
                키즈 라인
              </Link>
              <Link
                href="/silver"
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '6px 13px',
                  borderRadius: 100,
                  background: 'rgba(168,147,201,0.18)',
                  color: 'var(--silver-sage)',
                  border: '1px solid rgba(168,147,201,0.28)',
                }}
              >
                실버 라인
              </Link>
            </div>
          </div>

          {/* 링크 컬럼들 */}
          <div
            className="footer-cols"
            style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}
          >
            {/* 서비스 */}
            <div>
              <h6
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: 14,
                  letterSpacing: '0.08em',
                }}
              >
                서비스
              </h6>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FOOTER_LINKS.service.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{ fontSize: 13.5, opacity: 0.75, transition: 'opacity 0.2s' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 지원 */}
            <div>
              <h6
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: 14,
                  letterSpacing: '0.08em',
                }}
              >
                지원
              </h6>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{ fontSize: 13.5, opacity: 0.75, transition: 'opacity 0.2s' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 고객센터 */}
            <div>
              <h6
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: 14,
                  letterSpacing: '0.08em',
                }}
              >
                고객센터
              </h6>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                style={{
                  display: 'block',
                  fontFamily: 'var(--serif)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: 4,
                }}
              >
                {SITE_CONFIG.phone}
              </a>
              <span style={{ fontSize: 12, opacity: 0.45 }}>평일 09:00 – 18:00</span>
              <div style={{ marginTop: 14 }}>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  style={{ fontSize: 13, opacity: 0.6 }}
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 하단 법인 정보 ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 11.5,
              opacity: 0.38,
              lineHeight: 1.9,
            }}
          >
            상호명: 아이캔밀 &nbsp;|&nbsp; 대표자: — &nbsp;|&nbsp;
            사업자등록번호: {SITE_CONFIG.businessNumber}
            <br />
            주소: {SITE_CONFIG.address} &nbsp;|&nbsp; 이메일: {SITE_CONFIG.email}
            <br />
            © {year} ICANMEAL. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ fontSize: 12, opacity: 0.45 }}>
              개인정보처리방침
            </Link>
            <Link href="/terms" style={{ fontSize: 12, opacity: 0.45 }}>
              이용약관
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* hover 효과 */
        footer a:hover { opacity: 1 !important; }
        /* 반응형 */
        @media (max-width: 720px) {
          .footer-top-grid { flex-direction: column; }
          .footer-cols     { gap: 32px; }
        }
      `}</style>
    </footer>
  )
}
