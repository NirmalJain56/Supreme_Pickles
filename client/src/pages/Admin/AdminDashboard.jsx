import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, productAPI, userAPI } from '../../services/api';
import { formatPrice, formatDate, statusColor } from '../../utils/helpers';
import { FiPackage, FiShoppingBag, FiUsers, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          orderAPI.getStats(),
          productAPI.getAll({ limit: 50 }),
        ]);
        setStats(statsRes.data.stats);
        const products = productsRes.data.products || [];
        setLowStock(products.filter((p) => {
          if (p.variants?.length > 0) return p.variants.some((v) => v.stock <= 10);
          return (p.stock || 0) <= 10;
        }));
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiPackage size={24} />, color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <FiTrendingUp size={24} />, color: 'bg-green-50 text-green-600', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FiAlertTriangle size={24} />, color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders?status=Pending' },
    { label: 'Low Stock Items', value: lowStock.length, icon: <FiShoppingBag size={24} />, color: 'bg-red-50 text-red-600', link: '/admin/products' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to Perk Foodz Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.link} className="card p-5 hover:shadow-warm transition-all group">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="font-serif font-bold text-2xl text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-mustard-500 hover:text-mustard-600 transition-colors">View all</Link>
          </div>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.user?.name} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${statusColor(order.orderStatus)} text-xs`}>{order.orderStatus}</span>
                    <span className="font-bold text-sm text-gray-800">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4">No orders yet</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-gray-800">Low Stock Alerts</h2>
            <Link to="/admin/products" className="text-sm text-mustard-500 hover:text-mustard-600 transition-colors">Manage</Link>
          </div>
          {lowStock.length > 0 ? (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((product) => {
                const minStock = product.variants?.length > 0 ? Math.min(...product.variants.map((v) => v.stock)) : (product.stock || 0);
                return (
                  <div key={product._id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                    <p className="text-sm font-medium text-gray-700 truncate flex-1 mr-3">{product.name}</p>
                    <span className={`badge text-xs ${minStock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {minStock === 0 ? 'Out of Stock' : `${minStock} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-green-500 font-medium">✓ All products have healthy stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
