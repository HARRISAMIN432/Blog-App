import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../redux/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.VITE_API_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const token = data.token;
        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        dispatch(userLogin({ id: payload.id, username: name }));
        navigate("/");
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
              <span className="text-primary">Sign</span> Up
            </h1>
            <p className="font-light">Create your account to get started</p>
            <form
              onSubmit={handleSubmit}
              className="mt-6 w-full sm:max-w-md text-gray-600"
            >
              <div>
                <label> Username </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder="Username"
                  className="border-b-2 border-gray-300 placeholder:text-gray-300 p-2 outline-none mb-6 w-full"
                />
              </div>
              <div>
                <label> Email </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                  placeholder="your email id"
                  className="border-b-2 border-gray-300 placeholder:text-gray-300 p-2 outline-none mb-6 w-full"
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
                  className="border-b-2 border-gray-300 placeholder:text-gray-300 p-2 outline-none mb-6 w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
