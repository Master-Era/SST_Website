CREATE DATABASE IF NOT EXISTS shreeji_trust_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shreeji_trust_db;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150),
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('super_admin','admin','editor') DEFAULT 'editor',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (name, username, password_hash, role, status)
VALUES ('Super Admin', 'superadmin', 'sha256:c36a8214c0e7623f6c738edb54632a903e1e003c1b7fcfd37f27f54a76ffc491', 'super_admin', 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), status = VALUES(status);

CREATE TABLE IF NOT EXISTS content_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  module VARCHAR(80),
  section VARCHAR(120),
  title VARCHAR(255),
  short_text TEXT,
  content TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  pdf_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  status ENUM('active','draft','hidden') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY,
  email1 VARCHAR(150),
  email2 VARCHAR(150),
  email3 VARCHAR(150),
  bank_details TEXT,
  upi_id VARCHAR(150),
  upi_qr VARCHAR(500),
  donation_categories TEXT
);

INSERT INTO settings (id, email1, email2, email3, donation_categories)
VALUES (1, '', '', '', 'General, Annadan, Gaushala')
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  title_guj VARCHAR(200),
  description TEXT,
  description_guj TEXT,
  event_date DATE NOT NULL,
  event_type VARCHAR(100),
  image_url VARCHAR(300),
  status ENUM('upcoming','completed','cancelled') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(160) UNIQUE NOT NULL,
  category ENUM('Latest News','Upcoming Announcements','Press Release','Important Notices') NOT NULL,
  title VARCHAR(220) NOT NULL,
  news_date DATE,
  news_time VARCHAR(30),
  location VARCHAR(200),
  author VARCHAR(150),
  description TEXT,
  banner_image VARCHAR(300),
  gallery_images JSON,
  video_url VARCHAR(300),
  news_link VARCHAR(300),
  pdf_url VARCHAR(300),
  is_visible TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(300) NOT NULL,
  title VARCHAR(200),
  utsav_name VARCHAR(150),
  image_date DATE,
  description TEXT,
  is_visible TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  part_key VARCHAR(80) NOT NULL,
  part_title VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  image_urls JSON,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hari_bhakto (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  father_husband_name VARCHAR(150),
  mobile VARCHAR(15) NOT NULL,
  whatsapp VARCHAR(15),
  email VARCHAR(100),
  gender ENUM('Male','Female','Other'),
  date_of_birth DATE,
  age INT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  family_members INT,
  occupation VARCHAR(100),
  education VARCHAR(100),
  satsang_attend TINYINT(1) DEFAULT 0,
  seva_gaushala TINYINT(1) DEFAULT 0,
  seva_anna_dan TINYINT(1) DEFAULT 0,
  seva_vastra_dan TINYINT(1) DEFAULT 0,
  seva_gurukul TINYINT(1) DEFAULT 0,
  seva_mandir TINYINT(1) DEFAULT 0,
  seva_utsav TINYINT(1) DEFAULT 0,
  blood_group VARCHAR(10),
  emergency_contact VARCHAR(15),
  photo_url VARCHAR(300),
  photo_data MEDIUMTEXT,
  id_proof_url VARCHAR(300),
  remarks TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'Connected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donor_name VARCHAR(150),
  mobile VARCHAR(15),
  email VARCHAR(100),
  seva_type VARCHAR(100),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  receipt_number VARCHAR(50),
  receipt_issued TINYINT(1) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inquiry_type ENUM('contact','gurukul','donation','general') DEFAULT 'contact',
  full_name VARCHAR(150) NOT NULL,
  mobile VARCHAR(15),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT,
  status ENUM('new','contacted','completed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_key VARCHAR(100) UNIQUE NOT NULL,
  content_data JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donation_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  name_guj VARCHAR(150),
  description TEXT,
  bank_name VARCHAR(150),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(20),
  upi_id VARCHAR(100),
  qr_image_url VARCHAR(300),
  is_active TINYINT(1) DEFAULT 1
);

INSERT INTO events (title, title_guj, description, event_date, event_type, status)
VALUES
  ('Janmashtami Mahotsav', 'જન્માષ્ટમી મહોત્સવ', 'Bhajan, kirtan and mahaprasad.', '2026-08-15', 'Utsav', 'upcoming'),
  ('Annakut Darshan', 'અન્નકૂટ દર્શન', 'Diwali Annakut darshan and thal.', '2026-11-10', 'Utsav', 'upcoming')
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO news (slug, category, title, news_date, news_time, location, author, description, banner_image, gallery_images, video_url, news_link, pdf_url)
VALUES
  ('new-seva-start', 'Latest News', 'New Seva Start', '2026-07-05', '09:00 AM', 'Shreeji Samipya Mandir Campus', 'Shreeji Samipya Trust', 'A new seva activity has started for haribhakto and nearby families.', '/images/news-seva.jpg', JSON_ARRAY('/images/news-seva-1.jpg', '/images/news-seva-2.jpg'), NULL, NULL, NULL),
  ('new-project-start', 'Latest News', 'New Project Start', '2026-07-12', '10:30 AM', 'Hari Tirth Aashram', 'Project Team', 'A new project is being planned for mandir seva and social support.', '/images/news-project.jpg', JSON_ARRAY('/images/news-project-1.jpg', '/images/news-project-2.jpg'), NULL, NULL, NULL),
  ('events-update', 'Latest News', 'Events Updates', '2026-07-18', '06:00 PM', 'Sabha Hall', 'Events Team', 'Upcoming mandir events and seva gatherings are updated.', '/images/news-events.jpg', JSON_ARRAY('/images/news-events-1.jpg', '/images/news-events-2.jpg'), NULL, NULL, NULL),
  ('upcoming-announcement-yatra', 'Upcoming Announcements', 'Yatra Announcement', '2026-08-02', '07:00 AM', 'Mandir Parking Area', 'Yatra Committee', 'Yatra planning, reporting time and seva instructions.', '/images/news-yatra.jpg', JSON_ARRAY('/images/news-yatra-1.jpg', '/images/news-yatra-2.jpg'), NULL, NULL, NULL),
  ('press-release-seva', 'Press Release', 'Seva Press Release', '2026-08-09', '11:00 AM', 'Local Newspaper', 'Media Desk', 'Newspaper image and news link area for trust announcements.', '/images/news-press.jpg', JSON_ARRAY('/images/news-press-1.jpg'), NULL, 'https://example.com/news', NULL),
  ('important-notice-darshan-time', 'Important Notices', 'Pujan and Darshan Time Notice', '2026-08-15', '05:30 AM', 'Mandir', 'Admin Office', 'Important notice for pujan, darshan timing, yatra pamphlet and PDF upload records.', '/images/news-notice.jpg', JSON_ARRAY('/images/news-notice-1.jpg'), NULL, NULL, '/notice.pdf')
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  title = VALUES(title),
  news_date = VALUES(news_date),
  news_time = VALUES(news_time),
  location = VALUES(location),
  author = VALUES(author),
  description = VALUES(description),
  banner_image = VALUES(banner_image),
  gallery_images = VALUES(gallery_images),
  video_url = VALUES(video_url),
  news_link = VALUES(news_link),
  pdf_url = VALUES(pdf_url),
  is_visible = 1;

INSERT INTO activities (slug, part_key, part_title, title, description, image_urls, sort_order)
VALUES
  ('blood-donation', 'community-service', 'Activity', 'Blood Donation', 'Blood donation camps connect donors, volunteers and medical teams for lifesaving seva. The trust manages awareness, registration and follow-up support.', JSON_ARRAY('/images/activity-blood-1.jpg', '/images/activity-blood-2.jpg', '/images/activity-blood-3.jpg', '/images/activity-blood-4.jpg'), 1),
  ('health-care', 'community-service', 'Activity', 'Health Care', 'Health care activity includes checkup camps, basic medical guidance, awareness sessions and referral support for families.', JSON_ARRAY('/images/activity-health-1.jpg', '/images/activity-health-2.jpg', '/images/activity-health-3.jpg', '/images/activity-health-4.jpg'), 2),
  ('educate-child', 'community-service', 'Activity', 'Educate Child', 'Education support helps children with learning material, guidance, values and encouragement for a better future.', JSON_ARRAY('/images/activity-education-1.jpg', '/images/activity-education-2.jpg', '/images/activity-education-3.jpg', '/images/activity-education-4.jpg'), 3),
  ('social-help-relief', 'community-service', 'Activity', 'Social Help / Relief', 'Social help and relief seva supports people during difficult times through essentials, coordination and volunteer care.', JSON_ARRAY('/images/activity-relief-1.jpg', '/images/activity-relief-2.jpg', '/images/activity-relief-3.jpg', '/images/activity-relief-4.jpg'), 4),
  ('food-distribute', 'community-service', 'Activity', 'Food Distribute', 'Food distribution seva provides prasadi and meals for devotees, visitors and families with cleanliness and dignity.', JSON_ARRAY('/images/activity-food-1.jpg', '/images/activity-food-2.jpg', '/images/activity-food-3.jpg', '/images/activity-food-4.jpg'), 5),
  ('environment-care', 'community-service', 'Activity', 'Environment Care', 'Environment care includes cleanliness drives, awareness, campus maintenance and responsible community participation.', JSON_ARRAY('/images/activity-environment-1.jpg', '/images/activity-environment-2.jpg', '/images/activity-environment-3.jpg', '/images/activity-environment-4.jpg'), 6),
  ('weekly-sabha', 'social-care', 'Social Care', 'Weekly Sabha', 'Weekly sabha brings devotees together for katha, kirtan, dhun, discussion and seva planning in a disciplined satsang atmosphere.', JSON_ARRAY('/images/activity-sabha-1.jpg', '/images/activity-sabha-2.jpg', '/images/activity-sabha-3.jpg', '/images/activity-sabha-4.jpg'), 7),
  ('youth-activity', 'social-care', 'Social Care', 'Youth Activity', 'Youth activities build leadership, discipline, seva bhav and spiritual confidence through group programs and learning sessions.', JSON_ARRAY('/images/activity-youth-1.jpg', '/images/activity-youth-2.jpg', '/images/activity-youth-3.jpg', '/images/activity-youth-4.jpg'), 8),
  ('tirth-yatra', 'social-care', 'Social Care', 'Tirth Yatra', 'Tirth yatra connects devotees with sacred places, history, darshan and group satsang, managed with planning and care.', JSON_ARRAY('/images/activity-yatra-1.jpg', '/images/activity-yatra-2.jpg', '/images/activity-yatra-3.jpg', '/images/activity-yatra-4.jpg'), 9)
ON DUPLICATE KEY UPDATE
  part_key = VALUES(part_key),
  part_title = VALUES(part_title),
  title = VALUES(title),
  description = VALUES(description),
  image_urls = VALUES(image_urls),
  sort_order = VALUES(sort_order),
  is_active = 1;

INSERT INTO donation_categories (name, name_guj, description, bank_name, account_number, ifsc_code, upi_id)
VALUES
  ('Gaushala Seva', 'ગૌશાળા સેવા', 'Daily fodder and cow care seva.', 'Your Bank Name', '0000000000', 'BANK0000000', 'shreeji@upi'),
  ('Anna Dan', 'અન્ન દાન', 'Food seva and prasadi support.', 'Your Bank Name', '0000000000', 'BANK0000000', 'shreeji@upi')
ON DUPLICATE KEY UPDATE name = VALUES(name);
