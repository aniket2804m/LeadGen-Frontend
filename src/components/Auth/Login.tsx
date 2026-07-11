import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Key, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import API from "../../config/api";

interface LoginProps {
  setRole?: (role: string) => void;
}

const Login = ({ setRole }: LoginProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    error: "",
    success: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage({
      error: "",
      success: "",
    });
  };

  // Login Function
  const userLogin = async () => {
    const { email, password } = formData;

    // Validation
    if (!email || !password) {
      return setMessage({
        error: "Please fill all fields",
        success: "",
      });
    }

    try {
      setLoading(true);
      setMessage({ error: "", success: "" });

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, role, user, message: responseMsg } = response.data;

      // Store Data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      if (setRole) {
        setRole(role);
      }

      setMessage({
        success: responseMsg || "Login Successful",
        error: "",
      });

      // Redirect with smooth delay
      setTimeout(() => {
        if (role === "admin") {
          navigate("/console");
        } else {
          navigate("/");
        }
      }, 1200);

    } catch (err: any) {
      console.error("Login Error:", err);
      setMessage({
        error: err.response?.data?.message || "Invalid credentials or server error",
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enter Key Support
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      userLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#F5F0E8] p-4 font-montserrat relative overflow-hidden">
      
      {/* Decorative Gold Glow Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9A84C]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9A84C]/3 blur-[130px] pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-8 bg-[#0F0F0F]/95 border border-[#C9A84C]/15 relative z-10 shadow-2xl animate-[fadeIn_0.6s_ease-out] flex flex-col items-center backdrop-blur-md">
        
        {/* Shield Icon Badge */}
        <div className="flex items-center justify-center w-12 h-12 border border-[#C9A84C]/25 bg-black/60 mb-6">
          <Key className="w-5 h-5 text-[#C9A84C] animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-cinzel font-bold tracking-wider text-white text-center uppercase gold-text-glow mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-[#F5F0E8]/60 font-cormorant italic tracking-wide text-center mb-8">
          Authenticate to access the operating console
        </p>

        {/* Message Banner */}
        {message.error && (
          <div className="w-full bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 text-xs mb-6 text-center animate-[shake_0.4s_ease-in-out]">
            {message.error}
          </div>
        )}

        {message.success && (
          <div className="w-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 px-4 py-3 text-xs mb-6 text-center">
            {message.success}
          </div>
        )}

        <div className="w-full space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F5F0E8]/40">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="name@agency.com"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] text-[#F5F0E8] placeholder-[#F5F0E8]/30 outline-none text-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
              Access Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F5F0E8]/40">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-10 py-3 bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] text-[#F5F0E8] placeholder-[#F5F0E8]/30 outline-none text-sm transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={userLogin}
            disabled={loading}
            className="w-full py-3.5 bg-[#C9A84C] hover:bg-[#C9A84C]/90 disabled:bg-[#C9A84C]/50 text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 active:scale-[0.98] border border-[#C9A84C] flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/10 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decrypting Credentials...</span>
              </>
            ) : (
              <span>Initiate Console Access</span>
            )}
          </button>
        </div>

        {/* Redirect text */}
        <div className="mt-8 text-center text-xs text-[#F5F0E8]/50">
          New operative?{" "}
          <Link
            to="/register"
            className="text-[#C9A84C] hover:underline font-semibold tracking-wider transition-colors ml-1"
          >
            Register Account
          </Link>
        </div>
      </div>

      {/* Local keyframe styles injected */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
