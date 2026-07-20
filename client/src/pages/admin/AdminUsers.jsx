import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadUsers() {
    setLoading(true);
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadUsers, []);

  async function handleDelete(id) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4"></div>
        <div className="h-10 bg-slate-150 rounded w-full"></div>
        <div className="h-16 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100 space-y-0.5">
        <h2 className="text-xl font-extrabold text-slate-800">System Users</h2>
        <p className="text-slate-500 text-xs">Review registration logs, contact emails, and manage user credentials.</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-10 text-center space-y-3 shadow-inner">
          <span className="text-4xl block">👥</span>
          <h4 className="font-extrabold text-slate-700 text-sm">No Users Found</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">There are no registered user records in the database.</p>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registered Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{u.name}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{u.email}</td>
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          Admin
                        </span>
                      ) : u.role === 'vendor' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                          Vendor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Revoke Account
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-300">System Lock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
