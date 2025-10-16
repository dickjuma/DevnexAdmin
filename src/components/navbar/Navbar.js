import React from "react";
import "./navbar.css";
import logo from "../../assets/account.png";

const Navbar = () => {
  return (
    <nav className="navbar">
   
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <h2 className="brand-name">Dickson Juma</h2>
      </div>

    
      <div className="nav-center">
        <p className="nav-greeting"> Hello, Welcome Back Admin !</p>
      </div>


      <div className="nav-right">
        <img src={logo} alt="Profile" className="nav-profile" />
      </div>
    </nav>
  );
};

export default Navbar;
