import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import api from '../../api/axios';
import AdminUsers from './AdminUsers.jsx';
import AdminProducts from './AdminProducts.jsx';
import AdminOrders from './AdminOrders.jsx';

function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-200 border rounded-2xl h-24 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800">Administrator Console</h1>
        <p className="text-slate-500 text-sm">Monitor platform registration levels, active product catalogs, and transaction sales.</p>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        
        <StatCard
          label="Total Registered Users"
          value={stats.totalUsers}
          color="from-blue-500 to-indigo-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        <StatCard
          label="Active Vendors"
          value={stats.totalVendors}
          color="from-orange-500 to-amber-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <StatCard
          label="Registered Customers"
          value={stats.totalCustomers}
          color="from-indigo-500 to-purple-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <StatCard
          label="Total Products Listed"
          value={stats.totalProducts}
          color="from-amber-500 to-yellow-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatCard
          label="Total Orders Forwarded"
          value={stats.totalOrders}
          color="from-teal-500 to-emerald-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        <StatCard
          label="Total Marketplace Revenue"
          value={`LKR ${stats.revenue.toLocaleString()}`}
          color="from-rose-500 to-red-500"
          svg={
            <svg className="h-5.5 w-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
            </svg>
          }
        />
      </div>

      {/* Admin Information Callout */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Administration Guideline</h4>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>Monitor for malicious or non-hardware related items listed by vendors and delete them if necessary.</li>
          <li>User deletion is absolute and removes all related vendor stores or client purchases automatically.</li>
        </ul>
      </div>

    </div>
  );
}

function StatCard({ label, value, color, svg }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight">{label}</p>
        <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-md shrink-0`}>
        {svg}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const links = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
  ];

  return (
    <DashboardLayout title="Admin" links={links}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Routes>
    </DashboardLayout>
  );
}
