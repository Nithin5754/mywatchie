const statusBtn =document.querySelectorAll('#order-status')


statusBtn.forEach((statusButton) => {
  // statusButton.innerText="pending"
  statusButton.addEventListener('click',()=>{
    if( statusButton.innerText==="pending"){
       statusButton.innerText="delivered"
    }
   else if(statusButton.innerText="deliverd"){
    statusButton.innerText="cancelled"
   }
  })
  
});
