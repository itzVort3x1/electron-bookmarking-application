const { ipcRenderer } = require('electron');

const items = require('./items.cjs');

let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

ipcRenderer.on('menu-show-modal', () => {
     showModal.click();
})

ipcRenderer.on('menu-open-item', () => {
     items.open();
})

ipcRenderer.on('menu-delete-item', () => {
     let selectedItem = items.getSelectedItem();
     items.delete(selectedItem.index);
})

ipcRenderer.on('menu-open-item-native', () => {
     items.openNative();
})

ipcRenderer.on('menu-focus-search', () => {
     search.focus();
})

search.addEventListener('keyup', (e) => {
     // converting html to array using array.from
     Array.from(document.getElementsByClassName('read-item')).forEach(item => {
          let hasMatch = item.innerText.toLowerCase().includes(search.value);
          item.style.display = hasMatch ? 'flex' : 'none';
     })
});

document.addEventListener('keydown', (e) => {
     if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
          items.changeSelection(e.key);
     }
})

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
     
     items.addItem(newItem, true);

     toggleModalButtons();

     modal.style.display = 'none';
     itemUrl.value = '';
})

itemUrl.addEventListener('keyup', (e) => {
     if (e.key === 'Enter') {
          addItem.click();
     }
})