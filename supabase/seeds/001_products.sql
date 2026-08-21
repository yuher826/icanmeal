-- ============================================================
-- 001_products.sql — 상품 시드 (키즈 12 + 실버 12 = 24종)
--
-- ⚠️ 이 파일은 자동 생성된다. 직접 수정하지 말 것.
--    생성: node scripts/gen-product-seed.mjs
--    원본: constants/index.ts 의 KIDS_PRODUCTS / SILVER_PRODUCTS
--
-- slug 기준 UPSERT 이므로 여러 번 실행해도 안전하다(멱등).
-- 관리자가 대시보드에서 바꾼 값은 재실행 시 덮어써지니 주의.
--
-- min_order_qty / lead_time_days 는 NULL 로 둔다
--   → app_settings 의 전역 기본값(30세트 / 10영업일)이 적용된다.
--   → 특정 상품만 예외를 두고 싶을 때 해당 행에만 값을 넣는다. (Q6 결정)
-- ============================================================

INSERT INTO products (
  slug, line, month, name, tagline, description,
  unit_label, price, has_video, thumbnail_url, status, sort_order
) VALUES
  ('kids-01', 'kids', 1, '만두 만들기', '복이 가득! 영양 가득!', '기관 즉석취식 불가 · 별도 포장재로 가정에 배송', '3개', 5500, TRUE, '/images/products/kids/kids_01_만두.png', 'selling', 1),
  ('kids-02', 'kids', 2, '딸기 쌀강정 만들기', '새콤달콤!', '월간 정규 캘린더 쿠킹키트', '2개', 4500, TRUE, '/images/products/kids/kids_02_딸기쌀강정.png', 'selling', 2),
  ('kids-03', 'kids', 3, '꼬마김밥 만들기', '알록달록 영양소 가득', '월간 정규 캘린더 쿠킹키트', '3개', 4500, TRUE, '/images/products/kids/kids_03_꼬마김밥.png', 'selling', 3),
  ('kids-04', 'kids', 4, '봄나비 부르게스타 만들기', '봄이 왔어요!', '월간 정규 캘린더 쿠킹키트', '2개', 4000, TRUE, '/images/products/kids/kids_04_봄나비부르게스타.png', 'selling', 4),
  ('kids-05', 'kids', 5, '레몬청 만들기', '새콤달콤', '기관 즉석취식 불가 · 보관용기로 가정에 배송', '150ml 내외', 4500, TRUE, '/images/products/kids/kids_05_레몬청.png', 'selling', 5),
  ('kids-06', 'kids', 6, '햇감자샌드위치 만들기', '포실포실', '월간 정규 캘린더 쿠킹키트', '2개', 4000, TRUE, '/images/products/kids/kids_06_햇감자샌드위치.png', 'selling', 6),
  ('kids-07', 'kids', 7, '미니컵 파르페 만들기', '달콤한 여름 디저트!', '월간 정규 캘린더 쿠킹키트', '150g 내외', 5500, TRUE, '/images/products/kids/kids_07_미니컵파르페.png', 'selling', 7),
  ('kids-08', 'kids', 8, '참외컵화채 만들기', '건강한 여름나기', '월간 정규 캘린더 쿠킹키트', '150ml 내외', 4500, TRUE, '/images/products/kids/kids_08_참외컵화채.png', 'selling', 8),
  ('kids-09', 'kids', 9, '한가위 송편 만들기', '추석맞이!', '월간 정규 캘린더 쿠킹키트', '3개', 5000, TRUE, '/images/products/kids/kids_09_한가위송편.png', 'selling', 9),
  ('kids-10', 'kids', 10, '전통 된장 만들기', '한국음식의 뿌리', '기관 즉석취식 불가 · 보관용기로 가정에 배송', '150g 내외', 5500, TRUE, '/images/products/kids/kids_10_전통된장.png', 'selling', 10),
  ('kids-11', 'kids', 11, '김장 김치 만들기', '유산균이 톡톡!', '기관 즉석취식 불가 · 보관용기로 가정에 배송', '600g 내외', 6000, TRUE, '/images/products/kids/kids_11_김장김치.png', 'selling', 11),
  ('kids-12', 'kids', 12, '루돌프 컵케이크 만들기', '빛나는 코!', '월간 정규 캘린더 쿠킹키트', '1개', 4500, TRUE, '/images/products/kids/kids_12_루돌프컵케이크.png', 'selling', 12),
  ('silver-01', 'silver', 1, '떡만둣국 만들기', '온가족이 둘러앉아 빚던 만두!', '온가족이 둘러앉아 만두 빚던 기억을 함께 나누는 회상 활동입니다.', NULL, 5500, TRUE, '/images/products/silver_illustration/silver_illust_01_떡만둣국.png', 'selling', 1),
  ('silver-02', 'silver', 2, '월남떡쌈 만들기', '고운 색동저고리 입던 날의 설렘', '색동저고리 입고 설레던 날을 함께 나누는 회상 활동입니다.', NULL, 4000, TRUE, '/images/products/silver_illustration/silver_illust_02_월남떡쌈.png', 'selling', 2),
  ('silver-03', 'silver', 3, '화전 만들기', '꽃구경 가던 봄날의 기억', '꽃구경 가던 봄날의 기억을 함께 나누는 회상 활동입니다.', NULL, 4500, TRUE, '/images/products/silver_illustration/silver_illust_03_화전.png', 'selling', 3),
  ('silver-04', 'silver', 4, '식목일 텃밭케이크 만들기', '그 시절 흙내음 대신 달콤함 심는 날', '흙내음 대신 달콤함을 심던 식목일을 함께 나누는 회상 활동입니다.', NULL, 4500, TRUE, '/images/products/silver_illustration/silver_illust_04_식목일텃밭케이크.png', 'selling', 4),
  ('silver-05', 'silver', 5, '계란장 만들기', '계란이 왔어요~ 맛있는 계란장이 왔어요!', '계란장 나누어 먹던 기억을 함께 나누는 회상 활동입니다.', NULL, 5000, TRUE, '/images/products/silver_illustration/silver_illust_05_계란장.png', 'selling', 5),
  ('silver-06', 'silver', 6, '감자사라다빵 만들기', '뉘 집 감자여~?', '동네에서 감자 나눠 먹던 기억을 함께 나누는 회상 활동입니다.', NULL, 4000, TRUE, '/images/products/silver_illustration/silver_illust_06_감자사라다빵.png', 'selling', 6),
  ('silver-07', 'silver', 7, '열무김치 만들기', '정겨운 여름 손맛', '여름철 열무김치 담그던 손맛을 함께 나누는 회상 활동입니다.', NULL, 5000, TRUE, '/images/products/silver_illustration/silver_illust_07_열무김치.png', 'selling', 7),
  ('silver-08', 'silver', 8, '수박 화채 만들기', '매미 울던 여름날', '매미 울던 여름날의 시원함을 함께 나누는 회상 활동입니다.', NULL, 4500, TRUE, '/images/products/silver_illustration/silver_illust_08_수박화채.png', 'selling', 8),
  ('silver-09', 'silver', 9, '송편 만들기', '한가위 달빛 아래 가족들과 만들었던!', '한가위 달빛 아래 온가족이 빚던 송편을 함께 나누는 회상 활동입니다.', NULL, 4000, TRUE, '/images/products/silver_illustration/silver_illust_09_송편.png', 'selling', 9),
  ('silver-10', 'silver', 10, '약밥 만들기', '무병장수 기원, 약(藥)이 되는 귀한', '무병장수를 기원하며 나누던 약밥을 함께 나누는 회상 활동입니다.', NULL, 4500, TRUE, '/images/products/silver_illustration/silver_illust_10_약밥.png', 'selling', 10),
  ('silver-11', 'silver', 11, '튀밥 과즐 만들기', '수확의 기쁨!', '수확의 기쁨을 나누던 튀밥 과즐을 함께 나누는 회상 활동입니다.', NULL, 4000, TRUE, '/images/products/silver_illustration/silver_illust_11_튀밥과즐.png', 'selling', 11),
  ('silver-12', 'silver', 12, '크리스마스쿠키 만들기', '할머니·할아버지가 구운 달콤한 크리스마스의 기적', '손주에게 전하는 달콤한 크리스마스를 함께 나누는 회상 활동입니다.', NULL, 5500, TRUE, '/images/products/silver_illustration/silver_illust_12_크리스마스쿠키.png', 'selling', 12)
ON CONFLICT (slug) DO UPDATE SET
  line          = EXCLUDED.line,
  month         = EXCLUDED.month,
  name          = EXCLUDED.name,
  tagline       = EXCLUDED.tagline,
  description   = EXCLUDED.description,
  unit_label    = EXCLUDED.unit_label,
  price         = EXCLUDED.price,
  has_video     = EXCLUDED.has_video,
  thumbnail_url = EXCLUDED.thumbnail_url,
  sort_order    = EXCLUDED.sort_order,
  updated_at    = NOW();

-- 확인용
--   SELECT line, count(*) FROM products WHERE deleted_at IS NULL GROUP BY line;
--   → kids 12 / silver 12 가 나와야 한다.
