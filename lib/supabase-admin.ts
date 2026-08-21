import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * service_role 클라이언트 — **서버 전용, 절대 클라이언트로 새어나가면 안 된다.**
 *
 * 'server-only' import 가 방어선이다. 클라이언트 컴포넌트에서 이 파일을 import 하면
 * 빌드가 실패한다.
 *
 * 왜 필요한가:
 *   _0006_rls.sql 에서 institutions 의 status / price_tier / approved_* 등에 대해
 *   authenticated 롤의 컬럼 UPDATE 권한을 회수(REVOKE)했다.
 *   기관이 스스로를 승인하지 못하게 막는 장치인데, 관리자 역시 authenticated 롤이라
 *   같이 막힌다. 따라서 승인/반려 같은 상태 변경은 RLS 와 컬럼 권한을 모두 우회하는
 *   service_role 로만 가능하다.
 *
 * ⚠️ service_role 은 RLS 를 전부 무시한다. 반드시 호출 전에
 *    requireAdmin() 으로 관리자 여부를 확인할 것.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경변수가 없습니다.')
  }
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.\n' +
        'Supabase Dashboard → Settings → API → service_role 키를 복사해\n' +
        '.env.local 과 Vercel 환경변수에 추가하세요. (절대 NEXT_PUBLIC_ 접두사 금지)'
    )
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
