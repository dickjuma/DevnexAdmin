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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalOrders: 0,
    totalPayments: 0,
    fraudPayments: 0,
    confirmedPayments: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    latestService: null,
    latestOrder: null,
    growth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useSample, setUseSample] = useState(false);

 
  const sampleData = {
    totalUsers: 1245,
    totalServices: 63,
    totalOrders: 840,
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
      const res = await axios.get("http://localhost:4000/stats", {
        timeout: 8000,
      });

      if (res.data.success) {
        setStats(res.data);
        showToast && toast.success("✅ Dashboard data updated!");
      } else {
        throw new Error(res.data.message || "Server returned no data");
      }
    } catch (err) {
      console.error("⚠️ Backend error:", err.message);
      setError("⚠️ Failed to connect to backend. Switched to sample mode.");
      setStats(sampleData);
      setUseSample(true);
      toast.warning("⚠️ Backend unreachable. Switched to sample data.");
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

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 Admin Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Real-time tracking of users, orders, payments & growth
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

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {error && <p className="dashboard-warning">{error}</p>}

          <div className="dashboard-cards">
            <div className="card stat-users">
              <div className="icon">
                <Users size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalUsers.toLocaleString()}</h3>
                <p>Registered Users</p>
              </div>
            </div>

            <div className="card stat-services">
              <div className="icon">
                <Package size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalServices.toLocaleString()}</h3>
                <p>Total Services</p>
              </div>
            </div>

            <div className="card stat-orders">
              <div className="icon">
                <ShoppingBag size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalOrders.toLocaleString()}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="card stat-revenue">
              <div className="icon">
                <CreditCard size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalPayments.toLocaleString()}</h3>
                <p>Payments Made</p>
              </div>
            </div>

            <div className="card stat-confirmed">
              <div className="icon">
                <CheckCircle size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.confirmedPayments}</h3>
                <p>Confirmed Payments</p>
              </div>
            </div>

            <div className="card stat-fraud">
              <div className="icon">
                <AlertTriangle size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.fraudPayments}</h3>
                <p>Fraud Payments</p>
              </div>
            </div>

            <div className="card stat-pending">
              <div className="icon">
                <Clock size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>

            <div className="card stat-confirmed">
              <div className="icon">
                <CheckCircle size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.confirmedOrders}</h3>
                <p>Confirmed Orders</p>
              </div>
            </div>

            <div className="card stat-cancelled">
              <div className="icon">
                <XCircle size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.cancelledOrders}</h3>
                <p>Cancelled Orders</p>
              </div>
            </div>

            <div className="card stat-growth">
              <div className="icon">
                <TrendingUp size={28} />
              </div>
              <div className="stat-info">
                <h3>+{stats.growth}%</h3>
                <p>Monthly Growth</p>
              </div>
            </div>

            {stats.latestService && (
              <div className="card stat-latest">
                <div className="icon">
                  <Package size={28} />
                </div>
                <div className="stat-info">
                  <h3>{stats.latestService.name}</h3>
                  <p>Latest Added Service</p>
                </div>
              </div>
            )}

            {stats.latestOrder && (
              <div className="card stat-latest">
                <div className="icon">
                  <Clock size={28} />
                </div>
                <div className="stat-info">
                  <h3>
                    {new Date(stats.latestOrder.date).toLocaleDateString()}
                  </h3>
                  <p>Latest Order Date</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
