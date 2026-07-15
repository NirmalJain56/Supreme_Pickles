const Review = require('../models/Review');

// @desc  Get reviews for a product
// @route GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
};

// @desc  Create review
// @route POST /api/reviews/:productId
exports.createReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
  }
  const review = await Review.create({
    product: req.params.productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    title,
    comment,
  });
  res.status(201).json({ success: true, review });
};

// @desc  Delete review (admin or owner)
// @route DELETE /api/reviews/:reviewId
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
};
