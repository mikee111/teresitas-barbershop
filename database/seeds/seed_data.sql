-- ============================================================
-- Seed Data for Teresita's Barbershop Database
-- Run this script in phpMyAdmin after running schema.sql
-- ============================================================

USE `teresitas_barbershop`;

-- 1. SEED USERS
INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `contact`, `address`) VALUES
(1, 'admin@teresitas.com', 'admin123', 'Admin', 'Owner', 'admin', '0917-000-0000', 'Teresita Barbershop Main Branch'),
(2, 'user@teresitas.com', 'user123', 'Juan', 'Dela Cruz', 'user', '0912-345-6789', '123 Rizal St., Manila');

-- 2. SEED SERVICES
INSERT INTO `services` (`id`, `name`, `description`, `price`, `icon`) VALUES
(1, 'Hair Cut', 'Classic haircut with wash and style', 15.00, '✂️'),
(2, 'Beard Trim', 'Beard shaping and grooming', 10.00, '🧔'),
(3, 'Hair & Beard Combo', 'Haircut and beard trim combo', 22.00, '✂️'),
(4, 'Scissor Cut', 'Premium scissor haircut', 20.00, '✂️'),
(5, 'Hair Color', 'Hair coloring service', 30.00, '💧');

-- 3. SEED BARBERS
INSERT INTO `barbers` (`id`, `name`, `role`, `rating`, `specialty`, `status`) VALUES
(1, 'Mark Reyes', 'Master Barber', '⭐ 4.9', 'Fades & Classic Cuts', 'Active'),
(2, 'John Carlio', 'Senior Barber', '⭐ 4.8', 'Beard Grooming & Styling', 'Active'),
(3, 'Luis Santos', 'Fade Specialist', '⭐ 4.9', 'Taper Fade & Modern Cuts', 'Active'),
(4, 'Marco Cruz', 'Stylist & Colorist', '⭐ 4.7', 'Hair Color & Scissor Work', 'Active');

-- 4. SEED APPOINTMENTS
INSERT INTO `appointments` (`id`, `ref_code`, `customer_name`, `user_id`, `service_id`, `barber_id`, `service_name`, `barber_name`, `date`, `time`, `requested_time`, `confirmed_time`, `price`, `status`, `duration`, `payment_mode`, `rating`, `review`) VALUES
(101, '#TB-84920', 'Juan Dela Cruz', 2, 3, 1, 'Hair & Beard Combo', 'Mark Reyes', 'Aug 26, 2026', '10:30 AM', '10:30 AM', '10:30 AM', 22.00, 'confirmed', '45 mins', 'Pay at Shop (Cash / Card)', NULL, NULL),
(102, '#TB-73104', 'Juan Dela Cruz', 2, 4, 2, 'Scissor Cut', 'John Carlio', 'Aug 12, 2026', '02:00 PM', '02:00 PM', '02:00 PM', 20.00, 'completed', '40 mins', 'Paid (Card)', 5, 'Clean finish and great scissor work!'),
(103, '#TB-62095', 'Juan Dela Cruz', 2, 1, 3, 'Hair Cut', 'Luis Santos', 'Jul 28, 2026', '11:00 AM', '11:00 AM', '', 15.00, 'cancelled', '35 mins', 'Pay at Shop', NULL, NULL);
