import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge.jsx';

const STATUSES = ['Pending', 'Processing', 'Delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    api
      .get('/admin/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadOrders, []);

  async function handleStatusChange(orderId, status) {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    loadOrders();
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4"></div>
        <div className="bg-white border rounded-2xl h-36 w-full"></div>
        <div className="bg-white border rounded-2xl h-36 w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="pb-4 border-b border-slate-100 space-y-0.5">
        <h2 className="text-xl font-extrabold text-slate-800">All System Orders</h2>
        <p className="text-slate-500 text-xs">Review and manage status tracking details for all client purchases across the platform.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-10 text-center space-y-3 shadow-inner">
          <span className="text-4xl block">📦</span>
          <h4 className="font-extrabold text-slate-700 text-sm">No Orders Placed</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">There are no client transaction orders recorded in the system.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div key={order._id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                
                {/* Header block */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order Reference</p>
                    <p className="font-extrabold text-slate-800 text-sm">
                      #{order._id.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Placed on {formattedDate}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Customer Info Card */}
                <div className="flex items-center justify-between gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700">Buyer: {order.customer?.name}</p>
                    <p className="text-slate-500">{order.customer?.email}</p>
                  </div>
                  <a
                    href={`mailto:${order.customer?.email}?subject=HardwareHub Order Inquiry: #${order._id.slice(-6)}`}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-lg border border-slate-200 shadow-sm transition-colors"
                  >
                    Email Customer
                  </a>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Items & Merchant details</p>
                  <ul className="text-sm text-slate-700 space-y-2.5 divide-y divide-slate-100/50">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center first:pt-0 pt-2">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.qty} · LKR {item.price.toLocaleString()}</p>
                        </div>
                        <span className="font-bold text-slate-800">
                          LKR {(item.price * item.qty).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Controls */}
                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Transaction value:</span>
                    <span className="text-base font-extrabold text-orange-600">LKR {order.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
