'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'profile' | 'orders' | 'materials'

const MOCK_INSTITUTION = {
  name: '○○ 어린이집',
  type: '어린이집',
  businessNumber: '123-45-67890',
  address: '서울시 강남구 ○○로 1',
  contactName: '홍길동',
  phone: '010-0000-0000',
  email: 'contact@example.com',
  status: 'approved' as const,
  registeredAt: '2025-01-15',
}

const MOCK_ORDERS = [
  { id: 'ORD-2025-0041', date: '2025-06-10', name: '키즈 주먹밥 만들기 x 20', status: '배송 완료', amount: 180000 },
  { id: 'ORD-2025-0028', date: '2025-05-12', name: '키즈 팬케이크 클래스 x 20', status: '배송 완료', amount: 200000 },
  { id: 'ORD-2025-0013', date: '2025-04-08', name: '키즈 채소 샐러드 x 25',   status: '배송 완료', amount: 175000 },
]

const MOCK_MATERIALS = [
  { id: 1, name: '주먹밥 만들기 교안', type: 'PDF',  date: '2025-06-10', line: '키즈' },
  { id: 2, name: '주먹밥 만들기 활동지', type: 'PDF', date: '2025-06-10', line: '키즈' },
  { id: 3, name: '팬케이크 클래스 교안', type: 'PDF', date: '2025-05-12', line: '키즈' },
  { id: 4, name: '팬케이크 수업 영상', type: '영상',  date: '2025-05-12', line: '키즈' },
  { id: 5, name: '채소 샐러드 교안',    type: 'PDF',  date: '2025-04-08', line: '키즈' },
]

const STATUS_MAP = {
  pending:   { label: '신청 완료', bg: '#FFF3D6', color: 'var(--gold)' },
  reviewing: { label: '검토 중',   bg: 'var(--kids-tint)', color: 'var(--kids-coral-deep)' },
  approved:  { label: '승인 완료', bg: '#E8F5E9', color: '#2D6A4F' },
  rejected:  { label: '승인 거절', bg: '#FFF0ED', color: 'var(--kids-coral-deep)' },
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  '배송 완료': '#2D6A4F',
  '배송 중':   'var(--kids-coral-deep)',
  '주문 확인': 'var(--gold)',
  '결제 완료': 'var(--silver-rose-deep)',
}

