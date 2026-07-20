import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { API_ORIGIN } from '../api/axios';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const totalItemsCount = items.reduce((sum, i) => sum + i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 animate-fade-in">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-extrabold text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">Looks like you haven't added any industrial tools or materials to your cart yet.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50">
              Cart Items ({totalItemsCount})
            </h3>

            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const lineTotal = item.price * item.qty;
                return (
                  <div key={item.productId} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    
                    {/* Image frame */}
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={`${API_ORIGIN}${item.imageUrl}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">No Image</span>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-bold text-slate-800 hover:text-orange-500 text-sm sm:text-base transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Unit Price: LKR {item.price.toLocaleString()}</p>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      
                      {/* Qty Adjustment */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-9 shrink-0">
                        <button
                          onClick={() => updateQty(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="px-2.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="px-2.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right w-24">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                        <p className="font-extrabold text-slate-800 text-sm">
                          LKR {lineTotal.toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove product"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: order Summary card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-sm text-slate-600">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="text-slate-800">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Shipping Fees</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Estimated Taxes</span>
                <span className="text-slate-800 font-bold text-xs uppercase">Included</span>
              </div>
              <div className="border-t border-slate-50 pt-3 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-800">Order Total</span>
                <span className="text-xl font-extrabold text-orange-600">LKR {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all text-center mt-2"
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Secure Trust details badge */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-slate-800">Safe Purchase Protection</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Secure payment arrangement handled directly with certified vendors.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
