import { StarIcon, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ShoppingProductDetails() {
  const { id } = useParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      dispatch(getReviews(id));
    }
  }, [id, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({
        title: "Please login to add to cart",
        variant: "destructive",
      });
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
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?.id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?.id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  if (isLoading || !productDetails) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground">
          <Link to="/shop/home" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/shop/listing" className="hover:text-purple-600 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium truncate">{productDetails?.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery Column */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-muted/20 border border-border aspect-[4/5] lg:sticky lg:top-28">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-full object-contain p-4"
              />
              {productDetails?.salePrice > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-red-500/20">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{productDetails?.title}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  <StarRatingComponent rating={averageReview} />
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-400 ml-1">
                    {averageReview.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {reviews?.length || 0} Reviews
                </span>
              </div>

              <Separator className="my-6" />

              <div className="flex items-baseline gap-4">
                <p className={`text-4xl font-bold text-foreground ${productDetails?.salePrice > 0 ? "line-through text-muted-foreground/50 text-2xl" : ""}`}>
                  ₹{productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="text-4xl font-bold text-red-500 dark:text-red-400">
                    ₹{productDetails?.salePrice}
                  </p>
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">Inclusive of all taxes</p>

              <div className="mt-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {productDetails?.description}
                </p>
              </div>
            </div>

            <div className="pt-4 pb-8">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full sm:w-auto h-14 px-12 text-lg font-bold bg-muted text-muted-foreground cursor-not-allowed rounded-xl" disabled>
                  Out of Stock
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1"
                    onClick={() => handleAddToCart(productDetails?.id, productDetails?.totalStock)}
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Reviews Section */}
            <div className="space-y-8 pt-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Customer Reviews <span className="text-muted-foreground text-lg font-medium">({reviews?.length || 0})</span>
              </h2>
              
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                    {reviews.map((reviewItem, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                        <Avatar className="w-12 h-12 border-2 border-purple-500/20">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">{reviewItem?.userName}</h3>
                            <span className="text-xs text-muted-foreground">Verified Buyer</span>
                          </div>
                          <div className="flex items-center">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            "{reviewItem.reviewMessage}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl bg-muted/30 border border-border border-dashed">
                    <p className="text-muted-foreground mb-2">No reviews yet.</p>
                    <p className="text-sm">Be the first to review this product!</p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm mt-8">
                <Label className="text-lg font-bold mb-4 block">Write a review</Label>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(event) => setReviewMsg(event.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="h-12 border-border focus:ring-purple-500 rounded-xl"
                    />
                    <Button
                      onClick={handleAddReview}
                      disabled={reviewMsg.trim() === "" || rating === 0}
                      className="h-12 px-8 rounded-xl font-bold shadow-md disabled:opacity-50"
                    >
                      Post Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductDetails;
