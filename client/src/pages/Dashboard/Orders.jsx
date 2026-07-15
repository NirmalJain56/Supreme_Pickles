import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, statusColor } from '../../utils/helpers';
import { FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.orders || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>;

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <FiPackage size={48} className="mx-auto text-gray-200 mb-4" />
        <h3 className="font-serif text-xl font-bold text-gray-600 mb-2">No orders yet</h3>
        <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-bold text-gray-800">My Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order._id} className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="font-bold text-mustard-500 text-lg">#{order.orderNumber}</p>
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${statusColor(order.orderStatus)} px-3 py-1 text-xs`}>{order.orderStatus}</span>
              <span className="font-bold text-gray-800">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
          <div className="space-y-2">
            {order.items?.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center text-sm">🥒</div>
                <span>{item.name} {item.variant && `(${item.variant})`}</span>
                <span className="text-gray-400">× {item.quantity}</span>
              </div>
            ))}
            {order.items?.length > 2 && (
              <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
            )}
          </div>
          <Link to={`/orders/${order._id}`} className="btn-secondary !py-2 !px-4 text-xs mt-3 inline-flex">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
