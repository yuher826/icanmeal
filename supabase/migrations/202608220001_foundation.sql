-- ============================================================
-- 202608220001_foundation.sql
-- 공통 기반: 확장 / 공용 트리거 함수 / admins / audit_logs / app_settings
--
-- 목적:
--   이후 모든 마이그레이션이 의존하는 토대를 먼저 고정한다.
--   특히 RLS 헬퍼(is_admin 등)가 admins 테이블에 의존하므로
--   이 파일이 반드시 가장 먼저 실행돼야 한다.
--
-- 규칙 (CLAUDE.md 법인 분리 원칙 + 키즈밀 반면교사):
--   · 모든 CHECK / FK / UNIQUE 제약에 이름을 명시한다.
--     키즈밀이 인라인 CHECK 에 이름을 안 줘서 마이그레이션 수습에
--     파일 하나를 통째로 쓴 사고가 있었다. 반복하지 않는다.
--   · auth.users 외의 외부 스키마를 참조하지 않는다.
-- ============================================================

-- ── [0] 확장 ────────────────────────────────────────────────
-- gen_random_uuid() 는 PG13+ 내장(pgcrypto)이지만 명시적으로 보장해둔다.
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ── [1] 공용 트리거 함수: updated_at 자동 갱신 ────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at() IS
  '모든 테이블의 updated_at 을 자동 갱신하는 공용 트리거 함수';


-- ── [2] admins — 내부 관리자 ────────────────────────────────
-- 관리자 판별을 auth.users 의 메타데이터가 아니라 별도 테이블로 두는 이유:
--   · 권한 변경이 재로그인 없이 즉시 반영된다
--   · is_active = FALSE 로 즉시 차단할 수 있다
--   · 이름/부서 등 확장이 자유롭다
CREATE TABLE IF NOT EXISTS public.admins (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  auth_id     UUID,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'admin',
  department  TEXT,
  phone       TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT admins_pkey            PRIMARY KEY (id),
  CONSTRAINT admins_auth_id_key     UNIQUE (auth_id),
  CONSTRAINT admins_email_key       UNIQUE (email),
  CONSTRAINT admins_auth_id_fkey    FOREIGN KEY (auth_id)
                                    REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT admins_role_check      CHECK (role IN ('super_admin', 'admin'))
);

COMMENT ON TABLE  public.admins         IS '아이캔밀 내부 관리자 계정';
COMMENT ON COLUMN public.admins.role    IS 'super_admin: 전체 권한(관리자 계정 관리 포함), admin: 일반 관리자';
COMMENT ON COLUMN public.admins.auth_id IS 'auth.users.id — 유일하게 허용된 외부 의존';

DROP TRIGGER IF EXISTS trg_admins_updated_at ON public.admins;
CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_admins_auth_id
  ON public.admins (auth_id) WHERE deleted_at IS NULL;


-- ── [3] app_settings — 전역 설정 (Q6 결정) ───────────────────
-- 최소 주문 수량 / 리드타임을 "전역 기본값 + 상품별 예외" 구조로 운영한다.
--   · 전역 기본값은 여기에 1행으로 둔다
--   · 상품별 예외는 products.min_order_qty / lead_time_days 에 값을 넣는다
--   · 조회는 COALESCE(상품값, 전역값) — resolve_product_pricing() 참고
--
-- 단일 행만 존재하도록 강제한다(singleton).
CREATE TABLE IF NOT EXISTS public.app_settings (
  id                        BOOLEAN     NOT NULL DEFAULT TRUE,
  default_min_order_qty     INTEGER     NOT NULL DEFAULT 30,
  default_lead_time_days    INTEGER     NOT NULL DEFAULT 10,
  free_shipping_threshold   INTEGER     NOT NULL DEFAULT 200000,
  default_shipping_fee      INTEGER     NOT NULL DEFAULT 3000,
  vat_rate                  NUMERIC(5,4) NOT NULL DEFAULT 0.10,
  price_includes_vat        BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT app_settings_pkey                PRIMARY KEY (id),
  CONSTRAINT app_settings_singleton_check     CHECK (id = TRUE),
  CONSTRAINT app_settings_min_order_qty_check CHECK (default_min_order_qty  > 0),
  CONSTRAINT app_settings_lead_time_check     CHECK (default_lead_time_days >= 0),
  CONSTRAINT app_settings_shipping_check      CHECK (default_shipping_fee    >= 0),
  CONSTRAINT app_settings_threshold_check     CHECK (free_shipping_threshold >= 0),
  CONSTRAINT app_settings_vat_rate_check      CHECK (vat_rate >= 0 AND vat_rate <= 1)
);

