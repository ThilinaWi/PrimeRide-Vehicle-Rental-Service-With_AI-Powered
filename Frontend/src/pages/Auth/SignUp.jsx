import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle the form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Enhanced validation checks
    if (!name.trim()) {
      setError("Please enter a valid name"); // Name cannot be empty or just spaces
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address"); // Validate email format
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long"); // Minimum password length requirement
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter"); // Ensure uppercase letter
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter"); // Ensure lowercase letter
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number"); // Ensure at least one number
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError(
        "Password must contain at least one special character (!@#$%^&*)"
      ); // Ensure special character
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/home");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[url('./assets/images/Register.jpg')] bg-cover bg-center flex justify-center items-center">
      <div className="container h-screen flex justify-center items-center px-20 mx-auto">
        <div className="w-2/4 p-10 bg-white rounded-lg shadow-lg z-50">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            {/* Input for Full Name */}
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={({ target }) => setName(target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Input for Email */}
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Password Input Component */}
            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {/* Error Message Display */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Submit Button */}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>

            <p className="text sm text-gray-500 text-center my-4">Or</p>

            {/* Navigate to Login Page */}
            <button
              type="button"
              className="btn-light btn-primary"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
