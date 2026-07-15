import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['Pickles', 'Spices', 'Combos', 'Gift Hampers'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Rated', value: 'rating' },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [localSearch, setLocalSearch] = useState(search);
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({
        category: category || undefined,
        search: search || undefined,
        sort,
        page,
        limit: 12,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (priceMin) params.set('minPrice', priceMin);
    else params.delete('minPrice');
    if (priceMax) params.set('maxPrice', priceMax);
    else params.delete('maxPrice');
    params.delete('page');
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setLocalSearch('');
    setSearchParams({});
  };

  const hasFilters = category || search || minPrice || maxPrice;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-serif font-semibold text-gray-800 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={!category}
              onChange={() => updateParam('category', '')}
              className="accent-mustard-400"
            />
            <span className="text-sm text-gray-600 group-hover:text-mustard-500 transition-colors">All Products</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => updateParam('category', cat)}
                className="accent-mustard-400"
              />
              <span className="text-sm text-gray-600 group-hover:text-mustard-500 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-serif font-semibold text-gray-800 mb-3">Price Range (₹)</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="input-field text-sm !py-2"
              id="price-min"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="input-field text-sm !py-2"
              id="price-max"
            />
          </div>
          <button onClick={handlePriceFilter} className="btn-primary w-full !py-2 text-sm justify-center">
            Apply Filter
          </button>
        </div>
        <div className="mt-2 space-y-1">
          {[['Under ₹200', '', '200'], ['₹200–₹500', '200', '500'], ['Above ₹500', '500', '']].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                min ? params.set('minPrice', min) : params.delete('minPrice');
                max ? params.set('maxPrice', max) : params.delete('maxPrice');
                params.delete('page');
                setSearchParams(params);
              }}
              className="text-xs text-gray-500 hover:text-mustard-500 block transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors">
          <FiX size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-main py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-2xl md:text-3xl">
            {category || search ? (category || `Search: "${search}"`) : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn-secondary !py-2 lg:hidden flex items-center gap-2"
          >
            <FiFilter size={16} /> Filters
          </button>
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input-field !py-2 !pr-8 text-sm appearance-none cursor-pointer"
              id="sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-mustard-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-800">{category || 'All Products'}</span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input-field !pl-10"
            id="product-search"
          />
        </div>
        <button type="submit" className="btn-primary !py-2 px-5">Search</button>
      </form>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FiFilter size={16} /> Filters
            </h2>
            <FilterSidebar />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {category && <span className="badge badge-mustard">{category} <button onClick={() => updateParam('category', '')} className="ml-1"><FiX size={11} /></button></span>}
              {search && <span className="badge badge-mustard">"{search}" <button onClick={() => { updateParam('search', ''); setLocalSearch(''); }} className="ml-1"><FiX size={11} /></button></span>}
              {minPrice && <span className="badge badge-mustard">From ₹{minPrice} <button onClick={() => updateParam('minPrice', '')} className="ml-1"><FiX size={11} /></button></span>}
              {maxPrice && <span className="badge badge-mustard">Up to ₹{maxPrice} <button onClick={() => updateParam('maxPrice', '')} className="ml-1"><FiX size={11} /></button></span>}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-3 rounded w-full" />
                    <div className="skeleton h-6 rounded w-1/2 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam('page', String(i + 1))}
                      className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${page === i + 1 ? 'bg-mustard-400 text-white shadow-warm' : 'bg-white text-gray-600 hover:bg-mustard-50 border border-cream-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-black/50 flex-1" onClick={() => setMobileFilterOpen(false)} />
          <div className="bg-white w-80 h-full overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-xl">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)} className="btn-ghost !p-2">
                <FiX size={20} />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
