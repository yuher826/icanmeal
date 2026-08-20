import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ICANMEAL_몰_검수용_1.html 디자인 시안 토큰 연동 */
        cream:             'var(--cream)',
        'cream-deep':      'var(--cream-deep)',
        ink:               'var(--ink)',
        'ink-soft':        'var(--ink-soft)',
        line:              'var(--line)',
        'line-soft':       'var(--line-soft)',
        'kids-coral':      'var(--kids-coral)',
        'kids-coral-deep': 'var(--kids-coral-deep)',
        'kids-butter':     'var(--kids-butter)',
        'kids-tint':       'var(--kids-tint)',
        'silver-rose':     'var(--silver-rose)',
        'silver-rose-deep':'var(--silver-rose-deep)',
        'silver-sage':     'var(--silver-sage)',
        'silver-tint':     'var(--silver-tint)',
        gold:              'var(--gold)',
      },
      fontFamily: {
        /* 시안 전 화면 Pretendard 산세리프 기준 (serif 별칭은 하위호환용) */
        serif: ['var(--serif)'],
        sans:  ['var(--sans)'],
      },
      borderRadius: {
        card: '18px',
        lg2:  '22px',
        xl2:  '26px',
      },
      boxShadow: {
        card:  'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        modal: 'var(--shadow-modal)',
      },
      maxWidth: {
        wrap: 'var(--wrap-max)',
      },
    },
  },
  plugins: [],
}

export default config
