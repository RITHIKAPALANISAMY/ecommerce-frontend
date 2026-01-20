// src/components/AdminNavbar.jsx
import React, { useState } from "react";
import { Menu, X, Bell, User, Search } from "lucide-react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl text-blue-600">
            Shopverse Admin
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            {/* Icons */}
            <Bell className="cursor-pointer text-gray-600 hover:text-blue-600" size={20} />
            
            {/* Profile */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <User className="text-gray-600 hover:text-blue-600" size={20} />
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 px-4 pt-2 pb-4 space-y-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <a href="/" className="block py-1 text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/products" className="block py-1 text-gray-700 hover:text-blue-600">Products</a>
          <a href="/orders" className="block py-1 text-gray-700 hover:text-blue-600">Orders</a>
          <a href="/users" className="block py-1 text-gray-700 hover:text-blue-600">Users</a>
          <a href="/reports" className="block py-1 text-gray-700 hover:text-blue-600">Reports</a>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
