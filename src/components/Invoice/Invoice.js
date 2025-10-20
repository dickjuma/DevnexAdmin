import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./invoice.css";

const InvoiceGenerator = () => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [status, setStatus] = useState("Unpaid");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [showPreview, setShowPreview] = useState(false);
  const invoiceRef = useRef(null);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const downloadPDF = async () => {
    const invoice = invoiceRef.current;
    if (!invoice) return toast.error("Invoice not found!");

    const canvas = await html2canvas(invoice, { scale: 2.5, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Invoice downloaded successfully!");
  };

  const printInvoice = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=1000");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: 'Poppins', sans-serif; padding: 30px; background: #fff; color: #222; }
            h1, h2, h3 { margin: 5px 0; }
            .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; }
            .company-info h2 { color: #007bff; margin-bottom: 5px; }
            .invoice-meta { text-align: right; }
            .invoice-footer { margin-top: 30px; font-size: 13px; border-top: 1px solid #ccc; padding-top: 10px; }
            .status-label { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; }
            .paid { background: #c6f6d5; color: #22543d; }
            .unpaid { background: #fed7d7; color: #742a2a; }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContents}</body>
      </html>
    `);
    printWindow.document.close();
  };

  const openPreview = () => {
    setShowPreview(true);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setShowPreview(false);
    document.body.style.overflow = "auto";
  };

  const clearForm = () => {
    setClientName("");
    setClientEmail("");
    setClientAddress("");
    setItems([{ name: "", quantity: 1, price: 0 }]);
    setTaxRate(0);
    setStatus("Unpaid");
    setDueDate("");
    toast.info("Form cleared!");
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "name" ? value : Number(value);
    setItems(updated);
  };

  const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const formatCurrency = (amount) => `${currency} ${amount.toLocaleString()}`;

  return (
    <div className="invoice-container">
      <ToastContainer />
      <h1 className="page-title">🧾 Invoice Generator</h1>

      <div className="form-card">
        <div className="form-section">
          <div className="form-group">
            <label>Client Name</label>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Client Email</label>
            <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Client Address</label>
            <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          </div>
          <div className="form-row">
            <div>
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label>Tax (%)</label>
              <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
            <div>
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="KES">KES (Ksh)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="items-section">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td><input value={item.name} onChange={(e) => handleItemChange(i, "name", e.target.value)} /></td>
                  <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(i, "quantity", e.target.value)} /></td>
                  <td><input type="number" value={item.price} onChange={(e) => handleItemChange(i, "price", e.target.value)} /></td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                  <td><button className="remove-btn" onClick={() => removeItem(i)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-btn" onClick={addItem}>+ Add Item</button>
        </div>

        <div className="totals">
          <p>Subtotal: {formatCurrency(subtotal)}</p>
          <p>Tax: {formatCurrency(tax)}</p>
          <h3>Grand Total: {formatCurrency(total)}</h3>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={openPreview}>Preview</button>
          <button className="btn-clear" onClick={clearForm}>Clear</button>
        </div>
      </div>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-box" ref={invoiceRef}>
            <div className="invoice-header">
              <div className="company-info">
                <h2>DEVNEX GROCERRIES</h2>
                <p>Email: info@devnex.com</p>
                <p>Phone: +254 719 832 719</p>
              </div>
              <div className="invoice-meta">
                <h1>INVOICE</h1>
                <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
                <p><b>Due:</b> {dueDate || "N/A"}</p>
                <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
              </div>
            </div>

            <div className="bill-to">
              <h3>Bill To:</h3>
              <p>{clientName}</p>
              <p>{clientEmail}</p>
              <p>{clientAddress}</p>
            </div>

            <table className="invoice-table">
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Tax: {formatCurrency(tax)}</p>
              <h3>Total: {formatCurrency(total)}</h3>
            </div>

            <div className="invoice-footer">
              <p>Bank: KCB Bank (Ruiru Branch)</p>
              <p>Account No: 175988624560</p>
              <p>M-Pesa: 0719832719</p>
              <p>Terms: Pay within 14 days</p>
              <p>Thank you for choosing Devnex Groceries!</p>
            </div>
          </div>

          <div className="preview-actions">
            <button className="btn-download" onClick={downloadPDF}>Download PDF</button>
            <button className="btn-print" onClick={printInvoice}>Print Invoice</button>
            <button className="btn-cancel" onClick={closePreview}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
