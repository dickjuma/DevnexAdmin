import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "../../assets/cross.png";
import "./table.css";

const Table = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useDemo, setUseDemo] = useState(true);
  const [dialog, setDialog] = useState({ show: false, message: "", onConfirm: null });

  const demoProducts = [
    { id: "DEMO001", name: "Wireless Mouse", price: 1500, image: "https://via.placeholder.com/60x60.png?text=Mouse", inStock: true },
    { id: "DEMO002", name: "Bluetooth Speaker", price: 3500, image: "https://via.placeholder.com/60x60.png?text=Speaker", inStock: false },
    { id: "DEMO003", name: "Gaming Keyboard", price: 2500, image: "https://via.placeholder.com/60x60.png?text=Keyboard", inStock: true },
  ];

  const fetchData = async () => {
    if (useDemo) {
      setAllProducts(demoProducts);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/allproducts");
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast.info("⚠️ No products found, showing demo data.");
        setAllProducts(demoProducts);
      } else {
        setAllProducts(data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
      toast.error("❌ Failed to fetch products. Showing demo data.");
      setAllProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [useDemo]);

  // --- DELETE PRODUCT ---
  const removeProduct = (id, name) => {
    setDialog({
      show: true,
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: async () => {
        if (useDemo) {
          setAllProducts(allProducts.filter((p) => p.id !== id));
          setDialog({ show: false });
          toast.info(`🗑️ Demo: "${name}" removed`);
          return;
        }

        try {
          const res = await fetch("http://localhost:4000/removeproduct", {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          if (!res.ok) throw new Error("Failed to remove product from server");
          toast.success("✅ Product deleted successfully!");
          fetchData();
        } catch (err) {
          console.error("Error deleting product:", err);
          toast.error("❌ Failed to delete product. Try again later.");
        } finally {
          setDialog({ show: false });
        }
      },
    });
  };

  // --- TOGGLE STOCK ---
  const toggleStock = async (id) => {
    if (useDemo) {
      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
      );
      toast.info(`ℹ️ Demo: Stock status toggled`);
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

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <h1 className="table-title">Product List</h1>
        <div className="header-buttons">
          <button
            className={`toggle-btn ${useDemo ? "demo-active" : ""}`}
            onClick={() => setUseDemo((prev) => !prev)}
          >
            {useDemo ? "🔄 Switch to Live Data" : "🧪 Switch to Demo Mode"}
          </button>
          <button className="refresh-btn" onClick={fetchData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading && <p className="loading-text">⏳ Loading products...</p>}

      {!loading && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (Ksh)</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="product-img" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <span
                        className={`stock-status ${product.inStock ? "instock" : "outofstock"}`}
                        onClick={() => toggleStock(product.id)}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <img
                          src={cross}
                          alt="Remove"
                          className="delete-icon"
                          onClick={() => removeProduct(product.id, product.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- DIALOG BOX --- */}
      {dialog.show && (
        <div className="dialog-box confirm">
          <p>{dialog.message}</p>
          <div className="dialog-actions">
            <button className="dialog-confirm" onClick={dialog.onConfirm}>Confirm</button>
            <button className="dialog-cancel" onClick={() => setDialog({ show: false })}>Cancel</button>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Table;
