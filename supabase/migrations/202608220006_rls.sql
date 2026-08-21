-- ============================================================
-- 202608220006_rls.sql
-- SECURITY DEFINER 헬퍼 함수 + RLS 활성화 + 정책 + 컬럼 권한
--
-- 선행: 202608220005_inquiries.sql (모든 테이블이 존재해야 함)
--
-- ★ Q4 결정 반영 — 민감 컬럼은 RLS 서브쿼리가 아니라
--   REVOKE UPDATE (컬럼 단위 권한 회수) 로 막는다. 더 단순하고 확실하다.
--
-- ⚠️ SECURITY DEFINER 가 핵심이다.
--   헬퍼 함수가 institutions 를 조회하는데, 그 institutions 에도 RLS 가 걸려 있다.
--   SECURITY DEFINER 가 없으면 정책 평가 → 함수 호출 → 정책 평가 …
--   무한 재귀가 발생한다. SET search_path 는 스키마 하이재킹 방어.
-- ============================================================

-- ── [1] 헬퍼 함수 ──────────────────────────────────────────

-- 현재 사용자가 활성 관리자인가
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
     WHERE auth_id = auth.uid()
       AND is_active = TRUE
       AND deleted_at IS NULL
  );
END;
$$;

COMMENT ON FUNCTION public.is_admin() IS 'RLS 용 관리자 판별. SECURITY DEFINER 로 재귀 회피';


-- super_admin 인가 (관리자 계정 관리 권한)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
     WHERE auth_id = auth.uid()
       AND role = 'super_admin'
       AND is_active = TRUE
       AND deleted_at IS NULL
  );
END;
$$;

COMMENT ON FUNCTION public.is_super_admin() IS 'super_admin 판별';


-- ★ 내 기관 id
--   Phase 2 에서 institution_members 를 추가할 때
--   이 함수 "안" 에만 조회를 덧붙이면 RLS 정책은 한 줄도 안 고쳐도 된다.
--   키즈밀 get_my_branch_id() 가 마스터/서브계정을 함께 처리하는 것과 같은 구조.
CREATE OR REPLACE FUNCTION public.get_my_institution_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id
    FROM institutions
   WHERE auth_id = auth.uid()
     AND deleted_at IS NULL
   LIMIT 1;

  -- [Phase 2] institution_members 조회를 여기에 추가할 것.
  -- IF v_id IS NULL THEN
  --   SELECT institution_id INTO v_id FROM institution_members
  --    WHERE auth_id = auth.uid() AND is_active = TRUE LIMIT 1;
  -- END IF;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.get_my_institution_id() IS
  '내 기관 id. Phase 2 다계정 확장 시 이 함수 내부만 수정하면 됨';


-- 승인된 기관인가 (주문 자격)
CREATE OR REPLACE FUNCTION public.is_approved_institution()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM institutions
     WHERE id = public.get_my_institution_id()
       AND status = 'approved'
  );
END;
$$;

COMMENT ON FUNCTION public.is_approved_institution() IS '주문 생성 자격 판별';


-- 내 기관이 해당 상품을 구매했는가 (영상/교안 게이트)
CREATE OR REPLACE FUNCTION public.has_purchased_product(p_product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
     WHERE oi.product_id    = p_product_id
       AND o.institution_id = public.get_my_institution_id()
       AND o.status IN ('confirmed', 'preparing', 'shipping', 'delivered')
  );
END;
$$;

COMMENT ON FUNCTION public.has_purchased_product(UUID) IS
  '구매 이력 판별. 취소/반품 주문은 제외';


-- ── [2] RLS 활성화 ─────────────────────────────────────────
ALTER TABLE public.admins            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_messages  ENABLE ROW LEVEL SECURITY;

-- 채번 카운터는 함수(SECURITY DEFINER)로만 접근한다. 정책 없이 RLS 만 켜서 전면 차단.
ALTER TABLE public.order_number_counters   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_number_counters ENABLE ROW LEVEL SECURITY;


-- ── [3] admins ─────────────────────────────────────────────
DROP POLICY IF EXISTS admins_select_self ON public.admins;
CREATE POLICY admins_select_self ON public.admins
  FOR SELECT USING (auth_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS admins_super_all ON public.admins;
CREATE POLICY admins_super_all ON public.admins
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


-- ── [4] app_settings ───────────────────────────────────────
-- 전역 설정은 로그인 사용자면 읽을 수 있어야 한다 (최소주문수량 표시 등)
DROP POLICY IF EXISTS app_settings_select_all ON public.app_settings;
CREATE POLICY app_settings_select_all ON public.app_settings
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS app_settings_admin_write ON public.app_settings;
CREATE POLICY app_settings_admin_write ON public.app_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [5] institutions ───────────────────────────────────────
DROP POLICY IF EXISTS institutions_select_own ON public.institutions;
CREATE POLICY institutions_select_own ON public.institutions
  FOR SELECT USING (auth_id = auth.uid() OR public.is_admin());

-- 가입 신청: 본인 auth_id 로만 INSERT 가능
DROP POLICY IF EXISTS institutions_insert_self ON public.institutions;
CREATE POLICY institutions_insert_self ON public.institutions
  FOR INSERT WITH CHECK (auth_id = auth.uid());

-- 본인 정보 수정. 민감 컬럼은 아래 [12] 의 REVOKE 로 차단된다 (Q4)
DROP POLICY IF EXISTS institutions_update_own ON public.institutions;
CREATE POLICY institutions_update_own ON public.institutions
  FOR UPDATE USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());

