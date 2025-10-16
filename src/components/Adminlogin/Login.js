import React, { useState } from 'react';
import { FaRegUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  axios.defaults.withCredentials = true; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("⚠️ Please enter both email and password!");
      return;
    }

    try {
      setLoading(true); 

      const res = await axios.post('http://localhost:4000/admin/login', { email, password });

    
      if (res.data.message) toast.info(res.data.message);

      
      if (res.data.success) {
        navigate('/admin/dashboard');
      }

    } catch (error) {
      console.error("Login error:", error);

    
      if (error.response?.data?.message) {
        toast.error(`🚫 ${error.response.data.message}`);
      } else {
        toast.error("🚫 Server error. Try again later.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="admin-login-fullscreen">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Portal</h2>
        <p className="admin-login-subtitle">Sign in to manage your system</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-input-container">
            <FaRegUser className="admin-input-icon" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-container">
            <FaLock className="admin-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Login;
