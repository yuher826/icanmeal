-- ============================================================
-- ROLLBACK_all.sql — 전체 롤백 (⚠️ 데이터 전부 삭제)
--
-- ⛔ 이 파일은 마이그레이션 폴더에 있지만 "순서대로 실행"의 일부가 아니다.
--    파일명이 타임스탬프로 시작하지 않는 이유가 그것이다.
--    실수로 실행하지 않도록 주의할 것.
--
-- 언제 쓰나:
--   · 첫 적용 중 실패해서 깨끗하게 되돌리고 다시 시작할 때
--   · 개발 초기, 아직 실데이터가 없을 때
--
-- ⛔ 실데이터(주문·기관)가 들어간 뒤에는 절대 쓰지 말 것.
--    전자상거래법상 주문 기록은 5년 보관 의무가 있다.
--
-- FK 의존성 역순으로 삭제한다.
-- ============================================================

BEGIN;

-- ── Storage 정책 (버킷과 파일은 남긴다) ─────────────────────
DROP POLICY IF EXISTS materials_read_purchased ON storage.objects;
DROP POLICY IF EXISTS materials_admin_write    ON storage.objects;
DROP POLICY IF EXISTS materials_admin_update   ON storage.objects;
DROP POLICY IF EXISTS materials_admin_delete   ON storage.objects;
DROP POLICY IF EXISTS media_public_read        ON storage.objects;
DROP POLICY IF EXISTS media_admin_write        ON storage.objects;
DROP POLICY IF EXISTS media_admin_update       ON storage.objects;
DROP POLICY IF EXISTS media_admin_delete       ON storage.objects;

-- ⚠️ 버킷 자체는 SQL 로 지울 수 없다 (must be owner of table buckets).
--    애초에 지우면 안 되기도 한다 — 업로드한 영상 파일이 전부 날아간다.
--    정말 지워야 한다면 대시보드 Storage 에서 파일 백업 후 직접 삭제할 것.


-- ── 테이블 (FK 역순) ───────────────────────────────────────
DROP TABLE IF EXISTS public.inquiry_messages        CASCADE;
DROP TABLE IF EXISTS public.inquiries               CASCADE;
DROP TABLE IF EXISTS public.shipments               CASCADE;
DROP TABLE IF EXISTS public.order_items             CASCADE;
DROP TABLE IF EXISTS public.orders                  CASCADE;
DROP TABLE IF EXISTS public.inquiry_number_counters CASCADE;
DROP TABLE IF EXISTS public.order_number_counters   CASCADE;
DROP TABLE IF EXISTS public.product_materials       CASCADE;
DROP TABLE IF EXISTS public.product_prices          CASCADE;
DROP TABLE IF EXISTS public.products                CASCADE;
DROP TABLE IF EXISTS public.institutions            CASCADE;
DROP TABLE IF EXISTS public.email_logs              CASCADE;
DROP TABLE IF EXISTS public.audit_logs              CASCADE;
DROP TABLE IF EXISTS public.app_settings            CASCADE;
DROP TABLE IF EXISTS public.admins                  CASCADE;


-- ── 함수 ───────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.has_purchased_product(UUID)                  CASCADE;
DROP FUNCTION IF EXISTS public.is_approved_institution()                    CASCADE;
DROP FUNCTION IF EXISTS public.get_my_institution_id()                      CASCADE;
DROP FUNCTION IF EXISTS public.is_super_admin()                             CASCADE;
DROP FUNCTION IF EXISTS public.is_admin()                                   CASCADE;
DROP FUNCTION IF EXISTS public.resolve_product_pricing(UUID, UUID, DATE)    CASCADE;
DROP FUNCTION IF EXISTS public.resolve_product_price(UUID, UUID, DATE)      CASCADE;
DROP FUNCTION IF EXISTS public.next_inquiry_number()                        CASCADE;
DROP FUNCTION IF EXISTS public.next_order_number()                          CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at()                          CASCADE;

COMMIT;

-- 확인
--   SELECT table_name FROM information_schema.tables
--    WHERE table_schema = 'public' ORDER BY 1;
--   → 아무것도 안 나와야 한다.
