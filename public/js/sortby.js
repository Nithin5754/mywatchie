const prices = document.querySelectorAll('#priceSort');

prices.forEach(sort => {
  sort.addEventListener('change', event => {
    const categoryId = sort.getAttribute('data-category');
    const sortContent = event.target.value;
    window.location.href = `/productList/${categoryId}?sortContent=${sortContent}`;
  });
});

// Perform an HTTP request to your Node.js controller
// fetch(`/productList/${categoryId}?sortContent=${sortContent}`, {
//   method: 'GET',
// })
//   .then((response) => response.json())

//   .catch((error) => {
//     console.error('Error updating product quantity:', error);
//   });
