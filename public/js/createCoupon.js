
const createBtn=document.getElementById('create-coupon-btn')
const createCouponBox=document.querySelector('.openCoupon')
const closeCouponBox=document.querySelector('.close-coupon-Box')

const validateMsg=document.querySelector('.errorMsg')
const errorMsgElementAlreadyExist=document.querySelector('.alreadyExist')


createCouponBox.style.display="none"

createBtn.addEventListener('click',()=>{
createCouponBox.style.display='block'
  console.log("hello");
})


closeCouponBox.addEventListener('click',()=>{
  createCouponBox.style.display="none" 
})


function validateForm(){
  const discountType=document.querySelector('input[name=discountType]:checked').value 
const couponValue=document.querySelector('input[name=couponValue]').value
  if(discountType==='percentage'){
    console.log("hello");
    if(couponValue>100){
validateMsg.innerText="coupon value should below 100"

return false
    }
  }
  return true

}



function submitForm() {
  const couponName = document.getElementById('couponName').value;
  const discountType = document.querySelector('input[name="discountType"]:checked').value;
  const couponValue = document.getElementById('couponValue').value;
  const couponMinimumPurchase = document.getElementById('couponMinimumPurchase').value;
  const validFrom = document.getElementById('validFrom').value;
  const validTo = document.getElementById('validTo').value;

  const dataForm={
     couponName,
     discountType,
     couponValue,
     couponMinimumPurchase,
     validFrom,
     validTo
  }

  fetch("/adminCouponManagement/create",{
    method:'POST',
    body: JSON.stringify(dataForm),
    headers:{
      'Content-Type': 'application/json',
    }
  
   }).then((response)=>{
    if(response.ok){
      window.location.href = '/adminCouponManagement'
    }else if(response.status===400){
      response.json().then((data)=>{
        errorMsgElementAlreadyExist.textContent = data.error; 
      })
  
    }
   }).catch((error)=>console.log("errro fetching creating new coupon",error))
  
}


//fetch 
const couponForm=document.querySelector('form')

couponForm.addEventListener('submit',async(e)=>{
       e.preventDefault()
if(!validateForm){
return ;
}

submitForm()

})








const editCoupons=document.querySelectorAll('.coupon-edit')
const createCouponBoxEdit=document.querySelector('.openCoupon-edit')
const closeCouponBoxEdit=document.querySelector('.close-coupon-Box-edit')
closeCouponBoxEdit.addEventListener('click',()=>{
  
  createCouponBoxEdit.style.display="none"
  
})

createCouponBoxEdit.style.display="none"   


editCoupons.forEach((element) => {
  element.addEventListener('click',()=>{
    const getEditValue=element.getAttribute('data-couponEdit')
  console.log(getEditValue,"hello coupon id");
  fetch("/adminCouponManagement/edit",{
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({getEditValue}),

  })
  .then((response)=>{
    if(response.ok){
      console.log("response ok");
       return response.json();
    }else {
      console.log("not found");
    }
  })
  .then((data)=>{
    createCouponBoxEdit.style.display="block"
    const couponName = document.getElementById('couponName-edit');
    const discountType = document.querySelector('input[name="discountType"]:checked');
    const couponValue = document.getElementById('couponValue-edit');
    const couponMinimumPurchase = document.getElementById('couponMinimumPurchase-edit');
    const validFrom = document.getElementById('validFrom-edit');
    const validTo = document.getElementById('validTo-edit');
    console.log(data,"hello");
    couponName.value=data.data.couponName
    couponValue.value=data.data.couponValue
    couponMinimumPurchase.value=data.data.minimumPurchase
  })
  .catch((error)=>console.log("error fetching edit coupon",error))
  })

});




// edit submit form



function submitEditForm() {
  const couponName = document.getElementById('couponName-edit').value;
  const discountType = document.querySelector('input[name="discountType"]:checked').value;
  const couponValue = document.getElementById('couponValue-edit').value;
  const couponMinimumPurchase = document.getElementById('couponMinimumPurchase-edit').value;
  const validFrom = document.getElementById('validFrom-edit').value;
  const validTo = document.getElementById('validTo-edit').value;

  const dataForm={
     couponName,
     discountType,
     couponValue,
     couponMinimumPurchase,
     validFrom,
     validTo
  }

  fetch("/adminCouponManagement/edit/update",{
    method:'POST',
    body: JSON.stringify(dataForm),
    headers:{
      'Content-Type': 'application/json',
    }
  
   }).then((response)=>{
    if(response.ok){
      window.location.href = '/adminCouponManagement'
    }else if(response.status===400){
      response.json().then((data)=>{
        errorMsgElementAlreadyExist.textContent = data.error; 
      })
  
    }
   }).catch((error)=>console.log("errro fetching creating new coupon",error))
  
}


//fetch 
const couponFormEdit=document.querySelector('#edit-form')

couponFormEdit.addEventListener('submit',async(e)=>{
       e.preventDefault()
if(!validateForm){
return ;
}

submitEditForm()

})





