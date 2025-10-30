import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyPayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function RazorpayReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const razorpay_order_id = params.get("razorpay_order_id");
  const razorpay_payment_id = params.get("razorpay_payment_id");
  const razorpay_signature = params.get("razorpay_signature");

  useEffect(() => {
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      dispatch(verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [razorpay_order_id, razorpay_payment_id, razorpay_signature, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default RazorpayReturnPage;
