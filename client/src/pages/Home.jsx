import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 12, seconds: 59 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Split products for varied sections to simulate a large commercial platform
  const flashDeals = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);
  const newArrivals = products.slice(8, 12);
  const recommended = products.slice(2, 6);

  const categories = [
    { name: 'Power Tools', count: '12 Items', color: 'from-orange-500 to-amber-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Paint', count: '8 Items', color: 'from-blue-500 to-indigo-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )},
    { name: 'Electrical Items', count: '14 Items', color: 'from-yellow-500 to-amber-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )},
    { name: 'PVC', count: '9 Items', color: 'from-sky-500 to-teal-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
      </svg>
    )},
    { name: 'Cement', count: '6 Items', color: 'from-stone-500 to-slate-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { name: 'Nuts & Bolts', count: '16 Items', color: 'from-neutral-500 to-gray-500', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    )},
    { name: 'Safety Equipment', count: '10 Items', color: 'from-amber-600 to-orange-600', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { name: 'Garden Tools', count: '11 Items', color: 'from-emerald-500 to-green-600', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )},
    { name: 'Building Materials', count: '15 Items', color: 'from-red-500 to-rose-600', svg: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )}
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Large Premium Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-b-[40px] shadow-2xl py-12 md:py-24">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-600/10 to-indigo-600/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              Sri Lanka's Premier Multi-Vendor Hardware Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-shadow-sm">
              Industrial Hardware & Tools, <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Delivered Instantly</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto md:mx-0 font-normal leading-relaxed">
              Compare prices across Sri Lanka's leading local hardware vendors. Procure heavy materials, professional tools, PVC, electrical items, and cement in bulk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all text-center"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/register"
                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all text-center"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          {/* Banner Promo illustration area */}
          <div className="md:col-span-5 hidden md:block">
            <div className="relative p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl scale-105 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-50"></div>
              <div className="p-8 text-center relative z-10 space-y-4">
                <span className="text-7xl block animate-bounce">🛠️</span>
                <p className="text-xs uppercase text-orange-400 font-extrabold tracking-wider">Top Brand Focus</p>
                <h3 className="text-xl font-bold">Cordless Drill Machine</h3>
                <p className="text-slate-400 text-xs">High performance dual speed motor, certified by Lanka Hardware Store.</p>
                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-orange-400">LKR 12,500</span>
                  <span className="text-xs text-slate-500 line-through ml-2">LKR 15,625</span>
                </div>
                <Link
                  to="/products"
                  className="inline-block px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Explore Categories</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Select a category to view customized industrial tools and materials.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-slate-100 rounded-2xl p-4 text-center hover:shadow-premium-hover hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center shadow-md shadow-orange-500/5 group-hover:scale-110 transition-transform`}>
                {cat.svg}
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-orange-500 transition-colors leading-tight">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale Section with Countdown clock */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white/5 blur-xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-xs font-bold uppercase tracking-wider">
                ⚡ Limited Time Only
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Today's Flash Deals</h2>
              <p className="text-orange-100 text-sm max-w-md">Save up to 40% on select industrial goods, tools and fasteners. Offers reset daily.</p>
            </div>

            {/* Countdown timers */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-black/25 backdrop-blur-md rounded-xl h-14 w-14 flex items-center justify-center font-extrabold text-2xl border border-white/10 shadow">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-orange-100 font-bold uppercase mt-1">Hrs</span>
              </div>
              <span className="font-bold text-2xl -mt-4 text-orange-200 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <div className="bg-black/25 backdrop-blur-md rounded-xl h-14 w-14 flex items-center justify-center font-extrabold text-2xl border border-white/10 shadow">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-orange-100 font-bold uppercase mt-1">Min</span>
              </div>
              <span className="font-bold text-2xl -mt-4 text-orange-200 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <div className="bg-black/25 backdrop-blur-md rounded-xl h-14 w-14 flex items-center justify-center font-extrabold text-2xl border border-white/10 shadow">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-orange-100 font-bold uppercase mt-1">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : flashDeals.length === 0 ? (
            <p className="text-center text-slate-500 py-10 font-semibold bg-white rounded-2xl border border-slate-100">No flash deals currently running.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {flashDeals.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Best Sellers & New Arrivals double section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
        
        {/* Left Column: Best Sellers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-800">Best Selling Hardware</h3>
              <p className="text-xs text-slate-500">Most purchased items in the country.</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white border rounded-xl p-3 space-y-3 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-lg"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : bestSellers.length === 0 ? (
            <p className="text-slate-500 text-sm">No items loaded.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-800">New Arrivals</h3>
              <p className="text-xs text-slate-500">Recently listed tools by our vendors.</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white border rounded-xl p-3 space-y-3 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-lg"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : newArrivals.length === 0 ? (
            <p className="text-slate-500 text-sm">No items loaded.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Popular Brands Logo banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Partnering with Global Industrial Brands</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 items-center justify-items-center opacity-70">
            <div className="font-extrabold text-xl sm:text-2xl text-slate-600 tracking-tighter hover:text-orange-500 transition-colors cursor-pointer">
              BOSCH
            </div>
            <div className="font-extrabold text-xl sm:text-2xl text-slate-600 tracking-tighter hover:text-orange-500 transition-colors cursor-pointer">
              MAKITA
            </div>
            <div className="font-extrabold text-xl sm:text-2xl text-slate-600 tracking-tighter hover:text-orange-500 transition-colors cursor-pointer">
              STANLEY
            </div>
            <div className="font-extrabold text-xl sm:text-2xl text-slate-600 tracking-tighter hover:text-orange-500 transition-colors cursor-pointer">
              ORANGE ELECTRIC
            </div>
            <div className="font-extrabold text-xl sm:text-2xl text-slate-600 tracking-tighter hover:text-orange-500 transition-colors cursor-pointer">
              TOKYO CEMENT
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Vendors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Featured Marketplace Vendors</h2>
            <p className="text-slate-500 text-sm">Certified and reliable wholesale suppliers.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-shadow group">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 font-black">L</div>
              <h4 className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors">Lanka Hardware Store</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Top provider of heavy hand tools, carpentry gear, measuring tape, adjustable wrenches and drill machines.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 mt-6 group-hover:underline">
              Browse store items
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-shadow group">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 font-black">C</div>
              <h4 className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors">Colombo Tools & Fasteners</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Specialists in high quality steel nuts, bolts, galvanized nails, extension cords, PVC plumbing tubes, and LED lighting accessories.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 mt-6 group-hover:underline">
              Browse store items
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-shadow group">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black">K</div>
              <h4 className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors">Kandy Hardware Supply</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Sri Lanka's regional dealer in cement sacks, building aggregates, PVC solvents, home-painting coats, brushes and garden utensils.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 mt-6 group-hover:underline">
              Browse store items
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
