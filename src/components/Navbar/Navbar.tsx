import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Menu, X, ChevronDown, LogOut, User as UserIcon } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setAccountDropdown(false);
    navigate("/login");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setAccountDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="glass border-b border-[#C9A84C]/15 fixed top-0 left-0 right-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-white font-cinzel font-bold tracking-widest text-lg sm:text-xl uppercase gold-text-glow">
            <Shield className="w-5 h-5 text-[#C9A84C] animate-pulse" />
            <span>Agency OS</span>
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-[11px] font-semibold uppercase tracking-widest text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors"
          >
            Home
          </Link>

          {role === "admin" && (
            <Link
              to="/console"
              className="text-[11px] font-semibold uppercase tracking-widest text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors"
            >
              ✦ Admin Console
            </Link>
          )}

          {/* Account Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAccountDropdown(!accountDropdown)}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#C9A84C]/25 hover:border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Account</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${accountDropdown ? "rotate-180" : ""}`} />
            </button>

            {accountDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-[#C9A84C]/20 shadow-xl z-50 glass py-1 animate-[fadeIn_0.2s_ease-out]">
                {!token ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setAccountDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#F5F0E8]/70 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all"
                    >
                      Register
                    </button>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setAccountDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#F5F0E8]/70 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Console</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* HAMBURGER (MOBILE) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#F5F0E8] hover:text-[#C9A84C] p-2 transition-colors cursor-pointer"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 top-20 bg-black/95 z-40 flex flex-col p-6 space-y-6 glass border-t border-[#C9A84C]/15 animate-[fadeIn_0.3s_ease-out] md:hidden">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E8]/80 hover:text-[#C9A84C]"
          >
            Home
          </Link>

          {role === "admin" && (
            <Link
              to="/console"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold uppercase tracking-wider text-[#F5F0E8]/80 hover:text-[#C9A84C]"
            >
              ✦ Admin Console
            </Link>
          )}

          <div className="h-[1px] bg-[#C9A84C]/15 my-2" />

          {!token ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/register");
                  setMenuOpen(false);
                }}
                className="w-full py-3 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-semibold uppercase tracking-wider text-center"
              >
                Register
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full py-3 bg-[#C9A84C] text-black text-xs font-semibold uppercase tracking-wider text-center"
              >
                Login
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Console</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
