# REST API Reference Guide: Fashionify 🔌

This guide provides a comprehensive reference of all REST API endpoints available in the **Fashionify** backend. For every endpoint, we explain its route, HTTP method, required inputs, output schema, authentication rules, and a beginner-friendly overview of how it works.

---

## 1. Introduction for Beginners

### What is a REST API Endpoint?
Think of our backend server as a kitchen in a restaurant, and the frontend web browser as a customer sitting at a table. The customer cannot go into the kitchen themselves. Instead, they look at a menu of options and tell a waiter what they want.
- **REST Endpoints** are the items on the menu.
- **HTTP Methods** (like `GET`, `POST`, `PUT`, `DELETE`) represent the type of request:
  - `GET`: "Bring me this information." (Read)
  - `POST`: "Create a new record with this data." (Create)
  - `PUT`: "Update this existing record with new data." (Update)
  - `DELETE`: "Delete this record." (Delete)
- **JSON Body**: The details sent to the kitchen (e.g. "I want my burger with no onions").

---

## 2. Authentication & Security Endpoints

Endpoints located under `/api/auth` manage the user lifecycle (signing in, checking sessions, updating user preferences).

### 1. Initiate Signup
*   **User Action**: User fills out registration fields and clicks "Register".
*   **Why it exists**: To make sure the user's email is real before saving them to the database.
*   **Behind the scenes**: Checks if the email or username is already taken. If unique, generates a 4-digit PIN (OTP), logs it in the database with a 5-minute expiry, and emails the user via Brevo.
*   **Route**: `POST /api/auth/signup/initiate`
*   **Auth Required**: None (Public)
*   **Request Body**:
    ```json
    {
      "email": "student@example.com",
      "userName": "studentCoder",
      "password": "SecurePassword123!",
      "dateOfBirth": "2000-01-01",
      "gender": "male"
    }
    ```
*   **Success Response** (`200 OK`):
    ```json
    {
      "success": true,
      "message": "OTP sent to student@example.com. Valid for 5 minutes."
    }
    ```
*   **Controller Used**: `OtpAuthController`
*   **Service Used**: `OtpService`, `EmailService`
*   **Database Tables**: `otp_verifications`, `users` (read check)

### 2. Verify OTP & Finalize Registration
*   **User Action**: User enters the 4-digit OTP received in their email.
*   **Behind the scenes**: Matches the OTP against the database record. If matching and valid, hashes the password and registers the user profile.
*   **Route**: `POST /api/auth/signup/verify`
*   **Auth Required**: None (Public)
*   **Request Body**:
    ```json
    {
      "email": "student@example.com",
      "otp": "1234"
    }
    ```
*   **Success Response** (`201 Created`):
    ```json
    {
      "success": true,
      "message": "Account created successfully.",
      "userId": 12,
      "userName": "studentCoder"
    }
    ```
*   **Controller Used**: `OtpAuthController`
*   **Service Used**: `OtpService`
*   **Database Tables**: `otp_verifications`, `users`

### 3. Customer Login
*   **User Action**: Customer logs in.
*   **Why it exists**: Verifies credentials and issues a secure access key (JWT).
*   **Route**: `POST /api/auth/login`
*   **Auth Required**: None (Public)
*   **Request Body**:
    ```json
    {
      "email": "student@example.com",
      "password": "SecurePassword123!"
    }
    ```
*   **Success Response** (`200 OK`):
    *Sets an HTTP-Only cookie containing the signed JWT.*
    ```json
    {
      "success": true,
      "message": "Logged in successfully",
      "user": {
        "id": 12,
        "userName": "studentCoder",
        "email": "student@example.com",
        "role": "user"
      }
    }
    ```
*   **Controller Used**: `AuthController`
*   **Database Tables**: `users`

### 4. Admin Login
*   **User Action**: Administrator logs in.
*   **Why it exists**: Only allows logins for users configured with the `ROLE_ADMIN` authority.
*   **Route**: `POST /api/admin-auth/login`
*   **Auth Required**: None (Public)
*   **Request Body**: Same as Customer Login.
*   **Controller Used**: `AdminAuthController`

### 5. Session Check
*   **User Action**: None (Happens automatically in the background when the app loads).
*   **Why it exists**: To restore the user's dashboard view if their session cookie is still valid.
*   **Route**: `GET /api/auth/check-auth`
*   **Auth Required**: Valid JWT cookie.
*   **Success Response** (`200 OK`): Same as Login user block.
*   **Controller Used**: `AuthController`

---

## 3. Product Catalog Endpoints (Shop Client)

