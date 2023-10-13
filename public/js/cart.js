document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const productId = button.getAttribute('data-productid');

      fetch(`/cart/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can include any data you need in the request body
        body: JSON.stringify({ productId }),
      })
        .then(response => response.json(), window.location.reload())

        .catch(error => {
          console.error('Error adding product to cart:', error);
        });
    });
  });
});
