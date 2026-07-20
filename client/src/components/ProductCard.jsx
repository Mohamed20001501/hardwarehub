import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { API_ORIGIN } from '../api/axios';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Generate a mock regular price to calculate discount (e.g., price is 20% off)
  const discountPercent = 20;
  const oldPrice = Math.round(product.price / (1 - discountPercent / 100));

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  }

  function toggleQuickView(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(!showQuickView);
  }

  return (
    <>
      <div
        className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full animate-fade-in"
      >
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
            {discountPercent}% OFF
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md tracking-wider animate-pulse">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all outline-none"
        >
          <svg
            className={`h-4.5 w-4.5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
            fill={wishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Image Frame */}
        <Link to={`/products/${product._id}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={`${API_ORIGIN}${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
              <svg className="h-8 w-8 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              No image
            </div>
          )}

          {/* Quick View Button Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={toggleQuickView}
              className="px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold rounded-lg shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
            >
              Quick View
            </button>
          </div>
        </Link>

        {/* Content details */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Vendor & Category details */}
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="truncate max-w-28 text-slate-500">
              {product.vendor?.name || 'Local Vendor'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold lowercase first-letter:uppercase">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product._id}`}
            className="mt-1 text-sm font-bold text-slate-800 hover:text-orange-500 line-clamp-2 min-h-10 transition-colors"
          >
            {product.name}
          </Link>

          {/* Ratings (Mocked Visually) */}
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-bold">(12)</span>
          </div>

          {/* Stock Indicator Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
              <span>Stock level</span>
              <span>{product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  product.stock === 0
                    ? 'w-0'
                    : product.stock <= 5
                    ? 'w-1/4 bg-red-500'
                    : product.stock <= 15
                    ? 'w-2/4 bg-amber-500'
                    : 'w-full bg-emerald-500'
                }`}
              ></div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-baseline gap-2">
            <span className="text-base font-extrabold text-orange-600">
              LKR {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 line-through">
              LKR {oldPrice.toLocaleString()}
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 shadow-md transition-all duration-200 ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/10 hover:shadow-orange-500/25'
            }`}
          >
            {product.stock === 0 ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* Quick View Modal Dialog */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-6 mt-2">
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                {product.imageUrl ? (
                  <img
                    src={`${API_ORIGIN}${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400 text-sm">No image available</span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">
                  {product.category}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{product.name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sold by <span className="font-bold text-slate-700">{product.vendor?.name || 'Local Vendor'}</span>
                </p>

                <p className="text-slate-600 text-sm mt-4 line-clamp-4 leading-relaxed">
                  {product.description || 'No description provided for this hardware item.'}
                </p>

                {/* Pricing & Stock details */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                      <p className="text-xl font-extrabold text-orange-600">LKR {product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Availability</p>
                      <p className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full mt-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 shadow-md transition-all duration-200 ${
                      product.stock === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : added
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
