// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasks');

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const li = document.createElement('li');
    li.textContent = taskText;
    tasksList.appendChild(li);

    saveTask(taskText); // Save to localStorage
    taskInput.value = ''; // Clear input field
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        tasksList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', addTask);

loadTasks();

// Clear all tasks
function clearTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        localStorage.removeItem('tasks'); // Clear from localStorage
        tasksList.innerHTML = '';         // Clear from UI
    }
}

const clearTasksBtn = document.getElementById('clearTasksBtn');
clearTasksBtn.addEventListener('click', clearTasks);
