const btns = document.querySelectorAll('.add-btn');

const closeButtons = document.querySelectorAll('.close-button');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const boxId = btn.getAttribute('data-box');

    const box = document.getElementById(boxId);

    if (box) {
      box.style.display = 'block';
    }
  });
});

closeButtons.forEach(closebtn => {
  closebtn.addEventListener('click', () => {
    const close = closebtn.closest('.open-qty');

    if (close) {
      close.style.display = 'none';
    }
  });
});
