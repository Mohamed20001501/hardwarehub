import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  // Shipping Form State (Local mockup for UX improvement)
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
  });

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const payload = { items: items.map((i) => ({ productId: i.productId, qty: i.qty })) };
      await api.post('/orders', payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Secure Checkout</h1>
        <p className="text-slate-500 text-sm">Please review your items and supply delivery details below.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Shipping Form & Payment Info */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">
              1. Delivery Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nimal Perera"
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20000"
                  value={shippingForm.postalCode}
                  onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Kandy Road"
                  value={shippingForm.addressLine1}
                  onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colombo / Kandy"
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">
              2. Payment Arrangement
            </h3>

            {/* Custom Payment Option Card */}
            <div className="border-2 border-orange-500 rounded-2xl p-4 bg-orange-50/20 flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-4 border-orange-500 bg-white flex items-center justify-center shrink-0 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Cash on Delivery / Direct Vendor Arrangement</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Arrange payment terms or cash-on-delivery details directly with each respective vendor. HardwareHub acts as a vendor matching registry and manual order coordinator.
                </p>
              </div>
            </div>

            {/* Notice Callout */}
            <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-xl p-4 space-y-1">
              <span className="font-extrabold uppercase tracking-wider block">Important Note:</span>
              <p>Online card payment processes are not supported in this version of the platform. Orders are forwarded directly to the vendors to coordinate delivery times and billing.</p>
            </div>
          </div>

          {/* Submit button container */}
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all text-center"
          >
            {placing ? 'Placing Order...' : 'Place Secure Order'}
          </button>
        </form>

        {/* Right Side: Order Summary items preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50">
              Your Order
            </h3>

            {/* Items list */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-3.5 first:pt-0 last:pb-0 flex justify-between gap-3 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Qty: {item.qty}</p>
                  </div>
                  <span className="font-extrabold text-slate-800 shrink-0">
                    LKR {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals panel */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm text-slate-600">
              <div className="flex justify-between font-semibold">
                <span>Items Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Shipping Fees</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
              </div>
              <div className="border-t border-slate-50 pt-3 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-800">Grand Total</span>
                <span className="text-xl font-extrabold text-orange-600">LKR {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
