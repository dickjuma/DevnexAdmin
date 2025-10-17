import React from 'react'

import Admin from './pages/admin/Admin'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div>
      <ToastContainer/>
     
      <Admin/>

    </div>
  )
}

export default App

