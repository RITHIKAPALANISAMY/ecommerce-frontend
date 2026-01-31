const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <h2 className="text-xl font-bold text-red-600 tracking-wide">
          ShopVerse
        </h2>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* ADMIN NAME */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <span className="text-sm font-medium text-gray-700">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
