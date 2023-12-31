document.addEventListener('DOMContentLoaded', () => {
  const quantitySelects = document.querySelectorAll('[id^="qty"]');
  const totalElement = document.querySelector('#total');
  const afterShipment = document.querySelector('#afterShipping');
  let total = 0;
  let afterShipTotal = 0;
  let totalQuantity = 0;

  quantitySelects.forEach(quantitySelect => {
    quantitySelect.addEventListener('change', event => {
      const productId = quantitySelect.getAttribute('data-product-id');
      const newQuantity = event.target.value; // The selected quantity

      const priceElement = document.querySelector(`#price${productId}`);
      const productPrice = parseFloat(priceElement.getAttribute('data-price'));
      console.log(productPrice);

      const newSingleProductTotal = (productPrice * newQuantity).toFixed(2);

      // Update the displayed total price
      const singleProductPriceElement = document.querySelector(
        `#single-product${productId}`,
      );
      singleProductPriceElement.textContent = `$${newSingleProductTotal}`;

      // Calculate the total by iterating through all products
      total = 0;
      quantitySelects.forEach(select => {
        const id = select.getAttribute('data-product-id');
        const price = parseFloat(
          document.querySelector(`#price${id}`).getAttribute('data-price'),
        );
        const quantity = parseInt(select.value);

        total += price * quantity;
      });

      afterShipTotal = total + 8;

      // Update the total price element
      totalElement.textContent = `$${total.toFixed(2)}`;

      afterShipment.textContent = `$${afterShipTotal.toFixed(2)}`;

      // Perform an HTTP request to your Node.js controller
      fetch(`/cart/updateQuantity/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
          productPrice: productPrice,
          newSingleProductTotal: newSingleProductTotal,
          total: total,

          afterShipTotal: afterShipTotal,
        }),
      })
        .then(response => response.json())
        .catch(error => {
          console.error('Error updating product quantity:', error);
        });
    });
  });
});
