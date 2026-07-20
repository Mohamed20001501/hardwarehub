import { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', image: null };

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function loadProducts() {
    setLoading(true);
    api
      .get('/products/vendor/mine')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
    });
    setError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('category', form.category);
      if (form.image) data.append('image', form.image);

      if (editingId) {
        await api.put(`/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  const categories = [
    'Power Tools',
    'Paint',
    'Electrical Items',
    'PVC',
    'Cement',
    'Nuts & Bolts',
    'Safety Equipment',
    'Garden Tools',
    'Building Materials'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-800">My Product Catalog</h2>
          <p className="text-slate-500 text-xs">Create, edit, and delete hardware items listed under your merchant name.</p>
        </div>
        <button
          onClick={openAddForm}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all text-center shrink-0"
        >
          + Add Product
        </button>
      </div>

      {/* Edit Form Panel */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 sm:p-6 shadow-inner animate-fade-in">
          <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider mb-4">
            {editingId ? 'Edit Product details' : 'Add New Product to Catalog'}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            
            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Title</label>
              <input
                placeholder="e.g. Claw Hammer 16oz"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 text-sm px-3.5 py-2 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all font-semibold"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (LKR)</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 text-sm px-3.5 py-2 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Stock level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">In-Stock Quantity</label>
              <input
                type="number"
                placeholder="e.g. 25"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 text-sm px-3.5 py-2 rounded-xl outline-none transition-all"
              />
            </div>

            {/* description */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Description</label>
              <textarea
                placeholder="Describe key features, measurements, warranty terms, and usage safety tips..."
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 text-sm px-3.5 py-2 rounded-xl outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            {/* File Upload Box */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Image File</label>
              <div className="border-2 border-dashed border-slate-200 bg-white rounded-xl p-4 text-center hover:border-orange-500 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-2xl block mb-1">📤</span>
                <p className="text-xs font-bold text-slate-600">
                  {form.image ? `File selected: ${form.image.name}` : 'Click here or drag files to select photo'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG formats supported. Re-uploading updates existing file.</p>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm font-semibold sm:col-span-2">{error}</p>}

            {/* Form actions */}
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
              >
                {saving ? 'Saving changes...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog items table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-slate-100 rounded w-full"></div>
          <div className="h-16 bg-slate-200 rounded w-full"></div>
          <div className="h-16 bg-slate-200 rounded w-full"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-10 text-center space-y-3 shadow-inner">
          <span className="text-4xl block">📦</span>
          <h4 className="font-extrabold text-slate-700 text-sm">No Products Registered</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">You haven't listed any hardware goods. Click "+ Add Product" to create your first merchant item.</p>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4 font-semibold">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-xs font-semibold lowercase first-letter:uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-orange-600">LKR {p.price.toLocaleString()}</td>
                    <td className="p-4">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          Out of Stock
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          {p.stock} units left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {p.stock} units
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => openEditForm(p)}
                        className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
