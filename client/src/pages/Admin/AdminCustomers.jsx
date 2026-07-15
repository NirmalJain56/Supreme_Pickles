import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await userAPI.getAll({ limit: 50 });
        setUsers(data.users || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-gray-800">Customers ({users.length})</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No customers yet</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-mustard-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-mustard-600 text-sm">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.email}</td>
                  <td className="py-3 px-4 text-gray-500">{user.phone || '—'}</td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge text-xs ${user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
