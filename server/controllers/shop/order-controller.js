const mongoose = require("mongoose");
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const crypto = require("crypto");

/**
 * ✅ Create a new order (COD or PayPal)
 */
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    console.log("🛒 Incoming order request:", req.body);

    // ✅ Validate required fields
    if (!userId || !cartItems?.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (userId, cartItems, or totalAmount).",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    /**
     * ✅ CASH ON DELIVERY
     */
    if (paymentMethod === "cod") {
      console.log("💰 Processing Cash on Delivery (COD) order...");

      const newOrder = new Order({
        userId: userObjectId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "confirmed",
        paymentMethod,
        paymentStatus: "pending",
        totalAmount,
        orderDate: orderDate || new Date(),
        orderUpdateDate: orderUpdateDate || new Date(),
        paymentId: paymentId || "",
        payerId: payerId || "",
      });

      await newOrder.save();

      // Delete user's cart after order placement
      if (cartId && mongoose.Types.ObjectId.isValid(cartId)) {
        await Cart.findByIdAndDelete(cartId);
      }

      console.log("✅ COD order created successfully:", newOrder._id);
      return res.status(201).json({
        success: true,
        orderId: newOrder._id,
        message: "Order placed successfully with Cash on Delivery.",
      });
    }

    /**
     * ✅ RAZORPAY ORDER CREATION
     */
    console.log("💳 Creating Razorpay order for user:", userId);

    const newOrder = new Order({
      userId: userObjectId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "unpaid",
      totalAmount,
      orderDate: orderDate || new Date(),
      orderUpdateDate: orderUpdateDate || new Date(),
      paymentId: "",
      payerId: "",
    });

    await newOrder.save();

    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_" + newOrder._id,
    };

    try {
      const order = await razorpay.orders.create(options);
      newOrder.razorpayOrderId = order.id;
      await newOrder.save();

      console.log("✅ Razorpay order created successfully:", order.id);
      res.status(201).json({
        success: true,
        order,
        orderId: newOrder._id,
      });
    } catch (err) {
      console.error("❌ Razorpay order creation failed:", err);
      res.status(500).json({ error: "Failed to create order" });
    }
  } catch (err) {
    console.error("🔥 Error in createOrder:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the order.",
    });
  }
};

/**
 * ✅ Verify Razorpay Payment
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      // ✅ Update order & stock
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = razorpay_payment_id;

      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.title}.`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Delete the user's cart
      if (order.cartId && mongoose.Types.ObjectId.isValid(order.cartId)) {
        await Cart.findByIdAndDelete(order.cartId);
      }

      await order.save();

      console.log("✅ Payment verified and order confirmed:", order._id);
      res.json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verification failed:", err);
    res.status(500).json({ error: "Verification error" });
  }
};

/**
 * ✅ Get all orders by user
 */
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const orders = await Order.find({ userId: userObjectId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("🔥 Error in getAllOrdersByUser:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
    });
  }
};

/**
 * ✅ Get single order details
 */
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("🔥 Error in getOrderDetails:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order details.",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getAllOrdersByUser,
  getOrderDetails,
};
