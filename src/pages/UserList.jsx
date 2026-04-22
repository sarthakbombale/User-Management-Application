import { useEffect, useState, useCallback } from 'react';
import { userService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { UserPlus, Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Phone, Mail } from 'lucide-react';

const UserList = () => {
  const navigate = useNavigate(); // For programmatic navigation in cards
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * limit;
      let response;

      if (searchTerm.trim()) {
        response = await userService.search(searchTerm.trim(), limit, skip);
        if (response.data.total === 0) {
          const capitalized = searchTerm.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          const retry = await userService.search(capitalized, limit, skip);
          if (retry.data.total > 0) response = retry;
        }
      } else {
        response = await userService.getAll(limit, skip);
      }
      
      const { data } = response;
      setTotalUsers(data.total);

      const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
      
      let mergedUsers = data.users.map(apiUser => {
        const localMatch = localUpdates.find(u => String(u.id) === String(apiUser.id));
        return localMatch ? localMatch : apiUser;
      });

      if (roleFilter) {
        mergedUsers = mergedUsers.filter(u => u.role?.toLowerCase() === roleFilter.toLowerCase());
      }

      setUsers(mergedUsers);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
      const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
      localStorage.setItem('local_users', JSON.stringify(localUpdates.filter(u => String(u.id) !== String(id))));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Global search enabled.</p>
        </div>
        <Link to="/users/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200">
          <UserPlus size={18} /> Add New User
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search all pages (e.g. Jon Snow)..."
            className="w-full border-2 border-gray-100 bg-white p-3 pl-12 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition text-gray-900 shadow-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            className="w-full border-2 border-gray-100 p-3 pl-10 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none text-gray-900 appearance-none cursor-pointer shadow-sm"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* --- MOBILE/TABLET VIEW (Cards) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {users.length > 0 ? users.map((user) => (
              <div key={user.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
                      <p className="text-[10px] text-gray-400 font-mono">#{user.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                    user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail size={14} className="text-gray-400" /> {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone size={14} className="text-gray-400" /> {user.phone}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-50">
                  <button onClick={() => navigate(`/users/${user.id}`)} className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-1">
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => navigate(`/users/edit/${user.id}`)} className="flex-1 py-2.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 font-medium">No results found.</div>
            )}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-5 font-bold text-gray-600 uppercase text-xs">Name</th>
                    <th className="p-5 font-bold text-gray-600 uppercase text-xs">Contact</th>
                    <th className="p-5 font-bold text-gray-600 uppercase text-xs">Role</th>
                    <th className="p-5 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-400">#{user.id}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm text-gray-700">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.phone}</div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          <Link to={`/users/${user.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={18} /></Link>
                          <Link to={`/users/edit/${user.id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={18} /></Link>
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Arrow-style Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="p-2 border rounded-xl bg-white text-black hover:bg-gray-50 disabled:opacity-20 shadow-sm transition"
          >
            <ChevronsLeft size={20} />
          </button>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border rounded-xl bg-white text-black hover:bg-gray-50 disabled:opacity-20 shadow-sm transition"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <span className="text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-lg border shadow-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border rounded-xl bg-white text-black hover:bg-gray-50 disabled:opacity-20 shadow-sm transition"
          >
            <ChevronRight size={20} />
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(totalPages)}
            className="p-2 border rounded-xl bg-white text-black hover:bg-gray-50 disabled:opacity-20 shadow-sm transition"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;