const couponButtons = document.querySelectorAll('#data-coupon-btn');
let previousButton = null;
let previousCouponValue = 0;
let cartPriceSubTotal = parseFloat(document.getElementById('totalPrice').textContent);
console.log(cartPriceSubTotal, "hello my dear");

couponButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const couponSingleValue = parseFloat(btn.getAttribute('data-coupon-value'));
    const couponName = btn.getAttribute('data-coupon-name');
    console.log(couponName, "MY COUPON");
    fetch('/validateCouponAlreadyExist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        couponName: couponName
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          
          const cartTotalElement = document.getElementById('totalPriceElement');
          let cartPrice = parseFloat(cartTotalElement.textContent);

          if (previousButton) {
            previousButton.disabled = false;
            previousButton.textContent = 'Apply';
            cartPrice -= previousCouponValue;
            cartPriceSubTotal += previousCouponValue;
          }

          btn.disabled = true;
          btn.textContent = "applied";

          cartPrice = couponSingleValue;
          console.log(cartPrice,"cartprice");

          cartTotalElement.textContent = cartPrice.toFixed(2);

          cartPriceSubTotal -= cartPrice;
          console.log(cartPriceSubTotal,"hello all");
          document.getElementById('totalPrice').textContent = cartPriceSubTotal.toFixed(2);
        } else {
          console.log("Coupon is already used");
        }
      })
      .catch((error) => console.log(error, "Error validating coupon"));

    previousButton = btn;
    previousCouponValue = couponSingleValue;
  });
});




// const cartTotalElement = document.getElementById('totalPriceElement');
// let cartPrice = parseFloat(cartTotalElement.textContent);

// if (previousButton) {
//   previousButton.disabled = false;
//   previousButton.textContent = 'Apply';
//   cartPrice -= previousCouponValue;
//   cartPriceSubTotal += previousCouponValue;
 
// }

// btn.disabled = true;
// btn.textContent = "applied";

// cartPrice = couponSingleValue;

// cartTotalElement.textContent = cartPrice.toFixed(2);



// cartPriceSubTotal -= cartPrice;
// document.getElementById('totalPrice').textContent = cartPriceSubTotal.toFixed(2);



// fetch('/admincouponManagement/addtocustomer',{
//   method:'POST',
//   headers:{
//     'Content-Type':'application/json',

//   },
//   body: JSON.stringify({
// couponValue:couponSingleValue,
// newCartTotal:cartPriceSubTotal,
// appliedCoupon:couponName
// })
// })
// .then((response)=>response.json())
// .then((data)=>console.log(data,"helllo"))
// .catch((error)=>console.log(error,"error sending coupon send "))








