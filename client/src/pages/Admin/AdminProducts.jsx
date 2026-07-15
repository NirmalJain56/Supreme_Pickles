import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import { formatPrice, getEffectivePrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['Pickles', 'Spices', 'Combos', 'Gift Hampers'];

const emptyForm = {
  name: '', slug: '', shortDescription: '', description: '', category: 'Pickles',
  ingredients: '', tags: '', images: '', price: '', discountPrice: '',
  stock: '', isFeatured: false, isBestSeller: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ limit: 50 });
      setProducts(data.products || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription || '',
      description: product.description,
      category: product.category,
      ingredients: product.ingredients?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
      images: product.images?.join(', ') || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stock: product.stock || '',
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch { toast.error('Failed'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
        price: form.price ? Number(form.price) : undefined,
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: form.stock ? Number(form.stock) : undefined,
      };
      if (editProduct) {
        await productAPI.update(editProduct._id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      setShowForm(false);
      setEditProduct(null);
      setForm(emptyForm);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={() => { setShowForm(true); setEditProduct(null); setForm(emptyForm); }} className="btn-primary">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field !pl-10" id="admin-product-search" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Rating</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.map((product) => {
                const stockVal = product.variants?.length > 0 ? product.variants.reduce((sum, v) => sum + v.stock, 0) : (product.stock || 0);
                return (
                  <tr key={product._id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">🥒</div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.isFeatured && <span className="badge badge-mustard text-xs">Featured</span>}
                            {product.isBestSeller && <span className="badge bg-maroon-100 text-maroon-500 text-xs">Bestseller</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{product.category}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{formatPrice(getEffectivePrice(product))}</td>
                    <td className="py-3 px-4">
                      <span className={`badge text-xs ${stockVal <= 0 ? 'bg-red-100 text-red-600' : stockVal <= 20 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {stockVal <= 0 ? 'Out of Stock' : `${stockVal} units`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">⭐ {product.averageRating} ({product.numReviews})</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="w-8 h-8 bg-mustard-50 text-mustard-600 rounded-lg flex items-center justify-center hover:bg-mustard-100 transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: !editProduct ? e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : form.slug })} className="input-field" id="admin-product-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" id="admin-product-slug" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" id="admin-product-category">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" id="admin-product-price" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" id="admin-product-discount" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" id="admin-product-stock" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-field" id="admin-short-desc" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-28 resize-none" id="admin-product-desc" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field" id="admin-product-ingredients" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field" id="admin-product-images" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-mustard-400" id="admin-featured" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="accent-mustard-400" id="admin-bestseller" />
                  <span className="text-sm text-gray-700">Bestseller</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Product'}</button>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
