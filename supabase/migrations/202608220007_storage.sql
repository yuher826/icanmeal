-- ============================================================
-- 202608220007_storage.sql
-- Storage 접근 정책 (버킷 생성은 포함하지 않음)
--
-- 선행:
--   1) 202608220006_rls.sql  — is_admin(), has_purchased_product() 필요
--   2) ★ 버킷 2개를 대시보드에서 **수동으로** 먼저 만들어야 한다 (아래 참고)
--
-- ------------------------------------------------------------
-- ⚠️ 왜 버킷 생성 SQL 이 여기 없는가
--
--   초판에는 INSERT INTO storage.buckets 가 있었으나 실행 시 실패했다:
--       ERROR: 42501: must be owner of table buckets
--
--   storage 스키마는 supabase_storage_admin 이 소유하고 있어서
--   SQL Editor(postgres 롤)로는 버킷을 만들거나 COMMENT 를 달 수 없다.
--   버킷은 **대시보드 또는 Management API 로만** 생성 가능하다.
--
--   → 버킷 생성 부분을 제거하고 정책만 남겼다.
--   → 수동 생성 절차는 docs/MIGRATION_GUIDE.md 3장 참고.
-- ------------------------------------------------------------
--
-- ★ Q2 결정
--   · media      : public  — 홈/키즈/실버 히어로 영상 (마케팅 자산, 공개가 맞음)
--   · materials  : private — 교안/활동지/PPT/수업영상 (유료 자산)
--
-- ⚠️ RLS 만으로는 파일이 막히지 않는다.
--   public 버킷의 /object/public/... 경로는 RLS 를 우회한다.
--   materials 를 private 으로 두고, 서버에서 권한 확인 후
--   createSignedUrl(path, 만료초) 로 일회성 URL 을 발급해야 실제로 막힌다.
-- ============================================================


-- ── [0] 사전 확인 — 버킷이 있는지 검사 ──────────────────────
-- 버킷이 없으면 정책을 만들어도 의미가 없으므로 여기서 멈춘다.
-- (storage.buckets 는 읽기만 하므로 소유권이 필요 없다.
--  혹시 이 블록에서도 권한 오류가 나면 [0] 전체를 지우고 [1]부터 실행해도 된다.)
DO $$
DECLARE
  v_media     BOOLEAN;
  v_materials BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media')
    INTO v_media;
  SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'materials')
    INTO v_materials;

  IF NOT v_media THEN
    RAISE EXCEPTION
      'media 버킷이 없습니다. 대시보드 Storage 에서 먼저 생성하세요 (public). → docs/MIGRATION_GUIDE.md 3장';
  END IF;

  IF NOT v_materials THEN
    RAISE EXCEPTION
      'materials 버킷이 없습니다. 대시보드 Storage 에서 먼저 생성하세요 (private). → docs/MIGRATION_GUIDE.md 3장';
  END IF;

  -- 공개/비공개 설정이 의도와 다르면 경고만 (막지는 않음)
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'materials' AND public = TRUE) THEN
    RAISE WARNING 'materials 버킷이 public 입니다. private 으로 바꿔야 영상 게이트가 실제로 동작합니다.';
  END IF;

  RAISE NOTICE '버킷 확인 완료 — media / materials 모두 존재';
END;
$$;


-- ============================================================
-- [1] materials 버킷 정책 (private) — ★ 보안상 가장 중요
--
-- 경로 규칙: materials/{product_slug}/{type}/{파일명}
--   예) materials/kids-01/lesson_plan/만두_교안.pdf
--       materials/silver-08/video/수박화채_수업영상.mp4
--
-- 정책이 **첫 번째 폴더명을 products.slug 로 해석**해 구매 여부를 판정한다.
-- 경로 규칙이 깨지면 접근 제어가 통째로 무력화되니 반드시 지킬 것.
-- storage.foldername(name) 은 경로를 배열로 돌려주고 [1] 이 첫 폴더다.
-- ============================================================

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
-- [2] media 버킷 정책 (public)
--
-- 참고: media 는 public 버킷이라 /object/public/... 경로는 RLS 를 타지 않는다.
--   (지금 히어로 영상이 정책 없이도 재생되는 이유가 이것이다)
--   아래 read 정책은 인증 경로(/object/...)나 목록 조회를 쓸 때를 위한 것이다.
--
-- 쓰기 정책은 "관리자 세션으로 업로드하는 관리자 UI" 를 대비한 것이다.
-- 지금처럼 대시보드에서 올리는 동안은 service_role 이라 정책과 무관하게 동작한다.
-- ============================================================

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


-- ── [3] 실행 결과 확인 ─────────────────────────────────────
-- 아래 쿼리로 정책 8개가 만들어졌는지 확인한다.
--
--   SELECT policyname, cmd
--     FROM pg_policies
--    WHERE schemaname = 'storage' AND tablename = 'objects'
--    ORDER BY policyname;
--
--   → materials_admin_delete / materials_admin_update / materials_admin_write
--     materials_read_purchased / media_admin_delete / media_admin_update
--     media_admin_write / media_public_read   총 8개


-- ============================================================
-- 참고 — materials 파일을 앱에서 내려주는 올바른 순서
--
--   1. 서버(Route Handler)에서 세션 확인
--   2. product_materials 조회 → RLS 가 구매 여부를 이미 걸러줌
--   3. supabase.storage.from('materials')
--        .createSignedUrl(storage_path, 3600)
--   4. 클라이언트에 signed URL 만 전달 (storage_path 노출 금지)
--
-- ⛔ 키즈밀 app/api/download/route.ts 처럼
--    임의 URL 을 그대로 프록시하면 안 된다 (권한 없음 + SSRF).
-- ============================================================
