import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const shippingFee = subtotal - discount >= 499 ? 0 : 49;
  const gst = Math.round(((subtotal - discount) * 0.05) * 100) / 100;
  const total = subtotal - discount + shippingFee + gst;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isLoggedIn) {
      toast.error('Please login to apply coupon');
      return;
    }
    setCouponLoading(true);
    try {
      const { data } = await paymentAPI.applyCoupon({ code: couponCode, cartTotal: subtotal });
      setDiscount(data.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon applied! Saved ${formatPrice(data.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error('Please login to proceed to checkout');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout', { state: { discount, couponCode: appliedCoupon } });
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-24 text-center animate-fade-in">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-serif text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some authentic Indian pickles and spices to get started!</p>
        <Link to="/products" className="btn-primary text-base">
          <FiShoppingBag size={18} /> Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart <span className="text-mustard-400 text-2xl">({itemCount})</span></h1>
        <button onClick={() => { clearCart(); }} className="text-sm text-red-500 hover:text-red-700 transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="card p-5 flex gap-4 animate-slide-up">
              {/* Image */}
              <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                <div className="w-20 h-20 bg-cream-100 rounded-xl overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🥒</div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`} className="font-serif font-semibold text-gray-800 hover:text-mustard-500 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                {item.variant && (
                  <span className="badge badge-mustard text-xs mt-1">{item.variant}</span>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 transition-colors">
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 transition-colors">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.key)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiTag size={16} className="text-mustard-400" /> Apply Coupon
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                <div>
                  <span className="font-bold text-green-700">{appliedCoupon}</span>
                  <p className="text-xs text-green-600">Saved {formatPrice(discount)}</p>
                </div>
                <button onClick={() => { setDiscount(0); setAppliedCoupon(''); setCouponCode(''); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="input-field text-sm flex-1"
                  id="coupon-input"
                />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-primary !py-2 !px-4 text-sm">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-400">Available codes:</p>
              {['WELCOME10', 'PICKLE50', 'SPICE20'].map((code) => (
                <button key={code} onClick={() => setCouponCode(code)} className="text-xs text-mustard-500 hover:text-mustard-600 font-semibold mr-3 transition-colors">{code}</button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold text-gray-800 mb-4">Price Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span className="font-medium">{formatPrice(gst)}</span>
              </div>

              <div className="border-t border-cream-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-maroon w-full justify-center mt-5 text-base">
              Proceed to Checkout <FiArrowRight size={18} />
            </button>
            <Link to="/products" className="btn-ghost w-full justify-center mt-2 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
