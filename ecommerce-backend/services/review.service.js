const reviewModel = require("../models/review.model");

module.exports.getAllReviews = async () => {
  return await reviewModel.find().populate("productId").populate("userId");
};

module.exports.deleteReview = async (id) => {
  return await reviewModel.findByIdAndDelete(id);
};

module.exports.createReview = async (reviewData) => {
    return await reviewModel.create(reviewData);
}
