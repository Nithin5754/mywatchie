


const service = document.querySelector('.services');
const btns = document.querySelectorAll('.service-btn');
const hideSections = document.querySelectorAll('.hiddenSection-box');

service.addEventListener('click', e => {
  const id = e.target.dataset.id;

  if (id) {
    btns.forEach(btn => {
      btn.classList.remove('live');
    });
    e.target.classList.add('live');

    hideSections.forEach(hideSection => {
      hideSection.classList.remove('live');
    });

    const element = document.getElementById(id);
    element.classList.add('live');
  }
});
