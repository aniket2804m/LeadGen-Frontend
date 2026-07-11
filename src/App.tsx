import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LeadGenAgent from "./components/Lead/LeadGenAgent";
import UserHome from "./components/Lead/UserHome";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Navbar from "./components/Navbar/Navbar";
import HowWork from "./components/pages/Home/HowWorks";
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

function AppContent() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const location = useLocation();

  // Listen for role updates
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isConsole = location.pathname === "/console";

  return (
    <main className={`min-h-screen ${isConsole ? "bg-[#F8FAFC]" : "bg-[#0A0A0A]"}`}>
      {!isConsole && <Navbar />}
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/howwork" element={<HowWork />} />
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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
