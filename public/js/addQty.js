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




const btnsDetails = document.querySelectorAll('.add-btn-details');

const closeButtonsDetails = document.querySelectorAll('.close-button-details');

btnsDetails.forEach(btn => {
  btn.addEventListener('click', () => {
    const boxId = btn.getAttribute('data-boxDetails');

    const box = document.getElementById(boxId);

    if (box) {
      box.style.display = 'block';
    }
  });
});

closeButtonsDetails.forEach(closebtn => {
  closebtn.addEventListener('click', () => {
    const close = closebtn.closest('.open-qty');

    if (close) {
      close.style.display = 'none';
    }
  });
});





const openCreate=document.querySelector('#open-create')
const clsoCreate=document.querySelector('.close-create')
const createBox=document.querySelector('.open-create-form ')


openCreate.addEventListener('click',()=>{
    createBox.style.display='block'
    openCreate.style.display='none'
})


clsoCreate.addEventListener('click',()=>{
  createBox.style.display='none'
  openCreate.style.display='block'
})






const openview=document.querySelector('#open-view')
const clsoview=document.querySelector('.close-view')
const viewBox=document.querySelector('.open-view-form ')


openview.addEventListener('click',()=>{
    viewBox.style.display='block'
    openview.style.display='none'
})


clsoview.addEventListener('click',()=>{
  viewBox.style.display='none'
  openview.style.display='block'
})



// editoffer



const btnsEdit = document.querySelectorAll('.add-btn-edit');

const closeEdit = document.querySelectorAll('.close-edit');

btnsEdit.forEach(btn => {
  btn.addEventListener('click', () => {
    const boxId = btn.getAttribute('data-edit');

    const box = document.getElementById(boxId);

    if (box) {
      box.style.display = 'block';
    }
  });
});

closeEdit.forEach(closebtn => {
  closebtn.addEventListener('click', () => {
    const close = closebtn.closest('.open-edit');

    if (close) {
      close.style.display = 'none';
    }
  });
});

