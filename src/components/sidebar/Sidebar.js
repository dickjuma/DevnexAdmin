import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  ShoppingBag,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Sun,
  Moon,
  FileText,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Add Product", path: "/addproduct", icon: <PlusCircle size={20} /> },
    { name: "Add Service", path: "/service", icon: <PlusCircle size={20} /> },
    { name: "Product/Service List", path: "/table", icon: <List size={20} /> },
    { name: "Users List", path: "/user", icon: <Users size={20} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingBag size={20} /> },
    { name: "Payments", path: "/payment", icon: <CreditCard size={20} /> },
     { name: "Auto Invoice", path: "/autoinvoice", icon: <FileText size={20} /> },
       { name: "Generate Invoice", path: "/invoice", icon: <FileText size={20} /> }, // updated icon
   { name: "Generate Receipt", path: "/receipt", icon: <FileText size={20} /> },
  ];

  // ✅ Load theme and login state from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Apply dark mode to entire site
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // ✅ Handle sign in / out
  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-top">
        <h2 className="sidebar-title">{collapsed ? "D" : "Shop Manager"}</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="text">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="sidebar-settings">
        {/* Dark Mode Toggle */}
        <div
          className="sidebar-item settings-item"
          onClick={() => setDarkMode(!darkMode)}
        >
          <span className="icon">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
          {!collapsed && <span className="text">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </div>

        {/* Auth Section */}
        <div className="sidebar-item settings-item" onClick={handleAuth}>
          <span className="icon">{isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}</span>
          {!collapsed && <span className="text">{isLoggedIn ? "Sign Out" : "Sign In"}</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
