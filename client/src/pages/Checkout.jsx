import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'Razorpay', label: 'UPI / Card / Net Banking', icon: '💳', desc: 'Secure payment via Razorpay' },
  { id: 'COD', label: 'Cash on Delivery', icon: '💰', desc: 'Pay when your order arrives' },
];

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const discount = location.state?.discount || 0;
  const couponCode = location.state?.couponCode || '';

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
    }
  });

  const shippingFee = subtotal - discount >= 499 ? 0 : 49;
  const gst = Math.round(((subtotal - discount) * 0.05) * 100) / 100;
  const total = Math.round((subtotal - discount + shippingFee + gst) * 100) / 100;

  const handlePlaceOrder = async (addressData) => {
    setLoading(true);
    try {
      // Create order
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          variant: item.variant,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: addressData,
        paymentMethod,
        couponCode,
        discount,
      };

      const { data: orderData } = await orderAPI.create(orderPayload);
      const order = orderData.order;

      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      // Razorpay flow
      const { data: rzpData } = await paymentAPI.createOrder({
        amount: total,
        orderId: order._id,
      });

      if (rzpData.key === 'rzp_test_dummy_key_id') {
        // Test/dummy mode — auto verify
        await paymentAPI.verify({
          razorpay_order_id: rzpData.order.id,
          razorpay_payment_id: `pay_dummy_${Date.now()}`,
          razorpay_signature: 'dummy_signature',
          orderId: order._id,
        });
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      // Real Razorpay
      const options = {
        key: rzpData.key,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        name: 'Perk Foodz',
        description: `Order #${order.orderNumber}`,
        order_id: rzpData.order.id,
        handler: async (response) => {
          try {
            await paymentAPI.verify({ ...response, orderId: order._id });
            clearCart();
            navigate(`/order-success/${order._id}`);
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: addressData.fullName, contact: addressData.phone, email: user.email },
        theme: { color: '#D4A017' },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container-main py-10 animate-fade-in">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {['Address', 'Payment', 'Confirmation'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-mustard-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-mustard-500' : 'text-gray-400'}`}>{s}</span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200 hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(handlePlaceOrder)} id="checkout-form">
            {/* Address */}
            <div className="card p-6 mb-6">
              <h2 className="font-serif font-bold text-xl mb-5 flex items-center gap-2">
                <FiMapPin className="text-mustard-400" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input-field"
                    placeholder="Your full name"
                    id="checkout-fullname"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' } })}
                    className="input-field"
                    placeholder="10-digit mobile number"
                    id="checkout-phone"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input
                    {...register('addressLine1', { required: 'Address is required' })}
                    className="input-field"
                    placeholder="House/Flat no., Street name"
                    id="checkout-address1"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    {...register('addressLine2')}
                    className="input-field"
                    placeholder="Area, Landmark (optional)"
                    id="checkout-address2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                    placeholder="City"
                    id="checkout-city"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    {...register('state', { required: 'State is required' })}
                    className="input-field"
                    id="checkout-state"
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <input
                    {...register('pincode', { required: 'PIN code is required', pattern: { value: /^\d{6}$/, message: 'Enter a valid 6-digit PIN' } })}
                    className="input-field"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    id="checkout-pincode"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6 mb-6">
              <h2 className="font-serif font-bold text-xl mb-5 flex items-center gap-2">
                <FiCreditCard className="text-mustard-400" /> Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-mustard-400 bg-mustard-50' : 'border-gray-200 hover:border-mustard-200'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-mustard-400"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-maroon w-full justify-center text-base !py-4 disabled:opacity-60"
              id="place-order-btn"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <FiCheckCircle size={20} />
                  {paymentMethod === 'COD' ? 'Place Order (COD)' : `Pay ${formatPrice(total)}`}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif font-bold text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🥒</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-gray-400">{item.variant} × {item.quantity}</p>}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span><span>{formatPrice(gst)}</span>
              </div>
              <div className="border-t border-cream-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
