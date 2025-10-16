import React from 'react'
import {useState,useEffect} from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import cross from '../../assets/cross.png'
const Users = () => {
    const [allproducts,setAllProducts]=useState([])
    const FetchData=async()=>{
      await fetch('http://localhost:4000/userdetails').then((res)=>res.json()).then((data)=>{
        setAllProducts(data)
      })
    }
    useEffect(() => {
    FetchData()
    }, []);

    const Removeproduct=async(id)=>{
        await fetch('http://localhost:4000/deleteuser',{
          method:"POST",
          headers:{
            Accept:"application/json",
            'Content-Type':'application/json'
          },
          body:JSON.stringify({id:id})

        })
        await FetchData()

      }
  return (
    <div className='table'>
      <h1 style={{marginBottom:"20px" ,textDecoration:"underline"}}>USERS LIST</h1>

<table class="table">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">password</th>
      <th scope='col'>delete_user</th>
    </tr>
  </thead>
  <tbody>


    {allproducts.map((user,index)=>{
                return(
       <tr key={index} scope="row" alt="">
        <td>{user._id}</td>
        <td>{user.name}</td>
        <td>{user.email} </td>
        <td>{user.password}</td>
        <td> <img src={cross}  onClick={()=>{Removeproduct(user.id).then(alert("User deleted succsfully"))}} alt=''/></td>
       </tr>
            )
            })}

  </tbody>
</table>

    </div>
  )
}

export default Users


