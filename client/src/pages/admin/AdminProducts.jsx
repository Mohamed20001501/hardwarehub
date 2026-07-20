import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    setLoading(true);
    api
      .get('/admin/products')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    loadProducts();
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4"></div>
        <div className="h-10 bg-slate-150 rounded w-full"></div>
        <div className="h-16 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100 space-y-0.5">
        <h2 className="text-xl font-extrabold text-slate-800">All Catalog Products</h2>
        <p className="text-slate-500 text-xs">Review and manage all products listed across all platform vendors.</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-10 text-center space-y-3 shadow-inner">
          <span className="text-4xl block">📦</span>
          <h4 className="font-extrabold text-slate-700 text-sm">No Products Listed</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">There are no hardware goods currently listed in the database.</p>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{p.vendor?.name || 'Unknown'}</td>
                    <td className="p-4 font-semibold">
                      <span className="px-2.5 py-0.5 bg-slate-100 rounded text-slate-600 text-xs font-semibold lowercase first-letter:uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-orange-600">LKR {p.price.toLocaleString()}</td>
                    <td className="p-4">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 border border-red-100 text-red-700 text-xs font-bold">
                          Out of Stock
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold">
                          Low: {p.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                          {p.stock} units
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove Listing
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
