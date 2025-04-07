import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/logo.png";

export default function AuthForm({ isRegister = false }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const apiUrl = isRegister
      ? `http://localhost:4000/api/auth/register`
      : `http://localhost:4000/api/auth/login`;
    const payload = isRegister
      ? { username, email, password }
      : { email, password };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      if (!isRegister) {
        // Store token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.username);
        
        // Redirect to home page
        navigate("/", { replace: true });
      } else {
        // After registration, redirect to login
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Form Container */}
      <div className="bg-gray-900 bg-opacity-80 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            className="w-[200] h-[100px] object-contain"
            src={loginImg}
            alt="Logo"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-600">
          {isRegister
            ? "Register for Weather Report"
            : "Welcome to Weather Report"}
        </h2>

        <form onSubmit={handleSubmit} className="text-gray-300">
          {isRegister && (
            <div className="flex flex-col mb-4">
              <label className="font-semibold text-sm">Username</label>
              <input
                className="rounded-lg bg-gray-800 mt-2 p-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div className="flex flex-col mb-4">
            <label className="font-semibold text-sm">Email</label>
            <input
              className="rounded-lg bg-gray-800 mt-2 p-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="font-semibold text-sm">Password</label>
            <input
              className="rounded-lg bg-gray-800 mt-2 p-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition shadow-md hover:shadow-xl mt-4"
          >
            {isRegister ? "Register" : "Sign In"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900 bg-opacity-50 text-red-300 rounded-lg">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="text-teal-400 hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
