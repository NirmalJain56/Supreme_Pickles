import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, statusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiChevronDown } from 'react-icons/fi';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getAll({ status: filterStatus || undefined, limit: 50 });
      setOrders(data.orders || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch { toast.error('Failed to update'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2">
          {['', ...STATUSES].map((s) => (
            <button key={s || 'all'} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === s ? 'bg-maroon-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-maroon-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Order</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Items</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-mustard-500">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-700">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.items?.length} item(s)</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge text-xs ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {order.isPaid ? 'Paid' : order.paymentMethod === 'COD' ? 'COD' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${statusColor(order.orderStatus)} text-xs`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative flex justify-end">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-maroon-400 cursor-pointer bg-white"
                        id={`status-${order._id}`}
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
