-- Copyright (c) 2025 Ahmed Fahmy
-- Developed at UFUQ TECH
-- Proprietary software. See LICENSE file in the project root for full license information.

-- ============================================================================
-- Homeverse seed data
-- Matches the localized frontend mock inventory.
-- ============================================================================

-- Admin user (password: Admin@123456)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role, location, bio) VALUES
('Homeverse', 'Admin', 'admin@homeverse.com', '01015205654',
 '$2y$10$oM5vSkFi2ElLtsNc1S50Uupa0JHnD4H.jUZgIpPh7o60k9ntTaEpq',
 'admin', 'Cairo, Egypt', 'Platform administrator for Homeverse.');

-- Demo user (password: User@123456)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role, location) VALUES
('Ahmed', 'Mohamed', 'user@homeverse.com', '01098765432',
 '$2y$10$6O7EMhBxIbOWLyNAmLlVyu0Bft443kJh.dUnQaF26lWYr3lSbR.LW',
 'user', 'New Cairo, Egypt');

-- Property Categories
INSERT INTO property_categories (name, slug, icon, description, sort_order) VALUES
(JSON_OBJECT('en', 'Apartment', 'ar', 'شقة'), 'apartment', 'HiOutlineBuildingOffice', JSON_OBJECT('en', 'Modern apartments in prime locations', 'ar', 'شقق عصرية في مواقع مميزة'), 1),
(JSON_OBJECT('en', 'Villa', 'ar', 'فيلا'), 'villa', 'HiOutlineHome', JSON_OBJECT('en', 'Luxury villas with private gardens', 'ar', 'فيلات فاخرة مع حدائق خاصة'), 2),
(JSON_OBJECT('en', 'Penthouse', 'ar', 'بنتهاوس'), 'penthouse', 'HiOutlineStar', JSON_OBJECT('en', 'Exclusive penthouses with panoramic views', 'ar', 'بنتهاوس حصري بإطلالات بانورامية'), 3),
(JSON_OBJECT('en', 'Duplex', 'ar', 'دوبلكس'), 'duplex', 'HiOutlineSquares2X2', JSON_OBJECT('en', 'Spacious duplex units across two floors', 'ar', 'وحدات دوبلكس واسعة على طابقين'), 4),
(JSON_OBJECT('en', 'Studio', 'ar', 'استوديو'), 'studio', 'HiOutlineKey', JSON_OBJECT('en', 'Compact studios for singles and couples', 'ar', 'استوديوهات مدمجة للأفراد والأزواج'), 5),
(JSON_OBJECT('en', 'Chalet', 'ar', 'شاليه'), 'chalet', 'HiOutlineSun', JSON_OBJECT('en', 'Beachfront chalets for vacation living', 'ar', 'شاليهات على الشاطئ للحياة العطلات'), 6),
(JSON_OBJECT('en', 'Office', 'ar', 'مكتب'), 'office', 'HiOutlineBriefcase', JSON_OBJECT('en', 'Commercial office spaces', 'ar', 'مساحات مكتبية تجارية'), 7),
(JSON_OBJECT('en', 'Shop', 'ar', 'محل'), 'shop', 'HiOutlineShoppingBag', JSON_OBJECT('en', 'Retail and commercial shops', 'ar', 'محلات تجارية وبيع بالتجزئة'), 8);

-- Agents
INSERT INTO agents (name, email, phone, avatar, speciality, properties_sold, rating) VALUES
(JSON_OBJECT('en', 'Mohamed Attar', 'ar', 'محمد عطار'), 'mohamed@homeverse.com', '01015205654', 'uploads/images/agents/mohamed-attar.jpg', 'Luxury Properties', 45, 4.9),
(JSON_OBJECT('en', 'Ahmed Tamer', 'ar', 'أحمد تامر'), 'ahmed@homeverse.com', '01098765432', 'uploads/images/agents/ahmed-tamer.jpg', 'Residential', 32, 4.8),
(JSON_OBJECT('en', 'Khaled Ali', 'ar', 'خالد علي'), 'khaled@homeverse.com', '01123456789', 'uploads/images/agents/khaled-ali.jpg', 'Commercial', 28, 4.7),
(JSON_OBJECT('en', 'Omar Saad', 'ar', 'عمر سعد'), 'omar@homeverse.com', '01234567890', 'uploads/images/agents/omar-saad.jpg', 'Investment', 51, 4.9);

