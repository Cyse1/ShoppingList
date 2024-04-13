const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;


function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}


function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  //validate Input
  if (newItem === '') {
    alert('please add an item');
    return;
  }

  //Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert('Item already exist')
      return
    }
  }
  //Create DOM element
  addItemToDOM(newItem);
  
  //add item to local storage
  addItemToStorage(newItem);

  //Checking state of App
  checkUI();
  itemInput.value = '';
}

function addItemToDOM(item) {
  //create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  //add li to the DOM
  itemList.appendChild(li);
}


function createButton(classes) {
  button = document.createElement('button');
  button.classList.add(...classes.split(' '));
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.classList.add(...classes.split(' '));
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  //converto to JSON String and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'))
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement)
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage.includes(item)) {
    return itemsFromStorage.includes(item);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach((i) => {
    i.classList.remove('edit-mode');
  })
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  itemInput.value = item.textContent;
  formBtn.style.backgroundColor = 'green'
}


function removeItem(item) { 
  console.log(item)
  if (confirm('Are You Sure?')) {
    //reemove item from DOM
    item.remove();
    //reemove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}; 

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  //filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Reset to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstElementChild) {
    itemList.removeChild(itemList.firstElementChild);
  }
  //Clear from local storagee
  localStorage.removeItem('items')
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  const items = itemList.querySelectorAll('li');
  itemInput.value ==='';
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor='black'
  isEditMode = false;
}


function init(){
//Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems)

checkUI();
}

init();

// localStorage.setItem('key', 'Steven');
// console.log(localStorage.getItem('name'))
// localStorage.removeItem('name')
// localStorage.clear();

/* 
localStorage.setItem('key','value); //Sets a value with a key
localStorage.getItem('key'); //retrieves a value using the key
localStorage.removeItem('key'); //removes item using the key
localStorage.clear() //Clears all values
*/
