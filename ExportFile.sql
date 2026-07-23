-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: store_rating
-- ------------------------------------------------------
-- Server version	8.0.39
USE defaultdb;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,2,1,5,'2026-06-28 14:39:35'),(15,1,1,5,'2026-06-29 05:47:06'),(16,7,1,5,'2026-06-29 05:47:06'),(17,1,2,4,'2026-06-30 14:14:44');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) NOT NULL,
  `overall_rating` decimal(3,2) DEFAULT '0.00',
  `rating_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'ABC Super Market','abc@gmail.com','Pune',4,'2026-06-28 04:29:28','Lifestyle & Home',0.00,0),(2,'Kamla Enterprise','k@gmail.com','Sanpada Road',NULL,'2026-06-28 04:42:57','Lifestyle & Home',0.00,0),(3,'Sarita Parlour','sari@gmail.com','Sanpada Road',4,'2026-06-28 04:52:35','Lifestyle & Home',0.00,0);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  `role` enum('admin','user','owner') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sakshi sanjay Chavan','sakshichavan61116@gmail.com','$2b$10$Aa4JYHPhctg485ve3qccvOYdbMfg6O76Xipvg8ZiGnz2qZ8n4UhVO','20, Prathamesh Darshan Star Colony Ganesh nagar ','user','2026-06-27 08:58:10'),(2,'Test User','test@example.com','$2b$10$yxAezoSgOiwW/0lyu98Jf.hSu2TTNG3d8S68SAWM1XAwSpud4DNlq','123 Fake St','user','2026-06-27 09:57:45'),(3,'Super Admin','admin@gmail.com','$2b$10$QBQA/URn6LDEOzp5nor0UuHAVOVux4yjH48eUSx1BO8AF21zmXvhq','Pune','admin','2026-06-27 12:25:50'),(4,'ABC Store Owner','owner@gmail.com','$2b$10$XK1BLPOp5n6JMwuz/huSwu7.uXkEHcL/k8q6MvCh50joPMOO9yyF.','Mumbai','owner','2026-06-27 12:28:20'),(5,'Anita Rameshwari','anita@gmail.com','$2b$10$3z6M/k7nyG.8bydmvE5Wwu1mY8T2.2X39iCbHP3sdttSUP1Ljjy/C','123 , Star Office , Bandra','owner','2026-06-28 03:35:14'),(6,'Admin','admin@ratenest.com','$2b$10$.OdIEBKp0PZMo5mbRxza2uRyklFXiqTrw2fFeVi3HeSJXlTuvKf.C','HQ','admin','2026-06-28 13:48:08'),(7,'Maria','maria@ratenest.com','$2b$10$WBY/hWrq7NAxCFV5owKMTOu70cH8gyeKhm/u8NwLRIumbzI.MUxh6','NYC','user','2026-06-28 13:48:08'),(8,'Harlow','harlow@ratenest.com','$2b$10$tTjg.0FmUbcSyLsHjV4tCOzYdQTq4uNPINe7/MHeZYvGMu6no6cWC','Store 1','owner','2026-06-28 13:48:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-23 18:30:41
