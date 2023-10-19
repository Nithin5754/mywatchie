
const discounts = document.querySelectorAll('#discountSort');

discounts.forEach((sort) => {
  sort.addEventListener('change', (event) => {
    const categoryId = sort.getAttribute('data-category');
    const discountContent = event.target.value;
window.location.href=`/productList/${categoryId}?discount=${discountContent}`

  });
});

