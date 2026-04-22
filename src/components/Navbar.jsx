import { Link } from 'react-router-dom';
import logo from '../assets/prominno-logo.png';

const Navbar = () => {
  return (
    <nav className="bg-white text-gray-800 border-b border-gray-100 shadow-sm p-3 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/users" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img 
            src={logo} 
            alt="Prominno Logo" 
            className="h-8 w-auto object-contain" 
          />
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <span className="text-sm font-bold tracking-widest text-gray-400 uppercase hidden sm:block">
            User Portal
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/users" 
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
          >
            All Users
          </Link>
          <Link 
            to="/users/add" 
            className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100"
          >
            + ADD NEW
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;