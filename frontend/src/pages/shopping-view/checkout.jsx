import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { createNewOrder, confirmSimulatedOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag, MapPin, Loader2, CheckCircle } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.shopOrder);
  const navigate = useNavigate();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount = useMemo(() => {
    if (!cartItems?.items?.length) return 0;
    return cartItems.items.reduce(
      (sum, currentItem) =>
        sum +
        (currentItem?.product?.salePrice > 0
          ? currentItem.product.salePrice
          : currentItem?.product?.price) *
          currentItem?.quantity,
      0
    );
  }, [cartItems]);

  async function handlePlaceOrder() {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select a delivery address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?.id,
      orderItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.product?.id,
        title: singleCartItem?.product?.title,
        image: singleCartItem?.product?.image,
        price:
          singleCartItem?.product?.salePrice > 0
            ? singleCartItem?.product?.salePrice
            : singleCartItem?.product?.price,
        quantity: singleCartItem?.quantity,
        selectedSize: singleCartItem?.selectedSize || null,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?.id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending_payment",
      paymentMethod: "simulated_cod",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    const createResult = await dispatch(createNewOrder(orderData));
    if (!createResult?.payload?.success) {
      toast({ title: "Failed to create order. Please try again.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    const orderId = createResult.payload.orderId;
    const confirmResult = await dispatch(confirmSimulatedOrder(orderId));
    if (confirmResult?.payload?.success) {
      toast({ title: "🎉 Order placed successfully!" });
      navigate("/shop/payment-success");
    } else {
      toast({ title: "Order created but confirmation failed. Contact support.", variant: "destructive" });
    }
    setIsProcessing(false);
  }

  const itemCount = cartItems?.items?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero image */}
      <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Checkout</h1>
          <p className="text-white/80 text-sm mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""} in cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold">Delivery Address</h2>
            </div>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Order Summary */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              {cartItems?.items?.length > 0
                ? cartItems.items.map((item, idx) => (
                    <UserCartItemsContent key={item.productId + (item.selectedSize || "") + idx} cartItem={item} />
                  ))
                : (
                  <p className="text-muted-foreground text-center py-8">No items in cart</p>
                )}

              {/* Price breakdown */}
              <div className="border-t border-border pt-4 mt-2 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{totalCartAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Delivery</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-purple-600">₹{totalCartAmount}</span>
                </div>
              </div>

              {/* Simulated payment notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm">
                <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-none" />
                <p className="text-amber-700 dark:text-amber-300">
                  <strong>Cash on Delivery</strong> — No online payment required. Pay when your order arrives.
                </p>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing || isLoading || !itemCount}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isProcessing || isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing Order…
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
