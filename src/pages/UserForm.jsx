import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { validateUser } from '../utils/validate';
import toast from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, ShieldCheck, ArrowLeft,
    Save, Loader2, UserPlus, Edit3, Fingerprint
} from 'lucide-react';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', role: 'user'
    });
    const [errors, setErrors] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Check Local Storage first for edited data
            const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
            const localUser = localUpdates.find(u => String(u.id) === String(id));

            if (localUser) {
                // Use local data if we've edited this user before
                setFormData({
                    ...localUser,
                    phone: localUser.phone.replace(/\D/g, '').slice(-10)
                });
                setLoading(false);
                return; // Exit early, no need to call API
            }

            // 2. If no local data, fetch from API
            const { data } = await userService.getById(id);
            const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);

            setFormData({
                ...data,
                phone: cleanPhone
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to load user data");
            navigate('/users');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isEditMode) fetchUserDetails();
    }, [isEditMode, fetchUserDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateUser(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);
        try {
            let response;
            if (isEditMode) {
                response = await userService.update(id, formData);
            } else {
                response = await userService.create(formData);
            }

            // --- PERSISTENCE FIX ---
            const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');

            // API returns the newly created user object. 
            // We merge our formData with the API response to ensure we have all fields.
            const savedData = { ...formData, ...response.data };
            const savedId = String(savedData.id);

            // Remove old local version if it exists
            const filteredUpdates = localUpdates.filter(u => String(u.id) !== savedId);

            // Save the full object to localStorage
            localStorage.setItem('local_users', JSON.stringify([savedData, ...filteredUpdates]));

            toast.success(isEditMode ? "User Updated!" : "User Created!");
            navigate('/users');
        } catch (err) {
            console.error("API Error:", err);

            // FALLBACK: If API 404s on Create/Update, save to LocalStorage anyway for the demo
            const fallbackId = isEditMode ? id : Date.now();
            const fallbackData = { ...formData, id: fallbackId };
            const localUpdates = JSON.parse(localStorage.getItem('local_users') || '[]');
            const filtered = localUpdates.filter(u => String(u.id) !== String(fallbackId));

            localStorage.setItem('local_users', JSON.stringify([fallbackData, ...filtered]));

            toast.success(isEditMode ? "Updated (Local Only)" : "Created (Local Only)");
            navigate('/users');
        } finally {
            setSaving(false);
        }
    };
    // Common styles for all text inputs to ensure consistency
    const inputStyles = (fieldName) => `
    w-full border-2 p-3 rounded-xl transition-all outline-none focus:ring-4 
    bg-white text-gray-900 placeholder:text-gray-400
    ${errors[fieldName] ? 'border-red-400 focus:ring-red-50' : 'border-gray-100 focus:ring-blue-50 focus:border-blue-400'}
  `;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {isEditMode ? <Edit3 size={24} /> : <UserPlus size={24} />}
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        {isEditMode ? 'Edit Profile' : 'Add New User'}
                    </h2>
                </div>
                <motion.button
                    whileHover={{ x: -3 }}
                    onClick={() => navigate('/users')}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
                >
                    <ArrowLeft size={16} /> Back
                </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                            <User size={14} className="text-blue-500" /> First Name
                        </label>
                        <input
                            name="firstName"
                            placeholder="e.g. John"
                            className={inputStyles('firstName')}
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <AnimatePresence>
                            {errors.firstName && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Last Name */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                            <Fingerprint size={14} className="text-blue-500" /> Last Name
                        </label>
                        <input
                            name="lastName"
                            placeholder="e.g. Doe"
                            className={inputStyles('lastName')}
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <AnimatePresence>
                            {errors.lastName && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                        <Mail size={14} className="text-blue-500" /> Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className={inputStyles('email')}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <AnimatePresence>
                        {errors.email && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-xs mt-1 font-medium">{errors.email}</motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Phone */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                        <Phone size={14} className="text-blue-500" /> Phone Number
                    </label>
                    <input
                        name="phone"
                        placeholder="9876543210"
                        className={inputStyles('phone')}
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <AnimatePresence>
                        {errors.phone && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Role Select */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1.5">
                        <ShieldCheck size={14} className="text-blue-500" /> System Role
                    </label>
                    <div className="relative">
                        <select
                            name="role"
                            className="w-full border-2 p-3 rounded-xl border-gray-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none bg-white cursor-pointer text-gray-900 appearance-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user" className="text-gray-900">User</option>
                            <option value="admin" className="text-gray-900">Admin</option>
                        </select>
                        {/* Custom arrow icon since appearance-none hides the default */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-xl shadow-blue-100 mt-4"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create User'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default UserForm;