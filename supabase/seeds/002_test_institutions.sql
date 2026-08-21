-- ============================================================
-- 002_test_institutions.sql — 테스트용 더미 기관 (개발 전용)
--
-- ⛔ 운영 DB 에 실행하지 말 것. 개발/검증용이다.
-- ⛔ 기본적으로 실행하지 않는다. 관리자 화면 목록·페이지네이션·검색을
--    눈으로 확인하고 싶을 때만 수동 실행한다.
--
-- 특징
--   · auth_id 는 전부 NULL — 실제 로그인 계정과 연결되지 않는다.
--     (auth.users 를 건드리지 않으므로 안전하게 지울 수 있다)
--   · 상태를 골고루 섞어 필터/뱃지 확인이 가능하다
--   · 사업자번호 중복 케이스 포함 (Q3 — 분원 각각 가입 허용 확인용)
--   · 페이지네이션 확인을 위해 25건 (PAGE_SIZE = 20 이라 2페이지가 생긴다)
--
-- 삭제 (전부 되돌리기)
--   DELETE FROM institutions WHERE contact_email LIKE '%@test.icanmeal.local';
-- ============================================================

INSERT INTO institutions (
  name, institution_type, business_number, representative_name,
  contact_name, contact_phone, contact_email,
  zip_code, address, address_detail,
  status, rejected_reason, approved_at,
  price_tier, agreed_terms_at, agreed_privacy_at, created_at
) VALUES
-- ── 승인 대기 (pending) 8건 ──
('푸른어린이집',        'daycare',        '1018212345', '김푸른', '김담당', '010-1000-0001', 'a01@test.icanmeal.local', '06236', '서울 강남구 테헤란로 1',   '2층',  'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '1 day'),
('햇살유치원',          'kindergarten',   '2208312345', '이햇살', '이담당', '010-1000-0002', 'a02@test.icanmeal.local', '13529', '경기 성남시 분당구 판교로 2', NULL,   'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '2 days'),
('아이사랑어린이집',    'daycare',        '3109812345', '박사랑', '박담당', '010-1000-0003', 'a03@test.icanmeal.local', '21999', '인천 연수구 송도과학로 3',  '101호','pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '3 days'),
('행복노인복지관',      'welfare_center', '4051012345', '최행복', '최담당', '010-1000-0004', 'a04@test.icanmeal.local', '48058', '부산 해운대구 센텀로 4',    NULL,   'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '4 days'),
('은빛데이케어센터',    'senior_center',  '5121112345', '정은빛', '정담당', '010-1000-0005', 'a05@test.icanmeal.local', '35233', '대전 서구 둔산로 5',        '3층',  'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '5 days'),
('새싹초등학교',        'elementary',     '6131212345', '한새싹', '한담당', '010-1000-0006', 'a06@test.icanmeal.local', '61947', '광주 서구 상무대로 6',      NULL,   'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '6 days'),
('따뜻한요양원',        'hospital',       '7141312345', '오따뜻', '오담당', '010-1000-0007', 'a07@test.icanmeal.local', '41940', '대구 중구 국채보상로 7',    NULL,   'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '7 days'),
('나눔지역아동센터',    'other',          '8151412345', '윤나눔', '윤담당', '010-1000-0008', 'a08@test.icanmeal.local', '52725', '경남 진주시 진주대로 8',    NULL,   'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '8 days'),

-- ── 검토 중 (reviewing) 3건 ──
('별빛어린이집',        'daycare',        '9161512345', '강별빛', '강담당', '010-1000-0009', 'a09@test.icanmeal.local', '03925', '서울 마포구 월드컵북로 9',  NULL,   'reviewing', NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '9 days'),
('다솜유치원',          'kindergarten',   '1017612345', '문다솜', '문담당', '010-1000-0010', 'a10@test.icanmeal.local', '16506', '경기 수원시 영통구 광교로 10', NULL, 'reviewing', NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '10 days'),
('한마음복지관',        'welfare_center', '1117712345', '서한마음', '서담당', '010-1000-0011', 'a11@test.icanmeal.local', '24341', '강원 춘천시 중앙로 11',   NULL,   'reviewing', NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '11 days'),

-- ── 승인 완료 (approved) 8건 — 단가 등급도 섞는다 ──
('무지개어린이집',      'daycare',        '1217812345', '남무지개', '남담당', '010-1000-0012', 'a12@test.icanmeal.local', '05854', '서울 송파구 올림픽로 12', NULL, 'approved', NULL, NOW() - INTERVAL '20 days', 'standard',  NOW(), NOW(), NOW() - INTERVAL '30 days'),
('꿈나무유치원',        'kindergarten',   '1317912345', '배꿈나무', '배담당', '010-1000-0013', 'a13@test.icanmeal.local', '10380', '경기 고양시 일산동구 중앙로 13', NULL, 'approved', NULL, NOW() - INTERVAL '25 days', 'preferred', NOW(), NOW(), NOW() - INTERVAL '35 days'),
('사랑나눔복지관',      'welfare_center', '1418012345', '조사랑', '조담당', '010-1000-0014', 'a14@test.icanmeal.local', '34142', '대전 유성구 대학로 14',   NULL, 'approved', NULL, NOW() - INTERVAL '40 days', 'partner',   NOW(), NOW(), NOW() - INTERVAL '50 days'),
('푸른솔데이케어',      'senior_center',  '1518112345', '신푸른솔', '신담당', '010-1000-0015', 'a15@test.icanmeal.local', '46241', '부산 금정구 부산대학로 15', NULL, 'approved', NULL, NOW() - INTERVAL '15 days', 'standard',  NOW(), NOW(), NOW() - INTERVAL '22 days'),
('하늘초등학교',        'elementary',     '1618212345', '권하늘', '권담당', '010-1000-0016', 'a16@test.icanmeal.local', '28644', '충북 청주시 서원구 1순환로 16', NULL, 'approved', NULL, NOW() - INTERVAL '12 days', 'standard', NOW(), NOW(), NOW() - INTERVAL '18 days'),
('희망요양병원',        'hospital',       '1718312345', '황희망', '황담당', '010-1000-0017', 'a17@test.icanmeal.local', '54896', '전북 전주시 덕진구 백제대로 17', NULL, 'approved', NULL, NOW() - INTERVAL '60 days', 'preferred', NOW(), NOW(), NOW() - INTERVAL '70 days'),
('참사랑어린이집',      'daycare',        '1818412345', '노참사랑', '노담당', '010-1000-0018', 'a18@test.icanmeal.local', '63122', '제주 제주시 첨단로 18',   NULL, 'approved', NULL, NOW() - INTERVAL '8 days',  'standard',  NOW(), NOW(), NOW() - INTERVAL '14 days'),
('열린노인복지센터',    'senior_center',  '1918512345', '유열린', '유담당', '010-1000-0019', 'a19@test.icanmeal.local', '31116', '충남 천안시 동남구 만남로 19', NULL, 'approved', NULL, NOW() - INTERVAL '3 days', 'standard',  NOW(), NOW(), NOW() - INTERVAL '9 days'),

-- ── 반려 (rejected) 3건 — 사유 필수 (CHECK 제약) ──
('테스트기관A',         'other',          '2018612345', '임테스트', '임담당', '010-1000-0020', 'a20@test.icanmeal.local', '00000', '주소 미상',              NULL, 'rejected', '사업자등록번호가 확인되지 않습니다. 정확한 번호로 다시 신청해주세요.', NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '16 days'),
('폐원어린이집',        'daycare',        '2118712345', '차폐원', '차담당', '010-1000-0021', 'a21@test.icanmeal.local', '01000', '서울 도봉구 방학로 21',   NULL, 'rejected', '폐원 확인되어 반려합니다.', NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '19 days'),
('중복신청기관',        'kindergarten',   '2218812345', '표중복', '표담당', '010-1000-0022', 'a22@test.icanmeal.local', '02000', '서울 성북구 동소문로 22', NULL, 'rejected', '동일 기관으로 이미 승인된 계정이 있습니다.', NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '21 days'),

-- ── 정지 (suspended) 1건 ──
('정지된복지관',        'welfare_center', '2318912345', '구정지', '구담당', '010-1000-0023', 'a23@test.icanmeal.local', '03000', '서울 종로구 종로 23',     NULL, 'suspended', NULL, NOW() - INTERVAL '90 days', 'standard', NOW(), NOW(), NOW() - INTERVAL '100 days'),

-- ── 사업자번호 중복 케이스 2건 (Q3 검증용) ──
--    아래 둘은 '1018212345' 로 맨 위 '푸른어린이집' 과 같은 사업자번호를 쓴다.
--    분원 각각 가입을 허용했으므로 INSERT 는 성공해야 하고,
--    상세 화면에 "같은 사업자번호 기관" 경고가 떠야 정상이다.
('푸른어린이집 2호점',  'daycare',        '1018212345', '김푸른', '김담당', '010-1000-0024', 'a24@test.icanmeal.local', '06237', '서울 강남구 테헤란로 24', NULL, 'pending',  NULL, NULL, 'standard', NOW(), NOW(), NOW() - INTERVAL '1 day'),
('푸른어린이집 3호점',  'daycare',        '1018212345', '김푸른', '김담당', '010-1000-0025', 'a25@test.icanmeal.local', '06238', '서울 강남구 테헤란로 25', NULL, 'approved', NULL, NOW() - INTERVAL '5 days', 'standard', NOW(), NOW(), NOW() - INTERVAL '11 days');


-- ── 확인 ──
--   SELECT status, count(*) FROM institutions
--    WHERE contact_email LIKE '%@test.icanmeal.local'
--    GROUP BY status ORDER BY status;
--   → approved 9 / pending 9 / rejected 3 / reviewing 3 / suspended 1 = 25건

-- ── 삭제 ──
--   DELETE FROM institutions WHERE contact_email LIKE '%@test.icanmeal.local';
