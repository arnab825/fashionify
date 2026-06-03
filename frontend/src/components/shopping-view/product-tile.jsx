import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, Flame } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const { toast } = useToast();

  const isWishlisted = wishlistItems?.some((item) => item.id === product?.id);

  // Prefer first image from images[], fall back to legacy image field
  const coverImage = product?.images?.[0] || product?.image || "https://placehold.co/600x600/png?text=No+Image";
  const totalStock = product?.totalStock ?? 0;

  function handleWishlistToggle(e) {
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please login to add to wishlist", variant: "destructive" });
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist({ userId: user?.id, productId: product?.id }));
      toast({ title: "Removed from wishlist" });
    } else {
      dispatch(addToWishlist({ userId: user?.id, productId: product?.id }));
      toast({ title: "Added to wishlist" });
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto group">
      <div onClick={() => handleGetProductDetails(product?.id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={coverImage}
            alt={product?.title}
            onError={(e) => { e.target.src = "https://placehold.co/600x600/png?text=No+Image"; }}
            className="w-full h-[300px] object-contain p-4 bg-muted/10 rounded-t-lg"
          />
          {/* Stock badges */}
          {totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : totalStock <= 5 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {`Only ${totalStock} left`}
            </Badge>
          ) : totalStock <= 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
              {`Only ${totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}

          {/* Multiple images indicator */}
          {product?.images?.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              {product.images.length} photos
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 rounded-full z-10 transition-colors ${
              isWishlisted
                ? "text-pink-500 bg-pink-50 hover:bg-pink-100 hover:text-pink-600"
                : "text-slate-400 bg-white/80 hover:bg-white hover:text-pink-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-pink-500" : ""}`} />
            <span className="sr-only">Wishlist</span>
          </Button>
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 truncate" title={product?.title}>
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
          {/* Size preview */}
          {product?.sizeVariants?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.sizeVariants.slice(0, 4).map((v) => (
                <span
                  key={v.size}
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                    v.outOfStock || v.stock === 0
                      ? "text-muted-foreground/40 border-border line-through"
                      : "text-muted-foreground border-border"
                  }`}
                >
                  {v.size}
                </span>
              ))}
              {product.sizeVariants.length > 4 && (
                <span className="text-[10px] text-muted-foreground">
                  +{product.sizeVariants.length - 4} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter>
        {totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
        ) : (
          <Button
            onClick={() => handleGetProductDetails(product?.id)}
            className="w-full"
          >
            View & Select Size
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
