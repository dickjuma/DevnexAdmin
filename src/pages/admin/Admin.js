import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";

// Components
import Addproduct from "../../components/AddProduct/Addproduct";
import Table from "../../components/table/Table";
import UsersComp from "../../components/users/Users";
import Order from "../../components/order/Order";
import Dashboard from "../../components/Dashborad/Dashbord";
import Payment from "../../components/Payment/payment";
import Service from "../../components/Addservice/service";
import Login from "../../components/Adminlogin/Login";
import InvoiceGenerator from "../../components/Invoice/Invoice";
import ReceiptGenerator from "../../components/Reciet/Reciept";
import Auto from "../../components/AutoGenerator/Auto";

// Dashboard overview
const OverviewCards = () => (
  <div className="stats-grid">
    <div className="stat-card">
      <h3>Total Products</h3>
      <p>245</p>
    </div>
    <div className="stat-card">
      <h3>Active Users</h3>
      <p>1,032</p>
    </div>
    <div className="stat-card">
      <h3>Pending Orders</h3>
      <p>87</p>
    </div>
    <div className="stat-card">
      <h3>Total Revenue</h3>
      <p>KES 142,300</p>
    </div>
  </div>
);

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "admin/dashboard" },
    { name: "Add-Products", icon: <ShoppingBag size={20} />, path: "/addproduct" },
    { name: "Add-Services", icon: <ShoppingBag size={20} />, path: "/service" },
    { name: "Orders", icon: <CreditCard size={20} />, path: "/orders" },
    { name: "Users", icon: <Users size={20} />, path: "/user" },
    { name: "Producs & Services", icon: <ShoppingBag size={20} />, path: "/table" },
    { name: "Payments", icon: <CreditCard size={20} />, path: "/payment" },
    { name: "Invoices", icon: <CreditCard size={20} />, path: "/invoice" },
    { name: "Receipts", icon: <CreditCard size={20} />, path: "/receipt" },
    { name: "Auto Invoice", icon: <CreditCard size={20} />, path: "/autoinvoice" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/login" },
  ];

  return (
    <div className={`admin-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo-text">Devnex</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate("/")}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Main Area */}
      <main className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <Menu size={22} />
            </button>
            <h1>Devnex Groceries Admin Control Panel</h1>
          </div>
          <div className="nav-right">
          
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
           
          </div>
        </nav>

       
        <section className="content-area">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <>
                  <OverviewCards />
                  <div className="chart-placeholder glass-card">
                    <h3>Analytics Overview</h3>
                    <p>Charts and reports will appear here.</p>
                  </div>
                </>
              }
            />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/table" element={<Table />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/user" element={<UsersComp />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/service" element={<Service />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="/receipt" element={<ReceiptGenerator />} />
            <Route path="/autoinvoice" element={<Auto />} />
            <Route
              path="/"
              element={
                <div className="admin-welcome glass-card">
                  <h2>Welcome to Devnex Admin</h2>
                  <p>
                    Use the sidebar to navigate between sections like products,
                    users, services, and invoices.
                  </p>
                </div>
              }
            />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default Admin;
