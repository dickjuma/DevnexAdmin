import React from 'react'
import { useTable } from 'react-table'
import { useState,useEffect } from 'react'
import cross from '../../assets/cross.png'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './table.css'
const Table = () => {
    const [allproducts,setAllProducts]=useState([])
    const FetchData=async()=>{
      await fetch('http://localhost:4000/allproducts').then((res)=>res.json()).then((data)=>{
        setAllProducts(data)
      })
    }
    useEffect(() => {
    FetchData()
    }, [])
    const Removeproduct=async(id)=>{
      await fetch('http://localhost:4000/removeproduct',{
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
<h1 style={{marginBottom:"20px" ,textDecoration:"underline"}}>PRODUCTS LIST</h1>
<table class="table">
  <thead>
    <tr>
      <th scope="col">Product_image</th>
      <th scope="col">product-Name</th>
      <th scope="col">product-price</th>
      <th scope="col">remove-product</th>
    </tr>
  </thead>
  <tbody>


    {allproducts.map((product,index)=>{
                return(
       <tr key={index} scope="row" alt="">
        <td><img src={product.image}/></td>
        <td>{product.name}</td>
        <td> Ksh.{product.price} /=</td>
        <td><img src ={cross} alt='' onClick={()=>{Removeproduct(product.id).then(alert("Product deleted successfully"))}}/></td>
       </tr>
            )
            })}

  </tbody>
</table>

    </div>
  )
}

export default Table
