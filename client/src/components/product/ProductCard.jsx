import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, discountPercent, getEffectivePrice, getOriginalPrice, truncate, getImageUrl } from '../../utils/helpers';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PLACEHOLDER_COLORS = [
  'from-mustard-100 to-mustard-200',
  'from-maroon-100 to-maroon-200',
  'from-olive-100 to-olive-200',
  'from-amber-100 to-amber-200',
];

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product);
  const originalPrice = getOriginalPrice(product);
  const discount = discountPercent(originalPrice, effectivePrice);
  const hasVariants = product.variants && product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants[0] : null;
  const colorClass = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, firstVariant);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      await userAPI.toggleWishlist(product._id);
      toast.success('Wishlist updated!');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${colorClass} aspect-square`}>
          {product.images?.[0] ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-40">🥒</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-maroon-500 text-white text-xs font-bold">{discount}% OFF</span>
            )}
            {product.isBestSeller && (
              <span className="badge bg-mustard-400 text-white text-xs font-bold">⭐ Bestseller</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
            aria-label="Add to wishlist"
          >
            <FiHeart size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>

          {/* Quick add overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-2.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary !py-2 text-sm justify-center"
              id={`add-to-cart-${product._id}`}
            >
              <FiShoppingCart size={15} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-1">
            <span className="text-xs text-mustard-500 font-semibold uppercase tracking-wider">{product.category}</span>
          </div>
          <h3 className="font-serif font-semibold text-gray-800 text-base leading-snug mb-1 group-hover:text-mustard-500 transition-colors">
            {truncate(product.name, 40)}
          </h3>
          <p className="text-xs text-gray-500 mb-3 flex-1 leading-relaxed">
            {truncate(product.shortDescription || product.description, 70)}
          </p>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={12}
                    className={i < Math.floor(product.averageRating) ? 'text-mustard-400 fill-mustard-400' : 'text-gray-300'}
                    fill={i < Math.floor(product.averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-gray-900">{formatPrice(effectivePrice)}</span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            {hasVariants && (
              <span className="text-xs text-gray-400 bg-cream-100 px-2 py-0.5 rounded-lg">
                {product.variants.length} sizes
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
