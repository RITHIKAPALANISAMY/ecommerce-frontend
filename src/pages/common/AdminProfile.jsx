// src/pages/common/AdminProfile.jsx

import React from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Users,
  Ban,
  BadgeCheck,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      {/* ========================= */}
      {/* ADMIN HEADER */}
      {/* ========================= */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl font-bold shadow-inner">
              {user.fullName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.fullName}
              </h1>

              <p className="text-gray-500 mt-1">
                System Administrator
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span className="px-4 py-1 text-sm rounded-full bg-red-50 text-red-600 font-medium">
                  {user.role}
                </span>

                <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-50 text-green-600 font-medium">
                  <ShieldCheck size={16} />
                  Full Access
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================= */}
      {/* ADMIN DETAILS */}
      {/* ========================= */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Administrator Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ProfileItem
            icon={<User size={18} />}
            label="Full Name"
            value={user.fullName}
          />

          <ProfileItem
            icon={<Mail size={18} />}
            label="Email Address"
            value={user.email}
          />

          <ProfileItem
            icon={<ShieldCheck size={18} />}
            label="Access Level"
            value="Super Administrator"
          />

        </div>
      </div>

      {/* ========================= */}
      {/* ADMIN CONTROLS */}
      {/* ========================= */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Administrative Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <ActionCard
            icon={<Users size={22} />}
            title="Manage Users"
            description="View all users, filter by role, and monitor activity."
            onClick={() => navigate("/admin/users")}
          />

          <ActionCard
            icon={<Ban size={22} />}
            title="Ban / Unban Users"
            description="Control user access and enforce platform policies."
            onClick={() => navigate("/admin/ban-management")}
          />

          <ActionCard
            icon={<BadgeCheck size={22} />}
            title="Verify Sellers"
            description="Approve or reject seller verification requests."
            onClick={() => navigate("/admin/verify-sellers")}
          />

          <ActionCard
            icon={<Settings size={22} />}
            title="System Settings"
            description="Configure system-level platform settings."
            onClick={() => navigate("/admin/settings")}
          />

        </div>
      </div>

    </div>
  );
};

/* ========================= */
/* PROFILE ITEM COMPONENT */
/* ========================= */
const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
      <div className="text-red-600 mt-1">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>
        <p className="text-lg font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

/* ========================= */
/* ACTION CARD COMPONENT */
/* ========================= */
const ActionCard = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:scale-[1.02]"
    >
      <div className="text-red-600 mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default AdminProfile;