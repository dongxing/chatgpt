-- Flower Shop Database Initialization
-- This script runs automatically on first boot

USE flower_shop;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Note: Default admin user (admin/admin123) is created by the server on startup

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table (past work/portfolio)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    customer_feedback TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workshops table
CREATE TABLE IF NOT EXISTS workshops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_date DATE,
    price DECIMAL(10,2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Item images table for multi-image support
CREATE TABLE IF NOT EXISTS item_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_type ENUM('product', 'service', 'workshop', 'project') NOT NULL,
    item_id INT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_item (item_type, item_id)
);

-- Testimonials table for homepage
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_title VARCHAR(255),
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products with descriptions
INSERT INTO products (name, price, category, description, image_url) VALUES
('Elegant Rose Bouquet', 89.99, 'Hand-Flower', 'A stunning arrangement of premium long-stem roses in soft pink and cream hues. Perfect for anniversaries, birthdays, or to brighten someone\'s day. Each bouquet includes 12 hand-selected roses with fresh eucalyptus accents and elegant wrapping.', '/assets/images/img_1.svg'),
('Spring Garden Mix', 65.00, 'Hand-Flower', 'Celebrate the beauty of spring with this vibrant mix of seasonal flowers including tulips, daffodils, hyacinths, and ranunculus. A cheerful arrangement that brings the garden indoors with its fresh fragrance and colorful blooms.', '/assets/images/img_2.svg'),
('Romantic Red Roses', 120.00, 'Hand-Flower', 'Express your deepest love with two dozen premium red roses. These classic beauties are hand-arranged with baby\'s breath and lush greenery, wrapped in elegant paper with a satin ribbon. The ultimate romantic gesture.', '/assets/images/img_3.svg'),
('Wedding Centerpiece', 150.00, 'ROM', 'Elegant low centerpiece designed for wedding receptions. Features white roses, peonies, and soft greenery arranged in a gold geometric vessel. Creates a romantic atmosphere while allowing guests to converse across the table.', '/assets/images/img_4.svg'),
('Bridal Bouquet Classic', 180.00, 'ROM', 'Timeless bridal bouquet featuring white garden roses, ranunculus, and touches of eucalyptus. Hand-tied with silk ribbon and carefully designed to photograph beautifully from every angle. Includes matching boutonniere for the groom.', '/assets/images/sq_img_1.svg'),
('Anniversary Special', 95.00, 'Hand-Flower', 'Mark your special milestone with this luxurious arrangement of roses in graduated shades from blush to deep burgundy. Symbolizing the deepening of love over time, this bouquet is a meaningful way to celebrate years together.', '/assets/images/sq_img_2.svg'),
('Sunflower Delight', 55.00, 'Hand-Flower', 'Bring sunshine into any room with this cheerful arrangement of bright sunflowers mixed with golden solidago and rustic wheat accents. A happy, uplifting gift that\'s perfect for congratulations, get well wishes, or just because.', '/assets/images/sq_img_3.svg'),
('Orchid Elegance', 135.00, 'ROM', 'Sophisticated phalaenopsis orchid plant in a ceramic designer pot. These long-lasting blooms can flower for months with proper care. Includes care instructions. Available in white, purple, or pink.', '/assets/images/sq_img_4.svg');

-- Insert sample services
INSERT INTO services (title, description, image_url) VALUES
('Wedding Decorations', 'Transform your special day with our stunning floral arrangements. We provide complete wedding decoration services including altar pieces, table centerpieces, bridal party bouquets, and venue styling. Our expert team works with you to create a cohesive floral design that matches your wedding theme and personal style.', '/assets/images/img_1.svg'),
('Event Styling', 'Professional floral styling for corporate events, birthdays, anniversaries, and special occasions. Our team creates memorable experiences through beautiful arrangements. From intimate gatherings to grand celebrations, we handle events of all sizes with attention to detail and creative flair.', '/assets/images/img_2.svg'),
('Custom Arrangements', 'Personalized flower arrangements designed to match your vision. Tell us your preferences, color palette, favorite flowers, and the occasion, and we will create something unique and beautiful. Perfect for those who want something truly one-of-a-kind.', '/assets/images/img_4.svg'),
('Flower Subscriptions', 'Fresh flowers delivered to your home or office on a weekly or monthly basis. Brighten your space with seasonal blooms curated by our expert florists. Choose from various sizes and styles to fit your space and budget. Pause or cancel anytime.', '/assets/images/img_5.svg'),
('Same Day Delivery', 'Need flowers in a hurry? Our same day delivery service ensures your beautiful bouquet arrives fresh and on time. Order by 2pm for same day delivery within our service area. Perfect for last-minute gifts and surprises.', '/assets/images/sq_img_3.svg'),
('Gift Wrapping', 'Premium gift wrapping service to make your floral gift extra special. Choose from our selection of ribbons, papers, and finishing touches including handwritten cards, chocolate boxes, and plush toys.', '/assets/images/sq_img_5.svg');

