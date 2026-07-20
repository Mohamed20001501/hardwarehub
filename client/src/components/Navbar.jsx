import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const [searchVal, setSearchVal] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const profileRef = useRef(null);
  const categoryRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/products');
    }
  }

  async function handleLogout() {
    await logout();
    setShowProfileDropdown(false);
    navigate('/');
  }

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

  return (
    <header className="glassmorphism sticky top-0 z-50 border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              H
            </span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              HardwareHub
            </span>
          </Link>

          {/* Categories Dropdown */}
          {!isAuthPage && (
            <div className="hidden lg:block relative" ref={categoryRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Categories
                <svg className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-50 animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setShowCategoryDropdown(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          {!isAuthPage && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools, hardware, brands..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-100/80 border-0 focus:bg-white focus:ring-2 focus:ring-orange-500 text-sm pl-10 pr-4 py-2.5 rounded-full outline-none transition-all placeholder:text-slate-400 text-slate-800"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
          )}

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            
            {/* Products link */}
            {!isAuthPage && (
              <Link to="/products" className="hidden md:inline-block text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">
                Browse
              </Link>
            )}

            {/* Notification Bell */}
            {!isAuthPage && (
              <button className="p-2 rounded-full hover:bg-slate-100 relative text-slate-500 transition-colors">
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
              </button>
            )}

            {/* Cart Icon with badge */}
            {!isAuthPage && (
              <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 relative text-slate-500 transition-colors">
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-orange-500/30">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons or Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100/80 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-500/10">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-bold text-slate-700 max-w-24 truncate">
                    {user.name}
                  </span>
                  <svg className="h-3 w-3 text-slate-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white border border-slate-100 shadow-xl py-3 z-50 animate-fade-in text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                      <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-orange-50 text-orange-600 tracking-wider">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Vendor Dashboard
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}

                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          View Cart
                        </Link>
                      </>
                    )}

                    <hr className="my-2 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-orange-500 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-inner animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {/* Search */}
            {!isAuthPage && (
              <form onSubmit={handleSearchSubmit} className="pt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-slate-100 border-0 focus:ring-2 focus:ring-orange-500 text-sm pl-4 pr-4 py-2 rounded-lg outline-none"
                />
              </form>
            )}

            {!isAuthPage && (
              <Link
                to="/products"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
              >
                All Products
              </Link>
            )}

            {!isAuthPage && (
              <div className="pt-2">
                <p className="px-3 text-xs font-semibold uppercase text-slate-400 tracking-wider">Categories</p>
                <div className="mt-1 grid grid-cols-2 gap-1.5 px-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setShowMobileMenu(false)}
                      className="py-1 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
