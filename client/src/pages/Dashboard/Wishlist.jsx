import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { formatPrice, getEffectivePrice, getImageUrl } from '../../utils/helpers';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await userAPI.getWishlist();
        setWishlist(data.wishlist || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await userAPI.toggleWishlist(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="card p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>;

  if (wishlist.length === 0) {
    return (
      <div className="card p-12 text-center">
        <FiHeart size={48} className="mx-auto text-gray-200 mb-4" />
        <h3 className="font-serif text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-400 mb-6">Save products you love to come back to them later</p>
        <Link to="/products" className="btn-primary">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-bold text-gray-800">My Wishlist ({wishlist.length})</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {wishlist.map((product) => (
          <div key={product._id} className="card p-4 flex gap-4">
            <Link to={`/products/${product.slug}`} className="w-20 h-20 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
              {product.images?.[0] ? (
                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🥒</div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product.slug}`} className="font-semibold text-gray-800 hover:text-mustard-500 text-sm line-clamp-2 transition-colors">
                {product.name}
              </Link>
              <p className="font-bold text-mustard-500 mt-1">{formatPrice(getEffectivePrice(product))}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => addToCart(product, product.variants?.[0])} className="btn-primary !py-1.5 !px-3 text-xs">
                  <FiShoppingCart size={12} /> Add
                </button>
                <button onClick={() => handleRemove(product._id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <FiHeart size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
