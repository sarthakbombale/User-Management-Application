import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full"
      >
        <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/users" 
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;