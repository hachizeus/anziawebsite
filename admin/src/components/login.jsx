import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt, FaClock } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://real-estate-backend-vybd.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/admin-auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success) {
        const user = response.data.user;
        
        // Store the token in localStorage for ProtectedRoute
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(user));
        

        
        toast.success("Admin login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // No token refresh needed with longer-lived token

  return (
    <section className="bg-[#4B4B4B]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-2 bg-[#91BB3E] rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-[#4B4B4B] md:text-2xl text-center flex items-center justify-center">
              <FaShieldAlt className="mr-2 text-[#91BB3E]" /> Secure Admin Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-[#4B4B4B]"
                >
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#91BB3E] focus:border-[#91BB3E] block w-full p-2.5"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-[#4B4B4B]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#91BB3E] focus:border-[#91BB3E] block w-full p-2.5"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-[#91BB3E] hover:bg-[#7a9e33] focus:ring-4 focus:outline-none focus:ring-[#91BB3E]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;