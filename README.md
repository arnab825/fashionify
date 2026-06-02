# Fashionify 🛍️

Fashionify is a modern, full-stack e-commerce application featuring a sleek, dark-mode user interface and a robust Spring Boot backend. 

## 🚀 Features

- **Public Shop Browsing:** Guests can effortlessly browse products, search, and filter by categories and brands.
- **Secure Authentication:** JWT-based authentication system with separate flows for customers and administrators.
- **Shopping Cart & Checkout:** Seamless cart management and a secure checkout flow (integrated with Razorpay).
- **Real-World Product Management:** Products now support size variants (e.g., S, M, L or UK sizes) with individual stock limits, mimicking real e-commerce systems.
- **Modern Search UI:** A modernized, vertical-style search bar with built-in throttling/debouncing for an ultra-smooth experience.
- **Admin Dashboard:** A dedicated portal for administrators to manage products, sizes, stocks, view orders, and upload images seamlessly.
- **Dark Mode UI:** A gorgeous, responsive, and dynamic interface built with TailwindCSS and Shadcn UI.
- **Cloudinary Integration:** Efficient product image hosting and delivery via Cloudinary.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** TailwindCSS + Shadcn UI (Custom Dark Theme)
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM

### Backend
- **Framework:** Java 21 + Spring Boot 3.x
- **Database:** MySQL
- **Security:** Spring Security + JWT
- **Cloud Storage:** Cloudinary (for images)
- **Payment Gateway:** Razorpay (Test Mode)

## 🏗️ Project Structure

The project is structured as a monorepo containing two main folders:

- `/frontend` - Contains the React application.
- `/backend` - Contains the Spring Boot application.

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- Java 21
- Maven
- MySQL Server

### 1. Database Setup
You can either install MySQL locally or run it instantly via Docker.

**Option A: Using Docker (Recommended)**
If you have Docker Desktop installed, simply start the database container:
```bash
cd backend
docker-compose up -d mysql
```

**Option B: Manual MySQL Installation**
Create a MySQL database named `fashionify` in your local MySQL server:
```sql
CREATE DATABASE fashionify;
```

### 2. Backend Setup
Navigate to the backend directory and configure your environment variables:
```bash
cd backend
```
Ensure you have the correct variables in your `.env` file (or `application.properties`), such as:
- `spring.datasource.url`
- `spring.datasource.username` / `password`
- `cloudinary.cloud-name`, `api-key`, `api-secret`
- `jwt.secret`

Start the Spring Boot server using the bundled Maven Wrapper (no global Maven installation required):
```bash
# On Mac/Linux:
./mvnw spring-boot:run

# On Windows:
.\mvnw.cmd spring-boot:run
```
*Note: The backend runs on `http://localhost:8080` by default.*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies and start the development server:
```bash
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:5173` by default.*

## 🔐 Default Admin Credentials
When the backend initializes the database, it automatically creates a default admin account for you:
- **Email:** `admin@gmail.com`
- **Password:** `demo`

## 📄 License
This project is for educational and portfolio purposes.
