// Format price in Indian Rupee format
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate discount percentage
export const discountPercent = (original, discounted) => {
  if (!discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

// Truncate text
export const truncate = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Star rating array
export const getStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

// Validate email
export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Validate phone (Indian 10-digit)
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// Get product effective price (cheapest variant or fixed)
export const getEffectivePrice = (product) => {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.discountPrice || v.price);
    return Math.min(...prices);
  }
  return product.discountPrice || product.price;
};

// Get product original price (for discount display)
export const getOriginalPrice = (product) => {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price);
    return Math.min(...prices);
  }
  return product.price;
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Scroll to top
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Order status color
export const statusColor = (status) => {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

// Get full image URL (prepends backend URL in production)
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '') || 'http://localhost:5000';
  
  return `${baseUrl}${path}`;
};
