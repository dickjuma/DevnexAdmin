import React from 'react'
import Navbar from './components/navbar/Navbar'
import Admin from './pages/admin/Admin'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <Admin/>

    </div>
  )
}

export default App

