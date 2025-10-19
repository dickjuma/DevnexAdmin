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
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("product", image);

      const uploadResp = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const uploadData = await uploadResp.json();

      if (!uploadData.success) {
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }

      // Add product with uploaded image URL
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
        toast.error(productData.message || "Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("Server not responding. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <h1 className="addproduct-title">Add a New Product</h1>

      <div className="addproduct-container">
        {/* Product Image Upload */}
        <div className="addproduct-image-section">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : uploadimg}
              alt="Preview"
              className="addproduct-image"
            />
          </label>
          <input
            type="file"
            name="image"
            id="file-input"
            hidden
            onChange={handleImage}
          />
          <p className="addproduct-imgtext">
            {image ? image.name : "Click to upload product image"}
          </p>
        </div>

        {/* Product Details */}
        <div className="addproduct-form">
          <div className="addproduct-itemfield">
            <p>Product Name</p>
            <input
              type="text"
              name="name"
              placeholder="e.g., Organic Honey"
              value={productDetails.name}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-itemfield">
            <p>Description</p>
            <textarea
              name="description"
              placeholder="Enter product details or features..."
              value={productDetails.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="addproduct-itemfield">
            <p>Quantity</p>
            <input
              type="number"
              name="quantity"
              placeholder="e.g., 25"
              value={productDetails.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-itemfield">
            <p>Price (KES)</p>
            <input
              type="number"
              name="price"
              placeholder="e.g., 1200"
              value={productDetails.price}
              onChange={handleChange}
            />
          </div>

          <button
            className="addproduct-btn"
            onClick={Add_product}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Addproduct;
