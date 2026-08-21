-- ============================================================
-- 202608220005_inquiries.sql
-- 1:1 문의 (회원 + 비회원 통합) + 메시지
--
-- 선행: 202608220004_orders.sql (source_inquiry_id FK 연결 때문)
--
-- ★ Q1 결정 반영 — 회원/비회원 문의를 한 테이블로 통합한다.
--   키즈밀은 inquiries / public_inquiries / parent_inquiries 3벌로 갈라져
--   관리자 화면도 3개가 됐다. 같은 실수를 반복하지 않는다.
--   구분은 institution_id 의 NULL 여부 + source 컬럼으로 한다.
--
-- 비회원 문의 조회는 문의번호 + 비밀번호(bcrypt) 방식.
-- 비회원은 로그인 세션이 없으므로 RLS 로 막고 service_role API 를 경유한다.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inquiries (
  id                       UUID        NOT NULL DEFAULT gen_random_uuid(),
  inquiry_number           TEXT        NOT NULL,

  -- NULL 이면 비회원 문의
  institution_id           UUID,
  created_by_auth_id       UUID,
  source                   TEXT        NOT NULL DEFAULT 'web_form',

  -- 비회원 문의용
  guest_name               TEXT,
  guest_contact            TEXT,
  guest_email              TEXT,
  guest_password_hash      TEXT,

  category                 TEXT        NOT NULL DEFAULT 'general',
  title                    TEXT        NOT NULL,
  status                   TEXT        NOT NULL DEFAULT 'pending',
  priority                 TEXT        NOT NULL DEFAULT 'medium',
  assigned_admin_id        UUID,

  -- 카테고리별 가변 필드 (맞춤제안 폼: 대상라인/인원/일정/프로그램형태)
  meta                     JSONB       NOT NULL DEFAULT '{}',

  last_message_at          TIMESTAMPTZ,
  unread_count_institution INTEGER     NOT NULL DEFAULT 0,
  unread_count_admin       INTEGER     NOT NULL DEFAULT 0,
  resolved_at              TIMESTAMPTZ,
  closed_at                TIMESTAMPTZ,
  ip_address               TEXT,

  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT inquiries_pkey                    PRIMARY KEY (id),
  CONSTRAINT inquiries_inquiry_number_key      UNIQUE (inquiry_number),
  CONSTRAINT inquiries_institution_id_fkey     FOREIGN KEY (institution_id)
                                               REFERENCES public.institutions (id) ON DELETE SET NULL,
  CONSTRAINT inquiries_assigned_admin_id_fkey  FOREIGN KEY (assigned_admin_id)
                                               REFERENCES public.admins (id) ON DELETE SET NULL,
  CONSTRAINT inquiries_source_check            CHECK (source IN ('web_form', 'portal')),
  CONSTRAINT inquiries_category_check          CHECK (category IN (
                                                 'proposal', 'order', 'product',
                                                 'delivery', 'complaint', 'general')),
  CONSTRAINT inquiries_status_check            CHECK (status IN (
                                                 'pending', 'in_progress', 'resolved', 'closed')),
  CONSTRAINT inquiries_priority_check          CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT inquiries_unread_check            CHECK (
                                                 unread_count_institution >= 0 AND unread_count_admin >= 0),
  -- 비회원이면 이름/연락처/비밀번호가 있어야 조회가 가능하다
  CONSTRAINT inquiries_guest_fields_check      CHECK (
                                                 institution_id IS NOT NULL
                                                 OR (guest_name IS NOT NULL
                                                     AND guest_contact IS NOT NULL
                                                     AND guest_password_hash IS NOT NULL))
);

COMMENT ON TABLE  public.inquiries                     IS '1:1 문의 스레드 (회원+비회원 통합, Q1)';
COMMENT ON COLUMN public.inquiries.institution_id      IS 'NULL 이면 비회원 문의';
COMMENT ON COLUMN public.inquiries.guest_password_hash IS 'bcrypt. 비회원이 문의번호+비밀번호로 조회';
COMMENT ON COLUMN public.inquiries.meta                IS '맞춤제안 폼 등 카테고리별 가변 필드 {kit_line, headcount, schedule, program_type}';
COMMENT ON COLUMN public.inquiries.category            IS 'proposal = 홈 "맞춤 제안 받기" 동선';

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_inquiries_institution
  ON public.inquiries (institution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status
  ON public.inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_last_message
  ON public.inquiries (last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned
  ON public.inquiries (assigned_admin_id) WHERE assigned_admin_id IS NOT NULL;
-- 비회원 스팸 방어: 동일 연락처 일일 건수 조회
CREATE INDEX IF NOT EXISTS idx_inquiries_guest_contact
  ON public.inquiries (guest_contact, created_at DESC) WHERE guest_contact IS NOT NULL;


-- orders.source_inquiry_id 를 이제 FK 로 연결 (문의 → 주문 전환 추적)
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_source_inquiry_id_fkey;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_source_inquiry_id_fkey
  FOREIGN KEY (source_inquiry_id)
  REFERENCES public.inquiries (id) ON DELETE SET NULL;


-- ── inquiry_messages ───────────────────────────────────────
-- is_internal = TRUE 는 관리자 내부 메모. 기관에게 절대 노출되면 안 된다.
-- 키즈밀은 이 컬럼을 나중에 추가했다. 처음부터 넣는다.
CREATE TABLE IF NOT EXISTS public.inquiry_messages (
  id                   UUID        NOT NULL DEFAULT gen_random_uuid(),
  inquiry_id           UUID        NOT NULL,
  sender_type          TEXT        NOT NULL,
  sender_auth_id       UUID,
  sender_name_snapshot TEXT,
  content              TEXT        NOT NULL,
  attachments          JSONB       NOT NULL DEFAULT '[]',
  is_internal          BOOLEAN     NOT NULL DEFAULT FALSE,
  is_read              BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT inquiry_messages_pkey             PRIMARY KEY (id),
  CONSTRAINT inquiry_messages_inquiry_id_fkey  FOREIGN KEY (inquiry_id)
                                               REFERENCES public.inquiries (id) ON DELETE CASCADE,
  CONSTRAINT inquiry_messages_sender_type_check CHECK (sender_type IN (
                                                 'institution', 'guest', 'admin', 'system')),
  -- 내부 메모는 관리자만 작성할 수 있다
  CONSTRAINT inquiry_messages_internal_check   CHECK (
                                                 is_internal = FALSE OR sender_type = 'admin')
);

COMMENT ON TABLE  public.inquiry_messages                     IS '문의 스레드 메시지';
COMMENT ON COLUMN public.inquiry_messages.is_internal         IS 'TRUE = 관리자 내부 메모. RLS 로 기관에게 차단';
COMMENT ON COLUMN public.inquiry_messages.sender_name_snapshot IS '계정 삭제 후에도 "누가" 를 남기기 위함';
COMMENT ON COLUMN public.inquiry_messages.attachments         IS '[{file_name, url, size, mime}]';

CREATE INDEX IF NOT EXISTS idx_inquiry_messages_inquiry
  ON public.inquiry_messages (inquiry_id, created_at);
CREATE INDEX IF NOT EXISTS idx_inquiry_messages_unread
  ON public.inquiry_messages (inquiry_id, is_read) WHERE is_read = FALSE;
