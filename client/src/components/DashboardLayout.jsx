import { NavLink } from 'react-router-dom';

export default function DashboardLayout({ title, links, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Control Panel */}
      <aside className="w-full md:w-60 shrink-0">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          
          {/* Dashboard Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse"></div>
            <h2 className="font-extrabold text-slate-800 text-base tracking-tight">
              {title} Workspace
            </h2>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/10'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span>{link.label}</span>
                <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        {children}
      </div>

    </div>
  );
}
