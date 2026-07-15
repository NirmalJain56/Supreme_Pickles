const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
  getAllUsers,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
