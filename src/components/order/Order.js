import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import "./order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useDemo, setUseDemo] = useState(true);
  const [dialog, setDialog] = useState({ show: false, orderId: "", message: "" });
  const [statusDialog, setStatusDialog] = useState({ show: false, orderId: "", newStatus: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [exportScope, setExportScope] = useState("filtered"); // All vs Filtered

  const demoOrders = [
    {
      _id: "demo1",
      orderNumber: "DEMO123",
      customerName: "Wekesa Juma",
      productName: "Wireless Mouse",
      quantity: 2,
      totalPrice: 2400,
      status: "Pending",
      createdAt: "2025-10-07T10:00:00Z",
    },
    {
      _id: "demo2",
      orderNumber: "DEMO456",
      customerName: "Jane Wambui",
      productName: "Bluetooth Speaker",
      quantity: 1,
      totalPrice: 3500,
      status: "Approved",
      createdAt: "2025-10-06T14:20:00Z",
    },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      if (useDemo) {
        setOrders(demoOrders);
        setLoading(false);
        return;
      }
      const res = await fetch("http://localhost:4000/allorders");
      if (!res.ok) throw new Error("Failed to fetch orders from server");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      const msg = err.message.includes("Failed to fetch")
        ? "⚠️ Cannot connect to backend. Make sure the server is running."
        : err.message;
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [useDemo]);

  // --- Status Change ---
  const openStatusDialog = (orderId, newStatus) => setStatusDialog({ show: true, orderId, newStatus });
  const closeStatusDialog = () => setStatusDialog({ show: false, orderId: "", newStatus: "" });

  const confirmStatusChange = async () => {
    const { orderId, newStatus } = statusDialog;

    if (useDemo) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`(Demo) Order ${orderId} marked as ${newStatus}`);
      closeStatusDialog();
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/updateorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }), // send _id
      });
      if (!res.ok) throw new Error("Failed to update order status");
      toast.success(`Order ${orderId} marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order. Please try again later.");
    } finally {
      closeStatusDialog();
    }
  };

  // --- Message Dialog ---
  const openDialog = (orderId) => setDialog({ show: true, orderId, message: "" });
  const closeDialog = () => setDialog({ show: false, orderId: "", message: "" });

  const sendMessage = () => {
    if (!dialog.message) {
      toast.warn("⚠️ Please type a message.");
      return;
    }

    if (useDemo) {
      toast.success(`(Demo) Message for order ${dialog.orderId} sent!`);
      closeDialog();
      return;
    }

    fetch("http://localhost:4000/sendmessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: dialog.orderId, message: dialog.message }),
    })
      .then(() => {
        toast.success("📨 Message sent successfully!");
        closeDialog();
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to send message.");
      });
  };

  // --- Filtered Orders ---
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      (order.productName && order.productName.toLowerCase().includes(term));
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const exportOrders = exportScope === "all" ? orders : filteredOrders;

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Report", 14, 20);
    const tableColumn = ["Order ID", "Order Number", "Customer", "Product", "Qty", "Total", "Status", "Date"];
    const tableRows = exportOrders.map((order) => [
      order._id,
      order.orderNumber,
      order.customerName,
      order.productName,
      order.quantity,
      order.totalPrice,
      order.status,
      new Date(order.createdAt).toLocaleDateString("en-GB"),
    ]);
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save("orders.pdf");
  };

  const csvData = exportOrders.map((order) => ({
    "Order ID": order._id,
    "Order Number": order.orderNumber,
    Customer: order.customerName,
    Product: order.productName,
    Quantity: order.quantity,
    Total: order.totalPrice,
    Status: order.status,
    Date: new Date(order.createdAt).toLocaleDateString("en-GB"),
  }));

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
        <button
          className="toggle-btn"
          onClick={() => setUseDemo(!useDemo)}
          style={{ backgroundColor: useDemo ? "#007bff" : "#28a745" }}
        >
          {useDemo ? "Switch to Live Data" : "🧪 Switch to Demo Mode"}
        </button>
        <button
          className="btn-refresh"
          onClick={fetchOrders}
          style={{ marginLeft: "10px", backgroundColor: "#ffc107", color: "#000" }}
        >
          🔄 Refresh
        </button>
        <div style={{ marginLeft: "10px" }}>
          <select value={exportScope} onChange={(e) => setExportScope(e.target.value)}>
            <option value="filtered">Export Filtered Orders</option>
            <option value="all">Export All Orders</option>
          </select>
          <button onClick={exportPDF} className="btn-export">PDF</button>
          <button>
            <CSVLink data={csvData} filename="orders.csv" className="btn-export">
              CSV
            </CSVLink>
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Order Number, Customer, or Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <p className="loading-text">Loading orders...</p>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total (Ksh)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                  <td>
                    <select
                      className="status-dropdown"
                      value={order.status}
                      onChange={(e) => openStatusDialog(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="message-btn" onClick={() => openDialog(order._id)}>Message</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">No orders match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Message Dialog */}
      {dialog.show && (
        <div className="message-dialog">
          <h3>Message for Order: {dialog.orderId}</h3>
          <textarea
            placeholder="Type your message..."
            value={dialog.message}
            onChange={(e) => setDialog({ ...dialog, message: e.target.value })}
            rows={4}
          />
          <div className="dialog-actions">
            <button className="dialog-confirm" onClick={sendMessage}>Send</button>
            <button className="dialog-cancel" onClick={closeDialog}>Cancel</button>
          </div>
        </div>
      )}

      {/* Status Confirmation Dialog */}
      {statusDialog.show && (
        <div className="message-dialog">
          <h3>Confirm Status Change</h3>
          <p>Are you sure you want to change the status to <strong>{statusDialog.newStatus}</strong>?</p>
          <div className="dialog-actions">
            <button className="dialog-confirm" onClick={confirmStatusChange}>Yes</button>
            <button className="dialog-cancel" onClick={closeStatusDialog}>No</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Order;
