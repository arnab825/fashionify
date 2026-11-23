-- Fashionify Database Backup from Aiven MySQL
SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_mode = 'ANSI_QUOTES';

-- Table structure for `addresses`
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE "addresses" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "address" varchar(255) NOT NULL,
  "city" varchar(255) NOT NULL,
  "created_at" datetime(6) DEFAULT NULL,
  "notes" varchar(255) DEFAULT NULL,
  "phone" varchar(255) NOT NULL,
  "pincode" varchar(255) NOT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  KEY "FK1fa36y2oqhao3wgg2rw1pi459" ("user_id"),
  CONSTRAINT "FK1fa36y2oqhao3wgg2rw1pi459" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Data for table `addresses`
INSERT INTO `addresses` (`id`, `address`, `city`, `created_at`, `notes`, `phone`, `pincode`, `updated_at`, `user_id`) VALUES
(2, '27B, Lotus Residency, 4th Floor, Lakeview Lane, Newtown', 'Kolkata', '2026-06-06 10:44:46.144489', 'Leave package with security desk if recipient is unavailable.', '+91 98765 43210', '700156', '2026-06-06 10:44:46.144535', 1),
(3, 'Flat 5C, Shantiniketan Apartments, 118 Sarat Bose Road, Ballygunge', 'Kolkata', '2026-06-06 10:46:01.004216', 'Ring doorbell twice. Preferred delivery time: 10:00 AM to 6:00 PM.', '+91 98765 43210', '700019', '2026-06-06 10:46:01.004257', 1),
(4, 'House No. 14, Green Heights Complex, Block D, 22 Canal South Road, Garia', 'Kolkata', '2026-06-06 10:47:05.115680', 'Call before delivery. Entrance gate is next to the community park.', '+91 98765 43210', '700084', '2026-06-06 10:47:05.115741', 1),
(5, '48,Chakdah PurbaPutiary Near MilonPally', 'KOLKATA', '2026-06-07 12:06:38.666475', 'hi', '8902441711', '700 093', '2026-06-07 12:06:38.666475', 3),
(6, 'new town', 'kolkata', '2026-06-11 04:17:48.522653', 'nfjhr', '1234567890', '700000', '2026-06-11 04:17:48.522684', 6),
(7, 'Police Line', 'Burdwan', '2026-06-13 20:39:48.985097', 'Call me before delivering :)', '+91 8888888888', '713103', '2026-06-13 20:39:48.985162', 5);

-- Table structure for `cart_items`
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE "cart_items" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "quantity" int NOT NULL,
  "selected_size" varchar(255) DEFAULT NULL,
  "cart_id" bigint NOT NULL,
  "product_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  KEY "FKpcttvuq4mxppo8sxggjtn5i2c" ("cart_id"),
  KEY "FK1re40cjegsfvw58xrkdp6bac6" ("product_id"),
  CONSTRAINT "FK1re40cjegsfvw58xrkdp6bac6" FOREIGN KEY ("product_id") REFERENCES "products" ("id"),
  CONSTRAINT "FKpcttvuq4mxppo8sxggjtn5i2c" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id")
);

-- Data for table `cart_items`
INSERT INTO `cart_items` (`id`, `quantity`, `selected_size`, `cart_id`, `product_id`) VALUES
(12, 1, 'M', 5, 37);

-- Table structure for `carts`
DROP TABLE IF EXISTS `carts`;
CREATE TABLE "carts" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "UK64t7ox312pqal3p7fg9o503c2" ("user_id"),
  CONSTRAINT "FKb5o626f86h46m4s7ms6ginnop" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Data for table `carts`
INSERT INTO `carts` (`id`, `created_at`, `updated_at`, `user_id`) VALUES
(1, '2026-06-05 20:58:00.971563', '2026-06-05 20:58:00.971563', 1),
(2, '2026-06-07 12:06:17.903094', '2026-06-07 12:06:17.903094', 3),
(3, '2026-06-11 04:17:16.378397', '2026-06-11 04:17:16.378429', 6),
(4, '2026-06-13 20:38:32.187173', '2026-06-13 20:38:32.187266', 5),
(5, '2026-08-04 08:00:28.351767', '2026-08-04 08:00:28.351801', 7);

-- Table structure for `collection_products`
DROP TABLE IF EXISTS `collection_products`;
CREATE TABLE "collection_products" (
  "collection_id" bigint NOT NULL,
  "product_id" bigint NOT NULL,
  KEY "FKpm7tweq14d22pri7dw5mg90em" ("product_id"),
  KEY "FKaxoi4xo8kxr6ybr4agejey9p5" ("collection_id"),
  CONSTRAINT "FKaxoi4xo8kxr6ybr4agejey9p5" FOREIGN KEY ("collection_id") REFERENCES "collections" ("id"),
  CONSTRAINT "FKpm7tweq14d22pri7dw5mg90em" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `collection_products`
INSERT INTO `collection_products` (`collection_id`, `product_id`) VALUES
(3, 35),
(3, 36),
(3, 37),
(3, 38),
(3, 39),
(4, 40),
(4, 41),
(4, 42),
(4, 43),
(4, 44),
(4, 45),
(5, 46),
(5, 47),
(5, 48),
(6, 49),
(6, 50),
(6, 51),
(6, 52);

-- Table structure for `collections`
DROP TABLE IF EXISTS `collections`;
CREATE TABLE "collections" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "description" text,
  "image_url" text,
  "name" varchar(255) NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `collections`
INSERT INTO `collections` (`id`, `created_at`, `description`, `image_url`, `name`) VALUES
(3, '2026-06-06 13:55:34.773942', 'Inspired by sunset selfies and carefree summer evenings. This women\'s tee collection combines comfort, style, and versatility for looks that shine from day plans to night vibes.', 'https://res.cloudinary.com/davmbisny/image/upload/v1780734295/fashionify/collections/nvmrkzu2dxud7syva7ep.png', 'Golden Hour Girls Collection'),
(4, '2026-06-06 17:36:03.514268', 'Relaxed silhouettes and easy-going styles made for getaway energy.', 'https://res.cloudinary.com/davmbisny/image/upload/v1780747556/fashionify/collections/d0bfe6ckachqfzpeuddg.png', 'Men on Vacation'),
(5, '2026-06-06 17:39:11.981007', 'Everyday summer essentials for kids with big imaginations.', 'https://res.cloudinary.com/davmbisny/image/upload/v1780747746/fashionify/collections/qosg6v4l5t5fbvhbbkmv.png', 'Little Legends'),
(6, '2026-06-06 17:42:02.083004', 'Must-have sneakers, caps, bags, and accessories for daily wear.', 'https://res.cloudinary.com/davmbisny/image/upload/v1780747910/fashionify/collections/vdnq9osksaqclmcckbii.png', 'Street Essentials');

-- Table structure for `coupon_redemptions`
DROP TABLE IF EXISTS `coupon_redemptions`;
CREATE TABLE "coupon_redemptions" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "coupon_id" bigint NOT NULL,
  "discount_amount" double DEFAULT NULL,
  "order_id" bigint NOT NULL,
  "redeemed_at" datetime(6) DEFAULT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `coupon_redemptions`
INSERT INTO `coupon_redemptions` (`id`, `coupon_id`, `discount_amount`, `order_id`, `redeemed_at`, `user_id`) VALUES
(1, 2, 664.65, 2, '2026-06-06 10:47:41.626074', 1);

-- Table structure for `coupons`
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE "coupons" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "code" varchar(255) NOT NULL,
  "created_at" datetime(6) DEFAULT NULL,
  "deleted_at" datetime(6) DEFAULT NULL,
  "description" varchar(255) DEFAULT NULL,
  "discount_percentage" double DEFAULT NULL,
  "expiry_date" datetime(6) DEFAULT NULL,
  "is_active" bit(1) NOT NULL,
  "max_redemptions" int DEFAULT NULL,
  "minimum_order_amount" double DEFAULT NULL,
  "per_user_limit" int DEFAULT NULL,
  "start_date" datetime(6) DEFAULT NULL,
  "total_redemptions" int DEFAULT NULL,
  "type" varchar(255) NOT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "value" double NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "UKeplt0kkm9yf2of2lnx6c1oy9b" ("code")
);

