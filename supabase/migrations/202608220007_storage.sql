-- ============================================================
-- 202608220007_storage.sql
-- Storage 버킷 + 접근 정책
--
-- 선행: 202608220006_rls.sql (헬퍼 함수 필요)
--
-- ★ Q2 결정 반영
--   · media      : public 유지 — 홈/키즈/실버 히어로 영상 (마케팅 자산)
--   · materials  : private 신설 — 교안/활동지/PPT/수업영상 (유료 자산)
--
-- ⚠️ 중요 — RLS 만으로는 파일을 막지 못한다.
--   public 버킷은 URL 을 아는 사람이면 누구나 받는다.
--   materials 를 private 으로 두고, 서버에서 권한을 확인한 뒤
--   createSignedUrl(path, 만료초) 로 일회성 URL 을 발급해야 실제로 막힌다.
--   자세한 구현 지침은 docs/MIGRATION_GUIDE.md 참고.
--
-- ⚠️ storage.objects 에 정책을 만들려면 소유자 권한이 필요하다.
--   Supabase SQL Editor 는 이 권한이 있지만, 만약 권한 오류가 나면
--   대시보드 Storage > Policies 에서 같은 조건으로 만들면 된다.
-- ============================================================

-- ── [1] 버킷 생성 ──────────────────────────────────────────

-- media : 공개 (히어로 영상). 이미 존재하므로 없을 때만 생성.
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- materials : 비공개 (교안·활동지·수업영상)
--   file_size_limit: 500MB (수업영상 대비)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', FALSE, 524288000)
ON CONFLICT (id) DO UPDATE
  SET public = FALSE,
      file_size_limit = EXCLUDED.file_size_limit;

COMMENT ON TABLE storage.buckets IS
  'media=public(히어로 영상) / materials=private(교안·수업영상, signed URL 전용)';


-- ── [2] media 버킷 정책 (public) ───────────────────────────
-- 읽기는 누구나. 쓰기는 관리자만.
DROP POLICY IF EXISTS media_public_read ON storage.objects;
CREATE POLICY media_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS media_admin_write ON storage.objects;
CREATE POLICY media_admin_write ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS media_admin_update ON storage.objects;
CREATE POLICY media_admin_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS media_admin_delete ON storage.objects;
CREATE POLICY media_admin_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND public.is_admin());


-- ── [3] materials 버킷 정책 (private) ──────────────────────
-- 경로 규칙: materials/{product_slug}/{type}/{파일명}
--   예) materials/kids-01/lesson_plan/교안.pdf
--   → 첫 번째 폴더명(product_slug)으로 구매 여부를 판정한다.
--
-- storage.foldername(name) 은 경로를 배열로 돌려준다. [1] 이 첫 폴더.
DROP POLICY IF EXISTS materials_read_purchased ON storage.objects;
CREATE POLICY materials_read_purchased ON storage.objects
  FOR SELECT USING (
    bucket_id = 'materials'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1
          FROM public.products p
         WHERE p.slug = (storage.foldername(name))[1]
           AND p.deleted_at IS NULL
           AND public.has_purchased_product(p.id)
      )
    )
  );

DROP POLICY IF EXISTS materials_admin_write ON storage.objects;
CREATE POLICY materials_admin_write ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'materials' AND public.is_admin());

DROP POLICY IF EXISTS materials_admin_update ON storage.objects;
CREATE POLICY materials_admin_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'materials' AND public.is_admin());

DROP POLICY IF EXISTS materials_admin_delete ON storage.objects;
CREATE POLICY materials_admin_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'materials' AND public.is_admin());


-- ============================================================
-- 참고 — 앱에서 materials 파일을 내려주는 올바른 순서
--
--   1. 서버(Route Handler)에서 세션 확인
--   2. product_materials 조회 → RLS 가 구매 여부를 이미 걸러줌
--   3. supabase.storage.from('materials')
--        .createSignedUrl(storage_path, 3600)
--   4. 클라이언트에 signed URL 만 전달 (원본 경로 노출 금지)
--
-- ⛔ 키즈밀 app/api/download/route.ts 처럼
--    임의 URL 을 그대로 프록시하면 안 된다 (권한 없음 + SSRF).
-- ============================================================