DROP POLICY IF EXISTS institutions_admin_all ON public.institutions;
CREATE POLICY institutions_admin_all ON public.institutions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [6] products ───────────────────────────────────────────
-- 판매중 상품은 비로그인도 볼 수 있어야 한다 (공개 카탈로그)
DROP POLICY IF EXISTS products_select_public ON public.products;
CREATE POLICY products_select_public ON public.products
  FOR SELECT USING (
    (deleted_at IS NULL AND status IN ('selling', 'soldout'))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS products_admin_all ON public.products;
CREATE POLICY products_admin_all ON public.products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [7] product_prices (Q5) ────────────────────────────────
-- 기관은 "자기에게 적용되는" 가격만 볼 수 있다.
-- 다른 기관의 단가가 보이면 안 된다 (B2B 에서 치명적).
DROP POLICY IF EXISTS product_prices_select_own ON public.product_prices;
CREATE POLICY product_prices_select_own ON public.product_prices
  FOR SELECT USING (
    public.is_admin()
    OR institution_id = public.get_my_institution_id()
    OR (
      institution_id IS NULL
      AND price_tier = (
        SELECT price_tier FROM institutions
         WHERE id = public.get_my_institution_id()
      )
    )
  );

DROP POLICY IF EXISTS product_prices_admin_all ON public.product_prices;
CREATE POLICY product_prices_admin_all ON public.product_prices
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [8] product_materials — 영상/교안 게이트 ────────────────
DROP POLICY IF EXISTS product_materials_select ON public.product_materials;
CREATE POLICY product_materials_select ON public.product_materials
  FOR SELECT USING (
    deleted_at IS NULL
    AND is_active = TRUE
    AND (
      requires_purchase = FALSE
      OR public.is_admin()
      OR public.has_purchased_product(product_id)
    )
  );

DROP POLICY IF EXISTS product_materials_admin_all ON public.product_materials;
CREATE POLICY product_materials_admin_all ON public.product_materials
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [9] orders / order_items / shipments ───────────────────
DROP POLICY IF EXISTS orders_select_own ON public.orders;
CREATE POLICY orders_select_own ON public.orders
  FOR SELECT USING (
    institution_id = public.get_my_institution_id() OR public.is_admin()
  );

-- 승인된 기관만 주문 생성 가능
DROP POLICY IF EXISTS orders_insert_approved ON public.orders;
CREATE POLICY orders_insert_approved ON public.orders
  FOR INSERT WITH CHECK (
    institution_id = public.get_my_institution_id()
    AND public.is_approved_institution()
  );

DROP POLICY IF EXISTS orders_admin_all ON public.orders;
CREATE POLICY orders_admin_all ON public.orders
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS order_items_select_own ON public.order_items;
CREATE POLICY order_items_select_own ON public.order_items
  FOR SELECT USING (
    public.is_admin()
    OR order_id IN (
      SELECT id FROM orders WHERE institution_id = public.get_my_institution_id()
    )
  );

DROP POLICY IF EXISTS order_items_insert_own ON public.order_items;
CREATE POLICY order_items_insert_own ON public.order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE institution_id = public.get_my_institution_id()
    )
  );

DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;
CREATE POLICY order_items_admin_all ON public.order_items
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS shipments_select_own ON public.shipments;
CREATE POLICY shipments_select_own ON public.shipments
  FOR SELECT USING (
    public.is_admin()
    OR order_id IN (
      SELECT id FROM orders WHERE institution_id = public.get_my_institution_id()
    )
  );

DROP POLICY IF EXISTS shipments_admin_all ON public.shipments;
CREATE POLICY shipments_admin_all ON public.shipments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [10] inquiries / inquiry_messages ──────────────────────
-- 비회원 문의는 세션이 없으므로 여기서 통과하지 않는다.
-- 반드시 service_role 을 쓰는 API 라우트를 경유한다 (문의번호+비밀번호 검증 후).
DROP POLICY IF EXISTS inquiries_select_own ON public.inquiries;
CREATE POLICY inquiries_select_own ON public.inquiries
  FOR SELECT USING (
    public.is_admin()
    OR (institution_id IS NOT NULL AND institution_id = public.get_my_institution_id())
  );

