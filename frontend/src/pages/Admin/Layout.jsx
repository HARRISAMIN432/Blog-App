import React from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/adminSlice";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <img
          src={assets.logo}
          alt=""
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={() => {
            localStorage.removeItem("token");
            dispatch(logout());
          }}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