export default function MyPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const st = STATUS_MAP[MOCK_INSTITUTION.status]

  return (
    <>
      {/* ── 상단 헤더 ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--cream-deep),var(--cream))', padding: '52px 0 40px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* 아바타 */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--kids-coral),var(--silver-rose))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 800, flexShrink: 0, fontFamily: 'var(--sans)' }}>
              {MOCK_INSTITUTION.name[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700 }}>{MOCK_INSTITUTION.name}</h1>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{MOCK_INSTITUTION.type} · {MOCK_INSTITUTION.contactName} 담당자 · 가입 {MOCK_INSTITUTION.registeredAt}</p>
            </div>
            <Link href="/inquiry" className="btn-outline" style={{ marginLeft: 'auto', fontSize: 13, padding: '10px 20px' }}>
              추가 주문 문의
            </Link>
          </div>
        </div>
      </section>

      {/* ── 탭 + 콘텐츠 ── */}
      <section>
        <div className="wrap">
          {/* 탭 바 */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid var(--line)', marginBottom: 36 }}>
            {([
              { key: 'profile',   label: '기관 정보' },
              { key: 'orders',    label: `주문 내역 (${MOCK_ORDERS.length})` },
              { key: 'materials', label: `교육 자료 (${MOCK_MATERIALS.length})` },
            ] as { key: Tab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  fontSize: 15, fontWeight: 700, padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
                  color: tab === t.key ? 'var(--ink)' : 'var(--ink-soft)',
                  borderBottom: tab === t.key ? '2.5px solid var(--ink)' : '2.5px solid transparent',
                  marginBottom: -1.5, transition: 'color 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── 기관 정보 탭 ── */}
          {tab === 'profile' && (
            <div className="mp-profile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* 기관 정보 카드 */}
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, padding: '28px 24px', background: 'var(--white)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>기관 정보</h3>
                {[
                  { label: '기관명',     value: MOCK_INSTITUTION.name },
                  { label: '기관 유형',  value: MOCK_INSTITUTION.type },
                  { label: '사업자번호', value: MOCK_INSTITUTION.businessNumber },
                  { label: '주소',       value: MOCK_INSTITUTION.address },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-soft)', fontWeight: 600, minWidth: 80 }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* 담당자 정보 카드 */}
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, padding: '28px 24px', background: 'var(--white)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>담당자 정보</h3>
                {[
                  { label: '담당자명', value: MOCK_INSTITUTION.contactName },
                  { label: '연락처',   value: MOCK_INSTITUTION.phone },
                  { label: '이메일',   value: MOCK_INSTITUTION.email },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 16, padding: '11px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                    <span style={{ color: 'var(--ink-soft)', fontWeight: 600, minWidth: 80 }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <button className="btn-outline" style={{ marginTop: 20, fontSize: 13, padding: '10px 18px' }}>정보 수정 요청</button>
              </div>

              {/* 승인 현황 카드 */}
              <div style={{ gridColumn: '1 / -1', border: '1px solid var(--line)', borderRadius: 16, padding: '28px 24px', background: 'var(--white)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 18 }}>승인 현황</h3>
                <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 1, background: 'repeating-linear-gradient(to right,var(--gold) 0 6px,transparent 6px 12px)', zIndex: 0 }} />
                  {[
                    { label: '신청 완료', done: true },
                    { label: '서류 검토', done: true },
                    { label: '승인 완료', done: MOCK_INSTITUTION.status === 'approved' },
                  ].map((s, i) => (
                    <div key={s.label} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.done ? 'var(--gold)' : 'var(--cream-deep)', color: s.done ? '#fff' : 'var(--ink-soft)', fontWeight: 700 }}>
                        {s.done ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: s.done ? 'var(--ink)' : 'var(--ink-soft)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 주문 내역 탭 ── */}
          {tab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700 }}>주문 내역</h3>
                <Link href="/inquiry" className="btn-cta" style={{ fontSize: 13, padding: '10px 20px' }}>+ 신규 주문 문의</Link>
              </div>
              <div style={{ border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: 'var(--white)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream-deep)', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {['주문번호', '주문일', '제품명', '금액', '상태'].map(h => (
                        <th key={h} style={{ padding: '14px 18px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDERS.map((o, i) => (
                      <tr key={o.id} style={{ borderTop: '1px solid var(--line)', fontSize: 14 }}>
                        <td style={{ padding: '16px 18px', color: 'var(--ink-soft)', fontFamily: 'monospace', fontSize: 12 }}>{o.id}</td>
                        <td style={{ padding: '16px 18px', color: 'var(--ink-soft)' }}>{o.date}</td>
                        <td style={{ padding: '16px 18px', fontWeight: 600 }}>{o.name}</td>
                        <td style={{ padding: '16px 18px', fontWeight: 700 }}>{o.amount.toLocaleString('ko-KR')}원</td>
                        <td style={{ padding: '16px 18px' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: '#E8F5E9', color: ORDER_STATUS_COLORS[o.status] ?? 'var(--ink)' }}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {MOCK_ORDERS.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-soft)' }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>📦</div>
                  <p>아직 주문 내역이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* ── 교육 자료 탭 ── */}
          {tab === 'materials' && (
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>교육 자료</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_MATERIALS.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--white)' }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{m.type === '영상' ? '🎬' : '📄'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{m.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{m.type} · {m.line} · {m.date} 구매</div>
                    </div>
                    <button style={{ fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 100, background: 'var(--cream-deep)', color: 'var(--ink)', border: '1px solid var(--line)', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
                      {m.type === '영상' ? '▶ 재생' : '⬇ 다운로드'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 720px) {
          .mp-profile { grid-template-columns: 1fr !important; }
          .mp-profile > div[style*="grid-column"] { grid-column: 1 !important; }
          table { display: block; overflow-x: auto; }
        }
      `}</style>
    </>
  )
}
