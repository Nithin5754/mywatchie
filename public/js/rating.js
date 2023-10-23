const ratings = document.querySelectorAll('#ratingSort');

ratings.forEach(sort => {
  sort.addEventListener('change', event => {
    const categoryId = sort.getAttribute('data-category');
    const rateContent = event.target.value;
    window.location.href = `/productList/${categoryId}?rate=${rateContent}`;
  });
});
