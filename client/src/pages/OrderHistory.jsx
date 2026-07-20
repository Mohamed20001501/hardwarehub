import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge.jsx';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border rounded-2xl h-44 p-6 space-y-4 shadow-sm">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Purchase History</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm space-y-4 animate-fade-in">
          <span className="text-6xl block">📦</span>
          <h3 className="font-extrabold text-slate-800 text-lg">No Orders Placed Yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Once you purchase industrial tools or cement building materials, your orders will appear here with live tracking status.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            // Set current step index for tracking timeline
            const statusSteps = ['Pending', 'Processing', 'Delivered'];
            const currentStepIdx = statusSteps.indexOf(order.status);

            return (
              <div key={order._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow animate-fade-in">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order Identification</p>
                    <p className="font-extrabold text-slate-700 text-sm">
                      #{order._id.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Placed on {formattedDate}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Status stepper tracker */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative max-w-lg mx-auto">
                    {/* Stepper bar backline */}
                    <div className="absolute inset-x-0 h-1 bg-slate-100 top-1/2 -translate-y-1/2 rounded-full z-0"></div>
                    <div
                      className="absolute left-0 h-1 bg-orange-500 top-1/2 -translate-y-1/2 rounded-full z-0 transition-all duration-700"
                      style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
                    ></div>

                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isActive = idx === currentStepIdx;
                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shadow border transition-all duration-300 ${
                              isActive
                                ? 'bg-orange-500 text-white border-orange-500 ring-4 ring-orange-500/10 scale-110'
                                : isCompleted
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                              isActive
                                ? 'text-orange-600'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items breakdown list */}
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-3">Itemized List</p>
                  <ul className="text-sm text-slate-700 space-y-3.5 divide-y divide-slate-100/30">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center first:pt-0 pt-3">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400 font-semibold uppercase">Qty: {item.qty} · LKR {item.price.toLocaleString()}</p>
                        </div>
                        <span className="font-extrabold text-slate-800">
                          LKR {(item.price * item.qty).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order total info */}
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    LKR {order.totalPrice.toLocaleString()}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
