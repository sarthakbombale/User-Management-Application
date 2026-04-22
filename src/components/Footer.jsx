import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center">
      <p className="text-sm text-gray-400 font-medium">
        © {new Date().getFullYear()} UserManage. Developed by 
        <span className="text-blue-500 ml-1 font-bold">Sarthak Bombale</span>
      </p>
    </footer>
  );
};

// THIS IS THE MISSING LINE:
export default Footer;