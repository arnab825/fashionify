import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Root → always go to shop home
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" replace />;
  }

  // Not authenticated: allow public routes
  const publicRoutes = ["/login", "/register", "/shop/home", "/shop/listing", "/shop/search", "/shop/about", "/shop/contact"];
  const isPublicRoute = publicRoutes.some((r) => location.pathname.includes(r));

  if (!isAuthenticated && !isPublicRoute) {
    // Admin login page is public, redirect others to customer login
    if (location.pathname.includes("/admin-auth")) {
      return children;
    }
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated users trying to hit login/register → redirect home
  if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/shop/home" replace />;
  }

  // Non-admin trying to access /admin/** routes
  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
