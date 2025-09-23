const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/shop/paypal-return",
        cancel_url: "http://localhost:3000/shop/checkout",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toString(),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toString(),
          },
          description: "Payment for order",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod: "paypal",
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
          paypalOrderId: payment.id,
        });

        await newlyCreatedOrder.save();

        const approvalURL = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
          paymentId: payment.id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      async function (error, payment) {
        if (error) {
          console.log(error);
          return res.status(400).json({
            success: false,
            message: "Payment execution failed",
          });
        } else {
          let order = await Order.findById(orderId);

          if (!order) {
            return res.status(404).json({
              success: false,
              message: "Order can not be found",
            });
          }

          order.paymentStatus = "paid";
          order.orderStatus = "confirmed";
          order.paymentId = paymentId;
          order.payerId = payerId;

          for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
              return res.status(404).json({
                success: false,
                message: `Not enough stock for this product ${product.title}`,
              });
            }

            product.totalStock -= item.quantity;

            await product.save();
          }

          const getCartId = order.cartId;
          await Cart.findByIdAndDelete(getCartId);

          await order.save();

          res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
