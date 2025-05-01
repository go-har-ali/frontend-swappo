import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();

    try {
      //const BASE_URL = "https://swappo-6zd6.onrender.com";

      const BASE_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://swappo-6zd6.onrender.com";

      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if HTTP response status code is 2xx
        if (data.user) {
          localStorage.setItem("token", data.user); // Assuming data.user is the token
          navigate("/home");
        } else {
          console.error("Token not found in response:", data);
          alert("Unexpected issue with login, please try again."); // More generic error for unexpected cases
        }
      } else {
        console.log("Failed login response:", data);
        alert(data.message || "Please check your email and password"); // Use server-provided message if available
      }
    } catch (error) {
      console.error("Login request failed", error);
      alert("Login failed due to technical reasons"); // Handle errors like network issues
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="submit"
              value="Login"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
          <Link
            to="/register"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
