import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecommendations } from "@/store/shop/recommendations-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductCardSkeleton from "@/components/shopping-view/product-card-skeleton";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function RecommendationsCarousel({ userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { recommendations, basedOnTags, isLoading } = useSelector(
    (state) => state.shopRecommendations
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (userId) {
      dispatch(fetchRecommendations({ userId, limit: 8 }));
    }
  }, [userId, dispatch]);

  function handleGetProductDetails(id) {
    navigate(`/shop/product/${id}`);
  }

  function handleAddtoCart(productId, totalStock) {
    const getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const existing = getCartItems.find((item) => item.productId === productId);
      if (existing && existing.quantity + 1 > totalStock) {
        toast({ title: `Only ${totalStock} quantity available`, variant: "destructive" });
        return;
      }
    }
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to cart" });
      }
    });
  }

  if (!isLoading && recommendations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="px-4 md:px-6 py-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Recommended For You</h2>
          {basedOnTags.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on your interest in:{" "}
              {basedOnTags.slice(0, 3).map((t, i) => (
                <span key={t}>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">{t}</span>
                  {i < Math.min(basedOnTags.length, 3) - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div className="overflow-x-auto -mx-4 px-4 pb-4 scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-56 flex-none">
                  <ProductCardSkeleton />
                </div>
              ))
            : recommendations.map((product) => (
                <div key={product.id} className="w-56 flex-none">
                  <ShoppingProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
        </div>
      </div>
    </motion.section>
  );
}

export default RecommendationsCarousel;
