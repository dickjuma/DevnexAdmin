import React, { useState } from "react";
import "./addproduct.css";
import uploadimg from "../../assets/upload.png";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;
const Addproduct = () => {
  const [image, setImage] = useState(false);
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
      let responseData;
      let product = productDetails;
      let formData = new FormData();
      formData.append("product", image);

      const uploadResp = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      responseData = await uploadResp.json();

      if (responseData.success) {
        product.image = responseData.image_url;

        const productResp = await fetch(`${API_URL}/addproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        const data = await productResp.json();
        if (data.success) {
          toast.success("🎉 Product added successfully!");
          setProductDetails({
            name: "",
            description: "",
            quantity: "",
            price: "",
            image: "",
          });
          setImage(false);
        } else {
          toast.error("Failed to add product. Please try again.");
        }
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the product.");
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
    </div>
  );
};

export default Addproduct;
