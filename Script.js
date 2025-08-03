// DOM Elements
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDate');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

let filter = 'all'; // all | pending | completed

// Load page
window.onload = () => {
  loadTheme();
  showTasks();
};

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!text) return alert("Please enter a task.");

  const task = {
    text,
    dueDate: dueDate || null,
    priority,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  showTasks();

  // Reset inputs
  taskInput.value = '';
  dueDateInput.value = '';
  priorityInput.value = 'low';
}

// Show Tasks
function showTasks() {
  const tasks = getTasks().sort((a, b) => {
    return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
  });

  taskList.innerHTML = '';

  tasks.forEach((task, i) => {
    if (filter === 'completed' && !task.completed) return;
    if (filter === 'pending' && task.completed) return;

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    if (isOverdue(task)) li.classList.add('overdue');

    const priorityClass = `priority-${task.priority}`;

    li.innerHTML = `
      <div class="task-info" onclick="toggleComplete(${i})">
        <span class="text ${priorityClass}">${task.text} ${getPriorityIcon(task.priority)}</span>
        ${task.dueDate ? `<small class="due-date">${isOverdue(task) ? '⚠️ Overdue: ' : 'Due: '}${task.dueDate}</small>` : ''}
      </div>
      <div>
        <button onclick="editTask(${i})">Edit</button>
        <button onclick="deleteTask(${i})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Toggle Complete
function toggleComplete(i) {
  const tasks = getTasks();
  tasks[i].completed = !tasks[i].completed;
  saveTasks(tasks);
  showTasks();
}

// Delete Task
function deleteTask(i) {
  const tasks = getTasks();
  tasks.splice(i, 1);
  saveTasks(tasks);
  showTasks();
}

// Edit Task
function editTask(i) {
  const tasks = getTasks();
  const task = tasks[i];

  const newText = prompt("Edit task:", task.text);
  if (newText === null) return;

  const newDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate || '');
  const newPriority = prompt("Edit priority (low/medium/high):", task.priority);

  task.text = newText.trim() || task.text;
  task.dueDate = newDate || null;
  task.priority = ['low', 'medium', 'high'].includes(newPriority) ? newPriority : task.priority;

  saveTasks(tasks);
  showTasks();
}

// Check overdue
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate).setHours(0, 0, 0, 0);
  return due < today;
}

// Priority Icon
function getPriorityIcon(p) {
  return p === 'high' ? '🔥' : p === 'medium' ? '🟡' : '✅';
}

// Filter Tasks
function setFilter(type) {
  filter = type;
  showTasks();
}

// Local Storage
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Theme Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
  themeToggle.textContent = mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
};

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️ Light Mode';
  }
}
