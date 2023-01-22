const { ipcRenderer } = require('electron');

let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');

const toggleModalButtons = () => {
     if(addItem.disabled === true){
          addItem.disabled = false;
          addItem.style.opacity = 1;
          addItem.innerText = 'Add Item';
          closeModal.style.display = 'inline';

     }else {
          addItem.disabled = true;
          addItem.style.opacity = 0.5;
          addItem.innerText = 'Adding...';
          closeModal.style.display = 'none';
     }
}

showModal.addEventListener('click', () => {
     modal.style.display = 'flex';
     itemUrl.focus();
});

closeModal.addEventListener('click', () => {
     modal.style.display = 'none';
});

addItem.addEventListener('click', () => {
     if (itemUrl.value) {
          ipcRenderer.send('new-item', itemUrl.value);

          toggleModalButtons();
     }
})

ipcRenderer.on('new-item-success', (e, newItem) => {
     console.log(newItem);
     toggleModalButtons();

     modal.style.display = 'none';
     itemUrl.value = '';
})

itemUrl.addEventListener('keyup', (e) => {
     if (e.key === 'Enter') {
          addItem.click();
     }
})