DROP POLICY IF EXISTS inquiries_insert_own ON public.inquiries;
CREATE POLICY inquiries_insert_own ON public.inquiries
  FOR INSERT WITH CHECK (
    institution_id IS NOT NULL AND institution_id = public.get_my_institution_id()
  );

DROP POLICY IF EXISTS inquiries_admin_all ON public.inquiries;
CREATE POLICY inquiries_admin_all ON public.inquiries
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ★ 내부 메모(is_internal)는 기관에게 절대 나가면 안 된다
DROP POLICY IF EXISTS inquiry_messages_select_own ON public.inquiry_messages;
CREATE POLICY inquiry_messages_select_own ON public.inquiry_messages
  FOR SELECT USING (
    public.is_admin()
    OR (
      is_internal = FALSE
      AND inquiry_id IN (
        SELECT id FROM inquiries
         WHERE institution_id IS NOT NULL
           AND institution_id = public.get_my_institution_id()
      )
    )
  );

-- 기관은 내부 메모를 작성할 수 없다 (sender_type 도 institution 으로 고정)
DROP POLICY IF EXISTS inquiry_messages_insert_own ON public.inquiry_messages;
CREATE POLICY inquiry_messages_insert_own ON public.inquiry_messages
  FOR INSERT WITH CHECK (
    sender_type = 'institution'
    AND is_internal = FALSE
    AND inquiry_id IN (
      SELECT id FROM inquiries
       WHERE institution_id IS NOT NULL
         AND institution_id = public.get_my_institution_id()
    )
  );

DROP POLICY IF EXISTS inquiry_messages_admin_all ON public.inquiry_messages;
CREATE POLICY inquiry_messages_admin_all ON public.inquiry_messages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ── [11] audit_logs / email_logs ───────────────────────────
-- INSERT 는 service_role(RLS 우회)로만. 정책은 조회만 연다.
DROP POLICY IF EXISTS audit_logs_select_super ON public.audit_logs;
CREATE POLICY audit_logs_select_super ON public.audit_logs
  FOR SELECT USING (public.is_super_admin());

DROP POLICY IF EXISTS email_logs_select_admin ON public.email_logs;
CREATE POLICY email_logs_select_admin ON public.email_logs
  FOR SELECT USING (public.is_admin());


-- ── [12] ★ Q4 — 민감 컬럼 UPDATE 권한 회수 ──────────────────
-- RLS 서브쿼리로 "값이 안 바뀌었는지" 비교하는 방식보다
-- 컬럼 단위 권한을 회수하는 쪽이 단순하고 확실하다.
--
-- 이 REVOKE 가 없으면 기관이 자기 status 를 'approved' 로 바꿔
-- 스스로 승인하거나, price_tier 를 'partner' 로 올려 할인을 받을 수 있다.
--
-- 주의: 관리자 작업은 service_role 로 수행되므로 이 REVOKE 의 영향을 받지 않는다.
--       (service_role 은 RLS 와 컬럼 권한을 모두 우회한다)

REVOKE UPDATE (
  status,
  price_tier,
  approved_at,
  approved_by,
  rejected_reason,
  suspended_at,
  suspended_reason,
  admin_memo,
  anonymized_at,
  deleted_at
) ON public.institutions FROM authenticated;

-- 주문 상태·결제·정산 관련도 기관이 직접 못 바꾸게 한다
REVOKE UPDATE (
  status,
  payment_status,
  toss_payment_key,
  paid_at,
  refunded_amount,
  total_amount,
  subtotal_amount,
  discount_amount,
  shipping_fee,
  vat_amount,
  tax_invoice_issued,
  tax_invoice_issued_at,
  tax_invoice_number,
  admin_memo
) ON public.orders FROM authenticated;

-- 문의 상태·담당자·우선순위는 관리자 영역
REVOKE UPDATE (
  status,
  priority,
  assigned_admin_id,
  resolved_at,
  closed_at
) ON public.inquiries FROM authenticated;


-- ── [13] 함수 실행 권한 ────────────────────────────────────
-- 채번 함수는 서버(service_role)에서만 호출한다. 클라이언트 직접 호출 차단.
REVOKE EXECUTE ON FUNCTION public.next_order_number()   FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.next_inquiry_number() FROM authenticated, anon;

-- 가격 조회는 로그인 사용자가 호출할 수 있어야 한다 (주문서 화면)
GRANT EXECUTE ON FUNCTION public.resolve_product_price(UUID, UUID, DATE)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_product_pricing(UUID, UUID, DATE) TO authenticated;
