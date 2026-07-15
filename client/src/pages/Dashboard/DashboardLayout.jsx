import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'My Profile', to: '/dashboard', icon: <FiUser size={18} />, end: true },
  { label: 'My Orders', to: '/dashboard/orders', icon: <FiPackage size={18} /> },
  { label: 'Wishlist', to: '/dashboard/wishlist', icon: <FiHeart size={18} /> },
  { label: 'Saved Addresses', to: '/dashboard/addresses', icon: <FiMapPin size={18} /> },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="container-main py-8">
      <h1 className="section-title mb-8">My Account</h1>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-mustard-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-serif font-bold text-2xl text-mustard-600">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-mustard-50 text-mustard-600 font-semibold' : 'text-gray-600 hover:bg-cream-50 hover:text-mustard-500'}`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all">
                <FiLogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
