const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc  Create order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  // Calculate prices
  let itemsPrice = 0;
  for (const item of items) {
    itemsPrice += item.price * item.quantity;
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon expired' });
      }
      if (itemsPrice < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount ₹${coupon.minOrderAmount} required`,
        });
      }
      discount =
        coupon.discountType === 'percentage'
          ? Math.min((itemsPrice * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
          : coupon.discountValue;
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }
  }

  const shippingPrice = itemsPrice - discount >= 499 ? 0 : 49;
  const taxPrice = Math.round(((itemsPrice - discount) * 0.05) * 100) / 100; // 5% GST
  const totalPrice = Math.round((itemsPrice - discount + shippingPrice + taxPrice) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    discount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    statusHistory: [{ status: 'Pending', note: 'Order placed' }],
  });

  // Update totalSold for each product
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { totalSold: item.quantity } });
  }

  res.status(201).json({ success: true, order });
};

// @desc  Get logged-in user orders
// @route GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
};

// @desc  Get single order
// @route GET /api/orders/:id
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  res.json({ success: true, order });
};

// @desc  Get all orders (admin)
// @route GET /api/orders
exports.getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.orderStatus = status;
  order.statusHistory.push({ status, note });
  if (status === 'Delivered') {
    order.deliveredAt = new Date();
  }
  await order.save();
  res.json({ success: true, order });
};

// @desc  Mark order as paid (after Razorpay verify)
// @route PUT /api/orders/:id/pay
exports.markOrderPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = req.body;
  order.orderStatus = 'Processing';
  order.statusHistory.push({ status: 'Processing', note: 'Payment confirmed' });
  await order.save();
  res.json({ success: true, order });
};

// @desc  Admin stats
// @route GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  const [totalOrders, totalRevenue, pendingOrders, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
  ]);
  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      recentOrders,
    },
  });
};
