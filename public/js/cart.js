const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const target = document.getElementById('spinner-container');
var opts = {
  lines: 12, // Number of lines
  length: 7, // Length of each line
  width: 5, // Line thickness
  radius: 5, // Inner circle radius
  speed: 2, // Adjust the speed here (higher value for faster spin)

};

let spinner;
addToCartButtons.forEach((btn)=>{
   btn.addEventListener('click',()=>{
     btn.textContent="adding to the cart"

     spinner = new Spinner(opts).spin(target);
   
   })
  
})







document.addEventListener('DOMContentLoaded', () => {
  const addToCartButton = document.getElementById('add-to-cart-display-btn');
  const goToCartButton = document.getElementById('go-to-cart-display-btn');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const productId = button.getAttribute('data-productid');

      addToCartButton.disabled = true; 
 

      fetch(`/cart/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can include any data you need in the request body
        body: JSON.stringify({ productId }),
      })
         .then((data) => {
            console.log(data.message);
            console.log(data.cart);

            
          
            const cartMessage = document.getElementById('cartMessage');

    
            
            // Hide the cart message after 3 seconds
            setTimeout(() => {
              cartMessage.style.display="block"
              button.textContent = "go to cart";
              spinner.stop();
            }, 0);

            setTimeout(() => {
              location.reload() 
             
              cartMessage.style.display="none"
                 
            
            },700);

               
        })
        .catch(error => {
          console.error('Error adding the product to the cart:', error);
        });
    });
  });
});