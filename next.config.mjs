import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

/**
 * Windows 로컬 개발에서 반복되던 아래 에러 대응.
 *
 *   Error: UNKNOWN: unknown error, open '...\.next\static\chunks\app\layout.js'
 *   errno: -4094, code: 'UNKNOWN'
 *
 * 원인은 하나가 아니라 겹쳐 있었다 (자세한 진단은 CLAUDE.md「로컬 개발 트러블슈팅」).
 *   ① webpack 디스크 캐시(.next/cache/webpack/*.pack.gz) 쓰기 경합
 *   ② next dev 와 next build 가 같은 .next 를 동시에 쓰는 충돌
 *   ③ 실시간 감시 백신(알약)이 webpack 이 빠르게 쓰는 파일을 잠그는 문제
 *
 * ①②는 아래 설정으로 코드 레벨에서 막고, ③은 백신 예외 등록이 필요하다.
 * 키즈밀에서 같은 증상을 먼저 겪고 검증한 대응을 가져왔다
 * (kizmeal-renewal/next.config.mjs — 읽기만 참고).
 *
 * ⚠️ 전부 **개발 모드 전용**이다. 프로덕션 빌드/배포 동작은 바뀌지 않는다.
 */
const nextConfig = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  /** @type {import('next').NextConfig} */
  const config = {}

  if (isDev) {
    // ② dev 산출물을 .next 가 아닌 .next-dev 로 분리한다.
    //    이렇게 하면 dev 서버가 떠 있는 상태에서 npm run build 를 돌려도
    //    같은 파일을 두 프로세스가 건드리는 일이 원천적으로 없어진다.
    //    (배포는 next build → .next 를 쓰므로 Vercel 동작에 영향 없음)
    config.distDir = '.next-dev'

    // ① 여러 워커가 공용 청크에 동시에 쓰는 경합을 줄인다.
    config.experimental = {
      workerThreads: false,
      cpus: 1,
    }
  }

  config.webpack = (webpackConfig) => {
    if (isDev) {
      // ① 핵심 대응 — 디스크 캐시 대신 메모리 캐시만 쓴다.
      //    .next/cache/webpack/*.pack.gz 를 여러 워커가 동시에 쓰고 rename 하면서
      //    -4094 UNKNOWN / pack.gz rename ENOENT 가 났다.
      //    파일 쓰기 자체를 없애서 해결한다.
      //    dev 전용이라 프로덕션 빌드 속도에는 영향이 없다.
      webpackConfig.cache = false

      // 감시 대상에서 산출물·의존성을 빼 파일 워처 부하를 줄인다.
      // (감시 대상이 많을수록 잠금 충돌 확률이 올라간다)
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.next-dev/**',
          '**/.git/**',
          '**/supabase/**',
          '**/docs/**',
        ],
        // 연속 저장 시 재빌드를 한 번으로 묶는다
        aggregateTimeout: 300,
      }
    }
    return webpackConfig
  }

  return config
}

export default nextConfig
