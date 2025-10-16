import React, { useState, useEffect, useRef } from "react";
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
  const [showPreview, setShowPreview] = useState(false);
  const invoiceRef = useRef(null);

  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;


  const downloadPDF = async () => {
    const invoice = invoiceRef.current;
    if (!invoice) return toast.error("Invoice not found!");

    const canvas = await html2canvas(invoice, {
      scale: 2.5,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Invoice downloaded successfully!");
  };

  const closePreview = () => {
    setShowPreview(false);
    document.body.style.overflow = "auto";
  };

  const openPreview = () => {
    setShowPreview(true);
    document.body.style.overflow = "hidden";
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

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="invoice-container">
      <ToastContainer />
      <h2 className="heading">Invoice Generator</h2>

      <div className="form-section">
        <div className="form-controls">
          <label>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <label>Client Email</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />

          <label>Client Address</label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={status.toLowerCase()}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <label>Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="items-section">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>{(item.quantity * item.price).toLocaleString()}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(index)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="add-btn" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className="totals">
          <p>Subtotal: {subtotal.toLocaleString()}</p>
          <p>Tax ({taxRate}%): {tax.toLocaleString()}</p>
          <h3>Grand Total: {total.toLocaleString()}</h3>
        </div>

        <div className="action-buttons">
          <button onClick={openPreview}>Preview Invoice</button>
          <button onClick={clearForm}>Clear</button>
        </div>
      </div>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-box" ref={invoiceRef}>
            <div className="invoice-header">
              <div className="company-info">
                <h2>DEVNEX GROCERRIES</h2>
                <p>Email: infodevnex.com</p>
                <p>Phone: +254 719832719</p>
                <p>South B ,Nairobi</p>
                <p>Kenya</p>
              </div>
              <div className="invoice-meta">
                <h1>INVOICE</h1>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</p>
                <p className={`status-label ${status.toLowerCase()}`}>{status}</p>
              </div>
            </div>

            <div className="bill-to">
              <h3>Bill To:</h3>
              <p>{clientName}</p>
              <p>{clientEmail}</p>
              <p>{clientAddress}</p>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals">
              <p>Subtotal: {subtotal.toLocaleString()}</p>
              <p>Tax ({taxRate}%): {tax.toLocaleString()}</p>
              <h3>Grand Total: {total.toLocaleString()}</h3>
            </div>

            <div className="invoice-footer">
              <p>Payment Details:</p>
              <hr>
              </hr>
              <p>Bank</p>
              <p>KCB Bank Ruiru Branch</p>

              
              <p>Account No: 175988624560</p>
              <hr></hr>
              <p>M-Pesa</p>
              <p>M-pesa No:0719832719</p>
              <hr></hr>

              <p><strong>Payment Terms:</strong> Due within 14 days</p>
              <p></p>
              <p>Thank you for your business!</p>
            </div>
          </div>

          <div className="preview-actions">
            <button onClick={downloadPDF}>Download PDF</button>
            <button onClick={closePreview}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
