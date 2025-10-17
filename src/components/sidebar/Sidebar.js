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
  LogOut,
  LogIn,
  Sun,
  Moon,
  FileText,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop");

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
    { name: "Generate Invoice", path: "/invoice", icon: <FileText size={20} /> },
    { name: "Generate Receipt", path: "/receipt", icon: <FileText size={20} /> },
  ];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) setScreenSize("desktop");
      else if (width > 768) setScreenSize("tablet");
      else setScreenSize("mobile");
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load dark mode and auth state
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode") === "true");
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile Hamburger */}
      {screenSize === "mobile" && (
        <button className="mobile-toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => screenSize === "mobile" && setSidebarOpen(false)}
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Settings */}
        <div className="sidebar-settings">
          <div className="sidebar-item" onClick={() => setDarkMode(!darkMode)}>
            <span className="icon">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
            <span className="text">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <div className="sidebar-item" onClick={handleAuth}>
            <span className="icon">{isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}</span>
            <span className="text">{isLoggedIn ? "Sign Out" : "Sign In"}</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {screenSize === "mobile" && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;
