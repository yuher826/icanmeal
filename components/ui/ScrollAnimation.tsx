'use client'

import { useEffect, useRef, useState } from 'react'

type AnimType = 'up' | 'left' | 'right' | 'scale' | 'fade'

const ANIM_CLASS: Record<AnimType, string> = {
  up:    'anim anim-up',
  left:  'anim anim-left',
  right: 'anim anim-right',
  scale: 'anim anim-scale',
  fade:  'anim anim-fade',
}

/* delay → 100 단위로 반올림해 CSS 클래스 매핑 */
function delayClass(ms: number): string {
  const rounded = Math.round(ms / 100) * 100
  if (rounded <= 0 || rounded > 600) return ''
  return `delay-${rounded}`
}

interface Props {
  children: React.ReactNode
  animation?: AnimType
  delay?: number       /* ms: 100 | 200 | 300 | 400 | 500 | 600 */
  threshold?: number   /* 0~1, 기본 0.12 */
  className?: string
  style?: React.CSSProperties
}

export default function ScrollAnimation({
  children,
  animation = 'up',
  delay = 0,
  threshold = 0.12,
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  /* 'visible' 여부는 반드시 React state로 관리해야 한다.
     예전에는 el.classList.add('visible')로 DOM을 직접 조작했는데,
     이 div는 key가 있는 리스트(예: 계절 필터로 바뀌는 상품 그리드)에서
     같은 컴포넌트 인스턴스가 재사용되면서 delay 같은 prop만 바뀌는 경우가
     있다. 이때 React가 className을 다시 렌더링하면서 imperatively 추가했던
     'visible' 클래스가 통째로 덮어써져 사라지고, IntersectionObserver는
     이미 unobserve된 상태라 다시는 복구되지 않는 버그가 있었다. */
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* SSR 페이지에서 이미 뷰포트 안에 있으면 즉시 visible */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const cls = [ANIM_CLASS[animation], delayClass(delay), visible ? 'visible' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  )
}
