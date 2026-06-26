export default function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* 썸네일 영역 */}
      <div className="skeleton" style={{ height: 170 }} />

      {/* 바디 */}
      <div style={{ padding: '20px 20px 22px' }}>
        {/* 칩 행 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <div className="skeleton" style={{ width: 48, height: 22, borderRadius: 100 }} />
          <div className="skeleton" style={{ width: 44, height: 22, borderRadius: 100 }} />
          <div className="skeleton" style={{ width: 52, height: 22, borderRadius: 100 }} />
        </div>

        {/* 제목 */}
        <div className="skeleton" style={{ width: '75%', height: 20, marginBottom: 8 }} />
        {/* 설명 1 */}
        <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
        {/* 설명 2 */}
        <div className="skeleton" style={{ width: '65%', height: 14, marginBottom: 18 }} />

        {/* 하단 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: 80, height: 14 }} />
          <div className="skeleton" style={{ width: 52, height: 14 }} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
