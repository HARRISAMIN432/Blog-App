import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  return (
    <div>
      <NavLink
        end={true}
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3.5 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={assets.home_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>
      <NavLink
        to="/admin/listBlog"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3.5 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={assets.list_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">List Blog</p>
      </NavLink>
      <NavLink
        to="/admin/comments"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3.5 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={assets.comment_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Comments</p>
      </NavLink>
      <NavLink
        to="/admin/subscribers"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3.5 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src="../../assets/subscribe.png" alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Subscribers</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
