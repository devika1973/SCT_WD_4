// Elements
const loginPage = document.getElementById('loginPage');
const welcomePage = document.getElementById('welcomePage');
const todoApp = document.getElementById('todoApp');

const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');

const userDisplay = document.getElementById('userDisplay');
const getStartedBtn = document.getElementById('getStartedBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtn2 = document.getElementById('logoutBtn2');

const userDisplayTodo = document.getElementById('userDisplayTodo');

const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
const addTaskBtn = document.getElementById('addTaskBtn');

const taskList = document.getElementById('taskList');
const taskStats = document.getElementById('taskStats');
const progressBar = document.getElementById('progressBar');

const resetBtn = document.getElementById('resetBtn');

const funFactEl = document.getElementById('funFact');
const achievementEl = document.getElementById('achievement');

const darkModeToggle = document.getElementById('darkModeToggle');

const soundAdd = document.getElementById('soundAdd');
const soundComplete = document.getElementById('soundComplete');
const soundDelete = document.getElementById('soundDelete');

let tasks = [];
let achievementCount = 0;

// Fun facts array
const funFacts = [
  "Did you know? Writing tasks down can boost productivity by 42%.",
  "Fun fact: Your brain remembers completed tasks better than pending ones!",
  "Tip: Break big tasks into smaller steps to avoid feeling overwhelmed.",
  "Try to focus on one task at a time for maximum efficiency!",
  "Did you know? The Pomodoro technique can improve your focus."
];

// Load user & tasks from localStorage
function loadApp() {
  const savedUser = localStorage.getItem('todoUser');
  const savedTasks = localStorage.getItem('todoTasks');
  const savedDarkMode = localStorage.getItem('todoDarkMode');

  if (savedUser) {
    showWelcome(savedUser);
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedDarkMode === 'true') {
      document.body.classList.add('dark');
      darkModeToggle.checked = true;
    }
  } else {
    showLogin();
  }
}

// Show login page
function showLogin() {
  loginPage.classList.remove('hidden');
  welcomePage.classList.add('hidden');
  todoApp.classList.add('hidden');
}

// Show welcome page
function showWelcome(username) {
  userDisplay.textContent = username;
  loginPage.classList.add('hidden');
  welcomePage.classList.remove('hidden');
  todoApp.classList.add('hidden');
}

// Show To-Do App page
function showTodo(username) {
  userDisplayTodo.textContent = username;
  loginPage.classList.add('hidden');
  welcomePage.classList.add('hidden');
  todoApp.classList.remove('hidden');
  renderTasks();
  updateStats();
  showRandomFunFact();
  achievementEl.textContent = '';
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Render tasks list
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('data-index', index);

    // Task text
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Date/time
    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    if (task.datetime) {
      const dt = new Date(task.datetime);
      dateSpan.textContent = dt.toLocaleString();
    }

    // Buttons container
    const btnDiv = document.createElement('div');
    btnDiv.className = 'task-buttons';

    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.title = 'Toggle Complete';
    completeBtn.innerHTML = task.completed ? '✅' : '⬜';
    completeBtn.onclick = () => toggleComplete(index);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.title = 'Delete Task';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => deleteTask(index);

    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(btnDiv);

    taskList.appendChild(li);
  });
}

// Add task
function addTask() {
  const text = taskInput.value.trim();
  const datetime = taskDateTime.value;

  if (!text) {
    alert('Please enter a task.');
    return;
  }

  tasks.push({ text, datetime, completed: false });
  saveTasks();
  renderTasks();
  updateStats();
  taskInput.value = '';
  taskDateTime.value = '';
  playSound(soundAdd);
  showRandomFunFact();
}

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  updateStats();
  playSound(soundComplete);

  // Show achievement
  if (tasks[index].completed) {
    achievementCount++;
    if (achievementCount % 5 === 0) {
      achievementEl.textContent = `🎉 Great! You've completed ${achievementCount} tasks!`;
      setTimeout(() => (achievementEl.textContent = ''), 5000);
    }
  }
}

// Delete task
function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateStats();
    playSound(soundDelete);
  }
}

// Update task stats and progress bar
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskStats.textContent = `Completed ${completed} out of ${total} tasks`;

  const progress = total === 0 ? 0 : (completed / total) * 100;
  progressBar.value = progress;
}

// Show random fun fact
function showRandomFunFact() {
  if (tasks.length === 0) {
    funFactEl.textContent = '';
    return;
  }
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  funFactEl.textContent = fact;
}

// Reset all tasks
function resetTasks() {
  if (confirm('Are you sure you want to reset all tasks?')) {
    tasks = [];
    achievementCount = 0;
    saveTasks();
    renderTasks();
    updateStats();
    funFactEl.textContent = '';
    achievementEl.textContent = '';
  }
}

// Play sound helper
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Event listeners

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter your username to login.');
    return;
  }
  localStorage.setItem('todoUser', username);
  showWelcome(username);
});

getStartedBtn.addEventListener('click', () => {
  const username = localStorage.getItem('todoUser');
  if (username) {
    showTodo(username);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('todoUser');
  localStorage.removeItem('todoTasks');
  localStorage.removeItem('todoDarkMode');
  tasks = [];
  achievementCount = 0;
  showLogin();
});

logoutBtn2.addEventListener('click', () => {
  localStorage.removeItem('todoUser');
  localStorage.removeItem('todoTasks');
  localStorage.removeItem('todoDarkMode');
  tasks = [];
  achievementCount = 0;
  showLogin();
});

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

resetBtn.addEventListener('click', resetTasks);

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('todoDarkMode', 'true');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('todoDarkMode', 'false');
  }
});

// Initialize app on page load
loadApp();
