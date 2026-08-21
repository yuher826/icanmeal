import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버 컴포넌트 / Route Handler / 서버 액션용 Supabase 클라이언트.
 *
 * 로그인한 사용자의 세션(authenticated 롤)으로 동작하므로 **RLS 가 그대로 적용된다.**
 * 조회에는 이걸 쓴다. 관리자 조회는 is_admin() 정책이 통과시켜 준다.
 *
 * ⚠️ institutions.status 같은 민감 컬럼 UPDATE 는 이 클라이언트로 안 된다.
 *    _0006_rls.sql 에서 authenticated 롤의 컬럼 UPDATE 권한을 회수했기 때문이다.
 *    그런 변경은 lib/supabase-admin.ts 의 service_role 클라이언트를 쓴다.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없다.
            // 세션 갱신은 middleware 가 처리하므로 여기서는 무시해도 안전하다.
          }
        },
      },
    }
  )
}
