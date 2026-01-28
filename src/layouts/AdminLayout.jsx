import { Outlet } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";

const AdminLayout = () => {
  return (
    <>
      <AppHeader />
      <main style={{ padding: "24px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;