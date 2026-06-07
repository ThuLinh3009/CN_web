-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: bookstore_web
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book_attributes`
--

DROP TABLE IF EXISTS `book_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_attributes`
--

LOCK TABLES `book_attributes` WRITE;
/*!40000 ALTER TABLE `book_attributes` DISABLE KEYS */;
INSERT INTO `book_attributes` VALUES (1,'Nhà xuất bản',0),(2,'Năm xuất bản',0),(3,'Số trang',0),(4,'Kích thước',0),(5,'ISBN',0);
/*!40000 ALTER TABLE `book_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_details`
--

DROP TABLE IF EXISTS `book_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_details` (
  `book_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`book_id`,`attribute_id`),
  KEY `attribute_id` (`attribute_id`),
  CONSTRAINT `book_details_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `book_details_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `book_attributes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_details`
--

LOCK TABLES `book_details` WRITE;
/*!40000 ALTER TABLE `book_details` DISABLE KEYS */;
INSERT INTO `book_details` VALUES (1,1,'NXB Kim Đồng',NULL),(1,2,'2020',NULL),(1,3,'250',NULL),(2,1,'NXB Trẻ',NULL),(2,2,'2019',NULL),(2,3,'312',NULL),(10,1,'NXB Tổng Hợp TP.HCM',NULL),(10,2,'2021',NULL),(10,3,'228',NULL),(15,1,'Alpha Books',NULL),(15,2,'2018',NULL),(15,3,'336',NULL),(19,1,'NXB Tổng Hợp TP.HCM',NULL),(19,2,'2017',NULL),(19,3,'320',NULL);
/*!40000 ALTER TABLE `book_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint DEFAULT '1',
  `is_deleted` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,1,'Dế Mèn Phiêu Lưu Ký','Tô Hoài',43,'ma1.jpg','Câu chuyện phiêu lưu của chú Dế Mèn dũng cảm qua nhiều vùng đất xa lạ.',1,0,'2026-05-19 23:53:40'),(2,1,'Truyện Kiều','Nguyễn Du',40,'ma2.jpg','Tác phẩm thơ chữ Nôm nổi tiếng nhất của văn học Việt Nam cổ điển.',1,0,'2026-05-19 23:53:40'),(3,1,'Số Đỏ','Vũ Trọng Phụng',35,'vh-tn2.jfif','Tiểu thuyết châm biếm xã hội thượng lưu Hà Nội thời Pháp thuộc.',1,0,'2026-05-19 23:53:40'),(4,1,'Tắt Đèn','Ngô Tất Tố',30,'vh-tn3.jfif','Tác phẩm hiện thực phê phán về cuộc sống người nông dân.',1,0,'2026-05-19 23:53:40'),(5,1,'Lão Hạc','Nam Cao',45,'vh-tn4.jfif','Truyện ngắn xúc động về người nông dân nghèo khổ và tình yêu với con chó.',1,0,'2026-05-19 23:53:40'),(6,1,'Tuổi Thơ Dữ Dội','Phùng Quán',25,'vh-tn5.jfif','Tiểu thuyết về những thiếu niên anh hùng trong kháng chiến chống Pháp.',1,0,'2026-05-19 23:53:40'),(7,1,'Đất Rừng Phương Nam','Đoàn Giỏi',30,'vh-tn6.jfif','Câu chuyện phiêu lưu của cậu bé An trên vùng đất phương Nam.',1,0,'2026-05-19 23:53:40'),(8,1,'Tôi Thấy Hoa Vàng Trên Cỏ Xanh','Nguyễn Nhật Ánh',60,'vh-tn7.jfif','Câu chuyện tuổi thơ đầy cảm xúc của hai anh em ở miền quê.',1,0,'2026-05-19 23:53:40'),(9,2,'Những Người Khốn Khổ','Victor Hugo',40,'vh-nn1.jfif','Tác phẩm vĩ đại của Victor Hugo về lòng nhân ái và bất công xã hội.',1,0,'2026-05-19 23:53:40'),(10,2,'Nhà Giả Kim','Paulo Coelho',55,'vh-nn2.jfif','Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.',1,0,'2026-05-19 23:53:40'),(11,2,'1984','George Orwell',30,'vh-nn3.jfif','Tiểu thuyết dystopia kinh điển về chế độ toàn trị tương lai.',1,0,'2026-05-19 23:53:40'),(12,2,'Harry Potter và Hòn Đá Phù Thủy','J.K. Rowling',70,'vh-nn4.jfif','Cuốn sách đầu tiên trong series Harry Potter huyền thoại.',1,0,'2026-05-19 23:53:40'),(13,2,'Bố Già','Mario Puzo',25,'vh-nn5.jfif','Tiểu thuyết nổi tiếng về gia tộc mafia Corleone ở Mỹ.',1,0,'2026-05-19 23:53:40'),(14,2,'Cuốn Theo Chiều Gió','Margaret Mitchell',20,'ma11.jpg','Tiểu thuyết lãng mạn sử thi về cuộc Nội chiến Mỹ.',1,0,'2026-05-19 23:53:40'),(15,3,'Cha Giàu Cha Nghèo','Robert Kiyosaki',80,'ma3.jpg','Sách về tư duy tài chính và đầu tư từ góc nhìn thực tiễn.',1,0,'2026-05-19 23:53:40'),(16,3,'Nhà Đầu Tư Thông Minh','Benjamin Graham',30,'kinh-te1.png','Kinh thánh về đầu tư giá trị của huyền thoại Benjamin Graham.',1,0,'2026-05-19 23:53:40'),(17,3,'Tư Duy Nhanh Và Chậm','Daniel Kahneman',25,'kinh-te2.jfif','Khám phá hai hệ thống tư duy ảnh hưởng đến quyết định của con người.',1,0,'2026-05-19 23:53:40'),(18,3,'Kinh Tế Học','Paul Samuelson',15,'kinh-te3.jpg','Giáo trình kinh tế học cơ bản của nhà kinh tế học đoạt Nobel.',1,0,'2026-05-19 23:53:40'),(19,4,'Đắc Nhân Tâm','Dale Carnegie',100,'ma4.jpg','Sách kỹ năng giao tiếp và xây dựng mối quan hệ nổi tiếng nhất mọi thời đại.',1,0,'2026-05-19 23:53:40'),(20,4,'7 Thói Quen Hiệu Quả','Stephen Covey',45,'ptbt2.jfif','Bảy thói quen giúp bạn trở thành người thành công và hạnh phúc.',1,0,'2026-05-19 23:53:40'),(21,4,'Dám Bị Ghét','Ichiro Kishimi & Fumitake Koga',55,'ptbt3.png','Triết học Adler về cách sống tự do và hạnh phúc.',1,0,'2026-05-19 23:53:40'),(22,4,'Sức Mạnh Của Thói Quen','Charles Duhigg',40,'ptbt5.png','Khoa học về việc hình thành và thay đổi thói quen trong cuộc sống.',1,0,'2026-05-19 23:53:40'),(23,5,'Kính Vạn Hoa','Nguyễn Nhật Ánh',59,'thieu-nhi2.jfif','Bộ truyện dài về tình bạn tuổi học trò đầy sắc màu.',1,0,'2026-05-19 23:53:40'),(24,5,'Alice Ở Xứ Sở Thần Tiên','Lewis Carroll',35,'thieu-nhi3.jfif','Câu chuyện phiêu lưu kỳ diệu của cô bé Alice.',1,0,'2026-05-19 23:53:40'),(25,5,'Hoàng Tử Bé','Antoine de Saint-Exupéry',49,'thieu-nhi4.jfif','Tác phẩm bất hủ về tình bạn, tình yêu và ý nghĩa cuộc sống.',1,0,'2026-05-19 23:53:40'),(26,6,'Python Cơ Bản','Nguyễn Văn Hiệp',40,'ma5.jpg','Hướng dẫn lập trình Python từ cơ bản đến nâng cao.',1,0,'2026-05-19 23:53:40'),(27,6,'Code Dạo Ký Sự','Phạm Huy Hoàng',30,'tinhoc2.jfif','Những câu chuyện thú vị từ công việc lập trình hàng ngày.',1,0,'2026-05-19 23:53:40'),(28,6,'Clean Code','Robert C. Martin',24,'tinhoc3.jfif','Hướng dẫn viết code sạch và dễ bảo trì.',1,0,'2026-05-19 23:53:40'),(29,6,'Học SQL Qua Ví Dụ','Nguyễn Anh Tú',34,'tinhoc4.jfif','Hướng dẫn thực hành SQL từ cơ bản đến nâng cao.',1,0,'2026-05-19 23:53:40'),(30,6,'JavaScript: The Good Parts','Douglas Crockford',20,'tinhoc8.jfif','Tinh hoa của ngôn ngữ JavaScript.',1,0,'2026-05-19 23:53:40'),(31,7,'Ngữ Văn 12','Bộ GD&ĐT',200,'giaotrinh1.jfif','Sách giáo khoa Ngữ Văn lớp 12.',1,0,'2026-05-19 23:53:40'),(32,7,'Toán Đại Số & Hình Học 12','Bộ GD&ĐT',200,'giaotrinh2.jfif','Sách giáo khoa Toán lớp 12.',1,0,'2026-05-19 23:53:40'),(33,7,'Kinh Tế Vi Mô','N. Gregory Mankiw',50,'giaotrinh6.jfif','Giáo trình kinh tế vi mô cho sinh viên đại học.',1,0,'2026-05-19 23:53:40'),(34,8,'Bước Chậm Lại Giữa Thế Gian Vội Vã','Haemin Sunim',65,'doi-song1.jfif','Những triết lý sống nhẹ nhàng và sâu sắc từ thiền sư Hàn Quốc.',1,0,'2026-05-19 23:53:40'),(35,8,'Đời Ngắn Đừng Ngủ Dài','Robin Sharma',45,'doi-song2.jfif','Hướng dẫn sống trọn vẹn từng ngày và đạt được tiềm năng tối đa.',1,0,'2026-05-19 23:53:40'),(36,8,'Muôn Kiếp Nhân Sinh','Brian Weiss',49,'doi-song6.jfif','Hành trình khám phá tiền kiếp và ý nghĩa của linh hồn.',1,0,'2026-05-19 23:53:40'),(37,8,'Tâm Lý Học Đám Đông','Gustave Le Bon',30,'ma8.jpg','Phân tích tâm lý tập thể và hành vi của đám đông.',1,0,'2026-05-19 23:53:40'),(38,9,'ChatGPT & Trí Tuệ Nhân Tạo','Nguyễn Thanh Bình',39,'moi20251.jfif','Hướng dẫn sử dụng AI và ChatGPT trong công việc và học tập.',1,0,'2026-05-19 23:53:40'),(39,9,'Xây Dựng Thương Hiệu Cá Nhân 2025','Phạm Tiến Đạt',35,'moi20252.jfif','Chiến lược xây dựng thương hiệu cá nhân trong thời đại số.',1,0,'2026-05-19 23:53:40'),(40,6,'5000 Từ Vựng English','Nguyễn Thị Loan',57,'ma6.jpg','Bộ sách từ vựng tiếng Anh cho người học mọi cấp độ.',1,0,'2026-05-19 23:53:40');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `lot_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_lot` (`cart_id`,`lot_id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`lot_id`) REFERENCES `import_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,10,1),(2,1,19,2);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,3,'2026-05-19 23:53:40'),(2,2,'2026-05-20 00:02:11'),(3,1,'2026-05-20 11:08:43'),(4,4,'2026-06-07 19:52:20');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Văn học trong nước','Tác phẩm văn học của các tác giả Việt Nam',1),(2,'Văn học nước ngoài','Tác phẩm văn học dịch từ nước ngoài',1),(3,'Kinh tế','Sách về kinh tế, tài chính, kinh doanh',1),(4,'Phát triển bản thân','Sách kỹ năng sống và phát triển bản thân',1),(5,'Thiếu nhi','Sách dành cho trẻ em và thiếu niên',1),(6,'Tin học','Sách lập trình, công nghệ thông tin',1),(7,'Giáo khoa - Giáo trình','Sách giáo khoa và giáo trình đại học',1),(8,'Đời sống','Sách về lối sống, sức khỏe, tâm lý',1),(9,'Sách Mới 2025','Sách mới xuất bản năm 2025',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Nguyễn Văn Bình','binh@gmail.com','0901234567','Tôi muốn hỏi về chính sách đổi trả sách?',0,'2026-05-19 23:53:40'),(2,'Phạm Thị Lan','lan@gmail.com','0912345678','Shop có giao hàng đến Cần Thơ không?',1,'2026-05-19 23:53:40'),(3,'Hoàng Minh Tuấn','tuan@gmail.com','0923456789','Sách Harry Potter còn hàng không ạ?',0,'2026-05-19 23:53:40');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` tinyint DEFAULT '1',
  `is_active` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Trần Thị Mai','mai.tran','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','mai@gmail.com','0912222333','Hà Nội',0,1,'2026-05-19 23:53:40'),(2,'Lê Văn An','le.an','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','an@gmail.com','0933444555','TP HCM',1,1,'2026-05-19 23:53:40'),(3,'Nguyễn Thị Hoa','hoa.nguyen','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','hoa@gmail.com','0944555666','Đà Nẵng',0,1,'2026-05-19 23:53:40'),(4,'Mai Hoàng Anh','hoanganh','$2a$10$22zWn3QfJEaJ7aeZ9r88be9zEKwXkaOaLQBRirUtE2WgpJyzURymC','hoanganh123@gmail.com','0368975773','Hà Nội',1,1,'2026-06-07 19:51:58');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL DEFAULT '2',
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` tinyint DEFAULT '1' COMMENT '1=Nam, 0=Nu',
  `birth_date` date DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,1,'Quản Trị Viên','admin','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','admin@tbook.vn','0399975455','Dân Tiến, Khoái Châu, Hưng Yên',1,'1990-01-01',1),(2,2,'Đoàn Thị Thu Linh','linhnv','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','linh@tbook.vn','0987654321','Hưng Yên',0,'1999-03-09',1),(3,2,'Nguyễn Văn Hùng','hungnv','$2a$10$8HAIHnXGiKK6ZeDiFLGCOOzmUo7boOIIvLTKoNG2nzKZLlcc.f2fa','hung@tbook.vn','0912345678','Hà Nội',1,'1998-05-15',1);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_lots`
--

DROP TABLE IF EXISTS `import_lots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_lots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `quantity` int DEFAULT '0',
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `import_lots_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_lots`
--

LOCK TABLES `import_lots` WRITE;
/*!40000 ALTER TABLE `import_lots` DISABLE KEYS */;
INSERT INTO `import_lots` VALUES (1,1,50,'A1','Lô nhập đầu tiên'),(2,2,40,'A2',NULL),(3,3,35,'A3',NULL),(4,4,30,'A4',NULL),(5,5,45,'A5',NULL),(6,6,25,'B1',NULL),(7,7,30,'B2',NULL),(8,8,60,'B3',NULL),(9,9,40,'B4',NULL),(10,10,55,'B5',NULL),(11,11,30,'C1',NULL),(12,12,70,'C2',NULL),(13,13,25,'C3',NULL),(14,14,20,'C4',NULL),(15,15,80,'D1',NULL),(16,16,30,'D2',NULL),(17,17,25,'D3',NULL),(18,18,15,'D4',NULL),(19,19,100,'E1',NULL),(20,20,45,'E2',NULL),(21,21,55,'E3',NULL),(22,22,40,'E4',NULL),(23,23,59,'F1',NULL),(24,24,35,'F2',NULL),(25,25,49,'F3',NULL),(26,26,40,'G1',NULL),(27,27,30,'G2',NULL),(28,28,24,'G3',NULL),(29,29,34,'G4',NULL),(30,30,20,'G5',NULL),(31,31,200,'H1',NULL),(32,32,200,'H2',NULL),(33,33,50,'H3',NULL),(34,34,65,'I1',NULL),(35,35,45,'I2',NULL),(36,36,49,'I3',NULL),(37,37,30,'I4',NULL),(38,38,39,'J1',NULL),(39,39,35,'J2',NULL),(40,40,57,'J3',NULL);
/*!40000 ALTER TABLE `import_lots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt_items`
--

DROP TABLE IF EXISTS `import_receipt_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_id` int NOT NULL,
  `lot_id` int NOT NULL,
  `quantity` int DEFAULT '0',
  `unit_price` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `receipt_id` (`receipt_id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `import_receipt_items_ibfk_1` FOREIGN KEY (`receipt_id`) REFERENCES `import_receipts` (`id`),
  CONSTRAINT `import_receipt_items_ibfk_2` FOREIGN KEY (`lot_id`) REFERENCES `import_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_items`
--

LOCK TABLES `import_receipt_items` WRITE;
/*!40000 ALTER TABLE `import_receipt_items` DISABLE KEYS */;
INSERT INTO `import_receipt_items` VALUES (1,1,1,50,60000.00),(2,1,2,40,30000.00),(3,1,3,35,40000.00),(4,2,4,30,35000.00),(5,2,5,45,25000.00),(6,2,10,55,75000.00),(7,3,15,80,60000.00),(8,3,19,100,55000.00),(9,3,25,50,35000.00);
/*!40000 ALTER TABLE `import_receipt_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipts`
--

DROP TABLE IF EXISTS `import_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `import_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `import_receipts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `import_receipts_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipts`
--

LOCK TABLES `import_receipts` WRITE;
/*!40000 ALTER TABLE `import_receipts` DISABLE KEYS */;
INSERT INTO `import_receipts` VALUES (1,2,1,'2025-01-10 09:00:00'),(2,2,2,'2025-02-15 10:00:00'),(3,3,3,'2025-03-20 11:00:00');
/*!40000 ALTER TABLE `import_receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_published` tinyint DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'Top 10 Sách Hay Nhất 2025','Những cuốn sách được độc giả yêu thích nhất năm 2025','<p>Năm 2025 có nhiều cuốn sách xuất sắc ra đời...</p>','moi20251.jfif','Ban Biên Tập TBook',1,'2026-05-19 23:53:40'),(2,'Lợi Ích Của Việc Đọc Sách Mỗi Ngày','Đọc sách 30 phút mỗi ngày mang lại những lợi ích tuyệt vời','<p>Nghiên cứu chứng minh rằng đọc sách thường xuyên...</p>','doi-song3.png','Linh Đoàn',1,'2026-05-19 23:53:40'),(3,'Ra Mắt Bộ Sưu Tập Sách Cổ Điển','TBook giới thiệu bộ sưu tập sách văn học cổ điển thế giới','<p>Chúng tôi vui mừng giới thiệu...</p>','vh-nn1.jfif','Ban Biên Tập TBook',1,'2026-05-19 23:53:40');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `lot_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`lot_id`) REFERENCES `import_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,10,2,99000.00),(2,1,19,1,80000.00),(3,2,15,1,89000.00),(4,2,21,1,99000.00),(5,3,1,3,124000.00),(6,3,25,2,50000.00),(7,4,1,1,124000.00),(8,5,1,5,124000.00),(9,6,1,1,124000.00),(10,7,28,1,120000.00),(11,7,40,1,124000.00),(12,8,25,1,50000.00),(13,9,29,1,72000.00),(14,10,38,1,129000.00),(15,11,40,1,124000.00),(16,12,40,1,124000.00),(17,12,36,1,120000.00),(18,12,23,1,95000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `discount` decimal(15,2) DEFAULT '0.00',
  `payment_method` enum('COD','BANK','QR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD',
  `payment_status` enum('unpaid','paid') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `status` enum('pending','confirmed','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'ORD-20250401-001','Trần Thị Mai','0912222333','Hà Nội',NULL,278000.00,0.00,'COD','paid','delivered','2025-04-01 10:30:00'),(2,2,'ORD-20250405-001','Lê Văn An','0933444555','TP HCM','Giao giờ hành chính',177000.00,10000.00,'BANK','paid','delivered','2025-04-05 14:00:00'),(3,1,'ORD-20250501-001','Trần Thị Mai','0912222333','Hà Nội',NULL,472000.00,0.00,'COD','paid','delivered','2025-05-01 09:00:00'),(4,2,'ORD-1779862501940','Lê Văn An','0399975455','Đội 1, thôn Yên Lịch, Xã Việt Tiến, Tỉnh Hưng Yên',NULL,124000.00,0.00,'COD','paid','delivered','2026-05-27 13:15:01'),(5,2,'ORD-1779862974122','Lê Văn An','0399975455','R2V5+C8F, Xã Bắc Thụy Anh, Tỉnh Hưng Yên',NULL,620000.00,0.00,'COD','paid','delivered','2026-05-27 13:22:54'),(6,2,'ORD-1779866210361','Lê Văn An','0399975455','Đội 1, thôn Yên Lịch, Xã Việt Tiến, Tỉnh Hưng Yên',NULL,124000.00,0.00,'COD','paid','delivered','2026-05-27 14:16:50'),(7,2,'ORD-1780824917858','Lê Văn An','0399975455','Đội 1, thôn Yên Lịch, Xã Việt Tiến, Tỉnh Hưng Yên',NULL,244000.00,0.00,'COD','paid','delivered','2026-06-07 16:35:17'),(8,2,'ORD-1780825369457','Lê Văn An','0399975455','Đội 1, thôn Yên Lịch, Phường Mỹ Hào, Tỉnh Hưng Yên',NULL,50000.00,0.00,'COD','paid','delivered','2026-06-07 16:42:49'),(9,2,'ORD-1780833282467','Lê Văn An','0399975455','Đội 1, thôn Yên Lịch, Xã Việt Tiến, Tỉnh Hưng Yên',NULL,72000.00,0.00,'COD','paid','delivered','2026-06-07 18:54:42'),(10,4,'ORD-1780836802396','Mai Hoàng Anh','0369763773','13 Thôn Thái Ninh, Xã Bắc Thái Ninh, Tỉnh Hưng Yên',NULL,129000.00,0.00,'COD','paid','delivered','2026-06-07 19:53:22'),(11,4,'ORD-1780840988108','Mai Hoàng Anh','0369763773','13 Thôn Thái Ninh, Xã Bắc Thái Ninh, Tỉnh Hưng Yên',NULL,124000.00,0.00,'QR','paid','delivered','2026-06-07 21:03:08'),(12,4,'ORD-1780848498760','Mai Hoàng Anh','0369763773','13 Thôn Thái Ninh, Xã Bắc Thái Ninh, Tỉnh Hưng Yên',NULL,339000.00,0.00,'QR','unpaid','pending','2026-06-07 23:08:18');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Quản trị viên hệ thống'),(2,'staff','Nhân viên cửa hàng'),(3,'customer','Khách hàng');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_prices`
--

DROP TABLE IF EXISTS `sale_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lot_id` int NOT NULL,
  `old_price` decimal(15,2) DEFAULT '0.00',
  `new_price` decimal(15,2) DEFAULT '0.00',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `sale_prices_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `import_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_prices`
--

LOCK TABLES `sale_prices` WRITE;
/*!40000 ALTER TABLE `sale_prices` DISABLE KEYS */;
INSERT INTO `sale_prices` VALUES (1,1,124000.00,124000.00,'2026-05-19 23:53:40'),(2,2,90000.00,45000.00,'2026-05-19 23:53:40'),(3,3,50000.00,50000.00,'2026-05-19 23:53:40'),(4,4,55000.00,55000.00,'2026-05-19 23:53:40'),(5,5,35000.00,35000.00,'2026-05-19 23:53:40'),(6,6,95000.00,95000.00,'2026-05-19 23:53:40'),(7,7,70000.00,70000.00,'2026-05-19 23:53:40'),(8,8,85000.00,85000.00,'2026-05-19 23:53:40'),(9,9,110000.00,110000.00,'2026-05-19 23:53:40'),(10,10,99000.00,99000.00,'2026-05-19 23:53:40'),(11,11,105000.00,105000.00,'2026-05-19 23:53:40'),(12,12,130000.00,130000.00,'2026-05-19 23:53:40'),(13,13,100000.00,100000.00,'2026-05-19 23:53:40'),(14,14,217000.00,217000.00,'2026-05-19 23:53:40'),(15,15,89000.00,89000.00,'2026-05-19 23:53:40'),(16,16,150000.00,150000.00,'2026-05-19 23:53:40'),(17,17,135000.00,135000.00,'2026-05-19 23:53:40'),(18,18,119000.00,119000.00,'2026-05-19 23:53:40'),(19,19,80000.00,80000.00,'2026-05-19 23:53:40'),(20,20,110000.00,110000.00,'2026-05-19 23:53:40'),(21,21,99000.00,99000.00,'2026-05-19 23:53:40'),(22,22,105000.00,105000.00,'2026-05-19 23:53:40'),(23,23,95000.00,95000.00,'2026-05-19 23:53:40'),(24,24,55000.00,55000.00,'2026-05-19 23:53:40'),(25,25,50000.00,50000.00,'2026-05-19 23:53:40'),(26,26,98000.00,98000.00,'2026-05-19 23:53:40'),(27,27,85000.00,85000.00,'2026-05-19 23:53:40'),(28,28,120000.00,120000.00,'2026-05-19 23:53:40'),(29,29,72000.00,72000.00,'2026-05-19 23:53:40'),(30,30,79000.00,79000.00,'2026-05-19 23:53:40'),(31,31,25000.00,25000.00,'2026-05-19 23:53:40'),(32,32,32000.00,32000.00,'2026-05-19 23:53:40'),(33,33,95000.00,95000.00,'2026-05-19 23:53:40'),(34,34,72000.00,72000.00,'2026-05-19 23:53:40'),(35,35,68000.00,68000.00,'2026-05-19 23:53:40'),(36,36,120000.00,120000.00,'2026-05-19 23:53:40'),(37,37,128000.00,89600.00,'2026-05-19 23:53:40'),(38,38,129000.00,129000.00,'2026-05-19 23:53:40'),(39,39,112000.00,112000.00,'2026-05-19 23:53:40'),(40,40,124000.00,124000.00,'2026-05-19 23:53:40');
/*!40000 ALTER TABLE `sale_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoice_items`
--

DROP TABLE IF EXISTS `sales_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `lot_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `sales_invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `sales_invoices` (`id`),
  CONSTRAINT `sales_invoice_items_ibfk_2` FOREIGN KEY (`lot_id`) REFERENCES `import_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
INSERT INTO `sales_invoice_items` VALUES (1,1,10,2,99000.00),(2,1,19,1,80000.00),(3,2,15,1,89000.00),(4,2,21,1,99000.00),(5,3,1,3,124000.00),(6,3,25,2,50000.00),(7,4,12,1,130000.00);
/*!40000 ALTER TABLE `sales_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoices`
--

DROP TABLE IF EXISTS `sales_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `discount` decimal(15,2) DEFAULT '0.00',
  `sale_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `sales_invoices_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `sales_invoices_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
INSERT INTO `sales_invoices` VALUES (1,2,1,0.00,'2025-04-01 10:30:00'),(2,2,2,10000.00,'2025-04-05 14:00:00'),(3,3,1,0.00,'2025-05-01 09:00:00'),(4,2,NULL,0.00,'2025-05-10 11:00:00');
/*!40000 ALTER TABLE `sales_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'NXB Kim Đồng','024-38253985','55 Quang Trung, Hà Nội','nxbkimdong@kimdong.com.vn',1),(2,'NXB Trẻ','028-38231544','161B Lý Chính Thắng, TP HCM','nxbtre@nxbtre.com.vn',1),(3,'NXB Tổng Hợp TP.HCM','028-38225340','62 Nguyễn Thị Minh Khai, TP HCM','info@nxbhcm.com.vn',1),(4,'Alpha Books','024-37835381','13 Trần Quốc Toản, Hà Nội','info@alphabooks.vn',1),(5,'Fahasa','028-38222558','60-62 Lê Lợi, TP HCM','info@fahasa.com',1);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 23:12:50
