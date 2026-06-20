let tasks = [];

// تحميل المهام من الذاكرة
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
    showTasks();
}

// حفظ المهام في الذاكرة
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إضافة مهمة
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('اكتب مهمة!');
        return;
    }
    
    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });
    
    input.value = '';
    input.focus();
    saveTasks();
    showTasks();
}

// حذف مهمة
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    showTasks();
}

// تحديث حالة المهمة
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        saveTasks();
        showTasks();
    }
}

// حذف الكل
function deleteAll() {
    if (confirm('هل أنت متأكد؟')) {
        tasks = [];
        saveTasks();
        showTasks();
    }
}

// عرض المهام
function showTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    
    if (tasks.length === 0) {
        list.innerHTML = '<div class="empty-message">🌟 لا توجد مهام بعد</div>';
        return;
    }
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-item' + (task.done ? ' done' : '');
        
        div.innerHTML = `
            <input 
                type="checkbox" 
                ${task.done ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span>${task.text}</span>
            <button onclick="deleteTask(${task.id})">حذف</button>
        `;
        
        list.appendChild(div);
    });
}

// الضغط على Enter لإضافة مهمة
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});