import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LeadGenAgent from "./components/Lead/LeadGenAgent";
import UserHome from "./components/Lead/UserHome";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      {children}
    </>
  );
};

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Listen for role updates
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <main className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/console"
            element={
              <ProtectedRoute>
                {role === "admin" ? <LeadGenAgent /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
