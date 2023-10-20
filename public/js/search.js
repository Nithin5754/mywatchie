// const searchInput = document.getElementById('userSearch');
// const userRows = document.querySelectorAll('tbody tr');

// searchInput.addEventListener('input', () => {
//   const searchText = searchInput.value.toLowerCase();

//   userRows.forEach(userRow => {
//     const userName = userRow
//       .querySelector('.userName')
//       .textContent.toLowerCase();

//     if (userName.includes(searchText)) {
//       userRow.style.display = '';
//     } else {
//       userRow.style.display = 'none';
//     }
//   });
// });



const items= document.querySelectorAll('.searchable-item');

items.forEach((item) => {
  item.addEventListener('input', (event) => {
    const categoryId = item.getAttribute('data-category');
    const searchContent = event.target.value;
window.location.href=`/productList/${categoryId}?searchContent=${searchContent}`

  });
});
