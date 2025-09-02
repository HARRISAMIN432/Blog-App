import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/AdminSlice";
import { userLogin } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const token = data.token;
        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role || "user";
        if (role === "admin") {
          dispatch(login());
          navigate("/");
        } else {
          dispatch(userLogin({ id: payload.id, username: data.username }));
          navigate("/");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Network error. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Login</span>
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-6 w-full sm:max-w-md text-gray-600"
            >
              <div>
                <label> Email </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                  placeholder="your email id"
                  className="border-b-2 border-gray-300 placeholder:text-gray-300 p-2 outline-none mb-6"
                />
              </div>
              <div>
                <label> Password </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  required
                  placeholder="your password"
                  className="border-b-2 border-gray-300 placeholder:text-gray-300 p-2 outline-none mb-6"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
