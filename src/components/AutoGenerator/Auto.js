import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auto.css";

const Auto = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/allorders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Cannot fetch orders. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const togglePaymentStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      const res = await fetch("http://localhost:4000/update-order-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update payment status");
      toast.success(`Payment status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment status");
    }
  };

  const generateInvoice = (order) => {
    if (!order.cart || !order.cart.length) {
      toast.warn("No products found for this order.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Devnex Groceries", 14, 20);
    doc.setFontSize(10);
    doc.text("Email: info@devnex.com | Phone: 0719832719 | Location: Nairobi, Kenya", 14, 26);

    doc.setFontSize(12);
    doc.text(`Invoice for Order: ${order.orderNumber}`, 14, 36);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`, 14, 42);

    doc.setFontSize(10);
    doc.text("Bill To:", 14, 52);
    doc.text(`${order.customerName}`, 14, 58);
    doc.text(`Email: ${order.email || "N/A"}`, 14, 64);
    doc.text(`Phone: ${order.phone || "N/A"}`, 14, 70);
    if (order.address) doc.text(`Address: ${order.address}`, 14, 76);

    const tableColumn = ["Product", "Qty", "Unit Price (Ksh)", "Subtotal (Ksh)"];
    const tableRows = order.cart.map((item) => [
      item.name,
      item.quantity,
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90,
    });

    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFontSize(12);
    doc.text(`Grand Total: Ksh ${order.totalPrice.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Payment Status: ${order.paymentStatus || "Pending"}`, 14, finalY + 16);

    doc.save(`Invoice_${order.orderNumber}.pdf`);
  };

  return (
    <div className="auto-invoice-container">
      <h1>Auto Invoice</h1>
      <button onClick={fetchOrders} className="btn-refresh">🔄 Refresh Orders</button>

      {loading && <p>Loading orders...</p>}

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Total (Ksh)</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    className={`status-btn ${order.paymentStatus?.toLowerCase() || "pending"}`}
                    onClick={() => togglePaymentStatus(order._id, order.paymentStatus)}
                  >
                    {order.paymentStatus || "Pending"}
                  </button>
                </td>
                <td>
                  <button className="btn-generate" onClick={() => generateInvoice(order)}>
                    Generate PDF
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No orders available</td>
            </tr>
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Auto;
