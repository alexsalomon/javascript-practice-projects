"use strict";

function TaskManager() {
  this.list = new List();
  this.storage = new Storage();
  this.tasks = this.storage.getAll();
}

TaskManager.prototype.displayAll = function() {
  this.tasks = this.storage.getAll();
  this.list.addAll(this.tasks);
}

TaskManager.prototype.getCount = function(taskName) {
  return this.tasks.length;
}

TaskManager.prototype.add = function(taskName) {
  this.list.add(taskName);
  this.storage.add(taskName);
  this.tasks.push(taskName);
}

TaskManager.prototype.remove = function(taskName, row) {
  this.list.remove(row);
  this.storage.remove(taskName);
  this.tasks = this.tasks.filter(element => element !== taskName);
}

TaskManager.prototype.filter = function(filterValue) {
  this.list.filter(filterValue);
}

TaskManager.prototype.clear = function() {
  this.list.clear();
  this.storage.clear();
  this.tasks = [];
}

/******************************************************************/
//***************************** LIST ******************************/
/******************************************************************/
function List() { 
  this.list = document.querySelector('.tasklist__list');
  this.itemPrefix = "tasklist__";
}

List.prototype.addAll = function(items) {
  if(items) {
    for(let i = 0; i < items.length; i++) {
      this.add(items[i]);
    }
  }
}

List.prototype.add = function(item) {
  const newRow = document.createElement('li');
  newRow.classList.add(`${this.itemPrefix}list-item`);
  newRow.classList.add('collection-item');  
  
  const textNode = document.createTextNode(item);
  
  const deleteLink = document.createElement('a');
  deleteLink.classList.add(`${this.itemPrefix}list-item__delete-item`);
  deleteLink.classList.add('secondary-content');
  deleteLink.setAttribute('href', '#');
  deleteLink.innerHTML = '<i class="material-icons">close</i>';

  newRow.appendChild(textNode);
  newRow.appendChild(deleteLink);
  this.list.appendChild(newRow);

  this._updateBorders();
}

List.prototype.remove = function(row) {
  row.remove();
  this._updateBorders();
}

List.prototype.clear = function() {
  while (this.list.firstChild) {
    this.list.removeChild(this.list.firstChild);
  }
  this._updateBorders();
}

List.prototype.filter = function(filterValue) {
  let rows = document.querySelectorAll(`.${this.itemPrefix}list-item`);
  let currentItemValue = '';

  rows.forEach(function(row) {
    currentItemValue = row.firstChild.textContent;
    if(currentItemValue.toLowerCase().indexOf(filterValue) !== -1) {
      row.style.display = 'block';
    } else {
      row.style.display = 'none';
    }
  });

  this._updateBorders();
}

List.prototype._updateBorders = function() {
  if(this.list.children.length === 0) {
    this.list.style.border = 'none';
  } else {
    this.list.style.border = '1px solid #e0e0e0';
  }
}

/******************************************************************/
//**************************** STORAGE ****************************/
/******************************************************************/
function Storage() { 
  this.itemStorageName = 'tasks';
}

Storage.prototype.getAll = function() {
  let items = localStorage.getItem(this.itemStorageName);
  if(items === null) {
    items = '[]';
  }
  return JSON.parse(items);
}

Storage.prototype.add = function(itemName) {
  let items = this.getAll();
  items.push(itemName);
  localStorage.setItem(this.itemStorageName, JSON.stringify(items));
}

Storage.prototype.remove = function(itemName) {
  let items = this.getAll();
  items = items.filter(element => element !== itemName);
  localStorage.setItem(this.itemStorageName, JSON.stringify(items));
}

Storage.prototype.clear = function() {
  localStorage.removeItem(this.itemStorageName);
}

/******************************************************************/
//*************************** UIManager ***************************/
/******************************************************************/

function UIManager() {
  this.taskManager = new TaskManager();
}

UIManager.prototype.loadEventListeners = function() {
  let uiManager = this;

  document.addEventListener('DOMContentLoaded', function(eventObject) {
    uiManager.displayTasks();
  });

  const addTaskForm = document.querySelector('.tasklist__add-task-form');
  addTaskForm.addEventListener('submit', function(eventObject) {
    eventObject.preventDefault();

    const formData = new FormData(eventObject.target);
    const taskName = formData.get('task-name').trim();
    uiManager.addTask(taskName);
  });

  const taskList = document.querySelector('.tasklist__list');
  taskList.addEventListener('click', function(eventObject) {
    eventObject.preventDefault();
    let targetLink = eventObject.target.parentElement;
    uiManager.removeTask(targetLink);
  });

  const filterTaskInputField = document.querySelector('.tasklist__filter-field');
  filterTaskInputField.addEventListener('keyup', function(eventObject) {
    eventObject.preventDefault();
    const filterValue = eventObject.target.value.trim().toLowerCase();
    uiManager.filterTasks(filterValue);
  });

  const clearListButton = document.querySelector('.tasklist__clear-button');
  clearListButton.addEventListener('click', function(eventObject) {
    eventObject.preventDefault();
    uiManager.clearTasks();
  });
}

UIManager.prototype.displayTasks = function() {
  this.taskManager.displayAll();
  if(this.taskManager.getCount() > 0) {
    this.showTaskListSection();
  }
}

UIManager.prototype.addTask = function(taskName) {
  const addTaskInputField = document.querySelector('.tasklist__add-field');

  if(taskName) {
    this.taskManager.add(taskName);
    this.resetInputField(addTaskInputField);
    this.showTaskListSection();
  }
}

UIManager.prototype.showTaskListSection = function() {
  const tasklistListSection = document.querySelector('.tasklist__section--right');
  tasklistListSection.style.display = 'block';
}

UIManager.prototype.removeTask = function(targetLink) {
  if(targetLink.classList.contains('tasklist__list-item__delete-item') 
      && confirm('Are you sure you want to permanently delete this task?')) {
    this.taskManager.remove(targetLink.parentElement.firstChild.textContent, targetLink.parentElement);
  }
}

UIManager.prototype.filterTasks = function(filterValue) {
  this.taskManager.filter(filterValue);
}

UIManager.prototype.clearTasks = function() {
  if(confirm("Are you sure you want to permanently delete all items in the list?")) {
    const filterTaskInputField = document.querySelector('.tasklist__filter-field');
    this.taskManager.clear();
    this.resetInputField(filterTaskInputField);
  }
}

UIManager.prototype.resetInputField = function(field) {
  field.value = '';
  field.labels[0].classList.remove('active');
}

/******************************************************************/
/**************************** MAIN ********************************/
/******************************************************************/

const uiManager = new UIManager();
uiManager.loadEventListeners();