-- Amenities
INSERT INTO amenities (name, slug, icon, description, image_url) VALUES
(JSON_OBJECT('en', 'Parking Space', 'ar', 'موقف سيارات'), 'parking', 'FaCar', JSON_OBJECT('en', 'Underground parking with 24/7 CCTV surveillance and dedicated spots.', 'ar', 'موقف تحت الأرض مع مراقبة على مدار الساعة ومواقف مخصصة.'), 'uploads/images/amenities/parking-space.jpg'),
(JSON_OBJECT('en', 'Swimming Pool', 'ar', 'مسبح'), 'pool', 'FaSwimmingPool', JSON_OBJECT('en', 'Olympic-sized heated pool with kids area and poolside lounge.', 'ar', 'مسبح مدفأ بحجم أولمبي مع منطقة للأطفال وجلسات بجانب المسبح.'), 'uploads/images/amenities/swimming-pool.jpg'),
(JSON_OBJECT('en', 'Private Security', 'ar', 'أمن خاص'), 'security', 'FaShieldAlt', JSON_OBJECT('en', 'Round-the-clock security with advanced access control systems.', 'ar', 'أمن على مدار الساعة مع أنظمة تحكم متقدمة في الدخول.'), 'uploads/images/amenities/private-security.jpg'),
(JSON_OBJECT('en', 'Medical Center', 'ar', 'مركز طبي'), 'medical', 'FaHospital', JSON_OBJECT('en', 'On-site clinic with qualified staff for emergencies.', 'ar', 'عيادة داخلية بطاقم مؤهل للحالات الطارئة.'), 'uploads/images/amenities/medical-center.jpg'),
(JSON_OBJECT('en', 'Library Area', 'ar', 'منطقة مكتبة'), 'library', 'FaBook', JSON_OBJECT('en', 'Quiet reading rooms and co-working spaces with high-speed internet.', 'ar', 'غرف قراءة هادئة ومساحات عمل مشتركة مع إنترنت عالي السرعة.'), 'uploads/images/amenities/library-area.jpg'),
(JSON_OBJECT('en', 'Smart Home', 'ar', 'منزل ذكي'), 'smart-home', 'FaMobileAlt', JSON_OBJECT('en', 'Integrated automation with voice control, smart lighting and climate.', 'ar', 'أتمتة متكاملة مع تحكم صوتي وإضاءة ذكية وتحكم بالمناخ.'), 'uploads/images/amenities/smart-home.jpg'),
(JSON_OBJECT('en', 'Kids Playground', 'ar', 'منطقة ألعاب للأطفال'), 'playground', 'FaChild', JSON_OBJECT('en', 'Safe outdoor play areas with modern equipment and soft flooring.', 'ar', 'مناطق لعب آمنة خارجية بمعدات حديثة وأرضيات لينة.'), 'uploads/images/amenities/kids-playground.jpg'),
(JSON_OBJECT('en', 'Fitness Center', 'ar', 'مركز لياقة'), 'gym', 'FaDumbbell', JSON_OBJECT('en', 'Fully equipped gym with trainers, yoga studio and sauna.', 'ar', 'صالة رياضية مجهزة بالكامل مع مدربين واستوديو يوغا وساونا.'), 'uploads/images/amenities/fitness-center.jpg');

-- Properties
INSERT INTO properties (title, description, city, address, location_label, price, currency, price_period, listing_type, category_id, agent_id, bedrooms, bathrooms, area_sqft, floors, garage, year_built, is_featured, status)
VALUES
(JSON_OBJECT(
    'en', 'Skyline Penthouse with Nile View',
    'ar', 'بنتهاوس سكاي لاين بإطلالة على النيل'
), JSON_OBJECT(
    'en', 'Stunning penthouse overlooking the Nile with floor-to-ceiling windows, Italian marble flooring, and a private rooftop terrace. Open-plan kitchen with Siemens appliances. Master bedroom has walk-in closet and ensuite.',
    'ar', 'بنتهاوس رائع يطل على النيل مع نوافذ ممتدة من الأرض إلى السقف وأرضيات رخام إيطالي وتراس خاص على السطح. مطبخ مفتوح مزود بأجهزة سيمنس. تحتوي غرفة النوم الرئيسية على غرفة ملابس وحمام داخلي.'
), JSON_OBJECT('en', 'Cairo', 'ar', 'القاهرة'), JSON_OBJECT('en', '15 Hassan Sabry St', 'ar', '15 شارع حسن صبري'), JSON_OBJECT('en', 'Zamalek, Cairo', 'ar', 'الزمالك، القاهرة'),
 45000, 'EGP', '/Month', 'rent', 3, 1, 4, 3, 3200, 2, 2, 2023, 1, 'active'),

