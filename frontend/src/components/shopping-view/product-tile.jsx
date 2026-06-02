import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
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
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-contain p-4 bg-muted/10 rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 rounded-full z-10 transition-colors ${
              isWishlisted ? "text-pink-500 bg-pink-50 hover:bg-pink-100 hover:text-pink-600" : "text-slate-400 bg-white/80 hover:bg-white hover:text-pink-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-pink-500" : ""}`} />
            <span className="sr-only">Wishlist</span>
          </Button>
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 truncate" title={product?.title}>{product?.title}</h2>
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
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?.id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
