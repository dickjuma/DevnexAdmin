import React from 'react'
import { useState } from 'react'
import './addproduct.css'
import uploadimg from '../../assets/upload.png'
const Addproduct = () => {
    const [image,setImage]=useState(false);
    const [productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        price:""
    })
    const  Changemanager=(e)=>{
       setProductDetails({...productDetails,[e.target.name ]:e.target.value})
    }
    const imagamanager=(e)=>{
       setImage(e.target.files[0])
    }
    const Add_product=async()=>{
        console.log(productDetails)
        let responseData;
        let product=productDetails;
        let formData=new FormData();
        formData.append('product',image);
        await fetch('http://localhost:4000/upload',{
            method:"POST",
            headers:{
                Accept:'application/json'
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{
            responseData=data
        })

    if(responseData.success){
product.image=responseData.image_url;
console.log(product);

await fetch('http://localhost:4000/addproduct',{
    method:'POST',
    headers:{
       Accept:'application/json',
        'Content-Type':'application/json'
    },
    body:JSON.stringify(product),
}).then((resp)=>resp.json()).then((data)=>{
    data.success?alert("Item Added"):alert("Failed")
})
    }

    }
  return (
    <div className='add-product'>
        <h1 style={{marginBottom:"20px" ,textDecoration:"underline"}}>ADD PRODUCTS TO LIST</h1>
<div className='addproduct-itemfield'>
    <p>Product Title</p>
    <input type='text' name='name' placeholder='type here...' value={productDetails.name} onChange={Changemanager}/>
</div>
<div className='addproduct-price'>
    <div className='addproduct-itemfield'>
        <p>Price</p>
        <input type="text" name='price' placeholder='type here...'value={productDetails.price} onChange={Changemanager}/>
    </div>
</div>
<div className='addproduct-itemfield'>
   <label htmlFor='file-input'>
<img src={image?URL.createObjectURL(image):uploadimg} alt='' className='addproduct-image'/>
   </label>
   <input type='file' name='image' id='file-input' hidden
onChange={imagamanager}
   />
</div>
<button className='addproduct-btn' onClick={()=>{Add_product()}}>ADD</button>

    </div>
  )
}

export default Addproduct

