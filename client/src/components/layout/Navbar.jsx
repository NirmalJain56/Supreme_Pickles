import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import brandLogo from '../../assets/logo.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Pickles', to: '/products?category=Pickles' },
  { label: 'Spices', to: '/products?category=Spices' },
  { label: 'Combos', to: '/products?category=Combos' },
  { label: 'Gift Hampers', to: '/products?category=Gift+Hampers' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>


      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-card' : 'bg-cream-50 border-b border-cream-200'}`}>
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={brandLogo}
                alt="Supreme Pickles Logo"
                style={{
                  width: '44px',
                  height: '44px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="group-hover:scale-105 drop-shadow-sm"
              />
              <div>
                <div className="font-serif font-bold text-lg leading-none text-gray-900 group-hover:text-mustard-500 transition-colors">Supreme</div>
                <div className="font-sans text-xs text-maroon-500 font-semibold tracking-widest uppercase leading-none">Pickles</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive && link.to === '/' ? 'text-mustard-500' : 'text-gray-600 hover:text-mustard-500 hover:bg-mustard-50'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="btn-ghost !px-3 !py-2" aria-label="Search">
                <FiSearch size={20} />
              </button>

              {/* Wishlist */}
              {isLoggedIn && (
                <Link to="/dashboard/wishlist" className="btn-ghost !px-3 !py-2 hidden sm:flex" aria-label="Wishlist">
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative btn-ghost !px-3 !py-2" aria-label={`Cart (${itemCount} items)`}>
                <FiShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-gentle">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 btn-ghost !px-3 !py-2"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-mustard-100 rounded-full flex items-center justify-center">
                      <span className="text-mustard-600 font-bold text-sm">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-20 truncate">{user.name.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-cream-200 py-2 animate-slide-up z-50">
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-cream-50 hover:text-mustard-500 transition-colors">
                        <FiUser size={16} /> My Account
                      </Link>
                      <Link to="/dashboard/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-cream-50 hover:text-mustard-500 transition-colors">
                        <FiPackage size={16} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-500 hover:bg-maroon-50 font-semibold transition-colors">
                          <FiSettings size={16} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-cream-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <FiLogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary !py-2 !px-4 text-sm hidden sm:flex">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost !px-3 !py-2 lg:hidden" aria-label="Menu">
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-cream-100 py-4 animate-slide-up">
            <div className="container-main space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-medium transition-colors ${isActive && link.to === '/' ? 'bg-mustard-50 text-mustard-500' : 'text-gray-600 hover:bg-cream-50 hover:text-mustard-500'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!isLoggedIn && (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-primary text-center mt-3">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-card-hover animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">Search Products</h3>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pickles, spices, combos..."
                className="input-field flex-1"
                id="search-input"
              />
              <button type="submit" className="btn-primary">
                <FiSearch size={18} />
              </button>
            </form>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Mango Pickle', 'Garam Masala', 'Gift Hamper', 'Combo Pack'].map((s) => (
                  <button key={s} onClick={() => { setSearchQuery(s); }} className="badge badge-mustard cursor-pointer hover:bg-mustard-200 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
