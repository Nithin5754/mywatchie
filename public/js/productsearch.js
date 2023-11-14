const items = document.querySelectorAll('.searchable-item');

items.forEach(item => {
  item.addEventListener('input', event => {
    const categoryId = item.getAttribute('data-category');
    const searchContent = event.target.value;
    window.location.href = `/productList/${categoryId}?searchContent=${searchContent}`;
  });
});





const itemsAll = document.querySelectorAll('.searchable-item-all');

itemsAll.forEach(item => {
  item.addEventListener('input', event => {
    const searchContent = event.target.value;
    window.location.href = `/productFullList?searchContent=${searchContent}`;
  });
});
