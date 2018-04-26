"use strict";

class TaskManager {
  constructor() {
    this.list = new List();
    this.storage = new Storage();
    this.tasks = this.storage.getAll();
  }

  displayAll() {
    this.tasks = this.storage.getAll();
    this.list.addAll(this.tasks);
  }

  getCount(taskName) {
    return this.tasks.length;
  }

  add(taskName) {
    this.list.add(taskName);
    this.storage.add(taskName);
    this.tasks.push(taskName);
  }

  remove(taskName, row) {
    this.list.remove(row);
    this.storage.remove(taskName);
    this.tasks = this.tasks.filter(element => element !== taskName);
  }

  filter(filterValue) {
    this.list.filter(filterValue);
  }

  clear() {
    this.list.clear();
    this.storage.clear();
    this.tasks = [];
  }
}

/******************************************************************/
//***************************** LIST ******************************/
/******************************************************************/
class List { 
  constructor() {
    this.list = document.querySelector('.tasklist__list');
    this.itemPrefix = "tasklist__";
  }

  addAll(items) {
    if(items) {
      for(let i = 0; i < items.length; i++) {
        this.add(items[i]);
      }
    }
  }

  add(item) {
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

  remove(row) {
    row.remove();
    this._updateBorders();
  }

  clear() {
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
    this._updateBorders();
  }

  filter(filterValue) {
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

  _updateBorders() {
    if(this.list.children.length === 0) {
      this.list.style.border = 'none';
    } else {
      this.list.style.border = '1px solid #e0e0e0';
    }
  }
}

/******************************************************************/
//**************************** STORAGE ****************************/
/******************************************************************/
class Storage { 
  constructor() {
    this.itemStorageName = 'tasks';
  }

  getAll() {
    let items = localStorage.getItem(this.itemStorageName);
    if(items === null) {
      items = '[]';
    }
    return JSON.parse(items);
  }

  add(itemName) {
    let items = this.getAll();
    items.push(itemName);
    localStorage.setItem(this.itemStorageName, JSON.stringify(items));
  }

  remove(itemName) {
    let items = this.getAll();
    items = items.filter(element => element !== itemName);
    localStorage.setItem(this.itemStorageName, JSON.stringify(items));
  }

  clear() {
    localStorage.removeItem(this.itemStorageName);
  }
}

/******************************************************************/
//*************************** UIManager ***************************/
/******************************************************************/

class UIManager {
  constructor() { 
    this.taskManager = new TaskManager();
  }

  loadEventListeners() {
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

  displayTasks() {
    this.taskManager.displayAll();
    if(this.taskManager.getCount() > 0) {
      this.showTaskListSection();
    }
  }

  addTask(taskName) {
    const addTaskInputField = document.querySelector('.tasklist__add-field');

    if(taskName) {
      this.taskManager.add(taskName);
      this.resetInputField(addTaskInputField);
      this.showTaskListSection();
    }
  }

  showTaskListSection() {
    const tasklistListSection = document.querySelector('.tasklist__section--right');
    tasklistListSection.style.display = 'block';
  }

  removeTask(targetLink) {
    if(targetLink.classList.contains('tasklist__list-item__delete-item') 
        && confirm('Are you sure you want to permanently delete this task?')) {
      this.taskManager.remove(targetLink.parentElement.firstChild.textContent, targetLink.parentElement);
    }
  }

  filterTasks(filterValue) {
    this.taskManager.filter(filterValue);
  }

  clearTasks() {
    if(confirm("Are you sure you want to permanently delete all items in the list?")) {
      const filterTaskInputField = document.querySelector('.tasklist__filter-field');
      this.taskManager.clear();
      this.resetInputField(filterTaskInputField);
    }
  }

  resetInputField(field) {
    field.value = '';
    field.labels[0].classList.remove('active');
  }
}

/******************************************************************/
/**************************** MAIN ********************************/
/******************************************************************/

const uiManager = new UIManager();
uiManager.loadEventListeners();