(JSON_OBJECT('en', 'Modern Villa in Katameya Heights', 'ar', 'فيلا حديثة في القطامية هايتس'),
 JSON_OBJECT('en', 'Luxurious standalone villa in Katameya Heights compound. Features private garden with landscaping, infinity pool, detached guest house, and interiors designed by a renowned Italian architect. Smart home enabled.', 'ar', 'فيلا مستقلة فاخرة في كمبوند القطامية هايتس. تتميز بحديقة خاصة ومنتجع سباحة لا نهائي وبيت ضيافة منفصل وديكورات داخلية من تصميم مهندس إيطالي شهير. مزودة بنظام منزل ذكي.'),
 JSON_OBJECT('en', 'New Cairo', 'ar', 'القاهرة الجديدة'), JSON_OBJECT('en', 'Plot 42, Katameya Heights', 'ar', 'قطعة 42، القطامية هايتس'), JSON_OBJECT('en', 'Katameya Heights, New Cairo', 'ar', 'القطامية هايتس، القاهرة الجديدة'),
 8500000, 'EGP', '', 'sale', 2, 2, 5, 4, 6500, 3, 3, 2022, 1, 'active'),

(JSON_OBJECT('en', 'Cozy Studio in Downtown Cairo', 'ar', 'استوديو مريح في وسط القاهرة'),
 JSON_OBJECT('en', 'Beautifully furnished studio in downtown Cairo. Walking distance to restaurants, cafes, and metro station. Includes fiber internet, modern kitchenette with Bosch appliances, and smart TV.', 'ar', 'استوديو مفروش بشكل جميل في وسط القاهرة. على مسافة قريبة من المطاعم والمقاهي ومحطة المترو. يشمل إنترنت فايبر ومطبخًا صغيرًا حديثًا بأجهزة بوش وتلفازًا ذكيًا.'),
 JSON_OBJECT('en', 'Cairo', 'ar', 'القاهرة'), JSON_OBJECT('en', '78 Talaat Harb St', 'ar', '78 شارع طلعت حرب'), JSON_OBJECT('en', 'Downtown, Cairo', 'ar', 'وسط البلد، القاهرة'),
 12000, 'EGP', '/Month', 'rent', 5, 3, 1, 1, 850, 1, 0, 2021, 0, 'active'),

(JSON_OBJECT('en', 'Beachfront Chalet in North Coast', 'ar', 'شاليه على الشاطئ في الساحل الشمالي'),
 JSON_OBJECT('en', 'Direct beach access in Hacienda Bay with panoramic Mediterranean sea views. Open-plan living area, fully equipped kitchen, large terrace for sunset dining, and private parking.', 'ar', 'وصول مباشر إلى الشاطئ في هايسندا باي مع إطلالات بانورامية على البحر المتوسط. منطقة معيشة مفتوحة، مطبخ مجهز بالكامل، تراس واسع لتناول الطعام عند الغروب، وموقف خاص.'),
 JSON_OBJECT('en', 'North Coast', 'ar', 'الساحل الشمالي'), JSON_OBJECT('en', 'Hacienda Bay KM 200', 'ar', 'هايسندا باي كيلومتر 200'), JSON_OBJECT('en', 'Hacienda Bay, North Coast', 'ar', 'هايسندا باي، الساحل الشمالي'),
 55000, 'EGP', '/Month', 'rent', 6, 4, 3, 2, 2200, 1, 1, 2024, 1, 'active'),

(JSON_OBJECT('en', 'Duplex Apartment in Madinaty', 'ar', 'شقة دوبلكس في مدينتي'),
 JSON_OBJECT('en', 'Spacious duplex in Madinaty with modern finishes and large balcony overlooking green spaces. Two master bedrooms with ensuite bathrooms. Open-plan living and dining with double-height ceiling.', 'ar', 'شقة دوبلكس واسعة في مدينتي بتشطيبات حديثة وشرفة كبيرة تطل على المساحات الخضراء. تحتوي على غرفتي نوم رئيسيتين بحمامات داخلية. معيشة وطعام مفتوحان بسقف مزدوج الارتفاع.'),
 JSON_OBJECT('en', 'New Cairo', 'ar', 'القاهرة الجديدة'), JSON_OBJECT('en', 'B5 Group 89, Madinaty', 'ar', 'بي 5 مجموعة 89، مدينتي'), JSON_OBJECT('en', 'Madinaty, New Cairo', 'ar', 'مدينتي، القاهرة الجديدة'),
 3200000, 'EGP', '', 'sale', 4, 1, 3, 3, 2800, 2, 1, 2023, 1, 'active'),

