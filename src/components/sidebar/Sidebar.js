import React from 'react'
import './sidebar.css'
import {Link} from "react-router-dom"
import add from "../../assets/addproduct.png"
import list from "../../assets/List.png"
const Sidebar = () => {
  return (
    <div className='sidebar'>
<Link to={'/addproduct'} style={{textDecoration:"none"}}>
<div className="sidebar-item">
    <img  src={add} alt=''/>
    <p>Add Porduct</p>
</div>
</Link>
<Link to={'/table '} style={{textDecoration:"none"}}>
<div className="sidebar-item">
    <img  src={list} alt=''/>
    <p>Product List</p>
</div>
</Link>
<Link to={'/user '} style={{textDecoration:"none"}}>
<div className="sidebar-item">
    <img  src={list} alt=''/>
    <p>Users-List</p>
</div>
</Link>
    </div>
  )
}

export default Sidebar

