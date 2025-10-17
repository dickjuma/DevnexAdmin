// src/pages/admin/Admin.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Components
import Sidebar from "../../components/sidebar/Sidebar";
import Addproduct from "../../components/AddProduct/Addproduct";
import Table from "../../components/table/Table";
import Users from "../../components/users/Users";
import Order from "../../components/order/Order";
import Dashboard from "../../components/Dashborad/Dashbord";
import Payment from "../../components/Payment/payment";
import Service from "../../components/Addservice/service";
import Login from "../../components/Adminlogin/Login";
import InvoiceGenerator from "../../components/Invoice/Invoice";
import ReceiptGenerator from "../../components/Reciet/Reciept";
import Auto from "../../components/AutoGenerator/Auto";

// Assets & CSS
import logo from "../../assets/account.png";
import "./admin.css";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed] = useState(false); // optional for future
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    setSidebarOpen(false); // close on mobile
    navigate(path);
  };

  return (
    <div
      className={`admin-container ${sidebarOpen ? "sidebar-open" : ""} ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? "show" : ""} onLinkClick={handleLinkClick} />

      {/* Overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-left">
            {/* Hamburger for mobile */}
            <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <img src={logo} alt="Logo" className="nav-logo" />
            <div className="brand-name">Dickson Juma</div>
          </div>
          <div className="nav-center">Hello, Welcome Back Admin!</div>
        </nav>

        {/* Header */}
        <header className="admin-header">
          <h1 className="admin-title">Admin Dashboard Panel</h1>
          <p className="admin-subtitle">
            Manage Products, Orders, and Users — all in one place.
          </p>
        </header>

        {/* Content */}
        <section className="admin-content">
          <Routes>
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/table" element={<Table />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/user" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/service" element={<Service />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="/receipt" element={<ReceiptGenerator />} />
            <Route path="/autoinvoice" element={<Auto />} />
            <Route
              path="/"
              element={
                <div className="admin-welcome">
                  <h2>Welcome to the Admin Control Center</h2>
                  <p>Use the sidebar to navigate between management tools and keep your platform up to date.</p>
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
