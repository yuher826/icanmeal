-- ============================================================
-- 202608220003_products.sql
-- 상품 + 상품 자료(교안/영상) + 기관별 단가(product_prices)
--
-- 선행: 202608220002_institutions.sql
--
-- ★ Q5 결정 반영 — 기관별 단가 차등은 Phase 2 가 아니라 지금 만든다.
--   허이사님 확인 결과 실제로 필요한 기능이다.
--   테이블/조회 함수를 지금 만들고, 데이터는 비워둔 채 시작한다.
--   가격 결정 규칙: 기관 전용가 > 등급가 > 상품 기본가
--   → resolve_product_price() 한 함수로 캡슐화하여
--     나중에 데이터만 넣으면 주문 로직 수정 없이 동작한다.
--
-- ★ Q6 결정 반영 — 최소주문/리드타임은 전역 기본값 + 상품별 예외.
--   products.min_order_qty / lead_time_days 가 NULL 이면
--   app_settings 의 전역값을 쓴다.
-- ============================================================

-- ── [1] products ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id              UUID        NOT NULL DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL,
  line            TEXT        NOT NULL,
  month           INTEGER     NOT NULL,

  name            TEXT        NOT NULL,
  tagline         TEXT,
  description     TEXT,
  detail_html     TEXT,
  notice          TEXT,

  price           INTEGER     NOT NULL DEFAULT 0,
  unit_label      TEXT,
  portion_count   INTEGER,

  status          TEXT        NOT NULL DEFAULT 'preparing',

  -- NULL 이면 app_settings 전역값 사용 (Q6)
  min_order_qty   INTEGER,
  lead_time_days  INTEGER,

  cook_time_min   INTEGER,
  difficulty      TEXT,
  age_min         INTEGER,
  age_max         INTEGER,
  allergens       TEXT[]      NOT NULL DEFAULT '{}',
  ingredients     JSONB       NOT NULL DEFAULT '[]',
  steps           JSONB       NOT NULL DEFAULT '[]',
  storage_type    TEXT,

  thumbnail_url   TEXT,
  images          TEXT[]      NOT NULL DEFAULT '{}',
  video_url       TEXT,
  has_video       BOOLEAN     NOT NULL DEFAULT FALSE,

  stock_managed   BOOLEAN     NOT NULL DEFAULT FALSE,
  stock_quantity  INTEGER,

  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_featured     BOOLEAN     NOT NULL DEFAULT FALSE,

  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT products_pkey                PRIMARY KEY (id),
  CONSTRAINT products_slug_key            UNIQUE (slug),
  CONSTRAINT products_line_check          CHECK (line IN ('kids', 'silver')),
  CONSTRAINT products_month_check         CHECK (month BETWEEN 1 AND 12),
  CONSTRAINT products_status_check        CHECK (status IN ('selling', 'soldout', 'preparing', 'hidden')),
  CONSTRAINT products_difficulty_check    CHECK (difficulty IS NULL OR difficulty IN ('easy', 'medium', 'hard')),
  CONSTRAINT products_storage_type_check  CHECK (storage_type IS NULL OR storage_type IN ('refrigerated', 'frozen', 'room_temp')),
  CONSTRAINT products_price_check         CHECK (price >= 0),
  CONSTRAINT products_min_order_qty_check CHECK (min_order_qty  IS NULL OR min_order_qty  > 0),
  CONSTRAINT products_lead_time_check     CHECK (lead_time_days IS NULL OR lead_time_days >= 0),
  CONSTRAINT products_stock_check         CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  CONSTRAINT products_age_range_check     CHECK (age_min IS NULL OR age_max IS NULL OR age_min <= age_max)
);

