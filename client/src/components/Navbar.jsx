import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Truck,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const navItems = [
    { name: "HAIR", dropdown: ["Haircut", "Hair Spa", "Coloring"] },
    { name: "SKIN", dropdown: ["Facial", "Clean-up", "Detan"] },
    { name: "MAKE UP", dropdown: ["Bridal", "Party Makeup", "Eye"] },
    { name: "TRENDING", path: "/trending" },
    { name: "BRANDS", dropdown: ["Lakme", "Dermafique", "Schwarzkopf"] },
  ];

  return (
    <nav className="bg-black text-white font-sans shadow z-50 w-full fixed">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gradient-gold tracking-widest">
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
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-[#D7CCC8]"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/booking">
            <button className="bg-[#8D6E63] hover:bg-[#5D4037] text-white px-4 py-2 rounded-full shadow-md font-semibold transition-transform duration-300 hover:scale-105">
              Book Appointment
            </button>
          </Link>
          <Link to="/profile">
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
          </Link>
          <Heart size={20} className="text-white hover:text-[#D7CCC8]" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-black text-white px-4 pb-4 space-y-4">
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
                className="block text-sm font-semibold hover:text-[#D7CCC8]"
              >
                {item.name}
              </Link>
            )
          )}
          {/* Profile */}
          <Link to="/profile" className="block text-sm font-semibold">
            {user?.firstName || "Profile"}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