(JSON_OBJECT('en', 'Sea View Apartment in Alexandria', 'ar', 'شقة مطلة على البحر في الإسكندرية'),
 JSON_OBJECT('en', 'Elegant Corniche apartment with unobstructed Mediterranean sea views. Recently renovated with hardwood floors, central AC, modern fully-equipped kitchen, and two balconies.', 'ar', 'شقة أنيقة على الكورنيش بإطلالات غير محجوبة على البحر المتوسط. تم تجديدها مؤخرًا بأرضيات خشبية وتكييف مركزي ومطبخ حديث مجهز بالكامل وشرفتين.'),
 JSON_OBJECT('en', 'Alexandria', 'ar', 'الإسكندرية'), JSON_OBJECT('en', '312 Corniche Road', 'ar', '312 طريق الكورنيش'), JSON_OBJECT('en', 'Corniche, Alexandria', 'ar', 'الكورنيش، الإسكندرية'),
 28000, 'EGP', '/Month', 'rent', 1, 3, 2, 2, 1600, 1, 1, 2020, 0, 'active');

-- Property Images
INSERT INTO property_images (property_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, 'uploads/images/properties/skyline-penthouse/exterior.jpg', 'Penthouse exterior', 0, 1),
(1, 'uploads/images/properties/skyline-penthouse/living-room.jpg', 'Penthouse living room', 1, 0),
(1, 'uploads/images/properties/skyline-penthouse/terrace.jpg', 'Penthouse terrace', 2, 0),
(2, 'uploads/images/properties/modern-villa/front.jpg', 'Villa front', 0, 1),
(2, 'uploads/images/properties/modern-villa/garden.jpg', 'Villa garden', 1, 0),
(2, 'uploads/images/properties/modern-villa/interior.jpg', 'Villa interior', 2, 0),
(3, 'uploads/images/properties/cozy-studio/view.jpg', 'Studio view', 0, 1),
(3, 'uploads/images/properties/cozy-studio/interior.jpg', 'Studio interior', 1, 0),
(4, 'uploads/images/properties/beachfront-chalet/beach.jpg', 'Chalet beach', 0, 1),
(4, 'uploads/images/properties/beachfront-chalet/terrace.jpg', 'Chalet terrace', 1, 0),
(5, 'uploads/images/properties/duplex-apartment/living.jpg', 'Duplex living', 0, 1),
(5, 'uploads/images/properties/duplex-apartment/bedroom.jpg', 'Duplex bedroom', 1, 0),
(6, 'uploads/images/properties/sea-view-apartment/view.jpg', 'Apartment view', 0, 1),
(6, 'uploads/images/properties/sea-view-apartment/interior.jpg', 'Apartment interior', 1, 0);

