const Review = require("../../models/Review");

const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue, reviewImage } = req.body;

    const newReview = new Review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      reviewImage,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
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
  addReview,
  getReviews,
};
