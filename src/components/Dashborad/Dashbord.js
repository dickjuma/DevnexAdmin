import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  Users,
  ShoppingBag,
  CreditCard,
  Clock,
  TrendingUp,
  Database,
  Package,
  XCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalPayments: 0,
    fraudPayments: 1,
    confirmedPayments: 1,
    pendingOrders: 1,
    confirmedOrders: 1,
    cancelledOrders: 1,
    latestService: null,
    latestOrder: null,
    growth: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useSample, setUseSample] = useState(false);

  // === Sample fallback data (offline mode) ===
  const sampleData = {
    totalUsers: 1245,
    totalServices: 63,
    totalOrders: 840,
    totalProducts: 54,
    totalPayments: 650,
    fraudPayments: 6,
    confirmedPayments: 600,
    pendingOrders: 70,
    confirmedOrders: 720,
    cancelledOrders: 50,
    growth: 13.2,
    latestService: { name: "Car Detailing", price: 3000 },
    latestOrder: { userId: "Jane Doe", date: new Date() },
  };

  // === Fetch data from backend ===
  const fetchStats = async (showToast = false) => {
    if (useSample) {
      setStats(sampleData);
      setError("📊 Showing sample data (offline mode).");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    if (showToast) toast.info("Refreshing dashboard data...");

    try {
      const res = await axios.get(`${API_URL}/dashboard-stats`, { timeout: 8000 });

      if (res.data.success) {
        const data = res.data.data;

        // Fill missing fields with defaults (1)
        setStats({
          totalUsers: data.totalUsers || 1,
          totalOrders: data.totalOrders || 1,
          totalServices: data.totalServices || 1,
          totalProducts: data.totalProducts || 1,
          totalPayments: data.totalPayments || 1,
          fraudPayments: 1,
          confirmedPayments: 1,
          pendingOrders: 1,
          confirmedOrders: 1,
          cancelledOrders: 1,
          growth: 1,
          latestService: data.latestService || null,
          latestOrder: data.latestOrder || null,
        });

        showToast && toast.success("✅ Dashboard data updated!");
      } else {
        throw new Error(res.data.message || "Server returned no data");
      }
    } catch (err) {
      console.error("⚠️ Backend error:", err.message);
      setError("⚠️ Failed to connect to backend. Switched to sample mode.");
      setStats(sampleData);
      setUseSample(true);
      toast.warning("⚠️ Backend unreachable. Using sample data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [useSample]);

  return (
    <div className="dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* === Header === */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 Admin Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Real-time tracking of users, services, products & orders
          </p>
        </div>

        <div className="header-buttons">
          <button
            className="refresh-btn"
            onClick={() => fetchStats(true)}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className={`toggle-btn ${useSample ? "sample" : "live"}`}
            onClick={() => setUseSample(!useSample)}
          >
            <Database size={18} />
            {useSample ? "Switch to Live Data" : "Use Sample Data"}
          </button>
        </div>
      </div>

      {/* === Loading State === */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {error && <p className="dashboard-warning">{error}</p>}

          {/* === Stats Cards === */}
          <div className="dashboard-cards">
            <div className="card stat-users">
              <Users size={28} />
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Registered Users</p>
              </div>
            </div>

            <div className="card stat-services">
              <Package size={28} />
              <div className="stat-info">
                <h3>{stats.totalServices}</h3>
                <p>Total Services</p>
              </div>
            </div>

            <div className="card stat-products">
              <ShoppingBag size={28} />
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="card stat-orders">
              <Clock size={28} />
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="card stat-revenue">
              <CreditCard size={28} />
              <div className="stat-info">
                <h3>{stats.totalPayments}</h3>
                <p>Total Payments</p>
              </div>
            </div>

            <div className="card stat-growth">
              <TrendingUp size={28} />
              <div className="stat-info">
                <h3>+{stats.growth}%</h3>
                <p>Monthly Growth</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
