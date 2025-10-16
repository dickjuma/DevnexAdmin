import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, Download } from 'lucide-react';
import './Reciept.css';

const sampleReceipts = [
  { id: 1, client: 'Wekesa Juma', amount: 1200, mpesaRef: 'ABC123XYZ', date: '2025-10-13', note: 'Payment for services rendered' },
  { id: 2, client: 'Wafula Juma', amount: 2500, mpesaRef: 'XYZ789ABC', date: '2025-10-12', note: 'Consultation fee' },
];

const ReceiptGenerator = () => {
  const [receipts, setReceipts] = useState(sampleReceipts);
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [note, setNote] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const receiptRef = useRef();

  // Add new receipt
  const handleAddReceipt = () => {
    if (!client || !amount || !mpesaRef) {
      toast.error('Please fill all required fields');
      return;
    }
    const newReceipt = {
      id: receipts.length + 1,
      client,
      amount: parseFloat(amount),
      mpesaRef,
      date: new Date().toISOString().slice(0, 10),
      note,
    };
    setReceipts([...receipts, newReceipt]);
    toast.success('Receipt added successfully!');
    clearForm();
  };

  // Clear all form fields
  const clearForm = () => {
    setClient('');
    setAmount('');
    setMpesaRef('');
    setNote('');
  };

  // Refresh table (back to default)
  const refreshReceipts = () => {
    setReceipts(sampleReceipts);
    clearForm();
    toast.info('Receipts refreshed');
  };

  // Generate and download PDF
  const generatePDF = (receipt) => {
    setSelectedReceipt(receipt);
    setTimeout(() => {
      const input = receiptRef.current;
      html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`receipt_${receipt.mpesaRef}.pdf`);
        toast.success('Receipt downloaded!');
      });
    }, 300);
  };

  return (
    <div className="receipt-app">
      <ToastContainer position="bottom-right" autoClose={2000} />

      <div className="receipt-main-container">
        {/* LEFT SIDE - Receipts Table */}
        <div className="table-section">
          <h2>📋 All Receipts</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Date</th>
                <th>M-PESA Ref</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, idx) => (
                <tr key={receipt.id}>
                  <td>{idx + 1}</td>
                  <td>{receipt.client}</td>
                  <td>KES {receipt.amount.toLocaleString()}</td>
                  <td>{receipt.date}</td>
                  <td>{receipt.mpesaRef}</td>
                  <td>
                    <Eye className="action-icon view" onClick={() => setSelectedReceipt(receipt)} />
                    <Download className="action-icon download" onClick={() => generatePDF(receipt)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE - Receipt Generator Form */}
        <div className="form-section">
          <h2>🧾 Generate Receipt</h2>
          <input type="text" placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="M-PESA Ref" value={mpesaRef} onChange={(e) => setMpesaRef(e.target.value)} />
          <textarea placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="form-actions">
            <button onClick={handleAddReceipt}>Add Receipt</button>
            <button onClick={refreshReceipts} className="refresh">Refresh</button>
          </div>
        </div>
      </div>

      
      {selectedReceipt && (
        <div className="preview-overlay">
          <div className="receipt-preview" ref={receiptRef}>
            <div className="receipt-header">
              <div className="company-info">
                <h1>Devnex Groceries</h1>
                <p>Email: support@devnex.com</p>
                <p>Phone: 0719832719</p>
              </div>
              <div className="receipt-meta">
                <h2>Receipt</h2>
                <p><strong>Date:</strong> {selectedReceipt.date}</p>
                <p><strong>Ref:</strong> {selectedReceipt.mpesaRef}</p>
              </div>
            </div>

            <div className="receipt-body">
              <p><strong>Received From:</strong> {selectedReceipt.client}</p>
              <p><strong>Amount:</strong> KES {selectedReceipt.amount.toLocaleString()}</p>
              {selectedReceipt.note && (
                <p><strong>Note:</strong> {selectedReceipt.note}</p>
              )}
            </div>

            <div className="receipt-footer">
              <p>Thank you for choosing Devnex Groceries.</p>
              <hr></hr>
              <p>This receipt was automatically generated on {new Date().toLocaleDateString()}.</p>
            </div>
          </div>

          <div className="preview-actions">
            <button onClick={() => generatePDF(selectedReceipt)}>Download PDF</button>
            <button className="close-btn" onClick={() => setSelectedReceipt(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptGenerator;
