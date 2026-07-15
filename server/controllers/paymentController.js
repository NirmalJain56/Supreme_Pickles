const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc  Create Razorpay order
// @route POST /api/payment/create-order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    // In test mode with dummy keys, return a mock response
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
      return res.json({
        success: true,
        order: {
          id: `order_dummy_${Date.now()}`,
          amount: amount * 100,
          currency,
          receipt: orderId,
        },
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt: orderId,
    });

    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment initialization failed', error: err.message });
  }
};

// @desc  Verify Razorpay payment
// @route POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // In test mode with dummy keys, auto-verify
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'Processing',
        paymentResult: { razorpay_order_id, razorpay_payment_id, status: 'captured' },
        $push: { statusHistory: { status: 'Processing', note: 'Payment confirmed (test mode)' } },
      },
      { new: true }
    );
    return res.json({ success: true, order });
  }

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generated_signature = hmac.digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Processing',
      paymentResult: { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'captured' },
      $push: { statusHistory: { status: 'Processing', note: 'Payment confirmed' } },
    },
    { new: true }
  );

  res.json({ success: true, order });
};

// @desc  Apply coupon
// @route POST /api/payment/apply-coupon
exports.applyCoupon = async (req, res) => {
  const Coupon = require('../models/Coupon');
  const { code, cartTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return res.status(400).json({ success: false, message: 'Coupon has expired' });
  }
  if (cartTotal < coupon.minOrderAmount) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
    });
  }

  const discount =
    coupon.discountType === 'percentage'
      ? Math.min((cartTotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
      : coupon.discountValue;

  res.json({ success: true, discount: Math.round(discount), coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
};
