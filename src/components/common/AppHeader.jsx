import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
        <img
          src={logo}
          alt="ShopVerse"
          onClick={() => navigate("/")}
          className="h-10 cursor-pointer object-contain"
        />
      </div>
    </header>
  );
};

export default AppHeader;
