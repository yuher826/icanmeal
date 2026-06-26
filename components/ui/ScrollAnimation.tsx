'use client'

import { useEffect, useRef } from 'react'

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

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* SSR 페이지에서 이미 뷰포트 안에 있으면 즉시 visible */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const cls = [ANIM_CLASS[animation], delayClass(delay), className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  )
}
