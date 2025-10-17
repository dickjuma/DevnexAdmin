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
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Default collapsed
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

  // Load dark mode and login state
  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode") === "true");
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : "expanded"} ${screenSize}`}>
      {/* Menu button (top-left corner) */}
      <div className="sidebar-toggle" onClick={toggleCollapse}>
        <Menu size={22} />
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
              title={item.name}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="text">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-settings">
          <div className="sidebar-item" onClick={() => setDarkMode(!darkMode)}>
            <span className="icon">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</span>
            {!collapsed && <span className="text">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </div>

          <div className="sidebar-item" onClick={handleAuth}>
            <span className="icon">{isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}</span>
            {!collapsed && <span className="text">{isLoggedIn ? "Sign Out" : "Sign In"}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
