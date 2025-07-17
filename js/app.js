// Select DOM elements
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasks');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const taskCounter = document.getElementById('taskCounter');
const sortSelect = document.getElementById('sortTasks');

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = new Date().toLocaleDateString();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        text: taskText,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    const li = createTaskElement(task);
    tasksList.appendChild(li);
    attachTaskEvents(li);
    saveTask(task);
    taskInput.value = '';
    updateTaskCounter();
}

// Create task element with buttons
function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="due-date">${task.dueDate}</span>
        <span class="priority ${task.priority}">${task.priority}</span>
        <div class="task-buttons">
            <button class="edit-btn">✎</button>
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
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    sortTasks(tasks);
    tasks.forEach(task => {
        const li = createTaskElement(task);
        tasksList.appendChild(li);
        attachTaskEvents(li);
    });
    updateTaskCounter();
}

// Attach event listeners
function attachTaskEvents(li) {
    const editBtn = li.querySelector('.edit-btn');
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => {
        const taskTextEl = li.querySelector('.task-text');
        const newText = prompt('Edit your task:', taskTextEl.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskTextEl.textContent = newText.trim();
            updateTaskText(li, newText.trim());
        }
    });

    completeBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskStatus(li);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this task?')) {
            li.classList.add('deleting');
            setTimeout(() => {
                li.remove();
                removeTask(li.querySelector('.task-text').textContent);
                updateTaskCounter();
            }, 300);
        }
    });
}

// Update task text
function updateTaskText(li, newText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const oldText = li.querySelector('.task-text').dataset.originalText || li.querySelector('.task-text').textContent;
    const index = tasks.findIndex(task => task.text === oldText);
    if (index > -1) {
        tasks[index].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Update task status
function updateTaskStatus(li) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskText = li.querySelector('.task-text').textContent;
    const index = tasks.findIndex(task => task.text === taskText);
    if (index > -1) {
        tasks[index].completed = li.classList.contains('completed');
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Remove task
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

// Sort tasks
function sortTasks(tasks) {
    if (sortSelect.value === 'newest') {
        tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearTasksBtn.addEventListener('click', clearTasks);
sortSelect.addEventListener('change', () => {
    tasksList.innerHTML = '';
    loadTasks();
});

// Load saved tasks
loadTasks();