-- Data for table `coupons`
INSERT INTO `coupons` (`id`, `code`, `created_at`, `deleted_at`, `description`, `discount_percentage`, `expiry_date`, `is_active`, `max_redemptions`, `minimum_order_amount`, `per_user_limit`, `start_date`, `total_redemptions`, `type`, `updated_at`, `value`) VALUES
(1, 'SUMMER30', '2026-06-06 10:34:01.519990', NULL, 'Get Flat 30% OFF on your total order value only for this summer.', 0.0, '2026-07-31 18:29:00', 0x01, NULL, NULL, NULL, '2026-02-28 18:30:00', 0, 'PERCENTAGE', '2026-06-06 10:34:01.520024', 30.0),
(2, 'WELCOME35', '2026-06-06 10:37:22.098502', '2026-06-06 13:23:26.016771', 'Get Flat 35% OFF on your total order value only for first time users.', 0.0, '2026-10-31 18:29:00', 0x01, NULL, NULL, 1, '2026-05-31 18:30:00', 1, 'PERCENTAGE', '2026-06-06 13:23:26.078186', 35.0);

-- Table structure for `features`
DROP TABLE IF EXISTS `features`;
CREATE TABLE "features" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "end_date" varchar(255) DEFAULT NULL,
  "image" varchar(255) NOT NULL,
  "link_url" varchar(255) DEFAULT NULL,
  "start_date" varchar(255) DEFAULT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `features`
INSERT INTO `features` (`id`, `created_at`, `end_date`, `image`, `link_url`, `start_date`, `updated_at`) VALUES
(10, '2026-06-06 12:42:02.684938', NULL, 'https://res.cloudinary.com/davmbisny/image/upload/v1780729918/fashionify/products/hmvo4xq0grx1ctcu7wto.png', NULL, NULL, '2026-06-06 12:42:02.684981'),
(11, '2026-06-06 12:42:15.430136', NULL, 'https://res.cloudinary.com/davmbisny/image/upload/v1780729931/fashionify/products/iulsrcqpelx6aumcqvmy.png', NULL, NULL, '2026-06-06 12:42:15.430185'),
(13, '2026-06-06 12:42:48.883088', NULL, 'https://res.cloudinary.com/davmbisny/image/upload/v1780729963/fashionify/products/gbsej0xiqumbeyic37k7.png', NULL, NULL, '2026-06-06 12:42:48.883133');

-- Table structure for `messages`
DROP TABLE IF EXISTS `messages`;
CREATE TABLE "messages" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) NOT NULL,
  "email" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "name" varchar(255) NOT NULL,
  "is_read" bit(1) NOT NULL,
  "resolved" bit(1) NOT NULL,
  "subject" varchar(255) NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `messages`
INSERT INTO `messages` (`id`, `created_at`, `email`, `message`, `name`, `is_read`, `resolved`, `subject`) VALUES
(2, '2026-06-07 13:59:11.665944', 'rarnab225@gmail.com', 'hello', 'Arnab Roy', 0x01, 0x00, 'hi'),
(3, '2026-09-14 19:18:54.062424', 'rarnab225@gmail.com', 'hi', 'Arnab Roy', 0x01, 0x00, 'hi');

-- Table structure for `newsletter_subscriptions`
DROP TABLE IF EXISTS `newsletter_subscriptions`;
CREATE TABLE "newsletter_subscriptions" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "active" bit(1) NOT NULL,
  "email" varchar(255) NOT NULL,
  "subscribed_at" datetime(6) DEFAULT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "UKl1ugg7yd5fl40cxec8stsmte8" ("email")
);

-- Data for table `newsletter_subscriptions`
INSERT INTO `newsletter_subscriptions` (`id`, `active`, `email`, `subscribed_at`) VALUES
(1, 0x01, 'rarnab225@gmail.com', '2026-06-07 12:57:31.417792'),
(2, 0x01, 'tmsl.mca27.arnabroy@gmail.xom', '2026-06-08 15:44:49.000693'),
(3, 0x01, 'tmsl.mca27.arnabroy@gmail.com', '2026-06-08 15:44:54.929762'),
(4, 0x01, 'arnabroy.bca2022@nsec.ac.in', '2026-06-10 18:51:54.852702'),
(5, 0x01, 'gotog97126@herojp.com', '2026-06-10 13:44:18.785629'),
(6, 0x01, 'fashiontest99@gmail.com', '2026-09-14 20:53:58.785366');

-- Table structure for `order_items`
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE "order_items" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "image" varchar(255) DEFAULT NULL,
  "price" varchar(255) DEFAULT NULL,
  "product_id" varchar(255) DEFAULT NULL,
  "quantity" int DEFAULT NULL,
  "selected_size" varchar(255) DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "order_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  KEY "FKbioxgbv59vetrxe0ejfubep1w" ("order_id"),
  CONSTRAINT "FKbioxgbv59vetrxe0ejfubep1w" FOREIGN KEY ("order_id") REFERENCES "orders" ("id")
);

