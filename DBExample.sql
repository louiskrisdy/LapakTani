-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 27, 2023 at 09:53 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `LapakTaniDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `farmer_data`
--

CREATE TABLE `farmer_data` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `farmer_data`
--

INSERT INTO `farmer_data` (`id`, `name`, `email`, `password`) VALUES
(1, 'Farmer 1', 'farmer1@gfail.com', 'farmer1'),
(2, 'Farmer 2', 'farmer2@gfail.com', 'farmer2'),
(3, 'Farmer 3', 'farmer3@gfail.com', 'farmer3');

-- --------------------------------------------------------

--
-- Table structure for table `negotiation_details`
--

CREATE TABLE `negotiation_details` (
  `nego_price` int(11) NOT NULL,
  `nego_status` varchar(30) NOT NULL,
  `order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `item_name` varchar(120) NOT NULL,
  `total_price` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `final_price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(180) NOT NULL,
  `price` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `imagePath` varchar(50) DEFAULT NULL,
  `farmer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `qty`, `category`, `imagePath`, `farmer_id`) VALUES
(1, 'Telur Ayam Kampung (/12 butir)', 20000, 50, 'POULTRY', 'telurayamkampung.png', 2),
(2, 'Telur Ayam Kampung (/12 butir)', 15000, 100, 'POULTRY', 'telurayamkampung.png', 2),
(3, 'Telur Ayam Kampung (/12 butir)', 20000, 100, 'POULTRY', 'telurayamkampung.png', 2),
(4, 'Telur Ayam Kampung (/12 butir)', 20000, 100, 'POULTRY', 'telurayamkampung.png', 2),
(5, 'Jagung /pcs', 8000, 50, 'VEGGIES', 'jagung.jpeg', 1),
(6, 'Jagung /pcs', 9000, 50, 'VEGGIES', 'jagung.jpeg', 1),
(7, 'Jagung /pcs', 7000, 100, 'VEGGIES', 'jagung.jpeg', 1),
(8, 'Apple (/kg)', 35000, 50, 'FRUITS', 'apple.jpeg', 3),
(9, 'Apple (/kg)', 35000, 50, 'FRUITS', 'apple.jpeg', 3),
(10, 'Apple (/kg)', 35000, 50, 'FRUITS', 'apple.jpeg', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `id` int(11) NOT NULL,
  `username` varchar(120) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`id`, `username`, `email`, `password`) VALUES
(1, 'Amy A', 'amyA@gfail.com', '$2b$10$4dwlq7xmYb0U9LudiyO0yuc0iykYVok7plUraDgVVL9pf2RmN8kO6'),
(2, 'Budi', 'budi123@yahoot.com', '$2b$10$59J0cBOu42HVHAary6bdFe6Yy7.iAsGaVfk9jZj94imQPHR5Hsecm'),
(3, 'John Doe', 'johndoe@gfail.com', '$2b$10$oZ02vdh6JZ/qW3CUs01k.O.XVGD9wOew5K4mky2yC1A0kwAI596RO'),
(4, 'adrian', 'adrian123@gmail.com', '$2b$10$eaZh7mFDMrquf//ZLa.Jm.vqUf496T3d5mru6rdWSpK4KRk4QIx8a'),
(5, 'Dummy', 'dummy@gfail.com', '$2b$10$B6E2BQ0YwsJtRv6baHEUueDr7wbNccGUVnwygqnm4zBbwgkh4JLGm');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `farmer_data`
--
ALTER TABLE `farmer_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD KEY `FK_ProdID` (`product_id`),
  ADD KEY `FK_CustID` (`customer_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `farmer_data`
--
ALTER TABLE `farmer_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `FK_CustID` FOREIGN KEY (`customer_id`) REFERENCES `user_data` (`id`),
  ADD CONSTRAINT `FK_ProdID` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
