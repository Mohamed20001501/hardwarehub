import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { API_ORIGIN } from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl block">⚠️</span>
        <h2 className="text-xl font-bold text-slate-800 mt-4">{error}</h2>
        <Link to="/products" className="inline-block mt-4 text-orange-500 font-bold hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-slate-200 rounded-3xl"></div>
        <div className="space-y-6 py-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-20 bg-slate-200 rounded w-full"></div>
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const discountPercent = 20;
  const oldPrice = Math.round(product.price / (1 - discountPercent / 100));

  function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function incrementQty() {
    if (qty < product.stock) setQty(qty + 1);
  }

  function decrementQty() {
    if (qty > 1) setQty(qty - 1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-48">{product.name}</span>
      </nav>

      {/* Main product display grid */}
      <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Left Column: Image display */}
        <div className="md:col-span-6 space-y-4">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative group">
            <span className="absolute top-4 left-4 z-10 bg-red-500 text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-md tracking-wider">
              {discountPercent}% OFF
            </span>

            {product.imageUrl ? (
              <img
                src={`${API_ORIGIN}${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <svg className="h-16 w-16 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: details & Checkout */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Category & Title */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-orange-50 text-orange-600 tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Star Rating Review panel */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4.5 w-4.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">(12 Customer Reviews)</span>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing block */}
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">Price</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-orange-600">
                LKR {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400 line-through">
                LKR {oldPrice.toLocaleString()}
              </span>
              <span className="bg-red-50 text-red-600 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-red-100">
                Save LKR {(oldPrice - product.price).toLocaleString()} ({discountPercent}%)
              </span>
            </div>
          </div>

          {/* Stock Alert banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {product.stock > 0 ? 'Item is in stock' : 'Temporary out of stock'}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">
                  {product.stock > 0 ? `${product.stock} units available at warehouse` : 'Check back later'}
                </p>
              </div>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                Selling Fast!
              </span>
            )}
          </div>

          {/* Vendor Details card */}
          <div className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Merchant Supplier</p>
              <h4 className="font-bold text-slate-800 text-sm hover:text-orange-500 transition-colors">
                {product.vendor?.name || 'Local Merchant'}
              </h4>
              <p className="text-xs text-slate-500">{product.vendor?.email || 'vendor@hardwarehub.lk'}</p>
            </div>
            <a
              href={`mailto:${product.vendor?.email || 'support@hardwarehub.lk'}?subject=Inquiry: ${encodeURIComponent(product.name)}`}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200/50 transition-colors"
            >
              Contact Merchant
            </a>
          </div>

          {/* Checkout controls */}
          {user?.role !== 'vendor' && user?.role !== 'admin' && (
            <div className="pt-2 space-y-4">
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                
                {/* Quantity select slider panel */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 h-11 shrink-0">
                  <button
                    onClick={decrementQty}
                    disabled={qty <= 1 || product.stock === 0}
                    className="px-3.5 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors font-extrabold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800 text-sm">
                    {qty}
                  </span>
                  <button
                    onClick={incrementQty}
                    disabled={qty >= product.stock || product.stock === 0}
                    className="px-3.5 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors font-extrabold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                
                {/* Buy Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 shadow-lg transition-all duration-200 ${
                    product.stock === 0
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                      : added
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:shadow-orange-500/30'
                  }`}
                >
                  {product.stock === 0 ? 'Out of stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all ${
                    wishlisted
                      ? 'bg-red-50 border-red-200 text-red-500 shadow-md shadow-red-500/5'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50'
                  }`}
                >
                  <svg className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tabs Section for specs and details */}
      <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'description'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'specs'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Technical Specifications
          </button>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'description' ? (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description || 'No detailed description available for this hardware item.'}
              </p>
              <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 text-xs text-orange-800 space-y-1">
                <span className="font-extrabold uppercase block tracking-wider mb-1">Safety Instruction Reminder:</span>
                <p>When operating machinery, safety glasses and proper safety gear are highly recommended. Contact the respective vendor to query bulk purchase rates, wholesale shipping times, or certifications.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600 border border-slate-100 rounded-xl overflow-hidden">
                <tbody>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 font-bold text-slate-700 w-1/3">Item Category</th>
                    <td className="p-3">{product.category}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 font-bold text-slate-700">Supplying Vendor</th>
                    <td className="p-3">{product.vendor?.name}</td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 font-bold text-slate-700">Warranty</th>
                    <td className="p-3">Local Seller Warranty (Details upon request)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 font-bold text-slate-700">Packaging Size</th>
                    <td className="p-3">Standard Factory Box</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <th className="p-3 font-bold text-slate-700">Item ID</th>
                    <td className="p-3 font-mono text-xs">{product._id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