-- Property ↔ Amenity links
INSERT INTO property_amenities (property_id, amenity_id) VALUES
(1,1),(1,2),(1,3),(1,6),(1,8),
(2,1),(2,2),(2,3),(2,7),(2,8),
(3,3),(3,6),
(4,1),(4,2),(4,3),(4,7),
(5,1),(5,3),(5,5),(5,8),
(6,1),(6,3),(6,4);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, image_url, author_name, author_avatar, read_time, is_published, published_at) VALUES
(JSON_OBJECT(
    'en', 'The Most Inspiring Interior Design Trends of 2025',
    'ar', 'أحدث اتجاهات التصميم الداخلي الملهمة لعام 2025'
),
'interior-design-trends-2025',
JSON_OBJECT(
    'en', 'Discover the latest trends shaping modern Egyptian homes, from warm minimalism to biophilic design.',
    'ar', 'اكتشف أحدث الاتجاهات التي تشكل المنازل المصرية الحديثة، من البساطة الدافئة إلى التصميم البيوفيلي.'
),
JSON_OBJECT(
    'en', '<p>As we move through 2025, interior design continues to evolve with a focus on sustainability, wellness, and personal expression. Here are the top trends shaping modern Egyptian homes:</p><h2>Warm Minimalism</h2><p>Combining clean lines with warm materials like natural wood and soft textiles, this trend creates spaces that feel both modern and inviting.</p><h2>Biophilic Design</h2><p>Bringing nature indoors through plants, natural light, and organic materials to improve well-being and create a connection with the outdoors.</p><h2>Sustainable Luxury</h2><p>Using eco-friendly materials and energy-efficient solutions without compromising on style or comfort.</p>',
    'ar', '<p>مع تقدمنا في عام 2025، يستمر التصميم الداخلي في التطور مع التركيز على الاستدامة وصحة الإنسان والتعبير الشخصي. فيما يلي أهم الاتجاهات التي تشكل المنازل المصرية الحديثة:</p><h2>البساطة الدافئة</h2><p>الجمع بين الخطوط النظيفة والمواد الدافئة مثل الخشب الطبيعي والمنسوجات الناعمة لابتكار مساحات حديثة ومرحبة في الوقت نفسه.</p><h2>التصميم البيوفيلي</h2><p>إدخال الطبيعة إلى الداخل من خلال النباتات والضوء الطبيعي والمواد العضوية لتعزيز الرفاهية وخلق ارتباط مع الخارج.</p><h2>الفخامة المستدامة</h2><p>استخدام مواد صديقة للبيئة وحلول موفرة للطاقة دون التفريط في الأناقة أو الراحة.</p>'
),
JSON_OBJECT('en', 'Interior Design', 'ar', 'التصميم الداخلي'),
JSON_OBJECT('en', JSON_ARRAY('Design', 'Interior'), 'ar', JSON_ARRAY('تصميم', 'داخلي')),
'uploads/images/blog/interior-design-trends-2025/cover.jpg',
JSON_OBJECT('en', 'Sara El-Masry', 'ar', 'سارة المصري'),
'uploads/images/blog/authors/sara-el-masry.jpg',
'5 min', 1, '2025-04-27'),

(JSON_OBJECT('en', 'Egypt Real Estate Market Report Q1 2026', 'ar', 'تقرير سوق العقارات المصري الربع الأول 2026'),
'egypt-real-estate-q1-2026',
JSON_OBJECT('en', 'In-depth analysis of property prices, transactions, and emerging neighborhoods across Egypt.', 'ar', 'تحليل معمق لأسعار العقارات والمعاملات والأحياء الناشئة في جميع أنحاء مصر.'),
JSON_OBJECT('en', '', 'ar', ''),
JSON_OBJECT('en', 'Market Analysis', 'ar', 'تحليل السوق'),
JSON_OBJECT('en', JSON_ARRAY('Market', 'Investment'), 'ar', JSON_ARRAY('السوق', 'استثمار')),
'uploads/images/blog/egypt-real-estate-market-q1-2026/cover.jpg',
JSON_OBJECT('en', 'Youssef Kamal', 'ar', 'يوسف كمال'),
'uploads/images/blog/authors/youssef-kamal.jpg',
'8 min', 1, '2026-01-15'),

(JSON_OBJECT('en', 'Renovating Your Living Room: Expert Tips', 'ar', 'تجديد غرفة المعيشة: نصائح من الخبراء'),
'renovating-living-room-tips',
JSON_OBJECT('en', 'Top designers share practical advice on transforming your living space on a budget.', 'ar', 'أبرز المصممين يشاركون نصائح عملية لتحويل مساحة المعيشة بميزانية محدودة.'),
JSON_OBJECT('en', '', 'ar', ''),
JSON_OBJECT('en', 'Home Improvement', 'ar', 'تحسين المنزل'),
JSON_OBJECT('en', JSON_ARRAY('Renovation', 'Budget'), 'ar', JSON_ARRAY('تجديد', 'ميزانية')),
'uploads/images/blog/renovating-living-room-tips/cover.jpg',
JSON_OBJECT('en', 'Nour Ahmed', 'ar', 'نور أحمد'),
'uploads/images/blog/authors/nour-ahmed.jpg',
'6 min', 1, '2025-10-19'),

