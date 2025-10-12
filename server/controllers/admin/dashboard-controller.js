const Product = require("../../models/Product");
const Order = require("../../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    // Total Stock
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$totalStock" } } }
    ]);
    const totalStockCount = totalStock[0]?.total || 0;

    // Items Sold (from orders)
    const itemsSold = await Order.aggregate([
      { $unwind: "$cartItems" },
      { $group: { _id: null, total: { $sum: "$cartItems.quantity" } } }
    ]);
    const itemsSoldCount = itemsSold[0]?.total || 0;

    // Total Profit (simplified: total sales - assuming no expenses for now)
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const profit = totalSales[0]?.total || 0;

    // Stock by Category
    const stockData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          stock: { $sum: "$totalStock" }
        }
      },
      {
        $project: {
          category: "$_id",
          stock: 1,
          _id: 0
        }
      }
    ]);

    // Profit vs Expense (dummy expense for pie chart, replace with real data if needed)
    const profitData = [
      { name: "Profit", value: profit },
      { name: "Expense", value: 0 } // Placeholder; calculate real expenses if available
    ];

    res.status(200).json({
      success: true,
      data: {
        totalStock: totalStockCount,
        itemsSold: itemsSoldCount,
        profit: profit,
        stockData,
        profitData
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats"
    });
  }
};

module.exports = { getDashboardStats };
