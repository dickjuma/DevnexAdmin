import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "../../assets/cross.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [dialog, setDialog] = useState({ show: false, message: "", onConfirm: null });

  // ✅ Auto-switch between local and Render backend
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://devnexbackend-4.onrender.com";

  // Demo data
  const demoUsers = [
    { _id: "demo-001", name: "Jane Mwangi", email: "jane.mwangi@example.com", password: "demo1234", blacklisted: false },
    { _id: "demo-002", name: "Kevin Otieno", email: "kevin.otieno@example.com", password: "password", blacklisted: true },
    { _id: "demo-003", name: "Sarah Njeri", email: "sarah.njeri@example.com", password: "qwerty", blacklisted: false },
  ];

  // ✅ Fetch users safely
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/userdetails`, { method: "GET" });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        toast.success("✅ Users loaded successfully");
      } else {
        setUsers(demoUsers);
        toast.info("⚠️ No users found. Showing demo data.");
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setUsers(demoUsers);
      toast.error("⚠️ Unable to connect to the server. Showing demo data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm dialog handlers
  const showDialog = (message, onConfirm = null) => setDialog({ show: true, message, onConfirm });
  const closeDialog = () => setDialog({ show: false, message: "", onConfirm: null });

  // ✅ Delete user (handles local/demo/prod)
  const removeUser = (_id, name) => {
    showDialog(`Are you sure you want to delete user "${name}"?`, async () => {
      closeDialog();

      if (demoMode) {
        setUsers((prev) => prev.filter((u) => u._id !== _id));
        toast.info(`🗑️ Demo: "${name}" removed`);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/deleteuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: _id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete user.");

        setUsers((prev) => prev.filter((u) => u._id !== _id));
        toast.success(`🗑️ ${data.message || "User deleted successfully."}`);
      } catch (err) {
        console.error("❌ Delete error:", err);
        toast.error(`❌ Failed to delete user: ${err.message}`);
      }
    });
  };

  // ✅ Toggle blacklist status (local + prod safe)
  const toggleBlacklist = (_id, name) => {
    showDialog(`Are you sure you want to toggle blacklist status for "${name}"?`, async () => {
      closeDialog();

      if (demoMode) {
        setUsers((prev) =>
          prev.map((u) => (u._id === _id ? { ...u, blacklisted: !u.blacklisted } : u))
        );
        toast.info(`🚫 Demo: "${name}" blacklist toggled`);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/blacklistuser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: _id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update blacklist.");

        setUsers((prev) =>
          prev.map((u) => (u._id === _id ? { ...u, blacklisted: !u.blacklisted } : u))
        );
        toast.success(data.message || `🚫 "${name}" blacklist updated.`);
      } catch (err) {
        console.error("❌ Blacklist error:", err);
        toast.error(`❌ Failed to update blacklist: ${err.message}`);
      }
    });
  };

  // ✅ Fetch users when component mounts or demo mode changes
  useEffect(() => {
    if (demoMode) {
      setUsers(demoUsers);
      toast.info("ℹ️ Demo mode enabled.");
    } else {
      fetchUsers();
    }
  }, [demoMode]);

  // ✅ CSV Download
  const downloadCSV = () => {
    if (!users.length) return toast.info("No data to download");
    const csvRows = [
      ["ID", "Full Name", "Email", "Blacklisted"],
      ...users.map((u) => [u._id, u.name, u.email, u.blacklisted ? "Yes" : "No"]),
    ];
    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
    toast.success("📄 CSV downloaded");
  };

  // ✅ PDF Download
  const downloadPDF = () => {
    if (!users.length) return toast.info("No data to download");
    const doc = new jsPDF();
    doc.text("Users List", 14, 15);
    const rows = users.map((u) => [u._id, u.name, u.email, u.blacklisted ? "Yes" : "No"]);
    doc.autoTable({
      head: [["ID", "Full Name", "Email", "Blacklisted"]],
      body: rows,
      startY: 20,
    });
    doc.save("users.pdf");
    toast.success("📄 PDF downloaded");
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Registered Users</h1>
        <div className="header-buttons">
          <button
            className={`toggle-btn ${demoMode ? "demo-active" : ""}`}
            onClick={() => setDemoMode((p) => !p)}
          >
            {demoMode ? "Switch to Real Data" : "Switch to Demo Data"}
          </button>
          <button className="refresh-btn" onClick={fetchUsers}>🔄 Refresh</button>
          <button className="download-btn" onClick={downloadCSV}>📄 CSV</button>
          <button className="download-btn" onClick={downloadPDF}>📄 PDF</button>
        </div>
      </div>

      {loading && <p className="loading-text">⏳ Loading users...</p>}

      {!loading && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Blacklisted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className={user.blacklisted ? "blacklisted-user" : ""}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="masked-password">{user.password ? "••••••••" : "N/A"}</td>
                    <td>{user.blacklisted ? "Yes" : "No"}</td>
                    <td className="action-buttons">
                      <img
                        src={cross}
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => removeUser(user._id, user.name)}
                      />
                      <button
                        className="blacklist-btn"
                        onClick={() => toggleBlacklist(user._id, user.name)}
                      >
                        🚫 Toggle Blacklist
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {dialog.show && (
        <div className="dialog-box confirm">
          <p>{dialog.message}</p>
          <div className="dialog-actions">
            <button className="dialog-confirm" onClick={() => dialog.onConfirm?.()}>Confirm</button>
            <button className="dialog-cancel" onClick={closeDialog}>Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Users;