-- Insert sample workshops
INSERT INTO workshops (title, description, schedule_date, price, image_url) VALUES
('Beginner Flower Arranging', 'Learn the basics of floral design in this hands-on workshop. Perfect for beginners who want to create beautiful arrangements at home. You\'ll learn flower selection, color theory, basic techniques, and take home your own creation. All materials included.', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 75.00, '/assets/images/img_2.svg'),
('Wedding Bouquet Masterclass', 'Create your own wedding bouquet with guidance from our expert florists. This intensive workshop covers bridal bouquet techniques, flower preparation, and finishing touches. Take home your creation and the skills to make more. Perfect for DIY brides.', DATE_ADD(CURDATE(), INTERVAL 21 DAY), 150.00, '/assets/images/img_3.svg'),
('Seasonal Wreath Making', 'Design a stunning seasonal wreath using fresh flowers and foliage. Perfect for decorating your home or as a thoughtful handmade gift. Learn wire techniques, flower placement, and how to create a balanced design. All materials provided.', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 95.00, '/assets/images/sq_img_1.svg'),
('Kids Flower Fun', 'A fun and creative workshop for children aged 6-12. Kids will learn basic arranging skills and create their own mini bouquet to take home. Our patient instructors make learning fun and engaging. Parents welcome to stay and watch.', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 45.00, '/assets/images/sq_img_4.svg'),
('Corporate Team Building', 'Bring your team together for a creative floral workshop. Build connections while learning new skills in a relaxed environment. We can customize the workshop to include company colors or themes. Catering options available.', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 65.00, '/assets/images/sq_img_2.svg');

-- Insert sample projects
INSERT INTO projects (title, description, customer_feedback, image_url) VALUES
('Sarah & Michael\'s Wedding', 'Complete floral decoration for a beautiful garden wedding at Rosewood Estate. We provided altar arrangements featuring white roses and cascading greenery, table centerpieces with candles, bridal party bouquets, boutonnieres, and extensive venue styling including a stunning floral arch.', 'The flowers were absolutely stunning! Everyone commented on how beautiful the arrangements were. Thank you for making our day so special! The attention to detail was incredible.', '/assets/images/img_1.svg'),
('Corporate Gala Night', 'Elegant floral installations for TechCorp\'s annual corporate gala at the Grand Ballroom. Large statement pieces in the foyer, sophisticated table arrangements in company colors, and a branded photo backdrop with fresh flowers created a memorable atmosphere for 500 guests.', 'Professional service from start to finish. The team understood our vision perfectly and delivered beyond expectations. Our executives were impressed with the quality.', '/assets/images/img_4.svg'),
('Anniversary Celebration', 'Romantic rose installations for a 25th wedding anniversary party at a private residence. Red and white roses throughout the venue created a timeless elegant look. Special features included a rose petal pathway, hanging installations, and a custom cake table arrangement.', 'My wife was in tears when she saw the beautiful flowers. Thank you for helping us celebrate 25 amazing years! The roses were perfect and the fragrance was incredible.', '/assets/images/sq_img_2.svg'),
('Spring Fashion Show', 'Floral runway decorations and backstage arrangements for Milano Fashion Week showcase. Fresh seasonal flowers complemented the spring collection perfectly. We created botanical installations along the runway, designed model gift bouquets, and provided fresh arrangements for VIP seating areas.', 'The floral elements added the perfect finishing touch to our show. Creative, professional, and delivered on a tight deadline. We will definitely work together again.', '/assets/images/sq_img_5.svg');

-- Insert sample item images for multi-image gallery demo
INSERT INTO item_images (item_type, item_id, image_url, alt_text, sort_order) VALUES
-- Product 1 images
('product', 1, '/assets/images/img_1.svg', 'Elegant rose bouquet front view', 1),
('product', 1, '/assets/images/img_2.svg', 'Rose bouquet detail shot', 2),
('product', 1, '/assets/images/img_3.svg', 'Rose bouquet with ribbon', 3),
-- Product 2 images
('product', 2, '/assets/images/img_2.svg', 'Spring garden mix arrangement', 1),
('product', 2, '/assets/images/sq_img_1.svg', 'Spring flowers close-up', 2),
-- Service 1 images
('service', 1, '/assets/images/img_1.svg', 'Wedding ceremony altar flowers', 1),
('service', 1, '/assets/images/img_4.svg', 'Wedding reception centerpiece', 2),
('service', 1, '/assets/images/sq_img_2.svg', 'Bridal table arrangement', 3),
-- Workshop 1 images
('workshop', 1, '/assets/images/img_2.svg', 'Flower arranging workshop in progress', 1),
('workshop', 1, '/assets/images/sq_img_3.svg', 'Students creating arrangements', 2),
-- Project 1 images
('project', 1, '/assets/images/img_1.svg', 'Wedding ceremony setup', 1),
('project', 1, '/assets/images/img_3.svg', 'Bridal bouquet detail', 2),
('project', 1, '/assets/images/sq_img_1.svg', 'Reception table setting', 3),
('project', 1, '/assets/images/sq_img_2.svg', 'Venue entrance flowers', 4);

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_title, content, rating, image_url, is_featured) VALUES
('Emily Chen', 'Bride', 'Bloom & Petal made my wedding day absolutely magical. The floral arrangements were beyond what I imagined - elegant, fragrant, and perfectly matched our garden theme. The team was professional and responsive throughout the planning process.', 5, '/assets/images/sq_img_1.svg', TRUE),
('Marcus Thompson', 'Event Coordinator, TechCorp', 'We have been using Bloom & Petal for our corporate events for three years now. Their reliability and creativity are unmatched. They always deliver stunning arrangements that impress our clients and guests.', 5, '/assets/images/sq_img_2.svg', TRUE),
('Jennifer Williams', 'Regular Customer', 'I signed up for the monthly flower subscription and it has been the best decision! Fresh, beautiful blooms arrive at my door and brighten my home. The variety keeps me excited each month.', 5, '/assets/images/sq_img_3.svg', TRUE),
('David Park', 'Anniversary Celebrant', 'Ordered flowers for our 10th anniversary and was blown away by the quality. The roses were fresh and lasted over two weeks. Will definitely order again for all special occasions.', 5, '/assets/images/sq_img_4.svg', FALSE),
('Lisa Rodriguez', 'Workshop Attendee', 'Took the beginner flower arranging workshop and had so much fun! The instructors were patient and knowledgeable. I went home with skills and a beautiful arrangement.', 4, '/assets/images/sq_img_5.svg', FALSE);
