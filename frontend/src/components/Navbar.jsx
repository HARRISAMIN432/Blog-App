import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as adminLogout } from "../redux/adminSlice";
import { userLogout } from "../redux/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.id);
  const isSigned = useSelector((state) => state.admin.isSigned);

  const handleAuthClick = () => {
    if (id || isSigned) {
      localStorage.removeItem("token");
      dispatch(adminLogout());
      dispatch(userLogout());
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-between cursor-pointer items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44"
      />

      <div className="flex items-center gap-4">
        {/* ✅ Show Admin Panel only if admin */}
        {isSigned && (
          <button
            onClick={() => navigate("/admin")}
            className="text-sm font-medium border border-primary text-primary px-6 py-2.5 rounded-full hover:bg-primary/10 transition"
          >
            Admin Panel
          </button>
        )}

        <button
          onClick={handleAuthClick}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
        >
          {id || isSigned ? "Logout" : "Login"}
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
