# TODO: Migrate Payment from PayPal to Razorpay

## Backend Changes
- [x] Update .env file with Razorpay keys (already provided)
- [x] Create server/helpers/razorpay.js
- [x] Update server/controllers/shop/order-controller.js to replace PayPal logic with Razorpay create-order and verify
- [x] Update server/models/Order.js: change paypalOrderId to razorpayOrderId
- [x] Update server/routes/shop/order-routes.js: add /create-order and /verify routes
- [x] Update server/server.js: add new routes if needed

## Frontend Changes
- [x] Update client/src/pages/shopping-view/checkout.jsx: change payment method to Razorpay, integrate Razorpay checkout
- [ ] Rename client/src/pages/shopping-view/paypal-return.jsx to razorpay-return.jsx and update logic
- [ ] Update client/src/App.jsx: change route from paypal-return to razorpay-return
- [x] Update client/src/store/shop/order-slice/index.js: update thunks for Razorpay (createOrder, verifyPayment)
- [ ] Update client/src/pages/shopping-view/payment-success.jsx if needed

## Testing
- [ ] Test the integration end-to-end
- [ ] Ensure COD still works
