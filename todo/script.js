// متغيرات عامة
let tasks = [];
let filteredTasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let isDarkMode = localStorage.getItem('isDarkMode') === 'true';

// العناصر المهمة
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBtn = document.getElementById('sortBtn');
const clearBtn = document.getElementById('clearBtn');
const themeToggle = document.getElementById('themeToggle');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const editCategorySelect = document.getElementById('editCategorySelect');

// تهيئة التطبيق
function init() {
    loadTasks();
    applyTheme();
    renderTasks();
    updateStats();
    attachEventListeners();
}

// إضافة مستمعي الأحداث
function attachEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    searchInput.addEventListener('input', filterAndSearch);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.closest('.filter-btn').classList.add('active');
            currentFilter = e.target.closest('.filter-btn').dataset.filter;
            filterAndSearch();
        });
    });
    sortBtn.addEventListener('click', toggleSort);
    clearBtn.addEventListener('click', clearCompleted);
    themeToggle.addEventListener('click', toggleTheme);
}

// إضافة مهمة جديدة
function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;

    if (!text) {
        alert('الرجاء إدخال مهمة');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        category: category,
        completed: false,
        createdAt: new Date().toLocaleString('ar-SA'),
        completedAt: null
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    categorySelect.value = 'other';
    taskInput.focus();
}

// حذف مهمة
function deleteTask(id) {
    if (confirm('هل تريد حذف هذه المهمة؟')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// تحديث حالة المهمة
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toLocaleString('ar-SA') : null;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// فتح نموذج التعديل
function openEditModal(id) {
    editingTaskId = id;
    const task = tasks.find(t => t.id === id);
    if (task) {
        editInput.value = task.text;
        editCategorySelect.value = task.category;
        editModal.classList.add('active');
        editInput.focus();
    }
}

// إغلاق نموذج التعديل
function closeModal() {
    editModal.classList.remove('active');
    editingTaskId = null;
    editInput.value = '';
}

// حفظ التعديل
function saveEdit() {
    if (!editingTaskId) return;

    const newText = editInput.value.trim();
    if (!newText) {
        alert('الرجاء إدخال نص المهمة');
        return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = newText;
        task.category = editCategorySelect.value;
        saveTasks();
        renderTasks();
        updateStats();
        closeModal();
    }
}

// الفلترة والبحث
function filterAndSearch() {
    const searchText = searchInput.value.toLowerCase();

    filteredTasks = tasks.filter(task => {
        // فلترة حسب الحالة
        let matchesFilter = true;
        if (currentFilter === 'completed') matchesFilter = task.completed;
        if (currentFilter === 'pending') matchesFilter = !task.completed;

        // البحث في النص
        const matchesSearch = task.text.toLowerCase().includes(searchText);

        return matchesFilter && matchesSearch;
    });

    renderTasks();
}

// ترتيب المهام
let isSortedByDate = false;
function toggleSort() {
    isSortedByDate = !isSortedByDate;

    if (isSortedByDate) {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        sortBtn.innerHTML = '<i class="fas fa-sort-amount-down"></i> الأقدم';
    } else {
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        sortBtn.innerHTML = '<i class="fas fa-sort"></i>';
    }

    saveTasks();
    renderTasks();
}

// حذف جميع المهام المكتملة
function clearCompleted() {
    if (confirm('هل تريد حذف جميع المهام المكتملة؟')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// رسم قائمة المهام
function renderTasks() {
    tasksList.innerHTML = '';

    const tasksToRender = currentFilter === 'all' && searchInput.value === '' ? tasks : filteredTasks;

    if (tasksToRender.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    tasksToRender.forEach(task => {
        const categoryEmojis = {
            'work': '🏢',
            'personal': '👤',
            'shopping': '🛒',
            'health': '💪',
            'other': '📌'
        };

        const categoryLabels = {
            'work': 'عمل',
            'personal': 'شخصي',
            'shopping': 'تسوق',
            'health': 'صحة',
            'other': 'أخرى'
        };

        const taskEl = document.createElement('div');
        taskEl.className = `task-item category-${task.category} ${task.completed ? 'completed' : ''}`;
        taskEl.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleComplete(${task.id})"
            >
            <div class="task-content">
                <div class="task-category">
                    ${categoryEmojis[task.category]} ${categoryLabels[task.category]}
                </div>
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-time">📅 ${task.createdAt}</div>
                ${task.completedAt ? `<div class="task-time">✅ تم الإنجاز: ${task.completedAt}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="task-btn task-btn-edit" onclick="openEditModal(${task.id})" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn task-btn-delete" onclick="deleteTask(${task.id})" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        tasksList.appendChild(taskEl);
    });
}

// تحديث الإحصائيات
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('progressPercent').textContent = percentage + '%';
    document.getElementById('progressFill').style.width = percentage + '%';
}

// حفظ المهام في Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحميل المهام من Local Storage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// تبديل الوضع الليلي
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', isDarkMode);
    applyTheme();
}

// تطبيق الوضع الليلي
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// تأمين HTML من XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// إغلاق النموذج عند الضغط خارجه
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeModal();
});

// الاختصارات من لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// تهيئة التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', init);