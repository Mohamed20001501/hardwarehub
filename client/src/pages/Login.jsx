import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'vendor') navigate('/vendor');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [user, loading, navigate]);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'vendor') navigate('/vendor');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 animate-fade-in">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Color accents */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <Link to="/" className="inline-flex h-9 w-9 bg-orange-500 text-white rounded-xl items-center justify-center font-extrabold shadow shadow-orange-500/20 text-lg mb-2">
            H
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Log In to HardwareHub</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Access your marketplace account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. nimal.perera@test.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-slate-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">Account Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-slate-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-100 rounded-lg p-2.5 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all text-center mt-2"
          >
            {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <hr className="border-slate-100" />

        <p className="text-xs text-slate-500 text-center">
          New to the marketplace?{' '}
          <Link to="/register" className="text-orange-500 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