COMMENT ON TABLE  public.app_settings                      IS '전역 운영 설정 (단일 행)';
COMMENT ON COLUMN public.app_settings.default_min_order_qty  IS '기본 최소 주문 세트 수 (시안: 30세트)';
COMMENT ON COLUMN public.app_settings.default_lead_time_days IS '기본 배송 리드타임 (시안: 10영업일 전 주문)';
COMMENT ON COLUMN public.app_settings.price_includes_vat     IS 'FALSE = 상품가는 VAT 별도';

DROP TRIGGER IF EXISTS trg_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 기본 행 삽입 (이미 있으면 아무것도 안 함)
INSERT INTO public.app_settings (id) VALUES (TRUE)
ON CONFLICT (id) DO NOTHING;


-- ── [4] audit_logs — 관리자 활동 추적 ───────────────────────
-- "누가 이 기관을 승인했나 / 누가 이 주문을 취소했나" 는 분쟁 시 반드시 필요하다.
-- 소급 생성이 불가능하므로 처음부터 만든다.
-- actor_name_snapshot 을 두는 이유: 관리자 계정이 삭제돼도 로그는 남아야 한다.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid(),
  actor_auth_id       UUID,
  actor_type          TEXT        NOT NULL,
  actor_name_snapshot TEXT,
  action              TEXT        NOT NULL,
  target_table        TEXT,
  target_id           UUID,
  before              JSONB,
  after               JSONB,
  ip_address          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT audit_logs_pkey             PRIMARY KEY (id),
  CONSTRAINT audit_logs_actor_type_check CHECK (actor_type IN ('admin', 'institution', 'system'))
);

COMMENT ON TABLE  public.audit_logs                     IS '관리자 활동 감사 로그 (append-only)';
COMMENT ON COLUMN public.audit_logs.action              IS '예: institution.approve, order.status_change, product_price.update';
COMMENT ON COLUMN public.audit_logs.actor_name_snapshot IS '계정이 삭제돼도 "누가" 를 남기기 위한 스냅샷';

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON public.audit_logs (actor_auth_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target
  ON public.audit_logs (target_table, target_id, created_at DESC);


-- ── [5] email_logs — 이메일 발송 이력 ───────────────────────
-- "승인 메일 안 왔다는데요?" CS 대응용. 키즈밀에 없어서 아쉬웠던 항목.
CREATE TABLE IF NOT EXISTS public.email_logs (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid(),
  to_email            TEXT        NOT NULL,
  template_key        TEXT        NOT NULL,
  subject             TEXT,
  status              TEXT        NOT NULL DEFAULT 'queued',
  provider_message_id TEXT,
  error_message       TEXT,
  related_table       TEXT,
  related_id          UUID,
  sent_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT email_logs_pkey         PRIMARY KEY (id),
  CONSTRAINT email_logs_status_check CHECK (status IN ('queued', 'sent', 'failed'))
);

COMMENT ON TABLE  public.email_logs              IS '이메일 발송 이력 (Resend)';
COMMENT ON COLUMN public.email_logs.template_key IS '예: institution.approved, order.confirmed';

CREATE INDEX IF NOT EXISTS idx_email_logs_related
  ON public.email_logs (related_table, related_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email
  ON public.email_logs (to_email, created_at DESC);
