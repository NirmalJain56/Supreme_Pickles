const User = require('../models/User');

// @desc  Get user profile
// @route GET /api/users/profile
exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc  Update user profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
};

// @desc  Add/update address
// @route POST /api/users/addresses
exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

// @desc  Delete address
// @route DELETE /api/users/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

// @desc  Get wishlist
// @route GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, wishlist: user.wishlist });
};

// @desc  Toggle wishlist item
// @route POST /api/users/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx === -1) {
    user.wishlist.push(req.params.productId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

// @desc  Get all users (admin)
// @route GET /api/users
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments({ role: 'user' });
  const users = await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ success: true, users, total });
};
