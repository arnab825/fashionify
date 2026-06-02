# Fashionify 🛍️

Fashionify is a modern, full-stack e-commerce application featuring a sleek, dark-mode user interface and a robust Spring Boot backend. 

## 🚀 Features

- **Public Shop Browsing:** Guests can effortlessly browse products, search, and filter by categories and brands.
- **Secure Authentication:** JWT-based authentication system with separate flows for customers and administrators.
- **Shopping Cart & Checkout:** Seamless cart management and a secure checkout flow (integrated with Razorpay).
- **Admin Dashboard:** A dedicated portal for administrators to manage products, view orders, and upload images.
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
Create a MySQL database named `fashionify`:
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

Start the Spring Boot server:
```bash
./mvnw spring-boot:run
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
- **Password:** `admin123`

## 📄 License
This project is for educational and portfolio purposes.
