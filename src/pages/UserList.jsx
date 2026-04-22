import { useEffect, useState, useMemo, useCallback } from 'react';
import { userService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { UserPlus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch and Merge Logic
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userService.getAll();
      const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
      
      // Merge local updates into API data
      const apiUsersMerged = data.users.map(apiUser => {
        const localMatch = localUpdates.find(u => String(u.id) === String(apiUser.id));
        return localMatch ? localMatch : apiUser;
      });

      // Add brand new users (created locally) not present in the API
      const brandNewUsers = localUpdates.filter(
        local => !data.users.some(api => String(api.id) === String(local.id))
      );

      setUsers([...brandNewUsers, ...apiUsersMerged]);
    } catch (err) {
        console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Combined Search & Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // FIXED: Single declaration of handleDelete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.delete(id);
      
      // 1. Update UI state
      setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
      
      // 2. Persist deletion to localStorage
      const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
      const filteredLocal = localUpdates.filter(u => String(u.id) !== String(id));
      localStorage.setItem('local_users', JSON.stringify(filteredLocal));
      
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Manage, edit, and monitor system users.</p>
        </div>
        <Link 
          to="/users/add" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200"
        >
          <UserPlus size={18} /> Add New User
        </Link>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full border-2 border-gray-100 bg-white p-3 pl-12 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition text-gray-900 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            className="w-full border-2 border-gray-100 p-3 pl-10 rounded-xl bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none text-gray-900 cursor-pointer appearance-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Name</th>
                <th className="p-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Contact Info</th>
                <th className="p-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Role</th>
                <th className="p-5 font-bold text-gray-600 uppercase text-xs tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-400">ID: {user.id}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-gray-700">{user.email}</div>
                      <div className="text-xs text-gray-500 font-mono">{user.phone}</div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role?.toLowerCase() === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/users/${user.id}`} title="View Details" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={18} /></Link>
                        <Link to={`/users/edit/${user.id}`} title="Edit User" className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"><Edit size={18} /></Link>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <p className="text-gray-400 font-medium">No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;