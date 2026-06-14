# Open Source Contributor's Guide: Fashionify 🤝

Thank you for your interest in contributing to **Fashionify**! We welcome learners, open-source first-timers, and seasoned developers alike.

This guide will show you how to set up your local workspace, follow our architectural patterns, and write code that matches our standards. Let’s build something bold together!

---

## 1. Fast Setup Guide

Before writing code, make sure you can run the application locally:
1. Fork and clone the repository.
2. Spin up the MySQL database (using Docker or manual installation).
3. Set up your `.env` config files in both the `backend` and `frontend` folders.
4. Run the backend server (`./mvnw spring-boot:run`) and frontend dev server (`npm run dev`).

*Detailed step-by-step setup guides can be found in the [root README.md](file:///Users/subhajit/Developer/Development/fashionify/README.md).*

---

## 2. Where Should New Code Go?

When adding features, do not put your code in random folders. You must follow the established architecture:

### A. If you are adding backend code (Java)
All source files go under: `backend/src/main/java/com/fashionify/backend/`
- **Database Tables**: If you are mapping a new database table, create a Java class in `entity/`.
- **Database Queries**: Create an interface that extends `JpaRepository` in `repository/`.
- **Business Logic / Calculations**: Add your calculations, checks, or third-party client integrations inside `service/`.
- **API Payload Shapes**: If you need to define the structure of JSON sent/received, create a class in `dto/`.
- **API Endpoints**: Map your URL request path handlers in `controller/`.

### B. If you are adding frontend code (React)
All source files go under: `frontend/src/`
- **Reusable Buttons, Forms, Widgets**: Add them to `components/`.
- **New Page Screens**: Add them to `pages/`.
- **API Request Mappers**: Add Axios queries to `services/`.
- **Global Variables / Slice Reducers**: Register your state and async endpoints in `store/`.

---

## 3. Coding & Styling Conventions

To keep our codebase clean, readable, and consistent, please follow these guidelines:

### A. General Coding Conventions
- **Keep files focused**: A single controller or service should only manage one specific domain (e.g. do not write review features inside the checkout controller).
- **Use Lombok in Java**: Use Lombok annotations like `@Data`, `@NoArgsConstructor`, and `@AllArgsConstructor` on entities and DTOs to avoid writing manual getters/setters/constructors.
- **Do not expose Database Entities directly**: Always return DTO objects (e.g., `ProductDto` instead of `Product`) from your controllers to protect database details.

### B. Neubrutalism Styling (CSS/Tailwind)
Our layout uses a highly tactile, bold Neubrutalism look. When adding styles to components:
- **Sharp Boarders**: Use thick black borders: `border-2 border-black` or `border-[3px] border-black`.
- **Solid Hard Shadows**: Avoid soft, blurry gray shadows. Use solid black drop-shadows:
  - Tailwind: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- **Aesthetic Accents**: Use high-contrast highlights (like Acid Lime `#D1FF1A`) paired with bold charcoal text.
- **No round corners**: Use sharp corners (`rounded-none`) or minimal rounding (`rounded-md`).

---

## 4. Naming Conventions

Consistency makes reading code easier. Follow these casing systems:

| Language | Target | Casing Style | Example |
| :--- | :--- | :--- | :--- |
| **Java / JS** | Classes, Interfaces, React Components | **PascalCase** (Capitalize first letter of every word) | `ShopCartController`, `ProductCard.jsx` |
| **Java / JS** | Methods, Variables, State parameters | **camelCase** (Capitalize first letter of every word EXCEPT the first) | `fetchProductDetails`, `cartItems` |
| **CSS / HTML** | Utility classes, selectors | **kebab-case** (Lowercase words separated by hyphens) | `btn-primary`, `product-grid-container` |
| **Database** | Table names, column names | **snake_case** (Lowercase words separated by underscores) | `product_size_variants`, `user_id` |

---

## 5. Branch Strategy & Pull Request (PR) Process

To avoid messiness in Git history, we follow a simple Branch Strategy:

### Step 1: Create a feature branch
Name your branch based on the feature you are working on, starting with your name or task type:
```bash
git checkout -b feature/john-coupon-system
# or
git checkout -b bugfix/alice-jwt-refresh
```

### Step 2: Make small, focused commits
Commit early and often with clear, descriptive messages:
```bash
git commit -m "feat: Add Coupon controller mapping and validation logic"
```

### Step 3: Run local verification
Before pushing, ensure the application builds without errors:
- Backend: Run `./mvnw clean compile` to check for compiler errors.
- Frontend: Run `npm run build` to ensure there are no build bugs.

### Step 4: Open a Pull Request
Push your branch and open a PR pointing to the main branch. Describe:
- What changes you made.
- Why you made them.
- How you tested them (with screenshots if it is a UI change).

---

## 6. How to Add a New Feature: Step-by-Step Example

Let's say you want to add a **"Product Reviews"** feature:

1. **Database Entity**: Create `Review.java` in `entity/` with fields (rating, comment, user_id, product_id).
2. **Repository**: Create `ReviewRepository.java` in `repository/` extending `JpaRepository`.
3. **Service**: Create `ReviewService.java` in `service/` to check if a user actually bought the product before allowing them to review it.
4. **DTO**: Create `ReviewRequest.java` in `dto/` to structure the incoming review text.
5. **Controller**: Create `ReviewController.java` in `controller/` mapping the endpoint `POST /api/reviews/add`.
6. **Frontend Service**: Create `reviews.js` in `services/` using Axios to trigger `/api/reviews/add`.
7. **Redux Slice**: Create `reviewSlice` in `store/` to manage review actions and list updates.
8. **UI Component**: Create `ReviewSection.jsx` in `components/` and import it into the `ProductDetails` page.

---

## 7. Debugging Tips for Beginners

When things don't work, don't panic! Check these places:

- **Check the DevTools Console**: In your browser, press `F12` (or right-click -> Inspect) and look at the **Console** tab for Javascript errors or red network alerts.
- **Inspect Network Traffic**: Check the **Network** tab in DevTools. Look at the failing request to see the HTTP status code (e.g. `500` = server crashed, `403` = auth failure, `404` = wrong route URL).
- **Inspect Spring Boot Console**: Look at the terminal running `./mvnw spring-boot:run`. When a database or java error happens, a full "Stack Trace" (error description) will print out. Look for lines starting with `com.fashionify.backend` to find where the error occurred.

Thank you again for contributing to Fashionify! Happy coding!

---

### 🔗 Next Steps & Documentation
* 🛍️ **[Project Overview](file:///Users/subhajit/Developer/Development/fashionify/docs/PROJECT_OVERVIEW.md)**: Conceptual guide to the store's goals, user roles, and features.
* 🏗️ **[System Architecture Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/ARCHITECTURE_GUIDE.md)**: Explore how frontend-backend requests and database queries flow step-by-step.
* ⚙️ **[Feature Flows Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/FEATURE_FLOWS.md)**: Learn how user clicks process into database updates.
* 🔌 **[REST API Reference Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/API_GUIDE.md)**: Explore routes, request formats, and permissions.
* 🗄️ **[Database Entity Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/DATABASE_GUIDE.md)**: Study tables, relationships, and queries.
* 🎓 **[Beginner Onboarding Guide](file:///Users/subhajit/Developer/Development/fashionify/docs/BEGINNER_GUIDE.md)**: Learn the core concepts of the project from scratch.
* 🔒 **[Publication Safety Audit](file:///Users/subhajit/Developer/Development/fashionify/docs/PUBLICATION_SAFETY_AUDIT.md)**: Verification of security patterns.
