# Fashionify 🛍️

**Fashionify** is a premium, full-stack e-commerce platform that combines a bold **Neubrutalism design system** (vibrant high-contrast layouts, heavy drop-shadows, and sharp borders) with a highly structured and performant **Spring Boot** (Java) and **React** (Vite) architecture.

This project is built with clean engineering patterns, featuring role-based dashboards, JWT security in secure cookies, transactional email notifications, dynamic search filtering, and cloud image hosting.

---

## 🎨 Neubrutalism Design Philosophy
Fashionify breaks away from generic, minimalist store templates by using Neubrutalism:
*   **Acid Accents**: Sleek warm backgrounds highlighted by striking Acid Lime details.
*   **Tactile Borders**: Solid black 2px borders with geometric typography (Inter/Outfit).
*   **Hard Drop-Shadows**: Non-blurry black offsets (`box-shadow: 4px 4px 0px 0px #000`) on inputs, buttons, and panels.

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Interactive Shop Catalog**: Smoothly filter clothing by category/brand and sort by price.
- **Throttled Search System**: Quick search indexing to retrieve products instantly.
- **Dynamic Shopping Cart**: Manage size variations (S, M, L) and item quantities dynamically.
- **Address Book**: Save and manage shipping addresses for fast checkouts.
- **Printable Receipts**: Generates clean, professional PDF invoices directly from the browser.

### 🔐 Security & Operations
- **Stateless Authorization**: JWT token generation stored in secure, HTTP-only cookies.
- **2-Factor Email OTP**: Verified registration verification via **Brevo API** transactional emails.
- **Role-Based Guards**: Clean client-side routing protection restricting admin views from buyers.

### 📊 Administrative Dashboard
- **Sales Analytics**: View total revenue, average order value, sales metrics, and transaction charts.
- **Inventory Control**: Update stock limits, size variants, and create/modify products.
- **Cache Eviction**: Automated cache clearing to update catalog screens for buyers instantly.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (v18) + Vite | Dynamic rendering and fast client-side routing. |
| **State Management** | Redux Toolkit | Centralized, app-wide global data warehouse. |
| **Styling** | Tailwind CSS + Shadcn | Utility classes customized for Neubrutalist layouts. |
| **Backend** | Java 21 + Spring Boot 3.x | Type-safe REST APIs and enterprise business logic. |
| **Database** | MySQL | Relational data persistence. |
| **Security** | Spring Security + JWT | Stateless cookie checks and role checks. |
| **Integrations** | Cloudinary / Brevo / Razorpay | Image hosting, OTP mail dispatch, and payment simulated flows. |

---

## 🏗️ Architecture Overview

Fashionify uses a **Client-Server Architecture**:
1.  **Frontend Client**: React pages capture user events, dispatch actions to the Redux store, and call APIs via Axios.
2.  **Backend API**: Spring Boot controllers validate inputs, services run calculations, and repositories query MySQL via JPA Hibernate.
3.  **Database Persistence**: MySQL holds normalized tables for users, carts, orders, and products.

### 📂 High-Level Folder Structure
```text
fashionify/
├── docs/                 <-- Comprehensive Documentation Suite
├── backend/              <-- Spring Boot (Java) Server Project
│   ├── src/main/java/    <-- Controllers, Services, Repositories, Entities
│   └── src/main/resources/ <-- Configuration properties (.env)
└── frontend/             <-- React (Vite) Client Project
    └── src/              <-- Pages, Components, Redux Slices, API Services
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Java 21**
- **MySQL Server**

### Setup Steps
1.  **Database**: Create a MySQL schema named `fashionify`.
2.  **Backend Configuration**: Create `backend/.env` (use `backend/.env.example` as a template):
    ```env
    DATABASE_URL=jdbc:mysql://<DATABASE_HOST>:<DATABASE_PORT>/fashionify?useSSL=false
    DB_USER=<DATABASE_USER>
    DB_PASSWORD=<DATABASE_PASSWORD>
    JWT_SECRET=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    ADMIN_EMAIL=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    ADMIN_PASSWORD=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    CLOUDINARY_CLOUD_NAME=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    CLOUDINARY_API_KEY=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    CLOUDINARY_API_SECRET=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    BREVO_API_KEY=<CONFIGURED_VIA_ENVIRONMENT_VARIABLE>
    ```
3.  **Run Backend**:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
4.  **Frontend Configuration**: Create `frontend/.env`:
    ```env
    VITE_API_URL=http://localhost:8080
    ```
5.  **Run Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 📖 Deeper Learning Documentation Links

For a complete guide to understanding, building, and contributing to the project, explore the detailed markdown files in our `docs/` folder:

- 🛍️ **[Project Overview](file:///Users/subhajit/Developer/Development/fashionify/docs/PROJECT_OVERVIEW.md)**: Conceptual guide to the store's goals, user roles, and features.
- 🏗️ **[Architecture Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/ARCHITECTURE_GUIDE.md)**: Deep dive into package layouts, layered controllers, and folder roles.
- ⚙️ **[Feature Flows](file:///Users/subhajit/Developer/Development/fashionify/docs/FEATURE_FLOWS.md)**: Step-by-step trace of how data flows from a browser click down to the database.
- 🔌 **[REST API Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/API_GUIDE.md)**: Endpoint inputs, query schemas, and response formats.
- 🗄️ **[Database Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/DATABASE_GUIDE.md)**: ER diagrams, column types, and JPA Hibernate mappings.
- 🎓 **[Beginner's Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/BEGINNER_GUIDE.md)**: Onboarding guide explaining Controllers, Dependency Injection, and JWTs from scratch.
- 🤝 **[Contributing Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/CONTRIBUTING_GUIDE.md)**: Code style guides, naming conventions, and Git pull request workflow.
- 🔒 **[Publication Safety Audit](file:///Users/subhajit/Developer/Development/fashionify/docs/PUBLICATION_SAFETY_AUDIT.md)**: Code compliance audit confirming zero exposed secrets.

---

## 🎓 Learning Goals
- **State Flow**: Trace global variables in Redux to keep cart icons updated across screens.
- **Stateless Auth**: Understand security validations checking HTTP-only tokens on every query.
- **Performance Optimization**: Learn how to use `@Cacheable` to reduce DB query speeds.

---

## 🔮 Future Improvements
- **Recommendation Engine**: Add product suggestions powered by user preferred sizing and catalog history.
- **Automated Testing Suite**: Integrate robust JUnit test cases and React testing primitives.
- **Real Payment Gateway Integration**: Switch from Razorpay simulated mode to live keys for production checkouts.
- **Advanced Admin Audit Logging**: Store historical changes to product inventory and variant stocks.

---

## 🤝 Contributing
Please read the [Contributing Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/CONTRIBUTING_GUIDE.md) to understand coding standards and branch management guidelines.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
