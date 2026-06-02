import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Moon, Sun, ShieldCheck, Heart, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";
import { Label } from "../ui/label";
import { useTheme } from "../theme-provider";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search" &&
      getCurrentMenuItem.id !== "about" &&
      getCurrentMenuItem.id !== "contact"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-8 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 relative py-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 hover:after:w-full after:transition-all after:duration-300 ${
            location.pathname.includes(menuItem.path)
              ? "text-purple-600 dark:text-purple-400 after:w-full font-bold"
              : "text-foreground/80 hover:text-purple-500 hover:-translate-y-[1px]"
          }`}
          key={menuItem.id}
        >
          {menuItem.label}
        </button>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme();
  
  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user?.id));
      dispatch(fetchWishlistItems(user?.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <div className="hidden lg:flex items-center text-sm font-semibold text-foreground/70 mr-2 bg-muted/50 px-3 py-1.5 rounded-full">
        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="mr-1 hover:bg-muted dark:hover:bg-muted text-foreground/80 hover:text-foreground transition-colors rounded-full"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-purple-600" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/shop/search")}
        className="mr-1 hover:bg-muted dark:hover:bg-muted text-foreground/80 hover:text-foreground transition-colors rounded-full"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate("/shop/wishlist")}
        className="mr-1 relative hover:bg-pink-500/10 hover:border-pink-500/30 transition-all duration-300 rounded-xl group"
      >
        <Heart className="w-5 h-5 text-foreground/80 group-hover:text-pink-500" />
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-md shadow-pink-500/25">
          {wishlistItems?.length || 0}
        </span>
        <span className="sr-only">Wishlist</span>
      </Button>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 rounded-xl"
        >
          <ShoppingCart className="w-5 h-5 text-foreground/80 group-hover:text-purple-500" />
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-bold text-white shadow-md shadow-purple-500/25">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-purple-600 hover:bg-purple-700 cursor-pointer shadow-lg shadow-purple-500/30 transition-transform hover:scale-105">
              {user?.avatar && (
                <AvatarImage src={`https://api.dicebear.com/9.x/micah/svg?seed=${user.avatar}&backgroundColor=transparent`} alt="User Avatar" />
              )}
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56 mt-2 card-gradient border-purple-500/20">
            <DropdownMenuLabel className="font-bold">Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-500/10" />
            <DropdownMenuItem onClick={() => navigate("/shop/account")} className="hover:bg-purple-500/10 cursor-pointer">
              <UserCog className="mr-2 h-4 w-4 text-purple-500" />
              Account
            </DropdownMenuItem>
            
            {user?.role === "admin" && (
              <>
                <DropdownMenuSeparator className="bg-purple-500/10" />
                <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="hover:bg-purple-500/10 cursor-pointer text-indigo-500 font-bold">
                  <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
                  Admin Panel
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-purple-500/10" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:bg-red-500/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/auth/login")} variant="outline" className="border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-sm font-semibold rounded-xl px-5 h-10 transition-all">
            Login
          </Button>
          <Button onClick={() => navigate("/auth/register")} className="!bg-gradient-to-r !from-indigo-600 !via-purple-600 !to-pink-600 dark:!from-purple-500 dark:!via-fuchsia-500 dark:!to-pink-500 !text-white hover:!from-indigo-700 hover:!via-purple-700 hover:!to-pink-700 dark:hover:!from-purple-600 dark:hover:!via-fuchsia-600 dark:hover:!to-pink-600 text-sm font-semibold rounded-xl px-5 h-10 shadow-lg shadow-purple-500/25 hover:scale-102 transition-all">
            Register
          </Button>
        </div>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <Link to="/shop/home" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
            <HousePlug className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gradient">Fashionify</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden border-purple-500/20 hover:bg-purple-500/5 rounded-xl">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs card-gradient border-r-purple-500/20">
            <div className="flex flex-col gap-6 mt-8">
              <MenuItems />
              <div className="h-[1px] bg-purple-500/10 w-full" />
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
