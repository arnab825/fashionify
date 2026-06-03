import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";

function SearchProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // When keyword changes: if empty → reset immediately; else debounce API call
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!keyword.trim()) {
      // Immediate reset — no stale results
      dispatch(resetSearchResults());
      setSearchParams(new URLSearchParams());
      return;
    }

    debounceRef.current = setTimeout(() => {
      setSearchParams(new URLSearchParams(`?keyword=${encodeURIComponent(keyword)}`));
      dispatch(getSearchResults(keyword));
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [keyword, dispatch]);

  // Sync state if URL changes from outside (e.g. header SearchBar)
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleClear() {
    setKeyword("");
    dispatch(resetSearchResults());
    setSearchParams(new URLSearchParams());
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({ title: "Please login to add to cart", variant: "destructive" });
      navigate("/auth/login");
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {/* Search input */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-11 pr-10 py-6 text-base rounded-xl border-border focus-visible:ring-purple-500 bg-card shadow-sm"
            placeholder="Search Products..."
            autoFocus
          />
          {/* Clear button — only visible when there is text */}
          {keyword && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* Results */}
      {!isLoading && keyword.trim() && searchResults.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No results found</h2>
          <p className="text-muted-foreground">
            No products match &ldquo;<strong>{keyword}</strong>&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      {!isLoading && !keyword.trim() && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">Start typing to search products…</p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;<strong>{keyword}</strong>&rdquo;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item.id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchProducts;