(JSON_OBJECT('en', 'Smart Home Systems: A Complete Guide', 'ar', 'أنظمة المنزل الذكي: دليل كامل'),
'smart-home-complete-guide',
JSON_OBJECT('en', 'Everything about integrating smart technology into your property — lighting, security, HVAC.', 'ar', 'كل ما تحتاج معرفته حول دمج التكنولوجيا الذكية في عقارك - الإضاءة، الأمن، التدفئة والتهوية.'),
JSON_OBJECT('en', '', 'ar', ''),
JSON_OBJECT('en', 'Technology', 'ar', 'التكنولوجيا'),
JSON_OBJECT('en', JSON_ARRAY('Smart Home', 'Tech'), 'ar', JSON_ARRAY('منزل ذكي', 'تقنية')),
'uploads/images/blog/smart-home-complete-guide/cover.jpg',
JSON_OBJECT('en', 'Ahmed Mostafa', 'ar', 'أحمد مصطفى'),
'uploads/images/blog/authors/ahmed-mostafa.jpg',
'7 min', 1, '2026-02-05'),

(JSON_OBJECT('en', 'Top 10 Family-Friendly Compounds in New Cairo', 'ar', 'أفضل 10 مجمعات صديقة للعائلة في القاهرة الجديدة'),
'family-compounds-new-cairo',
JSON_OBJECT('en', 'Comprehensive review of the best residential compounds for families in New Cairo.', 'ar', 'مراجعة شاملة لأفضل المجمعات السكنية المناسبة للعائلات.'),
JSON_OBJECT('en', '<p>New Cairo has become Egypt\'s premier destination for family living, offering modern compounds with excellent amenities and community-focused designs. Here are our top 10 picks:</p><h2>1. Mountain View IC</h2><p>A sprawling compound with international schools, multiple pools, and extensive green spaces perfect for families.</p><h2>2. Hyde Park</h2><p>Known for its British-inspired architecture and comprehensive facilities including sports clubs and shopping centers.</p><h2>3. Palm Hills</h2><p>Offers a mix of villas and apartments with excellent security and family-oriented amenities.</p><h2>4. The Village</h2><p>A gated community with golf courses, equestrian centers, and top-rated international schools.</p><h2>5. Cairo Festival City</h2><p>Modern urban living with direct access to schools, hospitals, and entertainment facilities.</p><p>Each of these compounds provides the perfect balance of privacy, community, and convenience for growing families.</p>', 'ar', '<p>أصبحت القاهرة الجديدة وجهة رائدة للمعيشة العائلية في مصر، حيث توفر مجمعات عصرية بمرافق ممتازة وتصاميم تركز على المجتمع. فيما يلي أفضل 10 اختيارات لدينا:</p><h2>1. ماونتن فيو IC</h2><p>مجمع واسع يضم مدارس دولية وحمامات سباحة متعددة ومساحات خضراء واسعة مثالية للعائلات.</p><h2>2. هايد بارك</h2><p>يشتهر بطابعه المعماري البريطاني ومرافقه المتكاملة بما في ذلك النوادي الرياضية ومراكز التسوق.</p><h2>3. بالم هيلز</h2><p>يوفر مزيجًا من الفيلات والشقق مع أمان ممتاز ومرافق موجهة للعائلات.</p><h2>4. ذا فيليدج</h2><p>مجتمع مسوّر يضم ملاعب غولف ومراكز للفروسية ومدارس دولية مرموقة.</p><h2>5. كايرو فيستيفال سيتي</h2><p>حياة حضرية حديثة مع وصول مباشر إلى مدارس ومستشفيات ومرافق ترفيهية.</p><p>توفر كل من هذه المجمعات التوازن المثالي بين الخصوصية والمجتمع والراحة للعائلات النامية.</p>'),
JSON_OBJECT('en', 'Lifestyle', 'ar', 'أسلوب الحياة'),
JSON_OBJECT('en', JSON_ARRAY('New Cairo', 'Family'), 'ar', JSON_ARRAY('القاهرة الجديدة', 'العائلة')),
'uploads/images/blog/family-compounds-new-cairo/cover.jpg',
JSON_OBJECT('en', 'Mona Hossam', 'ar', 'منى حسام'),
'uploads/images/blog/authors/mona-hossam.jpg',
'10 min', 1, '2026-03-12');

-- Default Site Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Homeverse'),
('site_description', 'The leading real estate marketplace in Egypt'),
('company_name', 'UFUQ Tech'),
('company_phone', '01015205654'),
('company_email', 'info@homeverse.com'),
('company_address', 'Cairo, Egypt'),
('facebook_url', 'https://facebook.com/homeverse'),
('twitter_url', 'https://twitter.com/homeverse'),
('instagram_url', 'https://instagram.com/homeverse'),
('linkedin_url', 'https://linkedin.com/company/homeverse');
