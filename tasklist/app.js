"use strict";

const addTaskForm = document.querySelector('.tasklist__add-task-form');

addTaskForm.addEventListener('submit', addTask);

function addTask(eventObject) {
  eventObject.preventDefault();

  const taskList = document.querySelector('.tasklist__list');
  const addTaskField = document.querySelector('.tasklist__add-field');
  const formData = new FormData(eventObject.target);
  const taskName = formData.get('task-name').trim();

  if(taskName) {
    const newTask = createListItemElement(taskName);
    taskList.appendChild(newTask);
    showTasklistListSection();
    resetField(addTaskField);
    addToLocalStorage(taskName);
  } else {
    // invalid
  }
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

function createListItemElement(taskName) {
  const newTask = document.createElement('li');
  const taskNameNode = document.createTextNode(taskName);
  const deleteIconArea = document.createElement('div');

  deleteIconArea.classList.add('secondary-content');
  deleteIconArea.innerHTML = '<i class="material-icons">close</i>';

  newTask.classList.add('tasklist__list-item');
  newTask.classList.add('collection-item');
  newTask.appendChild(taskNameNode);
  newTask.appendChild(deleteIconArea);

  return newTask;
}

function resetField(field) {
  field.value = '';
  field.labels[0].classList.remove('active');
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
