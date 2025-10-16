import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "../../assets/cross.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./table.css";

const Table = () => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useDemo, setUseDemo] = useState(true);
  const [viewType, setViewType] = useState("products"); // 'products' or 'services'
  const [dialog, setDialog] = useState({ show: false, message: "", onConfirm: null });
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  // Demo data
  const demoProducts = [
    { id: "P001", name: "Honey", price: 1500, image: "https://via.placeholder.com/60x60.png?text=Mouse", inStock: true },
    { id: "P002", name: "Kales", price: 3500, image: "https://via.placeholder.com/60x60.png?text=Speaker", inStock: false },
  ];

  const demoServices = [
    { id: "S001", name: "Kitchen Repair", price: 2000, image: "https://via.placeholder.com/60x60.png?text=Repair" },
    { id: "S002", name: "Catering ", price: 1000, image: "https://via.placeholder.com/60x60.png?text=Install" },
  ];

  // Fetch data
  const fetchData = async () => {
    if (useDemo) {
      setAllItems(viewType === "products" ? demoProducts : demoServices);
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        viewType === "products"
          ? "http://localhost:4000/allproducts"
          : "http://localhost:4000/allservices";

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      setAllItems(data.length > 0 ? data : viewType === "products" ? demoProducts : demoServices);
    } catch (err) {
      console.error(err);
      toast.error(" Failed to fetch data. Showing demo data.");
      setAllItems(viewType === "products" ? demoProducts : demoServices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [useDemo, viewType]);

  // Remove item
  const removeItem = (id, name) => {
    setDialog({
      show: true,
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async () => {
        if (useDemo) {
          setAllItems(allItems.filter((i) => i.id !== id));
          toast.info(`🗑️ Demo: "${name}" removed`);
          setDialog({ show: false });
          return;
        }

        try {
          const endpoint =
            viewType === "products"
              ? "http://localhost:4000/removeproduct"
              : "http://localhost:4000/removeservice";

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          if (!res.ok) throw new Error("Failed to remove item");
          toast.success(" Deleted successfully!");
          fetchData();
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete item.");
        } finally {
          setDialog({ show: false });
        }
      },
    });
  };


  const toggleStock = async (id) => {
    if (viewType !== "products") return;

    if (useDemo) {
      setAllItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
      );
      toast.info("ℹ️ Demo: Stock status toggled");
      return;
    }

    try {
      await fetch(`http://localhost:4000/togglestock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData();
      toast.success("✅ Stock status updated");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update stock status");
    }
  };

  // Handle price edit
  const handlePriceEdit = (id, currentPrice) => {
    setEditingId(id);
    setNewPrice(currentPrice);
  };

  const savePriceEdit = async (id) => {
    if (!newPrice || isNaN(newPrice)) {
      toast.error(" Enter a valid price");
      return;
    }

    if (useDemo) {
      setAllItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, price: Number(newPrice) } : i))
      );
      toast.success("💰 Demo: Price updated");
      setEditingId(null);
      return;
    }

    try {
      const endpoint =
        viewType === "products"
          ? "http://localhost:4000/updateproductprice"
          : "http://localhost:4000/updateserviceprice";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: Number(newPrice) }),
      });

      toast.success(" Price updated successfully!");
      fetchData();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error(" Failed to update price");
    }
  };

  // PDF download
const downloadPDF = async () => {
  if (!allItems.length) return toast.info("No data to download");

  const doc = new jsPDF();
  doc.text(viewType === "products" ? "Product List" : "Service List", 14, 15);

  const columns = viewType === "products"
    ? ["Image", "ID", "Name", "Price (Ksh)", "Stock Status"]
    : ["Image", "ID", "Name", "Price (Ksh)"];

  const loadImageAsBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 60;
        canvas.height = 60;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = () => resolve(""); 
    });
  };

  const rows = await Promise.all(
    allItems.map(async (item) => {
      const imgData = await loadImageAsBase64(item.image);
      return viewType === "products"
        ? [imgData, item.id, item.name, item.price, item.inStock ? "In Stock" : "Out of Stock"]
        : [imgData, item.id, item.name, item.price];
    })
  );

  doc.autoTable({
    head: [columns],
    body: rows.map(row => row.map((cell, idx) => idx === 0 ? "" : cell)), // hide base64 string
    startY: 20,
    didDrawCell: (data) => {
      if (data.column.index === 0 && rows[data.row.index][0]) {
        const imgData = rows[data.row.index][0];
        const dim = 15;
        doc.addImage(imgData, "JPEG", data.cell.x + 1, data.cell.y + 1, dim, dim);
      }
    },
    columnStyles: { 0: { cellWidth: 18 } },
  });

  doc.save(`${viewType}-list.pdf`);
  toast.success(" PDF downloaded successfully");
};




  return (
    <div className="table-wrapper">
      <div className="table-header">
        <h1 className="table-title">
          {viewType === "products" ? "Product List" : "Service List"}
        </h1>

        <div className="header-buttons">
          <button
            className={`toggle-btn ${useDemo ? "demo-active" : ""}`}
            onClick={() => setUseDemo((prev) => !prev)}
          >
            {useDemo ? "🔄 Switch to Live Data" : "🧪 Switch to Demo Mode"}
          </button>

          <button
            className="toggle-btn switch-btn"
            onClick={() =>
              setViewType((prev) => (prev === "products" ? "services" : "products"))
            }
          >
            {viewType === "products" ? "🧰 Manage Services" : "📦 Manage Products"}
          </button>

          <button className="refresh-btn" onClick={fetchData}>
            🔄 Refresh
          </button>

          <button className="download-btn" onClick={downloadPDF}>
            📄 PDF
          </button>
        </div>
      </div>

      {loading && <p className="loading-text">⏳ Loading {viewType}...</p>}

      {!loading && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (Ksh)</th>
                {viewType === "products" && <th>Stock Status</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allItems.length > 0 ? (
                allItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.image} alt={item.name} className="product-img" />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {editingId === item.id ? (
                        <div className="edit-price">
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="price-input"
                          />
                          <button className="save-btn" onClick={() => savePriceEdit(item.id)}>💾</button>
                        </div>
                      ) : (
                        <span
                          onDoubleClick={() => handlePriceEdit(item.id, item.price)}
                          className="editable-price"
                        >
                          {item.price}
                        </span>
                      )}
                    </td>

                    {viewType === "products" && (
                      <td>
                        <span
                          className={`stock-status ${item.inStock ? "instock" : "outofstock"}`}
                          onClick={() => toggleStock(item.id)}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    )}

                    <td>
                      <div className="action-buttons">
                        <img
                          src={cross}
                          alt="Remove"
                          className="delete-icon"
                          onClick={() => removeItem(item.id, item.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={viewType === "products" ? "5" : "4"} className="no-data">
                    No {viewType} available.
                  </td>
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
            <button className="dialog-confirm" onClick={dialog.onConfirm}>
              Confirm
            </button>
            <button className="dialog-cancel" onClick={() => setDialog({ show: false })}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick />
    </div>
  );
};

export default Table;
