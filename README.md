# Fashionify 🛍️

Fashionify is a premium, full-stack e-commerce platform that combines a bold **Neubrutalism design system** (inspired by high-contrast layout trends, vibrant acid accents, and heavy black drop-shadows) with a highly organized and performant **Spring Boot** and **React** architecture.

Designed with modern engineering patterns in mind, Fashionify features type-safe state management, centralized API request handlers, decoupled controller mappings, and fully integrated third-party integrations (payments, image hosting, and email notifications).

---

## 🎨 Neubrutalism Design Aesthetic
Fashionify breaks away from standard, generic e-commerce templates by adopting a **Neubrutalism layout** characterized by:
*   **Vibrant Color Palette**: Warm editorial tones and deep charcoal offset by eye-catching Acid Lime highlights.
*   **Hard Shadows**: Solid, non-blurred black drop-shadows (`box-shadow: 4px 4px 0px 0px #000`) on buttons, inputs, headers, and modal cards.
*   **Sharp Boarders & Typography**: Black 2px borders with modern geometric fonts (like Outfit or Inter) to create a clean, responsive, and tactile web experience.

---

## 🚀 Key Features

### 🛍️ Customer Experience
*   **Public Shop Catalog**: Browse products smoothly, filter by category/brand, and sort items dynamically.
*   **Vertical Search System**: A customized, throttled/debounced search bar that yields instant results without overloading the server.
*   **Shopping Cart & Checkout**: Interactive side-drawer cart allowing quantity updates, size selections, and a seamless transition to checkout.
*   **Personalized Wishlist**: Add and remove items instantly to build a curated favorites collection.
*   **Address Management**: A reusable, structured address book for faster checkouts.
*   **Receipt Download**: Generates and downloads clean, themed, professional PDFs for purchases using custom JS print formatting.

### 🔐 Security & User Lifecycle
*   **Separate User/Admin Flows**: Tailored dashboards and features based on roles.
*   **JWT-Based Authentication**: Stateless authentication utilizing secure, HTTP-only cookie storage.
*   **Two-Factor Verification (OTP)**: Secure customer sign-up flow requiring a 4-digit verification code sent to the user's email via the Brevo API.

### 📊 Administrative Portal
*   **Analytics Dashboard**: Visualized insights showing total revenue, unit sales, average order value, and order metrics using interactive charts.
*   **Inventory & Variant Management**: Products support custom sizing variants (e.g. S, M, L) with independent stock tracking.
*   **Feature Slide Management**: Manage homepage carousel banners, define active date ranges, and attach deep links.
*   **Low Stock Alerts**: Interactive visual warnings for items running critical on inventory.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (v18) + Vite | Fast, modern rendering and rapid developer builds. |
| **State Management** | Redux Toolkit | Centralized state engine for user auth, cart, listing, and admin panels. |
| **Styling** | Tailwind CSS + Shadcn UI | Utility-first neubrutalist layouts and accessible base primitives. |
| **Backend** | Java 21 + Spring Boot 3.x | Type-safe, multithreaded REST API and business logic. |
| **Database** | MySQL | Persistent relational database storage. |
| **Security** | Spring Security + JWT | Stateless endpoint authentication and role authorization checks. |
| **Storage** | Cloudinary | Cloud-based media management for catalog images. |
| **Email Gateway** | Brevo REST API | Transactional SMTP client for OTP and email generation. |
| **Payment Gateway** | Razorpay (Test Mode) | E-commerce transaction processing. |

---

## 🏗️ Architectural Best Practices (DRY & Decoupling)
*   **Centralized Axios Interface**: All frontend Redux slices communicate through a shared client instance. Base URLs, authorization headers, and cookie options are managed in a single file, eliminating inline credentials setup.
*   **Stateless Cookie Utility**: Backend JWT processing (cookie creation, token extraction, and sign-out deletion) is centralized, decoupling authentication controllers.
*   **Object-to-DTO Mappers**: Controllers decouple database entity representations from API payloads using unified mapping classes, guaranteeing consistent REST response schemas.

---

## 💻 Getting Started

### Prerequisites
*   **Node.js** (v18 or higher)
*   **Java 21**
*   **MySQL Server** (Running locally or via Docker)
*   **Maven** (Or use the bundled Maven Wrapper `./mvnw`)

---

### Step 1: Database Setup
Create a MySQL database instance named `fashionify`.

#### Option A: Docker (Recommended)
If you have Docker installed, spin up the database container instantly from the backend directory:
```bash
cd backend
docker-compose up -d mysql
```

#### Option B: Manual Installation
Connect to your local MySQL database server and execute:
```sql
CREATE DATABASE fashionify;
```

---

### Step 2: Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file (copying from [.env.example](file:///Users/subhajit/Developer/Development/fashionify/backend/.env.example) as a guide):
   ```env
   # Database Configuration
   DATABASE_URL=jdbc:mysql://your_db_host:your_db_port/fashionify?useSSL=false&serverTimezone=UTC
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Properties
   JWT_SECRET=your_super_secure_signing_key_at_least_32_characters_long
   JWT_EXPIRATION_MS=86400000

   # Admin Default Credentials
   ADMIN_EMAIL=admin@fashionify.com
   ADMIN_PASSWORD=AdminSecurePassword123

   # Cloudinary Media Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay Credentials (Test Mode)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret

   # Brevo Email Configuration
   BREVO_API_KEY=your_brevo_api_key
   BREVO_FROM_EMAIL=info@fashionify.com
   BREVO_FROM_NAME=Fashionify
   
   # CORS Allowed Origins
   ALLOWED_ORIGINS=http://localhost:5173
   ```
3. Start the Spring Boot backend server using the Maven Wrapper:
   *   **Unix (macOS / Linux)**:
       ```bash
       ./mvnw spring-boot:run
       ```
   *   **Windows (Command Prompt / Powershell)**:
       ```cmd
       .\mvnw.cmd spring-boot:run
       ```
   *Note: The server will run at `http://localhost:8080`.*

---

### Step 3: Frontend Setup
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Create a `.env` file to link to the API:
   ```env
   VITE_API_URL=http://localhost:8080
   ```
3. Install dependencies and launch the Vite development server:
   ```bash
   npm install
   npm run dev
   ```
   *Note: The user interface runs at `http://localhost:5173`.*


## 📄 License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

