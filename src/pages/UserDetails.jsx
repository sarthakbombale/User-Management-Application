import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check Local Storage first so edited users show correct info
      const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
      const localUser = localUpdates.find(u => String(u.id) === String(id));

      if (localUser) {
        setUser(localUser);
        setLoading(false);
        return;
      }

      // 2. Fallback to API
      const { data } = await userService.getById(id);
      setUser(data);
    } catch (err) {
      console.error(err);
      toast.error("User not found");
      navigate('/users');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-64 gap-4">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      <p className="text-gray-500 font-medium">Fetching profile details...</p>
    </div>
  );

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">User Profile</h2>
        <button 
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Profile Info Card */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
            <p className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
            <p className="text-md font-medium text-gray-700">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
            <p className="text-md font-medium text-gray-700">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Role</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black uppercase ${user.role === 'admin' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Back Action */}
      <button 
        onClick={() => navigate('/users')} 
        className="w-full mt-8 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg"
      >
        Return to Dashboard
      </button>
    </motion.div>
  );
};

export default UserDetails;