### 1. Get Products List
*   **User Action**: Opens the shop page.
*   **Why it exists**: Fetches clothing items to show catalog lists.
*   **Route**: `GET /api/shop/products/get`
*   **Auth Required**: None (Public)
*   **Query Parameters**: `category`, `brand`, `sortBy` (optional filters)
*   **Success Response** (`200 OK`):
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "Neubrutalist Leather Jacket",
          "description": "Bold black leather jacket",
          "category": "men",
          "brand": "Fashionify Bold",
          "price": 120.0,
          "salePrice": 99.0,
          "imageUrl": "https://cloudinary.com/...",
          "sizeVariants": [
            { "size": "M", "stock": 15 },
            { "size": "L", "stock": 5 }
          ]
        }
      ]
    }
    ```
*   **Controller Used**: `ShopProductController`
*   **Service Used**: `ShopProductService` (Utilizes JVM Caching via `@Cacheable`)
*   **Database Tables**: `products`, `product_size_variants`

### 2. Search Products
*   **User Action**: User types search queries.
*   **Route**: `GET /api/shop/search/{keyword}`
*   **Controller Used**: `ShopSearchController`
*   **Database Tables**: `products`

---

## 4. Shopping Cart Endpoints

### 1. Retrieve Cart Details
*   **User Action**: Customer opens the shopping cart sidebar.
*   **Route**: `GET /api/shop/cart/get`
*   **Auth Required**: User JWT.
*   **Success Response** (`200 OK`):
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "userId": 12,
        "items": [
          {
            "productId": 1,
            "title": "Neubrutalist Leather Jacket",
            "size": "M",
            "quantity": 2,
            "price": 99.0
          }
        ]
      }
    }
    ```
*   **Controller Used**: `ShopCartController`
*   **Database Tables**: `carts`, `cart_items`

### 2. Add Item to Cart
*   **Route**: `POST /api/shop/cart/add`
*   **Request Body**:
    ```json
    {
      "productId": 1,
      "size": "M",
      "quantity": 1
    }
    ```

---

## 5. Order & Transaction Endpoints

### 1. Create Checkout Order
*   **User Action**: Clicks "Place Order".
*   **Route**: `POST /api/shop/order/create`
*   **Auth Required**: User JWT.
*   **Request Body**:
    ```json
    {
      "addressId": 3,
      "cartId": 5,
      "couponCode": "SUMMER10"
    }
    ```
*   **Success Response** (`201 Created`):
    ```json
    {
      "success": true,
      "orderId": 44,
      "paymentMode": "simulated",
      "totalAmount": 198.0
    }
    ```
*   **Controller Used**: `ShopOrderController`
*   **Service Used**: `ShopOrderService` (Locks inventory details, verifies coupon counts, clears user's cart)
*   **Database Tables**: `orders`, `order_items`, `product_size_variants`, `cart_items`

---

## 6. Admin Panel Control Endpoints

These endpoints are locked down to admin users.

### 1. Add Product (Create)
*   **Route**: `POST /api/admin/products/add`
*   **Auth Required**: Admin role (`ROLE_ADMIN`).
*   **Request Body**:
    ```json
    {
      "title": "Neon Acid Shirt",
      "description": "Bright neon green casual shirt",
      "category": "unisex",
      "brand": "AcidStudio",
      "price": 45.0,
      "salePrice": 39.0,
      "imageUrl": "https://cloudinary.com/...",
      "sizeVariants": [
        { "size": "S", "stock": 10 },
        { "size": "M", "stock": 20 }
      ]
    }
    ```
*   **Controller Used**: `AdminProductController`
*   **Database Action**: Inserts a product record, evicts catalog cache (`@CacheEvict`) to reload active catalog displays for shoppers.

### 2. Get Sales Dashboard Metrics
*   **Route**: `GET /api/admin/analytics/summary`
*   **Auth Required**: Admin role.
*   **Success Response**: Returns totals for revenue, average cart values, total users, and order summaries.
*   **Controller Used**: `AdminAnalyticsController`
*   **Database Tables**: `orders`, `users`, `order_items`

---

## 7. Coupon Management Endpoints

### 1. Validate Promo Coupon Code
*   **Route**: `GET /api/coupons/validate/{code}`
*   **Auth Required**: User JWT.
*   **Controller Used**: `CouponController`
*   **Database Tables**: `coupons`

---

### 🔗 Next Steps & Documentation
* 🛍️ **[Project Overview](file:///Users/subhajit/Developer/Development/fashionify/docs/PROJECT_OVERVIEW.md)**: Conceptual guide to the store's goals, user roles, and features.
* 🏗️ **[System Architecture Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/ARCHITECTURE_GUIDE.md)**: Explore how frontend-backend requests and database queries flow step-by-step.
* ⚙️ **[Feature Flows Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/FEATURE_FLOWS.md)**: Learn how user clicks process into database updates.
* 🗄️ **[Database Entity Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/DATABASE_GUIDE.md)**: Study tables, relationships, and queries.
* 🎓 **[Beginner Onboarding Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/BEGINNER_GUIDE.md)**: Learn the core concepts of the project from scratch.
* 🤝 **[Contributing Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/CONTRIBUTING_GUIDE.md)**: Guidelines for styling, naming conventions, and contributing.
* 🔒 **[Publication Safety Audit](file:///Users/subhajit/Developer/Development/fashionify/docs/PUBLICATION_SAFETY_AUDIT.md)**: Verification of security patterns.
