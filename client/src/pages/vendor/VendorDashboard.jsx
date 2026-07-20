import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import api from '../../api/axios';
import VendorProducts from './VendorProducts.jsx';
import VendorOrders from './VendorOrders.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function VendorOverview() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/products/vendor/mine').then((res) => setProducts(res.data));
    api.get('/orders/vendor').then((res) => setOrders(res.data));
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800">Welcome Back, {user?.name}!</h1>
        <p className="text-slate-500 text-sm">Here is a quick overview of your HardwareHub storefront metrics today.</p>
      </div>

      {/* Grid of premium cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        
        <StatCard
          label="My Active Products"
          value={products.length}
          color="from-orange-500 to-amber-500"
          svg={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatCard
          label="Orders Received"
          value={orders.length}
          color="from-blue-500 to-indigo-500"
          svg={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        <StatCard
          label="Estimated Revenue"
          value={`LKR ${revenue.toLocaleString()}`}
          color="from-emerald-500 to-teal-500"
          svg={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
            </svg>
          }
        />
      </div>

      {/* Helpful tips panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Merchant Growth Tips</h4>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>Ensure item inventories are accurately updated to prevent customer checkout delays.</li>
          <li>Promptly process order status updates from <strong>Pending</strong> to <strong>Processing</strong> as you package goods.</li>
          <li>For shipping arrangements, coordinate with customers directly using details printed on order receipts.</li>
        </ul>
      </div>

    </div>
  );
}

function StatCard({ label, value, color, svg }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
      </div>
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-md`}>
        {svg}
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  const links = [
    { to: '/vendor', label: 'Overview', end: true },
    { to: '/vendor/products', label: 'My Products' },
    { to: '/vendor/orders', label: 'Orders' },
  ];

  return (
    <DashboardLayout title="Vendor" links={links}>
      <Routes>
        <Route index element={<VendorOverview />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="orders" element={<VendorOrders />} />
      </Routes>
    </DashboardLayout>
  );
}
