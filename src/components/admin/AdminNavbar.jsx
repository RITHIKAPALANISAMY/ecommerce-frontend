import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
        <h2 className="logo">ShopVerse </h2>

        <div className="navbar-right">
          <input type="text" placeholder="Search..." />
          <span className="admin-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
