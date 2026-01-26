import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./AppHeader.css";

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <img
        src={logo}
        alt="Shoverse"
        className="app-logo"
        onClick={() => navigate("/")}
      />
    </header>
  );
};

export default AppHeader;
