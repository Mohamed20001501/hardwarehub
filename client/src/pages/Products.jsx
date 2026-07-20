import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || '';
  const sortVal = searchParams.get('sort') || '';
  const priceVal = searchParams.get('priceRange') || '';
  const vendorVal = searchParams.get('vendor') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchVal) params.search = searchVal;
    if (categoryVal) params.category = categoryVal;
    if (sortVal) params.sort = sortVal;
    if (vendorVal) params.vendor = vendorVal;

    api
      .get('/products', { params })
      .then((res) => {
        let filtered = res.data;
        // Client side filtering for price ranges since the backend doesn't support priceRange param natively
        if (priceVal) {
          if (priceVal === 'under_1000') filtered = filtered.filter((p) => p.price < 1000);
          else if (priceVal === '1000_5000') filtered = filtered.filter((p) => p.price >= 1000 && p.price <= 5000);
          else if (priceVal === '5000_10000') filtered = filtered.filter((p) => p.price >= 5000 && p.price <= 10000);
          else if (priceVal === 'above_10000') filtered = filtered.filter((p) => p.price > 10000);
        }
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [searchVal, categoryVal, sortVal, priceVal, vendorVal]);

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

  const priceRanges = [
    { label: 'Under LKR 1,000', value: 'under_1000' },
    { label: 'LKR 1,000 - LKR 5,000', value: '1000_5000' },
    { label: 'LKR 5,000 - LKR 10,000', value: '5000_10000' },
    { label: 'Over LKR 10,000', value: 'above_10000' },
  ];

  const vendorsList = [
    { name: 'Lanka Hardware Store', id: 'Lanka Hardware Store' },
    { name: 'Colombo Tools & Fasteners', id: 'Colombo Tools & Fasteners' },
    { name: 'Kandy Hardware Supply', id: 'Kandy Hardware Supply' }
  ];

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  }

  function clearAllFilters() {
    setSearchParams({});
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title */}
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Marketplace Catalog</h1>
        <p className="text-slate-500 text-sm">Find specialized industrial items, builder materials, and tools from certified merchants.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6 sticky top-20">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <span className="font-bold text-slate-800">Filter By</span>
              {(categoryVal || searchVal || priceVal || vendorVal) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category list */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Category</span>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', categoryVal === cat ? '' : cat)}
                    className={`text-left text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                      categoryVal === cat
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price list */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Price Range</span>
              <div className="flex flex-col gap-1.5">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => updateParam('priceRange', priceVal === range.value ? '' : range.value)}
                    className={`text-left text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                      priceVal === range.value
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendors Filter */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Suppliers</span>
              <div className="flex flex-col gap-1.5">
                {vendorsList.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => updateParam('vendor', vendorVal === v.id ? '' : v.id)}
                    className={`text-left text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                      vendorVal === v.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* 2. Main Content area */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Top Panel: Search Bar, Sorting, and Active Tagging */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchVal}
                onChange={(e) => updateParam('search', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm pl-10 pr-4 py-2 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sorting selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort by</span>
              <select
                value={sortVal}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
              >
                <option value="">Newest Listings</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Tags list */}
          {(categoryVal || searchVal || priceVal || vendorVal) && (
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Active filters:</span>
              
              {searchVal && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                  Search: "{searchVal}"
                  <button onClick={() => updateParam('search', '')} className="hover:text-orange-800">×</button>
                </span>
              )}
              {categoryVal && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                  Category: {categoryVal}
                  <button onClick={() => updateParam('category', '')} className="hover:text-orange-800">×</button>
                </span>
              )}
              {priceVal && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                  Price: {priceRanges.find((r) => r.value === priceVal)?.label}
                  <button onClick={() => updateParam('priceRange', '')} className="hover:text-orange-800">×</button>
                </span>
              )}
              {vendorVal && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                  Supplier: {vendorVal}
                  <button onClick={() => updateParam('vendor', '')} className="hover:text-orange-800">×</button>
                </span>
              )}
            </div>
          )}

          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm space-y-4">
              <span className="text-5xl block">🔍</span>
              <h3 className="font-extrabold text-slate-800 text-lg">No Products Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">We couldn't find matches for the selected filters. Try broadening your keywords or clearing constraints.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Showing {products.length} matching hardware items</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
