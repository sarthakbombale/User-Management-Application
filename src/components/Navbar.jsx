import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white shadow-md p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/users" className="text-xl font-bold tracking-tight">
          PROMINNO <span className="font-light text-blue-200">User Portal</span>
        </Link>
        <div className="space-x-4">
          <Link to="/users" className="hover:text-blue-200 transition">All Users</Link>
          <Link to="/users/add" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">+ Add New</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;