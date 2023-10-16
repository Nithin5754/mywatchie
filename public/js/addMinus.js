document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.minus-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const productId = button.getAttribute('data-minusid');
      updateCartQuantity(productId, -1); // Decrement quantity by 1
    });
  });

  const subtractButtons = document.querySelectorAll('.Add-cart');
  subtractButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const productId = button.getAttribute('data-Addid');
      updateCartQuantity(productId, 1); // Increment quantity by 1
    });
  });
});

function updateCartQuantity(productId, change) {
  const quantityDisplay = document.querySelector(`[data-product-id="${productId}"]`);
  let quantity = parseInt(quantityDisplay.textContent);

  // Update the quantity (add logic to limit the maximum and minimum quantity if needed)
  if (quantity + change >= 1 && quantity + change <= 10) {
    quantity += change;
    quantityDisplay.textContent = quantity;

    // Make an API call to update the quantity on the server-side (optional)
    fetch(`/cart/updateQuantity/${productId}/${change}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: quantity }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle any additional updates you want to make after the server response
      })
      .catch(error => {
        console.error('Error updating product quantity:', error);
      });
  }
}
