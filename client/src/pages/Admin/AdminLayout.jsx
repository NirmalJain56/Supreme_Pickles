import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import brandLogo from '../../assets/logo.png';

const adminNav = [
  { label: 'Dashboard', to: '/admin', icon: <FiGrid size={18} />, end: true },
  { label: 'Products', to: '/admin/products', icon: <FiShoppingBag size={18} /> },
  { label: 'Orders', to: '/admin/orders', icon: <FiPackage size={18} /> },
  { label: 'Customers', to: '/admin/customers', icon: <FiUsers size={18} /> },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-maroon-500 text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg">
            <img src={brandLogo} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="font-serif font-bold text-lg">Admin Panel</span>
        </div>
        <Link to="/" className="flex items-center gap-2 text-sm text-maroon-100 hover:text-white transition-colors">
          <FiArrowLeft size={16} /> Back to Store
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-white border-r border-cream-200 py-6">
          <nav className="space-y-1 px-3">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-maroon-50 text-maroon-600 font-semibold' : 'text-gray-600 hover:bg-cream-50 hover:text-maroon-500'}`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