-- Data for table `order_items`
INSERT INTO `order_items` (`id`, `image`, `price`, `product_id`, `quantity`, `selected_size`, `title`, `order_id`) VALUES
(1, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop', '1199', '20', 1, 'S', 'Premium Polo T-Shirt', 1),
(2, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop', '1899', '22', 1, 'M', 'Casual Linen Shirt', 2),
(3, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742432/fashionify/products/ssthvnd9uoesk7hogwlq.avif', '299', '40', 1, 'M', 'Short Sleeve Typographic Chest Print Crew Tshirt', 3),
(4, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745745/fashionify/products/huzikh17pzfe4mohnxy1.jpg', '399', '47', 1, '8Y (122cm)', 'Kids Dragon Ball-Z Print T-shirt', 4),
(5, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742700/fashionify/products/yvrbbxk3xmhwjssb80oa.avif', '399', '41', 1, 'M', 'Medium Length Sleeveless Buttoned Hooded Tshirt', 5),
(6, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746248/fashionify/products/z24hotywmhpinexynrzu.jpg', '2999', '49', 1, 'UK 9', 'Boys Batman Clogs with Charms', 6),
(7, 'https://res.cloudinary.com/davmbisny/image/upload/v1782454512/fashionify/products/t8kl8wsuvl0vx2t7lrvo.jpg', '899', '53', 1, 'One Size', 'batman', 7),
(8, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742432/fashionify/products/ssthvnd9uoesk7hogwlq.avif', '299', '40', 1, 'M', 'Short Sleeve Typographic Chest Print Crew Tshirt', 8),
(9, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731774/fashionify/products/pnirqsj3dsw4iilebshi.avif', '399', '39', 1, 'M', 'Raglan Sleeve Typographic Chest Patch Detail Crew Tshirt', 9),
(10, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731774/fashionify/products/pnirqsj3dsw4iilebshi.avif', '399', '39', 1, 'M', 'Raglan Sleeve Typographic Chest Patch Detail Crew Tshirt', 10),
(11, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742700/fashionify/products/yvrbbxk3xmhwjssb80oa.avif', '399', '41', 1, 'M', 'Medium Length Sleeveless Buttoned Hooded Tshirt', 10);

-- Table structure for `orders`
DROP TABLE IF EXISTS `orders`;
CREATE TABLE "orders" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "address" varchar(255) DEFAULT NULL,
  "address_id" varchar(255) DEFAULT NULL,
  "city" varchar(255) DEFAULT NULL,
  "notes" varchar(255) DEFAULT NULL,
  "phone" varchar(255) DEFAULT NULL,
  "pincode" varchar(255) DEFAULT NULL,
  "applied_promo_code" varchar(255) DEFAULT NULL,
  "cart_id" varchar(255) DEFAULT NULL,
  "discount_amount" double DEFAULT NULL,
  "is_gift_wrapped" bit(1) DEFAULT NULL,
  "order_date" datetime(6) DEFAULT NULL,
  "order_status" varchar(255) DEFAULT NULL,
  "order_update_date" datetime(6) DEFAULT NULL,
  "payer_id" varchar(255) DEFAULT NULL,
  "payment_id" varchar(255) DEFAULT NULL,
  "payment_method" varchar(255) DEFAULT NULL,
  "payment_status" varchar(255) DEFAULT NULL,
  "shipping_cost" double DEFAULT NULL,
  "shipping_method" varchar(255) DEFAULT NULL,
  "total_amount" double DEFAULT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  KEY "FK32ql8ubntj5uh44ph9659tiih" ("user_id"),
  CONSTRAINT "FK32ql8ubntj5uh44ph9659tiih" FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Data for table `orders`
INSERT INTO `orders` (`id`, `address`, `address_id`, `city`, `notes`, `phone`, `pincode`, `applied_promo_code`, `cart_id`, `discount_amount`, `is_gift_wrapped`, `order_date`, `order_status`, `order_update_date`, `payer_id`, `payment_id`, `payment_method`, `payment_status`, `shipping_cost`, `shipping_method`, `total_amount`, `user_id`) VALUES
(1, '48,Chakdah PurbaPutiary Near MilonPally', '1', 'KOLKATA', 'hello', '8902441711', '700 093', NULL, '1', 0.0, 0x01, '2026-06-05 20:58:41.632834', 'inShipping', '2026-06-07 14:27:23.741494', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 1249.0, 1),
(2, '27B, Lotus Residency, 4th Floor, Lakeview Lane, Newtown', '2', 'Kolkata', 'Leave package with security desk if recipient is unavailable.', '+91 98765 43210', '700156', 'WELCOME35', '1', 664.65, 0x01, '2026-06-06 10:47:39.283578', 'CANCELLED', '2026-06-06 10:56:19.418999', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 1284.35, 1),
(3, '48,Chakdah PurbaPutiary Near MilonPally', '5', 'KOLKATA', 'hi', '8902441711', '700 093', NULL, '2', 0.0, 0x00, '2026-06-07 12:06:44.819660', 'inShipping', '2026-06-07 14:41:58.590284', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 299.0, 3),
(4, '48,Chakdah PurbaPutiary Near MilonPally', '5', 'KOLKATA', 'hi', '8902441711', '700 093', NULL, '2', 0.0, 0x01, '2026-06-07 12:23:03.153540', 'delivered', '2026-06-07 14:53:05.839755', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 449.0, 3),
(5, 'new town', '6', 'kolkata', 'nfjhr', '1234567890', '700000', NULL, '3', 0.0, 0x00, '2026-06-11 04:17:52.579892', 'confirmed', '2026-06-11 04:17:53.617455', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 399.0, 6),
(6, 'Police Line', '7', 'Burdwan', 'Call me before delivering :)', '+91 8888888888', '713103', NULL, '4', 0.0, 0x01, '2026-06-13 20:40:01.378995', 'delivered', '2026-06-13 20:41:45.647375', NULL, NULL, 'simulated_cod', 'simulated_paid', 100.0, 'express', 3149.0, 5),
(7, 'House No. 14, Green Heights Complex, Block D, 22 Canal South Road, Garia', '4', 'Kolkata', 'Call before delivery. Entrance gate is next to the community park.', '+91 98765 43210', '700084', NULL, '1', 0.0, 0x00, '2026-06-26 11:49:46.227548', 'rejected', '2026-06-26 12:06:32.958318', NULL, NULL, 'simulated_cod', 'simulated_paid', 0.0, 'standard', 899.0, 1),
(8, '48,Chakdah PurbaPutiary Near MilonPally', '5', 'KOLKATA', 'hi', '8902441711', '700 093', NULL, '2', 0.0, 0x00, '2026-09-14 19:39:31.949263', 'delivered', '2026-09-14 19:42:00.567858', NULL, 'pay_TbwdLn8xz3kZBQ', 'razorpay', 'paid', 0.0, 'standard', 299.0, 3),
(9, '48,Chakdah PurbaPutiary Near MilonPally', '5', 'KOLKATA', 'hi', '8902441711', '700 093', NULL, '2', 0.0, 0x00, '2026-09-15 15:26:20.100504', 'pending_payment', '2026-09-15 15:26:20.100528', NULL, NULL, 'razorpay', 'pending', 0.0, 'standard', 399.0, 3),
(10, '48,Chakdah PurbaPutiary Near MilonPally', '5', 'KOLKATA', 'hi', '8902441711', '700 093', NULL, '2', 0.0, 0x01, '2026-09-17 06:46:29.576204', 'confirmed', '2026-09-17 06:46:56.276703', NULL, 'pay_Td0ggQuXLi1LYU', 'razorpay', 'paid', 100.0, 'express', 948.0, 3);

-- Table structure for `otp_verifications`
DROP TABLE IF EXISTS `otp_verifications`;
CREATE TABLE "otp_verifications" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) NOT NULL,
  "email" varchar(255) NOT NULL,
  "expires_at" datetime(6) NOT NULL,
  "hashed_password" text NOT NULL,
  "otp_code" varchar(6) NOT NULL,
  "user_name" varchar(255) NOT NULL,
  "date_of_birth" varchar(255) DEFAULT NULL,
  "gender" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `otp_verifications`
INSERT INTO `otp_verifications` (`id`, `created_at`, `email`, `expires_at`, `hashed_password`, `otp_code`, `user_name`, `date_of_birth`, `gender`) VALUES
(4, '2026-06-06 14:34:28.971959', 'business.subx6789@gmail.com', '2026-06-06 14:39:28.971959', '$2a$10$VjSmnI1Bk7Uzn4yJdwAhaOvIMxWpfyX7OOW15Kdc56/hvmy3o/sN6', '5654', 'Subhajit', '2004-08-19', 'Male'),
(5, '2026-06-06 14:48:33.546702', 'test1@example.com', '2026-06-06 14:53:33.546702', '$2a$10$q//Hnas2fm391XC.lHr/8uzAbi3q.U2twQN9VhVhsa/wtNii.r5ji', '9775', 'testuser1', '2000-01-01', 'Male'),
(7, '2026-06-07 12:50:56.117877', 'tmsl.mca27.arnabroy@gmail.com', '2026-06-07 12:55:56.117877', '$2a$10$ZXDQbmyvd04CNjtfbnGSMemR6aimj2TpWpBPk6UTqEH2I.4827doi', '4882', 'Raju Roy', '2004-07-28', 'Male');

-- Table structure for `outfit_products`
DROP TABLE IF EXISTS `outfit_products`;
CREATE TABLE "outfit_products" (
  "outfit_id" bigint NOT NULL,
  "product_id" bigint NOT NULL,
  KEY "FKpkb40m85j72f11gekeqf0ke1u" ("product_id"),
  KEY "FK9wudyo50qvt4rrae8jlq2i1uc" ("outfit_id"),
  CONSTRAINT "FK9wudyo50qvt4rrae8jlq2i1uc" FOREIGN KEY ("outfit_id") REFERENCES "outfits" ("id"),
  CONSTRAINT "FKpkb40m85j72f11gekeqf0ke1u" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `outfit_products`
INSERT INTO `outfit_products` (`outfit_id`, `product_id`) VALUES
(2, 35),
(2, 36),
(2, 37),
(2, 38),
(2, 39);

-- Table structure for `outfits`
DROP TABLE IF EXISTS `outfits`;
CREATE TABLE "outfits" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "description" text,
  "image_url" text,
  "name" varchar(255) NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `outfits`
INSERT INTO `outfits` (`id`, `created_at`, `description`, `image_url`, `name`) VALUES
(2, '2026-06-06 13:23:00.837266', 'Inspired by sunset selfies and carefree summer evenings. This women\'s tee collection combines comfort, style, and versatility for looks that shine from day plans to night vibes.', 'https://res.cloudinary.com/davmbisny/image/upload/v1780732368/fashionify/outfits/a6chlpjxdasmfjc3d9m3.png', 'Golden Hour Girls Collection');

-- Table structure for `password_resets`
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE "password_resets" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) NOT NULL,
  "email" varchar(255) NOT NULL,
  "expires_at" datetime(6) NOT NULL,
  "otp_code" varchar(6) NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `password_resets`
INSERT INTO `password_resets` (`id`, `created_at`, `email`, `expires_at`, `otp_code`) VALUES
(8, '2026-09-14 20:54:10.892865', 'rarnab225@gmail.com', '2026-09-14 20:59:10.892865', '842799');

-- Table structure for `product_images`
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE "product_images" (
  "product_id" bigint NOT NULL,
  "image_url" text,
  KEY "FKqnq71xsohugpqwf3c9gxmsuy" ("product_id"),
  CONSTRAINT "FKqnq71xsohugpqwf3c9gxmsuy" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `product_images`
INSERT INTO `product_images` (`product_id`, `image_url`) VALUES
(35, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730208/fashionify/products/xa9xscw6igi1nkzk1wyc.avif'),
(35, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730207/fashionify/products/gscjdgcwyqy0rdsmntub.avif'),
(35, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730208/fashionify/products/hehhqw6ezyv7xoujzq3q.avif'),
(36, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730709/fashionify/products/a26ao9ywyam8lt9jbohr.avif'),
(36, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730721/fashionify/products/m09twfew1ogozscjzopa.avif'),
(36, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730726/fashionify/products/bdhrlav2brqzadkil5ad.avif'),
(37, 'https://res.cloudinary.com/davmbisny/image/upload/v1780730999/fashionify/products/h0ut2jlzp51lqololbmd.avif'),
(37, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731006/fashionify/products/zcteayqmz4s18g9slfpp.avif'),
(37, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731006/fashionify/products/c5d2f2rkv8e0mt5g3ifz.avif'),
(37, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731006/fashionify/products/jxqcgrob0z2o3ca9l2cf.avif'),
(37, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731007/fashionify/products/j5xwebv8hjd3owizgd8f.avif'),
(38, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731286/fashionify/products/bkextkthrcrjutdfviik.avif'),
(38, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731306/fashionify/products/tespyyxu7fs4bhui9kps.avif'),
(38, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731313/fashionify/products/jmsblunyyiqaqcqus43d.avif'),
(39, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731774/fashionify/products/pnirqsj3dsw4iilebshi.avif'),
(39, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731782/fashionify/products/b4jelkos6kid06sil5zs.avif'),
(39, 'https://res.cloudinary.com/davmbisny/image/upload/v1780731782/fashionify/products/pzo9yhmpqm2m7u5wfb2j.avif'),
(40, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742432/fashionify/products/ssthvnd9uoesk7hogwlq.avif'),
(40, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742438/fashionify/products/hoopbf8vw9fxzyxnfegn.avif'),
(40, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742438/fashionify/products/movjskzkt8p9h2yz07q2.avif'),
(40, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742438/fashionify/products/zw2if1zkfnmkhdbwytzy.avif'),
(41, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742700/fashionify/products/yvrbbxk3xmhwjssb80oa.avif'),
(41, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742710/fashionify/products/oepmjzxd62blpkh84n5t.avif'),
(41, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742710/fashionify/products/nviranutzguzuwmuo2uc.avif'),
(41, 'https://res.cloudinary.com/davmbisny/image/upload/v1780742710/fashionify/products/uu1iscwg0gffj7o6opej.avif'),
(42, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743296/fashionify/products/ieftlixvwbfi29v2h6wc.avif'),
(42, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743302/fashionify/products/jn3tezbjlyedgwttkczt.avif'),
(43, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743533/fashionify/products/b3ut9zlnpqrnxzh0q3vk.avif'),
(43, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743539/fashionify/products/mixdhfs4aafa2xj9hxdo.avif'),
(44, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743783/fashionify/products/bk5zgghdaei8px0sdtjv.avif'),
(44, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743790/fashionify/products/ayvdjlcobrresqyytfdt.avif'),
(44, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743790/fashionify/products/zbr5afi0pxbbvfxwq2tq.avif'),
(44, 'https://res.cloudinary.com/davmbisny/image/upload/v1780743789/fashionify/products/yaqpaarcnk76ac9b9uyw.avif'),
(45, 'https://res.cloudinary.com/davmbisny/image/upload/v1780744251/fashionify/products/teby6gznq5sourr3ipgg.avif'),
(45, 'https://res.cloudinary.com/davmbisny/image/upload/v1780744258/fashionify/products/wrxy2noejahs4jumexde.avif'),
(45, 'https://res.cloudinary.com/davmbisny/image/upload/v1780744259/fashionify/products/beq1qftl8npxwcdaymlm.avif'),
(46, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745406/fashionify/products/ndcczp4vfd82pwfmljzx.jpg'),
(46, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745412/fashionify/products/sgbvsye9wqzi8pd060ii.jpg'),
(47, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745745/fashionify/products/huzikh17pzfe4mohnxy1.jpg'),
(47, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745761/fashionify/products/tclgcoamwdmzf0amypaq.jpg'),
(48, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745975/fashionify/products/s46ird3eitpgjqpo9sba.jpg'),
(48, 'https://res.cloudinary.com/davmbisny/image/upload/v1780745981/fashionify/products/pfmmegfdbcv8ivfvzhby.jpg'),
(49, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746248/fashionify/products/z24hotywmhpinexynrzu.jpg'),
(49, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746254/fashionify/products/vako44azypynekvrupvu.jpg'),
(49, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746260/fashionify/products/rwnibdkjyozmzdezrkca.jpg'),
(50, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746483/fashionify/products/olsojxmzknoiw1r1uvar.jpg'),
(50, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746490/fashionify/products/alvnfxihamr9s7pf6sg0.jpg'),
(50, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746490/fashionify/products/ejwkpe769wldrpjh00ca.jpg'),
(51, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746691/fashionify/products/zgpwsa1xdcjsyqz7nlgu.jpg'),
(51, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746700/fashionify/products/r3jfm4rrxmlqqi2ezym2.jpg'),
(51, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746698/fashionify/products/mnslscb5g3jc8c3acami.jpg'),
(52, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746949/fashionify/products/mbqayntayobskxqcxaex.jpg'),
(52, 'https://res.cloudinary.com/davmbisny/image/upload/v1780746992/fashionify/products/skjfydxx4q4xwif5uol3.jpg'),
(52, 'https://res.cloudinary.com/davmbisny/image/upload/v1780747000/fashionify/products/ovxo63n8oekoflegf8kg.jpg');

-- Table structure for `product_size_variants`
DROP TABLE IF EXISTS `product_size_variants`;
CREATE TABLE "product_size_variants" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "measurements" text,
  "size" varchar(255) NOT NULL,
  "stock" int NOT NULL,
  "product_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  KEY "FKraxkh1gthck9mweskwh29f5nd" ("product_id"),
  CONSTRAINT "FKraxkh1gthck9mweskwh29f5nd" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `product_size_variants`
INSERT INTO `product_size_variants` (`id`, `measurements`, `size`, `stock`, `product_id`) VALUES
(142, 'Bust 30.5-32', 'XS', 50, 35),
(143, 'Bust 32.5-34', 'S', 70, 35),
(144, 'Bust 34.5-36', 'M', 40, 35),
(145, 'Bust 36.5-38', 'L', 60, 35),
(146, 'Bust 32.5-34', 'S', 90, 36),
(147, 'Bust 34.5-36', 'M', 50, 36),
(148, 'Bust 36.5-38', 'L', 60, 36),
(149, 'Bust 30.5-32', 'XS', 40, 37),
(150, 'Bust 32.5-34', 'S', 50, 37),
(151, 'Bust 34.5-36', 'M', 50, 37),
(152, 'Bust 36.5-38', 'L', 40, 37),
(153, 'Bust 32.5-34', 'M', 60, 38),
(154, 'Bust 34.5-36', 'L', 40, 38),
(155, 'Bust 36.5-38', 'S', 30, 38),
(156, 'Bust 32.5-34', 'S', 40, 39),
(157, 'Bust 34.5-36', 'M', 39, 39),
(158, 'Bust 36.5-38', 'L', 50, 39),
(159, 'Chest 38.5-40', 'M', 28, 40),
(160, 'Chest 40.5-42', 'L', 45, 40),
(161, 'Chest 42.5-44', 'XL', 50, 40),
(162, 'Chest 38.5-40', 'M', 48, 41),
(163, 'Chest 40.5-42', 'L', 40, 41),
(164, 'Chest 42.5-44', 'XL', 45, 41),
(165, 'Chest 38.5-40', 'M', 40, 42),
(166, 'Chest 40.5-42', 'L', 40, 42),
(167, 'Chest 24.5-44', 'XL', 30, 42),
(168, 'Chest 38.5-40', 'M', 32, 43),
(169, 'Chest 40.5-42', 'L', 30, 43),
(170, 'Chest 38.5-40', 'M', 30, 44),
(171, 'Chest 40.5-42', 'L', 40, 44),
(172, 'Chest 42.5-44', 'XL', 40, 44),
(173, 'Chest 44.5-46', 'XXL', 50, 44),
(174, 'Chest 38.5-40', 'M', 30, 45),
(175, 'Chest 40.5-42', 'L', 35, 45),
(176, 'Chest 42.5-44', 'XL', 40, 45),
(177, 'Chest 27', '8Y (122cm)', 40, 46),
(178, 'Chest 28.5', '10Y (134cm)', 45, 46),
(179, 'Chest 30', '12Y (146cm)', 8, 46),
(180, 'Chest 27', '8Y (122cm)', 29, 47),
(181, 'Chest 28.5', '10Y (134cm)', 10, 47),
(182, 'Chest 30', '12Y (146cm)', 4, 47),
(183, 'Chest 29', '8Y (122cm)', 50, 48),
(184, 'Chest 30.5', '10Y (134cm)', 40, 48),
(185, 'Chest 32.5', '12Y (146cm)', 5, 48),
(186, 'To Fit - Foot Length 6.7\"', 'UK 9', 19, 49),
(187, 'To Fit - Foot Length 7\"', 'UK 10', 25, 49),
(188, 'To Fit - Foot Length 7.2\"', 'UK 11', 2, 49),
(189, 'To Fit - Foot Length 6.7\"', 'UK 9', 10, 50),
(190, 'To Fit - Foot Length 7\"', 'UK 10', 20, 50),
(191, 'To Fit - Foot Length 7.2\"', 'UK 11', 1, 50),
(192, 'Dimensions : 30 x 15 x 45 cm', 'One Size', 30, 51),
(193, 'Fixed Size', 'One Size', 20, 52);

-- Table structure for `product_tags`
DROP TABLE IF EXISTS `product_tags`;
CREATE TABLE "product_tags" (
  "product_id" bigint NOT NULL,
  "tag" varchar(64) DEFAULT NULL,
  KEY "idx_product_tag_tag" ("tag"),
  KEY "FK5rk6s19k3risy7q7wqdr41uss" ("product_id"),
  CONSTRAINT "FK5rk6s19k3risy7q7wqdr41uss" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `product_tags`
INSERT INTO `product_tags` (`product_id`, `tag`) VALUES
(35, 'trendy'),
(35, 'western'),
(35, 'summer wear'),
(35, 'casual'),
(35, 'graphic print'),
(36, 'trendy'),
(36, 'casual'),
(36, 'comfort fit'),
(36, 'premium'),
(36, 'streetwear'),
(37, 'casual'),
(37, 'summer wear'),
(37, 'western'),
(37, 'boho'),
(37, 'comfort fit'),
(38, 'floral'),
(38, 'casual'),
(38, 'summer wear'),
(38, 'comfort fit'),
(38, 'streetwear'),
(39, 'trendy'),
(39, 'minimalist'),
(39, 'casual'),
(39, 'summer wear'),
(39, 'comfort fit'),
(40, 'streetwear'),
(40, 'trendy'),
(40, 'casual'),
(40, 'urban'),
(40, 'graphic print'),
(41, 'genz'),
(41, 'trendy'),
(41, 'summer wear'),
(41, 'cozy'),
(41, 'slim fit'),
(42, 'streetwear'),
(42, 'linen'),
(42, 'cozy'),
(42, 'baggy'),
(42, 'urban'),
(43, 'trendy'),
(43, 'streetwear'),
(43, 'genz'),
(43, 'summer wear'),
(43, 'urban'),
(44, 'streetwear'),
(44, 'trendy'),
(44, 'premium cotton'),
(44, 'pure cotton'),
(44, 'luxury'),
(45, 'oversized'),
(45, 'streetwear'),
(45, 'genz'),
(45, 'pure cotton'),
(45, 'baggy'),
(46, 'comfortable'),
(46, 'soft cotton'),
(46, 'summer wear'),
(46, 'casual'),
(46, 'vibrant colors'),
(47, 'playful'),
(47, 'comfortable'),
(47, 'soft cotton'),
(47, 'summer wear'),
(47, 'casual'),
(48, 'playful'),
(48, 'comfortable'),
(48, 'soft cotton'),
(48, 'summer wear'),
(48, 'vibrant colors'),
(49, 'everyday'),
(49, 'casual'),
(49, 'premium'),
(49, 'comfort'),
(49, 'slip-on'),
(50, 'casual'),
(50, 'everyday'),
(50, 'slip-on'),
(50, 'comfort'),
(50, 'trending'),
(51, 'trending'),
(51, 'premium'),
(51, 'everyday carry'),
(51, 'luxury'),
(51, 'fashion essential'),
(52, 'trending'),
(52, 'fashion essential'),
(52, 'classic'),
(52, 'premium'),
(52, 'everyday carry');

-- Table structure for `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE "products" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "average_review" double DEFAULT NULL,
  "brand" varchar(255) DEFAULT NULL,
  "category" varchar(255) DEFAULT NULL,
  "created_at" datetime(6) DEFAULT NULL,
  "description" text,
  "price" double NOT NULL,
  "sale_price" double DEFAULT NULL,
  "title" varchar(255) NOT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  PRIMARY KEY ("id"),
  KEY "idx_product_category" ("category"),
  KEY "idx_product_brand" ("brand"),
  KEY "idx_product_price" ("price")
);

-- Data for table `products`
INSERT INTO `products` (`id`, `average_review`, `brand`, `category`, `created_at`, `description`, `price`, `sale_price`, `title`, `updated_at`) VALUES
(35, 0.0, 'h&m', 'women', '2026-06-06 12:52:32.772610', 'Fabric Composition:	100% Cotton\nLength:	Medium\nPackage Contains:	1 Women\'s Tshirt\nTransparency:	Opaque\nUSP:	Typographic Print, Crew Neck.\nWash Care:	Machine wash cold\nModel Chest Size:	33\"\nModel Height:	5\"9\'\nSize worn by Model:	S\nFabric:	100% Cotton\nNeckline:	Round\nFabric Description:	Knit\nProduct Code:	443395571013', 399.0, 299.0, 'Short Sleeve Harry Potter Chest Print Crew Tshirt', '2026-06-06 12:52:32.772653'),
(36, 0.0, 'h&m', 'women', '2026-06-06 12:58:34.106525', 'Fabric Composition:	100% Polyester\nLength:	Medium\nPackage Contains:	1 Women\'s Tshirt\nTransparency:	Opaque\nUSP:	Contrast Panel & Cuff.\nWash Care:	Machine wash cold\nSleeve Type:	Drop-shoulder\nModel Chest Size:	33\"\nModel Height:	5\'9\"\nSize worn by Model:	S\nFabric:	Polyester\nNeckline:	V-neck\nProduct Code:	443342527005', 999.0, 749.0, 'Drop Shoulder Contrast Panelled Textured Tshirt', '2026-06-06 12:58:34.106573'),
(37, 0.0, 'zara', 'women', '2026-06-06 13:02:37.555585', 'Fabric Composition:	92% Polyester, 8% Spandex\nLength:	Medium\nPackage Contains:	1 Women\'s Tshirt\nTransparency:	Opaque\nUSP:	Low Armhole.\nWash Care:	Machine wash warm\nModel Chest Size:	33\"\nModel Height:	5\"9\'\nSize worn by Model:	S\nFabric:	Polyester Spandex\nNeckline:	Round\nFabric Description:	Knit\nProduct Code:	443396498007', 389.0, 299.0, 'Medium Length Sleeveless Tank Tshirt', '2026-06-06 13:02:37.555600'),
(38, 0.0, 'zara', 'women', '2026-06-06 13:07:39.704929', 'Fabric Composition:	100% Cotton\nLength:	Long\nPackage Contains:	1 Women\'s Tshirt\nTransparency:	Opaque\nUSP:	Crew Neck, Embroidered Detail.\nWash Care:	Machine wash cold\nSleeve Type:	Drop-shoulder\nModel Chest Size:	33\"\nModel Height:	5\'9\"\nSize worn by Model:	S\nFabric:	100% Cotton\nNeckline:	Round\nProduct Code:	443400019013', 449.0, NULL, 'Drop Shoulder Floral Embroidered Detail Crew Tshirt', '2026-06-06 13:07:39.704970'),
(39, 0.0, 'levi', 'women', '2026-06-06 13:15:02.029415', 'Fabric Composition:	100% Cotton\nLength:	Short\nPackage Contains:	1 Women\'s Tshirt\nTransparency:	Opaque\nUSP:	Embroidered Patch Detail, Crew Neck, Mock Button Detail.\nWash Care:	Machine wash cold\nSleeve Type:	Raglan\nModel Chest Size:	33\"\nModel Height:	5\"9\'\nSize worn by Model:	S\nFabric:	100% Cotton\nNeckline:	Round\nFabric Description:	Knit\nProduct Code:	443393190007', 399.0, NULL, 'Raglan Sleeve Typographic Chest Patch Detail Crew Tshirt', '2026-06-06 13:15:02.029448'),
(40, 3.0, 'h&m', 'men', '2026-06-06 16:13:17.208857', 'Fabric:	100% Cotton\nStyle Type:	Chest print\nSleeve:	Short\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Crew Neck, Graphic Print.\nWash Care:	Machine wash warm\nPrimary Color:	Black\nModel Chest Size:	39\"\nModel Height:	6\"1\'\nSize worn by Model:	M\nFabric Composition:	100% Cotton\nNeckline:	Round\nProduct Code:	443402397011', 299.0, NULL, 'Short Sleeve Typographic Chest Print Crew Tshirt', '2026-06-07 12:10:55.926913'),
(41, 0.0, 'zara', 'men', '2026-06-06 16:21:01.616422', 'Fabric:	95% Polyester, 5% Spandex\nStyle Type:	Solid\nSleeve:	Sleeveless\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Panelled Hood, Contrast Stripe.\nWash Care:	Machine wash cold\nPrimary Color:	Dark Navy\nModel Chest Size:	39\"\nModel Height:	6\'1\"\nSize worn by Model:	M\nFabric Composition:	Polyester Spandex\nNeckline:	Hooded\nProduct Code:	443393204006', 599.0, 399.0, 'Medium Length Sleeveless Buttoned Hooded Tshirt', '2026-06-06 16:21:01.616471'),
(42, 0.0, 'puma', 'men', '2026-06-06 16:26:59.643074', 'Fabric:	100% Polyester\nStyle Type:	Solid\nSleeve:	Full-Length\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Notch neck.\nWash Care:	Machine wash cold\nPrimary Color:	Dark Grey\nModel Chest Size:	39\"\nModel Height:	6\"1\'\nSize worn by Model:	M\nFabric Composition:	Polyester\nNeckline:	Henley\nProduct Code:	443342440003', 999.0, 799.0, 'Full Sleeve Notched Henley Neck Tshirt', '2026-06-06 16:26:59.643115'),
(43, 0.0, 'levi', 'men', '2026-06-06 16:30:38.608877', 'Fabric:	100% Cotton\nStyle Type:	Chest print\nSleeve:	Short\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Crew Neck ,Typographic.\nWash Care:	Machine wash warm\nPrimary Color:	Black\nModel Chest Size:	39\"\nModel Height:	6\"1\'\nSize worn by Model:	M\nMood:	Casual\nFabric Composition:	100% Cotton\nNeckline:	Round\nProduct Code:	443400057006', 499.0, 349.0, 'Short Sleeve Graphic Chest Print Crew Tshirt', '2026-06-06 16:30:38.608926'),
(44, 0.0, 'zara', 'men', '2026-06-06 16:36:26.983253', 'Fabric:	100% Cotton\nStyle Type:	undefined\nSleeve:	Short\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Polo Neck.\nWash Care:	Machine wash cold\nPrimary Color:	Beige\nModel Chest Size:	39\"\nModel Height:	6\'1\"\nSize worn by Model:	M\nFabric Composition:	100% Cotton\nNeckline:	Collar\nProduct Code:	443401328001', 999.0, 749.0, 'Medium Length Short Sleeve Polo Tshirt', '2026-06-06 16:36:26.983372'),
(45, 0.0, 'h&m', 'men', '2026-06-06 16:42:56.908188', 'Fabric:	100% Cotton\nStyle Type:	Full front print\nSleeve:	Short\nLength:	Medium\nPackage Contains:	1 Men\'s Tshirt\nTransparency:	Opaque\nUSP:	Crew Neck, Drop Shoulder, Typographic Print.\nWash Care:	Machine wash cold\nPrimary Color:	Grey\nModel Chest Size:	39\"\nModel Height:	6\"1\'\nSize worn by Model:	M\nFabric Composition:	100% Cotton\nNeckline:	Round\nProduct Code:	443393029006', 399.0, NULL, 'Drop Shoulder Graphic Back Print Crew Tshirt', '2026-06-06 16:42:56.908239'),
(46, 0.0, 'pantaloons_junior', 'kids', '2026-06-06 17:03:33.666577', 'Add a casual edge to your wardrobe with this Goku printed T-shirt, featuring a classic crew neckline and comfortable half sleeves. Crafted from soft, breathable fabric, it offers all-day ease while keeping your look effortlessly stylish.', 499.0, NULL, 'Kids Goku Print T-shirt', '2026-06-06 17:03:33.666629'),
(47, 4.0, 'fabindia', 'kids', '2026-06-06 17:08:09.853151', 'Power up his casual style with this cool Dragon Ball Z print tee. Designed with a classic crew neckline and half sleeves, it offers everyday comfort while showcasing his favourite anime character.', 499.0, 399.0, 'Kids Dragon Ball-Z Print T-shirt', '2026-06-07 12:53:23.923766'),
(48, 0.0, 'pantaloons_junior', 'kids', '2026-06-06 17:11:51.464515', 'This Sakura print oversized T-shirt is a relaxed and stylish staple. Featuring a classic round neck and half sleeves, it offers a comfortable fit with a trendy oversized silhouette.', 449.0, NULL, 'Kids Sakura Print Oversized T-shirt', '2026-06-06 17:11:51.464555'),
(49, 5.0, 'crocs', 'footwear', '2026-06-06 17:16:48.704127', 'Step into comfort and style with these clogs, featuring fun charms for a personalized touch. The sling backstrap ensures a secure fit, making them perfect for all-day wear.', 3999.0, 2999.0, 'Boys Batman Clogs with Charms', '2026-06-13 20:46:41.341502'),
(50, 0.0, 'crocs', 'footwear', '2026-06-06 17:20:17.044428', 'These clogs with charms bring playful style and comfort together. Designed with a sling-back strap for a secure fit, they feature a lightweight build and ventilation holes for breathability', 3999.0, 2999.0, 'Boys Captain America Clogs with Charms', '2026-06-06 17:20:17.044467'),
(51, 0.0, 'under_armour', 'accessories', '2026-06-06 17:23:53.912049', 'Carry everything with this solid backpack. It features double push buckles, a top handle, and adjustable backstraps. Features double front zip pockets, back mesh, and a drawcord at the top. Features a main compartment with interior pockets.', 2999.0, 1599.0, 'Men Solid Backpack', '2026-06-06 17:23:53.912111'),
(52, 0.0, 'reebok', 'accessories', '2026-06-06 17:28:30.884944', 'Show off your superhero style with this Spiderman print baseball cap. Featuring a bold Spiderman design and a velcro closure for a secure, adjustable fit, it’s the perfect accessory for any Marvel fan looking to add some fun to their outfit.', 549.0, NULL, 'Boys Spiderman Print Baseball Cap', '2026-06-06 17:28:30.884989');

-- Table structure for `reviews`
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE "reviews" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "fit_feedback" varchar(255) DEFAULT NULL,
  "image_url" text,
  "review_message" text,
  "review_value" int NOT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "user_name" varchar(255) DEFAULT NULL,
  "verified_purchase" bit(1) NOT NULL,
  "product_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "uq_review_user_product" ("product_id","user_id"),
  KEY "idx_review_product" ("product_id"),
  KEY "FKcgy7qjc1r99dp117y9en6lxye" ("user_id"),
  CONSTRAINT "FKcgy7qjc1r99dp117y9en6lxye" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
  CONSTRAINT "FKpl51cejpw4gy5swfar8br9ngi" FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Data for table `reviews`
INSERT INTO `reviews` (`id`, `created_at`, `fit_feedback`, `image_url`, `review_message`, `review_value`, `updated_at`, `user_name`, `verified_purchase`, `product_id`, `user_id`) VALUES
(1, '2026-06-07 12:10:55.597946', 'Runs Small', '', 'Good', 3, '2026-06-07 12:10:55.597946', 'Arnab Roy', 0x01, 40, 3),
(2, '2026-06-07 12:53:23.573184', 'True to Size', '', 'Nice tshirt for gen-alpha kids', 4, '2026-06-07 12:53:23.573184', 'Arnab Roy', 0x01, 47, 3),
(3, '2026-06-13 20:46:41.049117', 'True to Size', '', 'Perfect fittings, extremely good quality, value for money and totally worth it ☺️', 5, '2026-06-13 20:46:41.049169', 'Subhajit Sarkar', 0x01, 49, 5);

-- Table structure for `user_coupon_usages`
DROP TABLE IF EXISTS `user_coupon_usages`;
CREATE TABLE "user_coupon_usages" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "coupon_id" bigint NOT NULL,
  "created_at" datetime(6) DEFAULT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "usage_count" int NOT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `user_coupon_usages`
INSERT INTO `user_coupon_usages` (`id`, `coupon_id`, `created_at`, `updated_at`, `usage_count`, `user_id`) VALUES
(1, 2, '2026-06-06 10:47:41.940263', '2026-06-06 10:47:41.940281', 1, 1);

-- Table structure for `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE "users" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "age" varchar(255) DEFAULT NULL,
  "avatar" text,
  "bottom_size" varchar(255) DEFAULT NULL,
  "created_at" datetime(6) DEFAULT NULL,
  "email" varchar(255) NOT NULL,
  "gender" varchar(255) DEFAULT NULL,
  "password" varchar(255) NOT NULL,
  "preferred_style" varchar(255) DEFAULT NULL,
  "role" varchar(255) NOT NULL,
  "shoe_size" varchar(255) DEFAULT NULL,
  "top_size" varchar(255) DEFAULT NULL,
  "updated_at" datetime(6) DEFAULT NULL,
  "user_name" varchar(255) NOT NULL,
  "weight" varchar(255) DEFAULT NULL,
  "date_of_birth" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id"),
  UNIQUE KEY "UK6dotkott2kjsp8vw4d0m25fb7" ("email"),
  UNIQUE KEY "UKk8d0f2n7n88w1a16yhua64onx" ("user_name")
);

-- Data for table `users`
INSERT INTO `users` (`id`, `age`, `avatar`, `bottom_size`, `created_at`, `email`, `gender`, `password`, `preferred_style`, `role`, `shoe_size`, `top_size`, `updated_at`, `user_name`, `weight`, `date_of_birth`) VALUES
(1, NULL, NULL, NULL, '2026-06-05 20:37:36.646634', 'admin@gmail.com', NULL, '$2a$10$AExJFjfQpbV0IV/LKc76W.CzRKOiYUs9vXKeVENZPSHoaWew/sNPa', NULL, 'admin', NULL, NULL, '2026-06-06 14:52:10.794161', 'Admin', NULL, NULL),
(3, '22', NULL, NULL, '2026-06-07 12:03:37.960406', 'rarnab225@gmail.com', 'Male', '$2a$10$j0YFit8RUVpHK88BDdaV5.ekFdCF1K/qfRWj6aNX8eUjP1ToPMa7q', NULL, 'user', NULL, NULL, '2026-06-26 10:34:40.764105', 'Arnab Roy', NULL, '2003-07-27'),
(4, '20', NULL, NULL, '2026-06-10 19:00:32.861377', 'arnabroy.bca2022@nsec.ac.in', 'Male', '$2a$10$I9JwYB5vM0TW7x7eNe5M3OR9795fiy9b54HrB699shu1DvwlAk6be', NULL, 'user', NULL, NULL, '2026-06-10 19:00:32.861377', 'Baban', NULL, '2005-08-24'),
(5, '21', NULL, NULL, '2026-06-10 13:45:34.383386', 'hellosubhajit123456@gmail.com', 'Male', '$2a$10$P4JcYMz2HFv/yRgkEU6eHeIfhGmAW6X4CRpp1jZqAOj9ZBUWA5ajC', NULL, 'user', NULL, NULL, '2026-06-26 11:13:57.964359', 'Subhajit Sarkar', NULL, '2004-08-19'),
(6, '21', NULL, NULL, '2026-06-11 04:16:24.667705', 'swas45790@gmail.com', 'Male', '$2a$10$PCwVm9/OnyOn3Xor8QXFtO90dKJDB5RPHt2pVA4mj3.kQq1fU6FIK', NULL, 'user', NULL, NULL, '2026-06-11 04:16:24.667755', 'Swastika Roy', NULL, '2004-08-30'),
(7, '22', NULL, NULL, '2026-08-04 07:58:23.157375', 'sushamapodder12@gmail.com', 'Female', '$2a$10$PGLGL8onjuGFuZExKwHBlua3oHAq6Rz5J/M0CGlAV0Ri.UTz2STty', NULL, 'user', NULL, NULL, '2026-08-04 07:58:23.157417', 'Sushama Podder', NULL, '2003-09-12');

-- Table structure for `waitlists`
DROP TABLE IF EXISTS `waitlists`;
CREATE TABLE "waitlists" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "created_at" datetime(6) DEFAULT NULL,
  "email" varchar(255) NOT NULL,
  "is_notified" bit(1) NOT NULL,
  "product_id" bigint NOT NULL,
  "size" varchar(255) NOT NULL,
  PRIMARY KEY ("id")
);

-- Table structure for `wishlists`
DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE "wishlists" (
  "id" bigint NOT NULL AUTO_INCREMENT,
  "product_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  PRIMARY KEY ("id")
);

-- Data for table `wishlists`
INSERT INTO `wishlists` (`id`, `product_id`, `user_id`) VALUES
(4, 37, 7);

SET FOREIGN_KEY_CHECKS = 1;
