// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasks');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const taskCounter = document.getElementById('taskCounter');

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const li = createTaskElement({ text: taskText, completed: false });
    tasksList.appendChild(li);
    attachTaskEvents(li);
    saveTask(taskText);
    taskInput.value = '';
    updateTaskCounter();
}

// Create task element with buttons
function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-buttons">
            <button class="complete-btn">✓</button>
            <button class="delete-btn">✗</button>
        </div>
    `;
    if (task.completed) {
        li.classList.add('completed');
    }
    return li;
}

// Save tasks to localStorage
function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task);
        tasksList.appendChild(li);
        attachTaskEvents(li);
    });
    updateTaskCounter();
}

// Attach event listeners to task buttons
function attachTaskEvents(li) {
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskStatus(li);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this task?')) {
            removeTask(li.querySelector('span').textContent);
            li.remove();
            updateTaskCounter();
        }
    });
}

// Update task status in localStorage
function updateTaskStatus(li) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskText = li.querySelector('span').textContent;
    const index = tasks.findIndex(task => task.text === taskText);
    if (index > -1) {
        tasks[index].completed = li.classList.contains('completed');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Remove task from localStorage
function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks
function clearTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        localStorage.removeItem('tasks');
        tasksList.innerHTML = '';
        updateTaskCounter();
    }
}

// Update task counter
function updateTaskCounter() {
    const totalTasks = tasksList.querySelectorAll('li').length;
    taskCounter.textContent = `You have ${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearTasksBtn.addEventListener('click', clearTasks);

// Load saved tasks on page load
loadTasks();
