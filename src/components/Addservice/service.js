import React, { useState } from "react";
import "./service.css";
import uploadimg from "../../assets/upload.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL;

const Service = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    setServiceDetails({ ...serviceDetails, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const addService = async () => {
    const { name, description, price } = serviceDetails;

    if (!name || !description || !price || !image) {
      toast.error("⚠️ Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // Upload service image
      const formData = new FormData();
      formData.append("service", image);

      const uploadResp = await fetch(`${API_URL}/uploadservice`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const uploadData = await uploadResp.json();

      if (!uploadData?.success) {
        toast.error("❌ Image upload failed. Try again.");
        setLoading(false);
        return;
      }

      // Add service with uploaded image URL
      const serviceResp = await fetch(`${API_URL}/addservice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serviceDetails,
          image: uploadData.image_url,
        }),
      });

      const serviceData = await serviceResp.json();

      if (serviceData?.success) {
        toast.success("🎉 Service added successfully!");
        setServiceDetails({ name: "", description: "", price: "" });
        setImage(null);
      } else {
        toast.error(
          `❌ Failed to add service: ${serviceData?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Add Service Error:", error);
      toast.error("⚠️ Server not responding. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service">
      <h1 className="addservice-title">Add a New Service</h1>

      <div className="addservice-container">
        {/* Image Upload */}
        <div className="addservice-image-section">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : uploadimg}
              alt="Preview"
              className="addservice-image"
            />
          </label>
          <input
            type="file"
            id="file-input"
            hidden
            accept="image/*"
            onChange={handleImage}
          />
          <p className="addservice-imgtext">
            {image ? image.name : "Click to upload service image"}
          </p>
        </div>

        {/* Service Details */}
        <div className="addservice-form">
          <div className="addservice-itemfield">
            <p>Service Name</p>
            <input
              type="text"
              name="name"
              placeholder="e.g., Plumbing Repair"
              value={serviceDetails.name}
              onChange={handleChange}
            />
          </div>

          <div className="addservice-itemfield">
            <p>Description</p>
            <textarea
              name="description"
              placeholder="Describe the service..."
              value={serviceDetails.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="addservice-itemfield">
            <p>Price (KES)</p>
            <input
              type="number"
              name="price"
              placeholder="e.g., 1500"
              value={serviceDetails.price}
              onChange={handleChange}
            />
          </div>

          <button
            className="addservice-btn"
            onClick={addService}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Service;
