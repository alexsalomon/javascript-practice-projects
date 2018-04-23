"use strict";

const addTaskForm = document.querySelector('.tasklist__add-task-form');
const filterField = document.querySelector('.tasklist__filter-field');
const clearListButton = document.querySelector('.tasklist__clear-button');
const taskList = document.querySelector('.tasklist__list');

loadEventListeners();

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', displayTasks);
  addTaskForm.addEventListener('submit', addTaskFromInput);
  filterField.addEventListener('keyup', filterTaskList);
  clearListButton.addEventListener('click', clearListWithConfirmation);
  taskList.addEventListener('click', deleteTask);
}

function displayTasks() {
  let tasks = getTasksFromLocalStorage();
  if(tasks) {
    tasks.forEach(function(task) {
      addTaskToTaskList(task);
    });
  }
}

function addTaskFromInput(eventObject) {
  eventObject.preventDefault();

  const addTaskField = document.querySelector('.tasklist__add-field');
  const formData = new FormData(eventObject.target);
  const taskName = formData.get('task-name').trim();

  if(taskName) {
    addTaskToTaskList(taskName);
    addToLocalStorage(taskName);
    resetField(addTaskField);
  }
}

function addTaskToTaskList(taskName) {
  const newTask = createListItemElement(taskName);
  taskList.appendChild(newTask);
  showTasklistListSection();
  updateTaskListBorder();
}

function deleteTask(eventObject) {
  eventObject.preventDefault();

  let targetLink = eventObject.target.parentElement;
  if(targetLink.classList.contains('tasklist__list-item__delete-item') 
      && confirm('Are you sure you want to permanently delete this task?')) {
    const listItem = targetLink.parentElement;
    listItem.remove();
    removeFromLocalStorage(listItem.childNodes[0].textContent);
    updateTaskListBorder();
  }
}

function clearListWithConfirmation(eventObject) {
  if(confirm("Are you sure you want to permanently delete all items in the list?")) {
    clearList();
    resetField(filterField);
  }
}

function clearList(eventObject) { 
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  clearTasksFromLocalStorage();
  updateTaskListBorder();
}

function filterTaskList(eventObject) {
  const filterValue = eventObject.target.value.trim().toLowerCase();
  const listItems = document.querySelectorAll('.tasklist__list-item');
  let currentItemValue = '';

  listItems.forEach(function(listItem) {
    currentItemValue = listItem.firstChild.textContent;
    if(currentItemValue.toLowerCase().indexOf(filterValue) !== -1) {
      listItem.style.display = 'block';
    } else {
      listItem.style.display = 'none';
    }
  });

  updateTaskListBorder();
}

function createListItemElement(taskName) {
  const newTask = document.createElement('li');
  const taskNameNode = document.createTextNode(taskName);
  const deleteIconArea = document.createElement('a');

  deleteIconArea.classList.add('tasklist__list-item__delete-item');
  deleteIconArea.classList.add('secondary-content');
  deleteIconArea.setAttribute('href', '#');
  deleteIconArea.innerHTML = '<i class="material-icons">close</i>';

  newTask.classList.add('tasklist__list-item');
  newTask.classList.add('collection-item');
  newTask.appendChild(taskNameNode);
  newTask.appendChild(deleteIconArea);

  return newTask;
}

function showTasklistListSection() {
  const separator = document.querySelector('.separator');
  const tasklistListSection = document.querySelector('.tasklist__section--right');

  separator.style.display = 'block';
  tasklistListSection.style.display = 'block';
}

function hideTasklistListSection() {
  const separator = document.querySelector('.separator');
  const tasklistListSection = document.querySelector('.tasklist__section--right');

  separator.style.display = 'none';
  tasklistListSection.style.display = 'none';
}

function resetField(field) {
  field.value = '';
  field.labels[0].classList.remove('active');
}

function updateTaskListBorder() {
  if(taskList.children.length === 0) {
    taskList.style.border = 'none';
  } else {
    taskList.style.border = '1px solid #e0e0e0';
  }
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks'));
}

function addToLocalStorage(taskName) {
  let tasks = localStorage.getItem('tasks');

  if(tasks === null) {
    tasks = '[]';
  }

  tasks = JSON.parse(tasks);
  tasks.push(taskName);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeFromLocalStorage(taskName) {
  let tasks = localStorage.getItem('tasks');
  if(tasks !== null) {
    tasks = JSON.parse(tasks);
    tasks = tasks.filter(e => e !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

function clearTasksFromLocalStorage() {
  localStorage.removeItem('tasks');
}
