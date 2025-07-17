// Select DOM elements
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasks');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const taskCounter = document.getElementById('taskCounter');
const sortSelect = document.getElementById('sortTasks');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterTasks');
const themeToggle = document.getElementById('themeToggle');

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

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.setAttribute('draggable', true);
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

// Save task to localStorage
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

    // Drag and Drop Events
    li.addEventListener('dragstart', () => {
        li.classList.add('dragging');
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        saveCurrentOrder();
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

// Filter tasks
function filterTasks() {
    const filter = filterSelect.value;
    const items = tasksList.querySelectorAll('li');
    items.forEach(li => {
        const priority = li.querySelector('.priority').textContent;
        const completed = li.classList.contains('completed');
        if (
            filter === 'all' ||
            (filter === 'completed' && completed) ||
            (filter === 'active' && !completed) ||
            priority === filter
        ) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
}

// Search tasks
function searchTasks() {
    const query = searchInput.value.toLowerCase();
    const items = tasksList.querySelectorAll('li');
    items.forEach(li => {
        const text = li.querySelector('.task-text').textContent.toLowerCase();
        li.style.display = text.includes(query) ? '' : 'none';
    });
}

// Drag-and-drop reordering
tasksList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        tasksList.appendChild(dragging);
    } else {
        tasksList.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(y) {
    const draggableElements = [...tasksList.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset: offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveCurrentOrder() {
    const tasks = [];
    tasksList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            dueDate: li.querySelector('.due-date').textContent,
            priority: li.querySelector('.priority').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Restore theme preference
function restoreTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearTasksBtn.addEventListener('click', clearTasks);
sortSelect.addEventListener('change', () => { tasksList.innerHTML = ''; loadTasks(); });
filterSelect.addEventListener('change', filterTasks);
searchInput.addEventListener('input', searchTasks);
themeToggle.addEventListener('click', toggleTheme);

// Initialize app
restoreTheme();
loadTasks();
