document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = ''; // Clear current list
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id); // Use a unique ID for tasks

            if (task.completed) {
                li.classList.add('completed');
            }

            // Task text
            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = task.text;
            taskTextSpan.addEventListener('click', () => toggleCompleteTask(task.id));

            // Task details (Date and Time)
            const taskDetailsSpan = document.createElement('span');
            taskDetailsSpan.classList.add('task-details');
            let details = '';
            if (task.date) details += `Date: ${task.date}`;
            if (task.time) details += (task.date ? ' | ' : '') + `Time: ${task.time}`;
            taskDetailsSpan.textContent = details;

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task.id));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(taskTextSpan);
            if (details) {
                li.appendChild(taskDetailsSpan);
            }
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        const date = taskDate.value;
        const time = taskTime.value;

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const newTask = {
            id: Date.now().toString(), // Simple unique ID
            text: text,
            date: date,
            time: time,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        // Clear inputs
        taskInput.value = '';
        taskDate.value = '';
        taskTime.value = '';
    }

    function toggleCompleteTask(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function editTask(id) {
        const taskToEdit = tasks.find(task => task.id === id);
        if (!taskToEdit) return;

        const newText = prompt('Edit task:', taskToEdit.text);
        if (newText !== null && newText.trim() !== '') {
            taskToEdit.text = newText.trim();
        }

        const newDate = prompt('Edit date (YYYY-MM-DD):', taskToEdit.date || '');
        if (newDate !== null) {
            taskToEdit.date = newDate.trim();
        }

        const newTime = prompt('Edit time (HH:MM):', taskToEdit.time || '');
        if (newTime !== null) {
            taskToEdit.time = newTime.trim();
        }

        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial render
    renderTasks();
});