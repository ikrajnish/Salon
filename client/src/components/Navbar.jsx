import React, { useState } from "react";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
    setIsMobileOpen(false);
  };

  const navItems = [
    { name: "HAIR", dropdown: ["Haircut", "Hair Spa", "Coloring"] },
    { name: "SKIN", dropdown: ["Facial", "Clean-up", "Detan"] },
    { name: "MAKE UP", dropdown: ["Bridal", "Party Makeup", "Eye"] },
    { name: "TRENDING", path: "/trending" },
    { name: "BRANDS", dropdown: ["Lakme", "Dermafique", "Schwarzkopf"] },
  ];

  return (
    <nav className="bg-[#003463] text-white font-sans shadow z-50 w-full fixed">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMobileOpen(false)}
          className="text-2xl font-bold text-gradient-gold tracking-widest"
        >
          MORES
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-sm font-semibold tracking-wide uppercase">
          {navItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setDropdown(item.name)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="flex items-center gap-1 hover:text-[#D7CCC8]">
                  {item.name}
                  <ChevronDown size={14} />
                </button>
                {dropdown === item.name && (
                  <div className="absolute top-full left-0 bg-black text-white py-2 mt-1 shadow-lg w-44 rounded z-50">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block px-4 py-2 text-sm hover:bg-[#222]"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.name} to={item.path} className="hover:text-[#D7CCC8]">
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4 relative">
          <Heart size={20} className="text-white hover:text-[#D7CCC8]" />

          {/* 👤 User dropdown or Login */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button className="flex items-center gap-1">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-sm font-bold uppercase">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                )}
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full bg-black text-white py-2 mt-0 shadow-lg w-44 rounded z-50">
                  {user?.isAdmin ? (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-[#222]">
                      Admin Panel
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-[#222]">
                      Membership Zone
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-[#222]">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#222]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full shadow-md font-semibold transition-transform duration-300 hover:scale-105 hover:brightness-110"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Sidebar Menu (Right side) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#001f3f] text-white transform ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-white/20">
          <h2 className="text-xl font-bold">MORES</h2>
          <button onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="px-4 py-6 space-y-4 overflow-y-auto flex-1">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setDropdown(dropdown === item.name ? null : item.name)
                  }
                  className="flex justify-between w-full text-left text-sm font-semibold"
                >
                  {item.name}
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform ${
                      dropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {dropdown === item.name && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        onClick={() => setIsMobileOpen(false)}
                        className="block text-sm hover:text-[#D7CCC8]"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className="block text-sm font-semibold hover:text-[#D7CCC8]"
              >
                {item.name}
              </Link>
            )
          )}

          {/* 👤 User Links in Mobile */}
          {user && (
            <div className="mt-6 border-t border-white/20 pt-4 space-y-2">
              {user?.isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm font-semibold hover:text-[#D7CCC8]"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm font-semibold hover:text-[#D7CCC8]"
                >
                  Membership Zone
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsMobileOpen(false)}
                className="block text-sm font-semibold hover:text-[#D7CCC8]"
              >
                Profile
              </Link>
            </div>
          )}
        </div>

        {/* 🔻 Bottom Fixed Logout/Login */}
        <div className="border-t border-white/20 p-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              className="block text-center w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
