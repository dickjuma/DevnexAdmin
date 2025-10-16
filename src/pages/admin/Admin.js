import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

import "./admin.css";

const Admin = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`admin-container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Sidebar />

        {/* Collapse Button */}
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Admin Dashboard Panel</h1>
            <p className="admin-subtitle">
              Manage Products, Orders, and Users — all in one place.
            </p>
          </div>
        </header>

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
                  <p>
                    Use the sidebar to navigate between management tools and keep your
                    platform up to date.
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
