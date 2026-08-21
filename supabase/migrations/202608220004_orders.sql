-- ============================================================
-- 202608220004_orders.sql
-- 주문 + 주문상세(스냅샷) + 배송 + 주문번호 채번
--
-- 선행: 202608220003_products.sql
--
-- 설계 근거 (docs/DB_DESIGN_DRAFT.md 4-4 ~ 4-6):
--   · 주문번호는 원자적 카운터로 채번한다.
--     키즈밀의 count(*)+1 방식은 동시 주문 시 충돌한다.
--   · order_items 는 주문 시점 상품 정보를 스냅샷으로 보관한다.
--     나중에 상품명/가격이 바뀌어도 과거 주문은 그대로여야 한다.
--   · orders 1:N shipments — 기관 분원 다중 배송 대비 (v1 UI 는 1건만 생성)
--
-- ★ Q5 영향: order_items.unit_price_snapshot 은
--   resolve_product_price(product_id, institution_id) 결과를 넣는다.
--   기본가가 아니라 "그 기관에 적용된 실제 단가" 를 박아야
--   나중에 단가 정책이 바뀌어도 과거 주문 금액이 흔들리지 않는다.
--   base_price_snapshot 에 정가를 같이 남겨 할인폭을 추적할 수 있게 한다.
-- ============================================================

-- ── [1] 주문번호 채번 카운터 ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_number_counters (
  year      INTEGER NOT NULL,
  last_seq  INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT order_number_counters_pkey       PRIMARY KEY (year),
  CONSTRAINT order_number_counters_seq_check  CHECK (last_seq >= 0)
);

COMMENT ON TABLE public.order_number_counters IS
  '주문번호 연도별 시퀀스. UPSERT 로 원자적 증가 (경쟁 조건 없음)';

-- ICM-2026-000123 형태로 채번
CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
  v_seq  INTEGER;
