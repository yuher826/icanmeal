import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/* ── 기관 회원용 보호 경로 ── */
const MEMBER_PROTECTED_PATHS = ['/mypage', '/cart', '/checkout']

/**
 * 관리자 영역에서 로그인 없이 접근 가능한 경로.
 *
 * ⚠️ deny-by-default — /admin/* 는 아래 목록을 뺀 **전부**가 보호 대상이다.
 *    보호할 경로를 열거하는 방식으로 짜면 페이지를 추가할 때마다 보호가 누락된다.
 *    (키즈밀이 실제로 겪은 사고 — CLAUDE.md 작업 규칙 참고)
 */
const ADMIN_PUBLIC_PATHS = ['/admin/login']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  /* ── 관리자 영역 ─────────────────────────────────────────
     세션 유무만 확인한다.
     "관리자인가"는 app/admin/layout.tsx 가 DB 를 조회해 판정한다.
     미들웨어에서 매 요청마다 DB 를 때리지 않기 위한 분담이다. */
  const isAdminArea = pathname.startsWith('/admin')
  const isAdminPublic = ADMIN_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isAdminArea && !isAdminPublic && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  /* 로그인 상태로 /admin/login 에 오면 관리자 홈으로 */
  if (user && pathname === '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/institutions'
    url.search = ''
    return NextResponse.redirect(url)
  }

  /* ── 기관 회원 영역 ─────────────────────────────────────── */
  const isMemberProtected = MEMBER_PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (isMemberProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  /* 로그인한 기관 회원이 회원 인증 페이지에 오면 마이페이지로.
     /admin/* 는 위에서 이미 처리했으므로 제외한다. */
  if (user && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/mypage', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
  ],
}
