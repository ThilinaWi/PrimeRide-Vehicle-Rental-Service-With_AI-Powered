import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/login", { email, password });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate(
          response.data.user.role === "admin" ? "/admindashboard" : "/home"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[url('./assets/images/Login.jpg')] bg-cover bg-center flex justify-center items-center">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl font-semibold mb-7">Login</h4>

          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
            }}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <br />
          <PasswordInput
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
            }}
          />

          {/* Add Forgot Password Link */}
          <div className="flex justify-end mt-1 mb-4">
            <button
              type="button"
              className="text-sm text-cyan-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text sm text-gray-500 text-center my-4">Or</p>

          <button
            type="button"
            className="btn-light btn-primary"
            onClick={() => navigate("/signup")}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