BEGIN
  INSERT INTO order_number_counters (year, last_seq)
  VALUES (v_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET last_seq = order_number_counters.last_seq + 1
  RETURNING last_seq INTO v_seq;

  RETURN 'ICM-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$;

COMMENT ON FUNCTION public.next_order_number() IS '원자적 주문번호 채번 (ICM-YYYY-NNNNNN)';

-- 문의번호도 같은 방식 (INQ-YYYY-NNNNNN)
CREATE TABLE IF NOT EXISTS public.inquiry_number_counters (
  year      INTEGER NOT NULL,
  last_seq  INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT inquiry_number_counters_pkey      PRIMARY KEY (year),
  CONSTRAINT inquiry_number_counters_seq_check CHECK (last_seq >= 0)
);

CREATE OR REPLACE FUNCTION public.next_inquiry_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
  v_seq  INTEGER;
BEGIN
  INSERT INTO inquiry_number_counters (year, last_seq)
  VALUES (v_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET last_seq = inquiry_number_counters.last_seq + 1
  RETURNING last_seq INTO v_seq;

  RETURN 'INQ-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$;

COMMENT ON FUNCTION public.next_inquiry_number() IS '원자적 문의번호 채번 (INQ-YYYY-NNNNNN)';


-- ── [2] orders ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                        UUID        NOT NULL DEFAULT gen_random_uuid(),
  order_number              TEXT        NOT NULL,
  institution_id            UUID        NOT NULL,
  created_by_auth_id        UUID,
  order_type                TEXT        NOT NULL DEFAULT 'one_time',
  status                    TEXT        NOT NULL DEFAULT 'received',

  ordered_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  desired_delivery_date     DATE,
  delivered_at              TIMESTAMPTZ,

  -- 금액 (원 단위 정수)
  subtotal_amount           INTEGER     NOT NULL DEFAULT 0,
  discount_amount           INTEGER     NOT NULL DEFAULT 0,
  shipping_fee              INTEGER     NOT NULL DEFAULT 0,
  vat_amount                INTEGER     NOT NULL DEFAULT 0,
  total_amount              INTEGER     NOT NULL DEFAULT 0,

  -- 결제
  payment_method            TEXT,
  payment_status            TEXT        NOT NULL DEFAULT 'unpaid',
  toss_order_id             TEXT,
  toss_payment_key          TEXT,
  paid_at                   TIMESTAMPTZ,
  receipt_url               TEXT,
  refunded_amount           INTEGER     NOT NULL DEFAULT 0,

  -- 세금계산서
  tax_invoice_requested     BOOLEAN     NOT NULL DEFAULT FALSE,
  tax_invoice_issued        BOOLEAN     NOT NULL DEFAULT FALSE,
  tax_invoice_issued_at     TIMESTAMPTZ,
  tax_invoice_number        TEXT,

  -- 배송지 스냅샷 (기관 정보가 바뀌어도 주문은 불변)
  ship_recipient_name       TEXT,
  ship_phone                TEXT,
  ship_zip_code             TEXT,
  ship_address              TEXT,
  ship_address_detail       TEXT,

  -- 기관명 스냅샷 (탈퇴/익명화 후에도 주문 조회 가능)
  institution_name_snapshot TEXT,

  customer_memo             TEXT,
  admin_memo                TEXT,
  cancelled_at              TIMESTAMPTZ,
  cancel_reason             TEXT,

  -- 전환 추적 (견적/정기주문은 Phase 2, 컬럼만 미리)
  source_inquiry_id         UUID,
  source_quote_id           UUID,
  subscription_id           UUID,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT orders_pkey                   PRIMARY KEY (id),
  CONSTRAINT orders_order_number_key       UNIQUE (order_number),
  CONSTRAINT orders_toss_order_id_key      UNIQUE (toss_order_id),
  CONSTRAINT orders_institution_id_fkey    FOREIGN KEY (institution_id)
                                           REFERENCES public.institutions (id) ON DELETE RESTRICT,
  CONSTRAINT orders_order_type_check       CHECK (order_type IN ('one_time', 'subscription')),
  CONSTRAINT orders_status_check           CHECK (status IN (
                                             'received', 'confirmed', 'preparing',
                                             'shipping', 'delivered', 'cancelled', 'returned')),
  CONSTRAINT orders_payment_method_check   CHECK (payment_method IS NULL OR payment_method IN (
                                             'card', 'transfer', 'tax_invoice', 'quote')),
  CONSTRAINT orders_payment_status_check   CHECK (payment_status IN (
                                             'unpaid', 'paid', 'failed', 'refunded', 'partially_refunded')),
  CONSTRAINT orders_amount_check           CHECK (
                                             subtotal_amount >= 0 AND discount_amount >= 0
                                             AND shipping_fee >= 0 AND vat_amount >= 0
                                             AND total_amount >= 0 AND refunded_amount >= 0),
  CONSTRAINT orders_cancel_reason_check    CHECK (status <> 'cancelled' OR cancel_reason IS NOT NULL)
);

COMMENT ON TABLE  public.orders                            IS '기관 주문';
COMMENT ON COLUMN public.orders.order_number               IS 'ICM-YYYY-NNNNNN. next_order_number() 로 채번';
COMMENT ON COLUMN public.orders.created_by_auth_id         IS '주문한 담당자. 기관 다계정 전환 대비 핵심 컬럼';
COMMENT ON COLUMN public.orders.status                     IS 'received→confirmed→preparing→shipping→delivered / cancelled, returned';
COMMENT ON COLUMN public.orders.institution_name_snapshot  IS '탈퇴·익명화 후에도 관리자 화면에 기관명이 보이도록';
COMMENT ON COLUMN public.orders.payment_method             IS 'tax_invoice = 계산서 발행 후 월말 입금 (B2B 관행)';

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_institution
  ON public.orders (institution_id, ordered_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status
  ON public.orders (status, ordered_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status
  ON public.orders (payment_status) WHERE payment_status <> 'paid';
CREATE INDEX IF NOT EXISTS idx_orders_ordered_at
  ON public.orders (ordered_at DESC);
-- 세금계산서 미발행 건 추적 (월말 정산용)
CREATE INDEX IF NOT EXISTS idx_orders_tax_invoice_pending
  ON public.orders (tax_invoice_requested, tax_invoice_issued)
  WHERE tax_invoice_requested = TRUE AND tax_invoice_issued = FALSE;


-- ── [3] order_items — 스냅샷이 핵심 ─────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                     UUID        NOT NULL DEFAULT gen_random_uuid(),
  order_id               UUID        NOT NULL,
  product_id             UUID,

  -- 주문 시점 스냅샷 (표시는 전부 이 컬럼들을 쓴다)
  product_slug_snapshot  TEXT        NOT NULL,
  product_name_snapshot  TEXT        NOT NULL,
  product_line_snapshot  TEXT        NOT NULL,
  product_month_snapshot INTEGER,
  unit_label_snapshot    TEXT,
  thumbnail_url_snapshot TEXT,

  -- 금액 스냅샷 (Q5)
  unit_price_snapshot    INTEGER     NOT NULL,
  base_price_snapshot    INTEGER,

  quantity               INTEGER     NOT NULL DEFAULT 1,
  subtotal               INTEGER     NOT NULL,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT order_items_pkey             PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey    FOREIGN KEY (order_id)
                                          REFERENCES public.orders (id) ON DELETE CASCADE,
  -- 상품은 소프트 삭제만 하므로 RESTRICT 로 안전하게 묶는다
  CONSTRAINT order_items_product_id_fkey  FOREIGN KEY (product_id)
                                          REFERENCES public.products (id) ON DELETE RESTRICT,
  CONSTRAINT order_items_line_check       CHECK (product_line_snapshot IN ('kids', 'silver')),
  CONSTRAINT order_items_quantity_check   CHECK (quantity > 0),
  CONSTRAINT order_items_price_check      CHECK (unit_price_snapshot >= 0 AND subtotal >= 0)
);

COMMENT ON TABLE  public.order_items                     IS '주문 상세. 주문 시점 상품 정보를 스냅샷으로 보관';
COMMENT ON COLUMN public.order_items.unit_price_snapshot IS '그 기관에 실제 적용된 단가 (resolve_product_price 결과)';
COMMENT ON COLUMN public.order_items.base_price_snapshot IS '당시 상품 정가. 할인폭 추적용 (Q5)';

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product
  ON public.order_items (product_id);


-- ── [4] shipments ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipments (
  id              UUID        NOT NULL DEFAULT gen_random_uuid(),
  order_id        UUID        NOT NULL,
  sequence_no     INTEGER     NOT NULL DEFAULT 1,
  label           TEXT,
  carrier         TEXT,
  tracking_number TEXT,
  tracking_url    TEXT,
  status          TEXT        NOT NULL DEFAULT 'preparing',

  -- 배송지 스냅샷 (분원별로 다를 수 있음)
  recipient_name  TEXT,
  recipient_phone TEXT,
  zip_code        TEXT,
  address         TEXT,
  address_detail  TEXT,

  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  memo            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT shipments_pkey            PRIMARY KEY (id),
  CONSTRAINT shipments_order_id_fkey   FOREIGN KEY (order_id)
                                       REFERENCES public.orders (id) ON DELETE CASCADE,
  CONSTRAINT shipments_order_seq_key   UNIQUE (order_id, sequence_no),
  CONSTRAINT shipments_status_check    CHECK (status IN (
                                         'preparing', 'shipped', 'in_transit', 'delivered', 'failed')),
  CONSTRAINT shipments_sequence_check  CHECK (sequence_no > 0)
);

COMMENT ON TABLE  public.shipments             IS '배송. 주문 1:N — 기관 분원 다중 배송 대비';
COMMENT ON COLUMN public.shipments.sequence_no IS '분할배송 순번. v1 은 항상 1';
COMMENT ON COLUMN public.shipments.label       IS '본원 / ○○분원 등 배송지 구분 라벨';

DROP TRIGGER IF EXISTS trg_shipments_updated_at ON public.shipments;
CREATE TRIGGER trg_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_shipments_order
  ON public.shipments (order_id, sequence_no);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking
  ON public.shipments (tracking_number) WHERE tracking_number IS NOT NULL;
