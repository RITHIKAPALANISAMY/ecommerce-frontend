// src/pages/common/Profile.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import BuyerProfile from "./BuyerProfile";
import SellerProfile from "./SellerProfile";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500">
        Not authorized
      </div>
    );
  }

  // 🔥 ROLE CHECKING
  if (user.roles?.includes("seller")) {
    return <SellerProfile user={user} />;
  }

  return <BuyerProfile user={user} />;
};

export default Profile;