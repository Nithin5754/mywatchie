
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
