import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, statusColor } from '../utils/helpers';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderAPI.getById(orderId);
        setOrder(data.order);
      } catch {}
    };
    fetch();
  }, [orderId]);

  return (
    <div className="container-main py-16 text-center animate-fade-in max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle size={48} className="text-green-500" />
      </div>
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">Order Placed!</h1>
      <p className="text-gray-500 text-lg mb-8">
        {order?.paymentMethod === 'COD'
          ? 'Your order has been placed. Pay cash when it arrives!'
          : 'Payment successful! Your order is confirmed.'}
      </p>

      {order && (
        <div className="card p-6 text-left mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-bold text-xl text-mustard-500">#{order.orderNumber}</p>
            </div>
            <span className={`badge ${statusColor(order.orderStatus)} text-sm px-3 py-1`}>{order.orderStatus}</span>
          </div>
          <div className="space-y-3 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} {item.variant && `(${item.variant})`} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-100 pt-3 flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-mustard-500">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/dashboard/orders" className="btn-primary">
          <FiPackage size={18} /> Track Order
        </Link>
        <Link to="/products" className="btn-secondary">
          Continue Shopping <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
