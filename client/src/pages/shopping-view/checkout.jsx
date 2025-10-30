import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redux store data
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  // Local states
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // ✅ Compute total amount safely
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            ((currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity),
          0
        )
      : 0;

  // ✅ Handle payment initiation
  const handleInitiatePayment = async () => {
    console.log(cartItems, "cartItems");

    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "razorpay") {
      try {
        // 1️⃣ Create order from backend
        const { data: order } = await axios.post("http://localhost:5000/api/payment/create-order", {
          amount: totalCartAmount * 100, // amount in paise
        });

        // 2️⃣ Open Razorpay checkout
        const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RFxhjAiTxwrpAJ", // replace with your Razorpay test key
          amount: order.amount,
          currency: order.currency,
          name: "AutoHub",
          description: "Payment for Car Booking",
          order_id: order.id,
          handler: async function (response) {
            // 3️⃣ Verify payment on backend
            const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // Create order after successful payment
              const orderData = {
                userId: user?._id || user?.id,
                cartId: cartItems?._id,
                cartItems: cartItems.items.map((item) => ({
                  productId: item?.productId,
                  title: item?.title,
                  image: item?.image,
                  price: item?.salePrice > 0 ? item?.salePrice : item?.price,
                  quantity: item?.quantity,
                })),
                addressInfo: {
                  addressId: currentSelectedAddress?._id,
                  address: currentSelectedAddress?.address,
                  city: currentSelectedAddress?.city,
                  pincode: currentSelectedAddress?.pincode,
                  phone: currentSelectedAddress?.phone,
                  notes: currentSelectedAddress?.notes,
                },
                orderStatus: "confirmed",
                paymentMethod,
                paymentStatus: "paid",
                totalAmount: totalCartAmount,
                orderDate: new Date(),
                orderUpdateDate: new Date(),
                paymentId: response.razorpay_payment_id,
                payerId: "",
              };

              dispatch(createNewOrder(orderData)).then((data) => {
                if (data?.payload?.success) {
                  navigate("/shop/payment-success");
                } else {
                  toast({
                    title: "Order creation failed after payment.",
                    variant: "destructive",
                  });
                }
              });
            } else {
              toast({
                title: "Payment verification failed!",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: user?.userName || "User",
            email: user?.email || "",
            contact: currentSelectedAddress?.phone || "",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (err) {
        console.error("Payment error:", err);
        toast({
          title: "Something went wrong. Try again.",
          variant: "destructive",
        });
      }
    } else {
      // COD
      const orderData = {
        userId: user?._id || user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((item) => ({
          productId: item?.productId,
          title: item?.title,
          image: item?.image,
          price: item?.salePrice > 0 ? item?.salePrice : item?.price,
          quantity: item?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
        },
        orderStatus: "confirmed",
        paymentMethod,
        paymentStatus: "pending",
        totalAmount: totalCartAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: "",
        payerId: "",
      };

      setIsPaymentStart(true);

      dispatch(createNewOrder(orderData)).then((data) => {
        console.log("Order response:", data);

        if (data?.payload?.success) {
          toast({ title: "Order placed successfully!" });
          navigate("/shop/payment-success");
        } else {
          toast({
            title: data?.payload?.message || "Failed to create order.",
            variant: "destructive",
          });
        }

        setIsPaymentStart(false);
      });
    }
  };

  // ✅ Redirect if Razorpay order received
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🖼️ Banner Section */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Secure Checkout
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Complete your purchase safely
            </p>
          </div>
        </div>
      </div>

      {/* 🧱 Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Shipping Address
            </h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Order Summary + Payment */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems?.items?.length > 0 ? (
                  cartItems.items.map((item) => (
                    <UserCartItemsContent
                      key={item.productId}
                      cartItem={item}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Your cart is empty
                  </p>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Payment Details
              </h3>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{totalCartAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-700">
                  Choose Payment Method
                </Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label
                      htmlFor="razorpay"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-blue-600 font-medium">Razorpay</span>
                      <span className="text-sm text-gray-500">
                        (Secure online payment)
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <span className="text-green-600 font-medium">
                        Cash on Delivery
                      </span>
                      <span className="text-sm text-gray-500">
                        (Pay when you receive)
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Checkout Button */}
              <div className="mt-6">
                <Button
                  onClick={handleInitiatePayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  disabled={isPaymentStart}
                >
                  {isPaymentStart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : paymentMethod === "cod" ? (
                    "Place Order with COD"
                  ) : (
                    "Checkout with Razorpay"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
