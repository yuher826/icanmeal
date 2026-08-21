-- ============================================================
-- 202608220002_institutions.sql
-- 기관 회원 + 승인 워크플로우
--
-- 선행: 202608220001_foundation.sql (admins, update_updated_at)
--
-- 설계 근거 (docs/DB_DESIGN_DRAFT.md 4-2):
--   · 승인 상태: pending → reviewing → approved / rejected, 이후 suspended 가능
--   · 기관 주소와 배송지 주소를 분리 보관
--   · 세금계산서 발행 정보 별도 보관
--   · 약관 동의 시각 3종 (법적 증빙)
--   · price_tier — 기관별 단가 차등 (Q5 결정: Phase 1 에서 확정)
--
-- Q3 결정: business_number 에 UNIQUE 를 걸지 않는다.
--   같은 법인이 분원별로 각각 가입할 수 있어야 하기 때문.
--   중복 가입 여부는 관리자 승인 화면에서 경고로 노출한다.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.institutions (
  id                    UUID        NOT NULL DEFAULT gen_random_uuid(),
  auth_id               UUID,

  -- 기관 기본 정보
  name                  TEXT        NOT NULL,
  institution_type      TEXT        NOT NULL,
  business_number       TEXT,
  representative_name   TEXT,

  -- 담당자
  contact_name          TEXT        NOT NULL,
  contact_phone         TEXT        NOT NULL,
  contact_email         TEXT        NOT NULL,

  -- 기관 주소
  zip_code              TEXT,
  address               TEXT,
  address_detail        TEXT,

  -- 배송지 (기관 주소와 다를 수 있음)
  ship_same_as_address  BOOLEAN     NOT NULL DEFAULT TRUE,
  ship_recipient_name   TEXT,
  ship_phone            TEXT,
  ship_zip_code         TEXT,
  ship_address          TEXT,
  ship_address_detail   TEXT,

  -- 세금계산서
  tax_email             TEXT,
  tax_manager_name      TEXT,
  tax_manager_phone     TEXT,

  -- 승인 상태
  status                TEXT        NOT NULL DEFAULT 'pending',
  rejected_reason       TEXT,
  approved_at           TIMESTAMPTZ,
  approved_by           UUID,
  suspended_at          TIMESTAMPTZ,
  suspended_reason      TEXT,

  -- 단가 정책 (Q5)
  price_tier            TEXT        NOT NULL DEFAULT 'standard',

  -- 약관 동의 이력
  agreed_terms_at       TIMESTAMPTZ,
  agreed_privacy_at     TIMESTAMPTZ,
  agreed_marketing_at   TIMESTAMPTZ,

  -- 운영/탈퇴
  admin_memo            TEXT,
  anonymized_at         TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT institutions_pkey             PRIMARY KEY (id),
  CONSTRAINT institutions_auth_id_key      UNIQUE (auth_id),
  CONSTRAINT institutions_auth_id_fkey     FOREIGN KEY (auth_id)
                                           REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT institutions_approved_by_fkey FOREIGN KEY (approved_by)
                                           REFERENCES public.admins (id) ON DELETE SET NULL,
  CONSTRAINT institutions_type_check       CHECK (institution_type IN (
                                             'daycare', 'kindergarten', 'elementary',
                                             'welfare_center', 'senior_center', 'hospital', 'other')),
  CONSTRAINT institutions_status_check     CHECK (status IN (
                                             'pending', 'reviewing', 'approved', 'rejected', 'suspended')),
  CONSTRAINT institutions_price_tier_check CHECK (price_tier IN (
                                             'standard', 'preferred', 'partner')),
  -- 반려 상태면 사유가 반드시 있어야 한다
  CONSTRAINT institutions_rejected_reason_check CHECK (
    status <> 'rejected' OR rejected_reason IS NOT NULL
  )
);

COMMENT ON TABLE  public.institutions                  IS '기관 회원 (B2B 고객)';
COMMENT ON COLUMN public.institutions.business_number  IS '사업자등록번호. 분원 각각 가입 가능하도록 UNIQUE 없음 (Q3)';
COMMENT ON COLUMN public.institutions.status           IS 'pending→reviewing→approved/rejected, approved↔suspended';
COMMENT ON COLUMN public.institutions.price_tier       IS '단가 등급. product_prices 조회 키 (Q5)';
COMMENT ON COLUMN public.institutions.anonymized_at    IS '탈퇴 후 개인정보 마스킹 완료 시각. 주문 기록은 법정 보관기간 동안 유지';

DROP TRIGGER IF EXISTS trg_institutions_updated_at ON public.institutions;
CREATE TRIGGER trg_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_institutions_auth_id
  ON public.institutions (auth_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_institutions_status
  ON public.institutions (status) WHERE deleted_at IS NULL;
-- Q3: UNIQUE 는 아니지만 중복 가입 경고용으로 조회는 빨라야 한다
CREATE INDEX IF NOT EXISTS idx_institutions_business_number
  ON public.institutions (business_number) WHERE business_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_institutions_price_tier
  ON public.institutions (price_tier) WHERE deleted_at IS NULL;
