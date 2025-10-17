import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle, RotateCcw, File } from "lucide-react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./payment.css";
const API_URL = process.env.REACT_APP_API_URL;
const Payment = ({ onOrderStatusChange }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const [dialog, setDialog] = useState({ show: false, type: "", message: "", onConfirm: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [cashFormVisible, setCashFormVisible] = useState(false);
  const [cashFormData, setCashFormData] = useState({ customerName: "", phone: "", orderId: "", amount: "" });

  const demoPayments = [
    { _id: "1", customerName: "Dickson Juma", phone: "0719832719", orderId: "ORD-1001", amount: 750, reference: "MPESA123ABC", status: "Pending" },
    { _id: "2", customerName: "Mary Wekesa", phone: "0722334455", orderId: "ORD-1002", amount: 850, reference: "MPESA456DEF", status: "Confirmed" },
    { _id: "3", customerName: "Peter Wafula", phone: "0799123456", orderId: "ORD-1003", amount: 2100, reference: "MPESA789XYZ", status: "Fraud" },
  ];

  // --- Fetch Payments ---
  const fetchPayments = async () => {
    setLoading(true);
    try {
      if (demoMode) {
        setPayments(demoPayments);
      } else {
        const res = await axios.get(`${API_URL}/payments`);
        setPayments(res.data);
      }
    } catch (err) {
      showDialog("error", " Failed to fetch payment records.");
    } finally {
      setLoading(false);
    }
  };

  // --- Dialog Handlers ---
  const showDialog = (type, message, onConfirm = null) => setDialog({ show: true, type, message, onConfirm });
  const closeDialog = () => setDialog({ show: false, type: "", message: "", onConfirm: null });

  // --- Update Payment Status ---
  const updatePaymentStatus = (id, orderId, newStatus) => {
    showDialog(
      "confirm",
      `Are you sure you want to mark order ${orderId} as ${newStatus}?`,
      async () => {
        if (demoMode) {
          setPayments(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
          onOrderStatusChange?.(orderId, newStatus === "Confirmed" ? "Approved" : "Cancelled");
          showDialog("success", ` Demo: Payment marked as ${newStatus}`);
        } else {
          try {
            await axios.post(`${API_URL}/userdetails/update-payment-status`, { id, newStatus });
            fetchPayments();
            onOrderStatusChange?.(orderId, newStatus === "Confirmed" ? "Approved" : "Cancelled");
            showDialog("success", ` Payment marked as ${newStatus}`);
          } catch {
            showDialog("error", " Failed to update payment status.");
          }
        }
      }
    );
  };

  // --- Cash Payment Submit ---
  const handleCashPaymentSubmit = async (e) => {
    e.preventDefault();
    const { customerName, phone, orderId, amount } = cashFormData;
    if (!customerName || !phone || !orderId || !amount) {
      showDialog("error", "⚠️ Please fill all fields.");
      return;
    }

    const newPayment = {
      _id: Date.now().toString(),
      customerName,
      phone,
      orderId,
      amount,
      reference: "CASH-" + Date.now(),
      status: "Confirmed"
    };

    if (demoMode) {
      setPayments(prev => [newPayment, ...prev]);
      showDialog("success", " Demo: Cash payment recorded successfully!");
    } else {
      try {
        await axios.post(`${API_URL}/cash-payment`, newPayment);
        fetchPayments();
        showDialog("success", " Cash payment recorded successfully!");
      } catch {
        showDialog("error", "❌ Failed to record cash payment.");
        return;
      }
    }

    setCashFormVisible(false);
    setCashFormData({ customerName: "", phone: "", orderId: "", amount: "" });
  };

  // --- Filtered Payments ---
  const filteredPayments = payments.filter(p =>
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Export PDF ---
  const exportPDF = (all = false) => {
    const doc = new jsPDF();
    const data = (all ? payments : filteredPayments).map((p, idx) => [idx + 1, p.customerName, p.phone, p.orderId, p.amount, p.reference, p.status]);
    doc.text("Payments Report", 14, 15);
    doc.autoTable({ head: [["#", "Customer", "Phone", "Order ID", "Amount", "Reference", "Status"]], body: data, startY: 20 });
    doc.save("payments.pdf");
  };

  // --- CSV headers ---
  const csvHeaders = [
    { label: "#", key: "index" },
    { label: "Customer", key: "customerName" },
    { label: "Phone", key: "phone" },
    { label: "Order ID", key: "orderId" },
    { label: "Amount", key: "amount" },
    { label: "Reference", key: "reference" },
    { label: "Status", key: "status" },
  ];

  useEffect(() => { fetchPayments(); }, [demoMode]);

  return (
    <div className="payment">
      <div className="payment-header">
        <div>
          <h1>💳 M-PESA Payments</h1>
          <p className="mode-label">Mode: <span className={demoMode ? "demo-mode" : "real-mode"}>{demoMode ? "Demo" : "Live"}</span></p>
          <p className="stats">✅ Confirmed: {payments.filter(p => p.status === "Confirmed").length} | ⚠️ Fraud: {payments.filter(p => p.status === "Fraud").length}</p>
        </div>
        <div className="btn-group">
          <button className="toggle-mode-btn" onClick={() => setDemoMode(!demoMode)}><Database size={18} /> Switch Mode</button>
          <button className="refresh-btn" onClick={fetchPayments}><RefreshCw size={18} /> Refresh</button>
          <button className="cash-btn" onClick={() => setCashFormVisible(true)}>💵 Cash Payment</button>
          <div className="export-dropdown">
            <button className="export-btn"><File size={16} /> Export</button>
            <div className="export-menu">
              <button onClick={() => exportPDF(false)}>PDF (Filtered)</button>
              <button onClick={() => exportPDF(true)}>PDF (All)</button>
              <CSVLink data={filteredPayments.map((p, idx) => ({ ...p, index: idx + 1 }))} headers={csvHeaders} filename="payments_filtered.csv">CSV (Filtered)</CSVLink>
              <CSVLink data={payments.map((p, idx) => ({ ...p, index: idx + 1 }))} headers={csvHeaders} filename="payments_all.csv">CSV (All)</CSVLink>
            </div>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search customer, phone, order ID or reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {loading ? <div className="payment-loading">Loading payments...</div> : (
        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Order ID</th>
                <th>Amount (Ksh)</th>
                <th>Reference No</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length ? filteredPayments.map((p, idx) => (
                <tr key={p._id}>
                  <td>{idx + 1}</td>
                  <td>{p.customerName}</td>
                  <td>{p.phone}</td>
                  <td>{p.orderId}</td>
                  <td>{p.amount}</td>
                  <td>{p.reference}</td>
                  <td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td className="action-buttons">
                    {p.status === "Pending" && <>
                      <button className="confirm-btn" onClick={() => updatePaymentStatus(p._id, p.orderId, "Confirmed")}><CheckCircle size={18} /> Confirm</button>
                      <button className="fraud-btn" onClick={() => updatePaymentStatus(p._id, p.orderId, "Fraud")}><AlertTriangle size={18} /> Fraud</button>
                    </>}
                    {p.status === "Fraud" && <button className="reclaim-btn" onClick={() => updatePaymentStatus(p._id, p.orderId, "Confirmed")}><RotateCcw size={18} /> Reclaim</button>}
                    {p.status === "Confirmed" && <XCircle className="icon-disabled" size={18} />}
                  </td>
                </tr>
              )) : <tr><td colSpan="8" style={{ textAlign: "center" }}>No payment records found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Cash Payment Modal */}
      {cashFormVisible && (
        <div className="cash-modal">
          <div className="cash-modal-content">
            <h3>💵 Record Cash Payment</h3>
            <form onSubmit={handleCashPaymentSubmit}>
              <input type="text" placeholder="Customer Name" value={cashFormData.customerName} onChange={e => setCashFormData({...cashFormData, customerName: e.target.value})} />
              <input type="text" placeholder="Phone Number" value={cashFormData.phone} onChange={e => setCashFormData({...cashFormData, phone: e.target.value})} />
              <input type="text" placeholder="Order ID" value={cashFormData.orderId} onChange={e => setCashFormData({...cashFormData, orderId: e.target.value})} />
              <input type="number" placeholder="Amount (Ksh)" value={cashFormData.amount} onChange={e => setCashFormData({...cashFormData, amount: e.target.value})} />
              <div className="form-buttons">
                <button type="submit" className="confirm-btn">Record Payment</button>
                <button type="button" className="dialog-cancel" onClick={() => setCashFormVisible(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Box */}
      {dialog.show && (
        <div className={`dialog-box ${dialog.type}`}>
          <p>{dialog.message}</p>
          {dialog.type === "confirm" ? (
            <div className="dialog-actions">
              <button className="dialog-confirm" onClick={() => { dialog.onConfirm?.(); closeDialog(); }}>Confirm</button>
              <button className="dialog-cancel" onClick={closeDialog}>Cancel</button>
            </div>
          ) : <button className="dialog-close" onClick={closeDialog}>Close</button>}
        </div>
      )}
    </div>
  );
};

export default Payment;
