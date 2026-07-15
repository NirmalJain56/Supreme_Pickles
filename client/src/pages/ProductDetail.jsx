import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';
import { productAPI, reviewAPI, userAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, discountPercent, formatDate, getImageUrl } from '../utils/helpers';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getBySlug(slug);
        setProduct(data.product);
        if (data.product.variants?.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
        // Fetch related products
        const related = await productAPI.getAll({ category: data.product.category, limit: 4 });
        setRelated(related.data.products.filter((p) => p._id !== data.product._id).slice(0, 4));
        // Fetch reviews
        const rev = await reviewAPI.getForProduct(data.product._id);
        setReviews(rev.data.reviews || []);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    setActiveImage(0);
    setQuantity(1);
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login to post a review'); return; }
    setReviewLoading(true);
    try {
      const { data } = await reviewAPI.create(product._id, reviewForm);
      setReviews((prev) => [data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 rounded w-3/4" />
            <div className="skeleton h-4 rounded w-1/2" />
            <div className="skeleton h-24 rounded w-full" />
            <div className="skeleton h-12 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasVariants = product.variants?.length > 0;
  const currentPrice = selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price);
  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const discount = discountPercent(originalPrice, currentPrice);
  const currentStock = selectedVariant ? selectedVariant.stock : (product.stock || 0);
  const inStock = currentStock > 0;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-cream-100 py-3">
        <div className="container-main flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-mustard-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-mustard-500 transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-mustard-500 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-48">{product.name}</span>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-cream-100 rounded-2xl overflow-hidden aspect-square mb-4">
              {product.images?.length > 0 ? (
                <img
                  src={getImageUrl(product.images[activeImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🥒</div>
              )}
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => Math.max(0, p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-cream-50 transition-colors">
                    <FiChevronLeft size={20} />
                  </button>
                  <button onClick={() => setActiveImage((p) => Math.min(product.images.length - 1, p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-cream-50 transition-colors">
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 badge bg-maroon-500 text-white text-sm font-bold px-3 py-1">
                  {discount}% OFF
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-mustard-400 shadow-warm' : 'border-cream-200 hover:border-mustard-200'}`}
                  >
                    <img src={getImageUrl(img)} alt={`View ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-mustard">{product.category}</span>
              {product.isBestSeller && <span className="badge bg-maroon-100 text-maroon-500">⭐ Bestseller</span>}
              {!inStock && <span className="badge bg-red-100 text-red-600">Out of Stock</span>}
            </div>

            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.floor(product.averageRating) ? 'text-mustard-400 fill-mustard-400' : 'text-gray-300'} fill={i < Math.floor(product.averageRating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-mustard-500 font-semibold">{product.averageRating}</span>
              <span className="text-gray-400 text-sm">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif font-bold text-4xl text-gray-900">{formatPrice(currentPrice)}</span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="badge bg-green-100 text-green-700 text-sm">{discount}% off</span>
                </>
              )}
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-3">Select Size:</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                        selectedVariant?.weight === v.weight
                          ? 'border-mustard-400 bg-mustard-50 text-mustard-600 shadow-warm'
                          : v.stock === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 text-gray-600 hover:border-mustard-200 hover:bg-mustard-50'
                      }`}
                    >
                      {v.weight}
                      {v.discountPrice && (
                        <span className="block text-xs font-normal mt-0.5 text-mustard-500">{formatPrice(v.discountPrice)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-semibold text-gray-700">Qty:</p>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 transition-colors">
                  <FiMinus size={16} />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 transition-colors">
                  <FiPlus size={16} />
                </button>
              </div>
              {currentStock > 0 && currentStock <= 10 && (
                <span className="text-sm text-orange-500 font-medium">Only {currentStock} left!</span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={!inStock} className="btn-secondary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={!inStock} className="btn-maroon flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 py-4 border-t border-cream-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiTruck size={16} className="text-mustard-400" /> Free delivery above ₹499
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiShield size={16} className="text-mustard-400" /> 100% Natural, FSSAI Certified
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-serif font-bold text-lg text-gray-800 mb-3">About This Product</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className="mt-5">
                <h2 className="font-serif font-bold text-lg text-gray-800 mb-3">Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span key={ing} className="badge badge-mustard">{ing}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="section-title text-2xl mb-8">Customer Reviews</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Review Summary */}
            <div className="card p-6 text-center">
              <div className="font-serif font-bold text-6xl text-mustard-500 mb-2">{product.averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={20} className={i < Math.floor(product.averageRating) ? 'text-mustard-400 fill-mustard-400' : 'text-gray-200'} fill={i < Math.floor(product.averageRating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-gray-500 text-sm">{product.numReviews} reviews</p>

              {/* Write Review */}
              {isLoggedIn ? (
                <form onSubmit={handleReviewSubmit} className="mt-6 text-left space-y-3">
                  <p className="font-semibold text-gray-700 text-sm">Write a Review</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}>
                        <FiStar size={20} className={star <= reviewForm.rating ? 'text-mustard-400 fill-mustard-400' : 'text-gray-300'} fill={star <= reviewForm.rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Review title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="input-field text-sm"
                    id="review-title"
                  />
                  <textarea
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    className="input-field text-sm h-24 resize-none"
                    required
                    id="review-comment"
                  />
                  <button type="submit" disabled={reviewLoading} className="btn-primary w-full justify-center !py-2 text-sm">
                    {reviewLoading ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <Link to="/login" className="btn-secondary w-full justify-center mt-4">Login to Review</Link>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length > 0 ? reviews.map((r) => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-mustard-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-mustard-600 text-sm">{r.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={14} className={i < r.rating ? 'text-mustard-400 fill-mustard-400' : 'text-gray-200'} fill={i < r.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="font-semibold text-gray-700 text-sm mb-1">{r.title}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                </div>
              )) : (
                <div className="card p-8 text-center text-gray-400">
                  <p className="text-4xl mb-2">💬</p>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title text-2xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
