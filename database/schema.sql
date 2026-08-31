-- ============================================================
-- Teresita's Barbershop Database Schema
-- Run this script in XAMPP phpMyAdmin (http://localhost/phpmyadmin)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `teresitas_barbershop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `teresitas_barbershop`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) DEFAULT '',
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `contact` VARCHAR(50) DEFAULT '',
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `icon` VARCHAR(50) DEFAULT '✂️',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BARBERS TABLE
CREATE TABLE IF NOT EXISTS `barbers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Barber',
  `rating` VARCHAR(50) DEFAULT '⭐ 4.9',
  `specialty` VARCHAR(255) DEFAULT '',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ref_code` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL DEFAULT 'Juan Dela Cruz',
  `user_id` INT NULL,
  `service_id` INT NULL,
  `barber_id` INT NULL,
  `service_name` VARCHAR(100) NOT NULL,
  `barber_name` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `requested_time` VARCHAR(50) DEFAULT '',
  `confirmed_time` VARCHAR(50) DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `duration` VARCHAR(50) DEFAULT '45 mins',
  `payment_mode` VARCHAR(100) DEFAULT 'Pay at Shop (Cash / Card)',
  `cancel_reason` TEXT DEFAULT NULL,
  `rating` INT NULL,
  `review` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`barber_id`) REFERENCES `barbers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
