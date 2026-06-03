import { StarIcon, ChevronRight, ChevronLeft, Flame, AlertTriangle, Ruler } from "lucide-react";
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
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  // Reset selected size when product changes
  useEffect(() => {
    setSelectedSize(null);
    setActiveImageIndex(0);
  }, [id]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const images = productDetails?.images?.length > 0
    ? productDetails.images
    : productDetails?.image
      ? [productDetails.image]
      : [];

  const sizeVariants = productDetails?.sizeVariants || [];
  const totalStock = productDetails?.totalStock ?? 0;

  // Find selected variant stock info
  const selectedVariant = sizeVariants.find((v) => v.size === selectedSize);
  const selectedVariantStock = selectedVariant?.stock ?? 0;

  // Low-stock logic
  const isOverallLowStock = totalStock > 0 && totalStock <= 10;
  const isSelectedSizeLowStock = selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0;

  function handleAddToCart() {
    if (!isAuthenticated) {
      toast({ title: "Please login to add to cart", variant: "destructive" });
      navigate("/auth/login");
      return;
    }
    if (sizeVariants.length > 0 && !selectedSize) {
      toast({ title: "Please select a size first", variant: "destructive" });
      return;
    }
    if (selectedVariant && selectedVariant.outOfStock) {
      toast({ title: "This size is out of stock", variant: "destructive" });
      return;
    }

    let getCartItems = cartItems?.items || [];
    if (getCartItems.length) {
      const existingItem = getCartItems.find(
        (item) => item.productId === String(productDetails?.id) && item.selectedSize === selectedSize
      );
      if (existingItem) {
        if (existingItem.quantity + 1 > selectedVariantStock) {
          toast({
            title: `Only ${selectedVariantStock} in stock for size ${selectedSize}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails?.id,
        quantity: 1,
        selectedSize: selectedSize || null,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: `Added to cart${selectedSize ? ` — Size: ${selectedSize}` : ""}` });
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
        toast({ title: "Review added successfully!" });
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  if (isLoading || !productDetails) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const addToCartDisabled =
    totalStock === 0 ||
    (sizeVariants.length > 0 && !selectedSize) ||
    (selectedVariant && selectedVariant.outOfStock);

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

          {/* ── Image Gallery ─────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-muted/20 border border-border aspect-[4/5] lg:sticky lg:top-28">
              {images.length > 0 ? (
                <img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={productDetails?.title}
                  onError={(e) => { e.target.src = "https://placehold.co/600x600/png?text=No+Image"; }}
                  className="w-full h-full object-contain p-4 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}

              {/* Sale badge */}
              {productDetails?.salePrice > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-red-500/20">
                  Sale
                </div>
              )}

              {/* Prev/Next if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border border-border rounded-full p-2 shadow hover:bg-background transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border border-border rounded-full p-2 shadow hover:bg-background transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeImageIndex ? "bg-purple-600 w-4" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImageIndex
                        ? "border-purple-500 ring-2 ring-purple-500/30"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`View ${i + 1}`} onError={(e) => { e.target.src = "https://placehold.co/600x600/png?text=No+Image"; }} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Details ────────────────────────────────────── */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {productDetails?.title}
              </h1>

              {/* Rating */}
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

              <Separator />

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <p className={`text-3xl font-bold text-foreground ${
                  productDetails?.salePrice > 0 ? "line-through text-muted-foreground/50 text-2xl" : ""
                }`}>
                  ₹{productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="text-3xl font-bold text-red-500 dark:text-red-400">
                    ₹{productDetails?.salePrice}
                  </p>
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                Inclusive of all taxes
              </p>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {productDetails?.description}
              </p>
            </div>

            {/* ── Size Selector ──────────────────────────────────── */}
            {sizeVariants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Select Size</Label>
                  {selectedVariant?.measurements && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5" />
                      {selectedVariant.measurements}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const isOOS = variant.outOfStock || variant.stock === 0;
                    return (
                      <button
                        key={variant.size}
                        type="button"
                        disabled={isOOS}
                        onClick={() => setSelectedSize(variant.size)}
                        title={
                          isOOS
                            ? `Out of stock`
                            : variant.measurements
                            ? variant.measurements
                            : `${variant.stock} in stock`
                        }
                        className={`relative px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                          ${isOOS
                            ? "border-border text-muted-foreground/40 line-through cursor-not-allowed bg-muted/30"
                            : isSelected
                            ? "border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                            : "border-border hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          }`}
                      >
                        {variant.size}
                        {/* Low stock dot indicator */}
                        {!isOOS && variant.lowStock && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-background" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected size stock info */}
                {selectedVariant && !selectedVariant.outOfStock && (
                  <p className="text-xs text-muted-foreground">
                    {selectedVariant.stock} units available in size{" "}
                    <strong>{selectedSize}</strong>
                  </p>
                )}
              </div>
            )}

            {/* ── Stock Warnings ──────────────────────────────────── */}
            {totalStock === 0 ? (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-none" />
                This product is currently out of stock.
              </div>
            ) : isSelectedSizeLowStock ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 flex-none text-orange-500" />
                Only {selectedVariant.stock} left in size {selectedSize} — Buy Now!
              </div>
            ) : isOverallLowStock && !selectedSize ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 flex-none text-orange-500" />
                Only {totalStock} items left across all sizes!
              </div>
            ) : null}

            {/* ── Add to Cart Button ──────────────────────────────── */}
            <div className="pt-2">
              {totalStock === 0 ? (
                <Button className="w-full h-14 text-lg font-bold bg-muted text-muted-foreground cursor-not-allowed rounded-xl" disabled>
                  Out of Stock
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  {sizeVariants.length > 0 && !selectedSize && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please select a size to continue
                    </p>
                  )}
                  <Button
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    onClick={handleAddToCart}
                    disabled={addToCartDisabled}
                  >
                    {selectedVariant?.outOfStock
                      ? "Size Out of Stock"
                      : "Add to Cart"}
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* ── Reviews Section ─────────────────────────────────── */}
            <div className="space-y-8 pt-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Customer Reviews{" "}
                <span className="text-muted-foreground text-lg font-medium">
                  ({reviews?.length || 0})
                </span>
              </h2>

              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
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
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
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
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                <Label className="text-lg font-bold mb-4 block">Write a review</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                  </div>
                  <div className="flex gap-4">
                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(e) => setReviewMsg(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="h-12 rounded-xl"
                    />
                    <Button
                      onClick={handleAddReview}
                      disabled={reviewMsg.trim() === "" || rating === 0}
                      className="h-12 px-8 rounded-xl font-bold"
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