COMMENT ON TABLE  public.products                IS '월간 쿠킹키트 상품 (키즈 12 + 실버 12)';
COMMENT ON COLUMN public.products.slug           IS 'kids-01 형태. constants/index.ts 의 id 와 동일하게 유지';
COMMENT ON COLUMN public.products.price          IS '기본 단가(원, VAT 별도). 기관별 단가는 product_prices 참고';
COMMENT ON COLUMN public.products.min_order_qty  IS 'NULL 이면 app_settings.default_min_order_qty 사용 (Q6)';
COMMENT ON COLUMN public.products.lead_time_days IS 'NULL 이면 app_settings.default_lead_time_days 사용 (Q6)';
COMMENT ON COLUMN public.products.allergens      IS '14대 알레르기 코드 배열. GIN 인덱스로 필터';

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_line_month
  ON public.products (line, month) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_status
  ON public.products (status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_sort
  ON public.products (line, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_allergens
  ON public.products USING GIN (allergens);


-- ── [2] product_prices — 기관별 단가 차등 (Q5) ───────────────
-- 두 가지 방식을 한 테이블로 수용한다.
--   (A) 등급가   : price_tier 지정, institution_id NULL
--   (B) 기관 전용가: institution_id 지정, price_tier NULL
-- 정확히 하나만 채워져야 한다 (target_check).
--
-- 유효기간(valid_from / valid_until)을 두어 "언제부터 얼마" 를 관리한다.
-- NULL 이면 무기한.
CREATE TABLE IF NOT EXISTS public.product_prices (
  id             UUID        NOT NULL DEFAULT gen_random_uuid(),
  product_id     UUID        NOT NULL,
  price_tier     TEXT,
  institution_id UUID,
  price          INTEGER     NOT NULL,
  valid_from     DATE,
  valid_until    DATE,
  memo           TEXT,
  created_by     UUID,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT product_prices_pkey                PRIMARY KEY (id),
  CONSTRAINT product_prices_product_id_fkey     FOREIGN KEY (product_id)
                                                REFERENCES public.products (id) ON DELETE CASCADE,
  CONSTRAINT product_prices_institution_id_fkey FOREIGN KEY (institution_id)
                                                REFERENCES public.institutions (id) ON DELETE CASCADE,
  CONSTRAINT product_prices_created_by_fkey     FOREIGN KEY (created_by)
                                                REFERENCES public.admins (id) ON DELETE SET NULL,
  CONSTRAINT product_prices_price_check         CHECK (price >= 0),
  CONSTRAINT product_prices_tier_check          CHECK (price_tier IS NULL OR price_tier IN
                                                  ('standard', 'preferred', 'partner')),
  CONSTRAINT product_prices_period_check        CHECK (
                                                  valid_from IS NULL OR valid_until IS NULL
                                                  OR valid_from <= valid_until),
  -- 등급가 XOR 기관전용가 — 정확히 하나만
  CONSTRAINT product_prices_target_check        CHECK (
                                                  (price_tier IS NOT NULL AND institution_id IS NULL)
                                                  OR (price_tier IS NULL AND institution_id IS NOT NULL))
);

COMMENT ON TABLE  public.product_prices                IS '기관별/등급별 상품 단가 (Q5). 비어 있으면 products.price 사용';
COMMENT ON COLUMN public.product_prices.price_tier     IS '등급가. institution_id 와 배타적';
COMMENT ON COLUMN public.product_prices.institution_id IS '특정 기관 전용가. price_tier 와 배타적. 등급가보다 우선';
COMMENT ON COLUMN public.product_prices.valid_from     IS 'NULL 이면 무기한 (과거부터 유효)';

DROP TRIGGER IF EXISTS trg_product_prices_updated_at ON public.product_prices;
CREATE TRIGGER trg_product_prices_updated_at
  BEFORE UPDATE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 같은 대상 + 같은 시작일 중복 방지 (부분 유니크 인덱스)
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_prices_tier
  ON public.product_prices (product_id, price_tier, COALESCE(valid_from, DATE '0001-01-01'))
  WHERE price_tier IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_prices_institution
  ON public.product_prices (product_id, institution_id, COALESCE(valid_from, DATE '0001-01-01'))
  WHERE institution_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_product_prices_lookup
  ON public.product_prices (product_id, price_tier, institution_id);


-- ── [3] 가격 조회 함수 (Q5 핵심) ─────────────────────────────
-- 우선순위: ① 기관 전용가 → ② 등급가 → ③ 상품 기본가
-- 주문 생성 시 반드시 이 함수를 통해 단가를 구한다.
-- 데이터가 비어 있어도 ③ 으로 폴백하므로 지금 당장 정상 동작한다.
CREATE OR REPLACE FUNCTION public.resolve_product_price(
  p_product_id     UUID,
  p_institution_id UUID DEFAULT NULL,
  p_on_date        DATE DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date       DATE    := COALESCE(p_on_date, CURRENT_DATE);
  v_tier       TEXT;
  v_price      INTEGER;
  v_base_price INTEGER;
BEGIN
  SELECT price INTO v_base_price
    FROM products
   WHERE id = p_product_id AND deleted_at IS NULL;

  IF v_base_price IS NULL THEN
    RETURN NULL;  -- 없는 상품
  END IF;

  IF p_institution_id IS NOT NULL THEN
    -- ① 기관 전용가
    SELECT pp.price INTO v_price
      FROM product_prices pp
     WHERE pp.product_id     = p_product_id
       AND pp.institution_id = p_institution_id
       AND (pp.valid_from  IS NULL OR pp.valid_from  <= v_date)
       AND (pp.valid_until IS NULL OR pp.valid_until >= v_date)
     ORDER BY pp.valid_from DESC NULLS LAST
     LIMIT 1;

    IF v_price IS NOT NULL THEN
      RETURN v_price;
    END IF;

    -- ② 등급가
    SELECT i.price_tier INTO v_tier
      FROM institutions i
     WHERE i.id = p_institution_id;

    IF v_tier IS NOT NULL THEN
      SELECT pp.price INTO v_price
        FROM product_prices pp
       WHERE pp.product_id = p_product_id
         AND pp.price_tier = v_tier
         AND (pp.valid_from  IS NULL OR pp.valid_from  <= v_date)
         AND (pp.valid_until IS NULL OR pp.valid_until >= v_date)
       ORDER BY pp.valid_from DESC NULLS LAST
       LIMIT 1;

      IF v_price IS NOT NULL THEN
        RETURN v_price;
      END IF;
    END IF;
  END IF;

  -- ③ 기본가
  RETURN v_base_price;
END;
$$;

COMMENT ON FUNCTION public.resolve_product_price(UUID, UUID, DATE) IS
  '기관별 최종 단가 조회. 기관 전용가 > 등급가 > 상품 기본가 순 (Q5)';


-- 최소주문/리드타임까지 한 번에 돌려주는 편의 함수 (Q6 전역값 폴백 포함)
CREATE OR REPLACE FUNCTION public.resolve_product_pricing(
  p_product_id     UUID,
  p_institution_id UUID DEFAULT NULL,
  p_on_date        DATE DEFAULT NULL
)
RETURNS TABLE (
  unit_price     INTEGER,
  base_price     INTEGER,
  min_order_qty  INTEGER,
  lead_time_days INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    public.resolve_product_price(p_product_id, p_institution_id, p_on_date),
    p.price,
    COALESCE(p.min_order_qty,  s.default_min_order_qty),
    COALESCE(p.lead_time_days, s.default_lead_time_days)
  FROM products p
  CROSS JOIN app_settings s
  WHERE p.id = p_product_id AND p.deleted_at IS NULL;
END;
$$;

COMMENT ON FUNCTION public.resolve_product_pricing(UUID, UUID, DATE) IS
  '단가 + 최소주문수량 + 리드타임을 한 번에 조회 (Q5 + Q6 폴백 적용)';


-- ── [4] product_materials — 교안/활동지/영상 ─────────────────
-- storage_path 를 정본으로 둔다 (절대 URL 금지).
-- 법인 분리 시 파일만 복사하면 경로가 그대로 유효해야 하기 때문 (원칙 4).
CREATE TABLE IF NOT EXISTS public.product_materials (
  id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  product_id        UUID        NOT NULL,
  type              TEXT        NOT NULL,
  title             TEXT        NOT NULL,
  bucket_id         TEXT        NOT NULL DEFAULT 'materials',
  storage_path      TEXT,
  file_url          TEXT,
  file_size         INTEGER,
  mime_type         TEXT,
  requires_purchase BOOLEAN     NOT NULL DEFAULT TRUE,
  version           INTEGER     NOT NULL DEFAULT 1,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  generated_by      TEXT,
  generated_at      TIMESTAMPTZ,
  generation_status TEXT,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT product_materials_pkey            PRIMARY KEY (id),
  CONSTRAINT product_materials_product_id_fkey FOREIGN KEY (product_id)
                                               REFERENCES public.products (id) ON DELETE CASCADE,
  CONSTRAINT product_materials_type_check      CHECK (type IN (
                                                 'lesson_plan', 'worksheet', 'ppt', 'video', 'photo_guide')),
  CONSTRAINT product_materials_generated_by_check CHECK (
                                                 generated_by IS NULL OR generated_by IN ('manual', 'auto')),
  CONSTRAINT product_materials_gen_status_check   CHECK (
                                                 generation_status IS NULL OR generation_status IN
                                                 ('queued', 'running', 'done', 'failed')),
  CONSTRAINT product_materials_version_check   CHECK (version > 0),
  -- 파일 위치가 최소 하나는 있어야 한다
  CONSTRAINT product_materials_location_check  CHECK (
                                                 storage_path IS NOT NULL OR file_url IS NOT NULL)
);

COMMENT ON TABLE  public.product_materials                   IS '상품별 교안·활동지·PPT·수업영상';
COMMENT ON COLUMN public.product_materials.storage_path      IS '버킷 내 상대경로. 절대 URL 금지 (법인 분리 원칙 4)';
COMMENT ON COLUMN public.product_materials.requires_purchase IS 'TRUE 면 구매 기관만 접근 (RLS + signed URL 로 이중 방어)';
COMMENT ON COLUMN public.product_materials.generation_status IS '교안 자동화 파이프라인용. 지금은 미사용';

DROP TRIGGER IF EXISTS trg_product_materials_updated_at ON public.product_materials;
CREATE TRIGGER trg_product_materials_updated_at
  BEFORE UPDATE ON public.product_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_product_materials_product
  ON public.product_materials (product_id, type) WHERE deleted_at IS NULL AND is_active = TRUE;
