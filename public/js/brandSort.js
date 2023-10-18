const brands = document.querySelectorAll('#brandSort');

brands.forEach((brand) => {
  brand.addEventListener('change', (event) => {
    const categoryId = brand.getAttribute('data-category');
    const brandContent = event.target.value;
window.location.href=`/productList/${categoryId}?brandContent=${brandContent}`

  });
});