import React from 'react'
import './admin.css'
import Sidebar from '../../components/sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import Addproduct from '../../components/AddProduct/Addproduct'

import Table from '../../components/table/Table'
import Users from '../../components/users/Users'

const Admin = () => {
  return (
    <div  className='admin'>
<Sidebar/>
<Routes>
  <Route path='/addproduct' element={<Addproduct/>}/>

  <Route path='/table' element={<Table/>}/>
  <Route path='/user' element={<Users/>}/>
</Routes>
    </div>
  )
}

export default Admin
