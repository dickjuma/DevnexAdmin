import React, { useState } from "react";
import "./addproduct.css";
import uploadimg from "../../assets/upload.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const Addproduct = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const Add_product = async () => {
    const { name, description, quantity, price } = productDetails;

    if (!name || !description || !quantity || !price || !image) {
      toast.error("⚠️ Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // Upload image
      const formData = new FormData();
      formData.append("product", image);

      const uploadResp = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const uploadData = await uploadResp.json();

      if (!uploadData.success) {
        toast.error("❌ Image upload failed. Try again.");
        setLoading(false);
        return;
      }

      // Add product
      const productResp = await fetch(`${API_URL}/addproduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productDetails,
          image: uploadData.image_url,
        }),
      });

      const productData = await productResp.json();

      if (productData.success) {
        toast.success("🎉 Product added successfully!");
        setProductDetails({
          name: "",
          description: "",
          quantity: "",
          price: "",
          image: "",
        });
        setImage(null);
      } else {
        toast.error(productData.message || "❌ Failed to add product.");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("🚫 Server not responding. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addproduct-wrapper">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="addproduct-header">
        <h1>Add a New Product</h1>
        <p>Upload, describe, and price your new item below.</p>
      </div>

      <div className="addproduct-card">
        {/* Upload Section */}
        <div className="addproduct-image-section">
          <label htmlFor="file-input">
            <div className="upload-box">
              <img
                src={image ? URL.createObjectURL(image) : uploadimg}
                alt="Preview"
                className="addproduct-image"
              />
            </div>
          </label>
          <input type="file" id="file-input" hidden onChange={handleImage} />
          <p className="addproduct-imgtext">
            {image ? image.name : "Click to upload product image"}
          </p>
        </div>

        {/* Product Form */}
        <div className="addproduct-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Organic Honey"
              value={productDetails.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product details or features..."
              value={productDetails.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g., 25"
                value={productDetails.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price (KES)</label>
              <input
                type="number"
                name="price"
                placeholder="e.g., 1200"
                value={productDetails.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            className="addproduct-btn"
            onClick={Add_product}
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;
