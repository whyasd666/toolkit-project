let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const authContainer = document.getElementById('authContainer');
const lessonsContainer = document.getElementById('lessonsContainer');
const dynamicArea = document.getElementById('dynamicLessonArea');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTabBtn');
const registerTab = document.getElementById('registerTabBtn');
const doLoginBtn = document.getElementById('doLoginBtn');
const doRegisterBtn = document.getElementById('doRegisterBtn');
const logoutBtn = document.getElementById('logoutButton');
const userEmailSpan = document.getElementById('currentUserEmail');
const darkModeToggle = document.getElementById('darkModeToggle');

function checkAuth() {
    if (token && currentUser) {
        authContainer.classList.add('hidden');
        lessonsContainer.classList.remove('hidden');
        userEmailSpan.innerText = currentUser.email;
        loadLessons();
    } else {
        authContainer.classList.remove('hidden');
        lessonsContainer.classList.add('hidden');
    }
}

async function loadLessons() {
    try {
        const response = await fetch('/api/lessons');
        const lessons = await response.json();
        let html = `<h2 style="margin-bottom:1rem;">Lessons</h2><div class="lessons-grid">`;
        lessons.forEach(lesson => {
            html += `
                <div class="lesson-card" data-slug="${lesson.slug}">
                    <div class="lesson-number">LESSON</div>
                    <h3>${lesson.title}</h3>
                    <p>${lesson.short_desc}</p>
                    <a href="#" class="lesson-link">Read more →</a>
                    <br>
                    <small>Ask bot: 
                        <a href="https://t.me/CyberSecLearning_bot?start=question_${lesson.slug}" target="_blank">Question about ${lesson.title}</a>
                    </small>
                </div>
            `;
        });
        html += `</div><div style="margin-top:1.5rem; background:var(--tab-active-bg); border-radius:1rem; padding:0.7rem; text-align:center;">Click any lesson to open full page.</div>`;
        dynamicArea.innerHTML = html;
        document.querySelectorAll('.lesson-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const card = link.closest('.lesson-card');
                const slug = card.dataset.slug;
                await showLessonDetail(slug);
            });
        });
    } catch (err) {
        console.error('Failed to load lessons', err);
        dynamicArea.innerHTML = '<p>Error loading lessons. Please try again later.</p>';
    }
}

async function showLessonDetail(slug) {
    try {
        const response = await fetch(`/api/lessons/${slug}`);
        const lesson = await response.json();
        const content = lesson.content.replace(/\n/g, '<br>');
        dynamicArea.innerHTML = `
            <div class="lesson-detail">
                <button id="backToListBtn" class="btn back-btn">← Back to all lessons</button>
                <h2>${lesson.title}</h2>
                <div class="lesson-content">${content}</div>
                <hr>
                <p><strong>Need help?</strong> <a href="https://t.me/CyberSecLearning_bot?start=question_${slug}" target="_blank">Ask our Telegram bot about ${lesson.title}</a></p>
            </div>
        `;
        document.getElementById('backToListBtn').addEventListener('click', () => {
            loadLessons();
        });
    } catch (err) {
        console.error(err);
        dynamicArea.innerHTML = '<p>Lesson not found.</p>';
    }
}

// registration
async function handleRegister() {
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('regSuccess').innerText = data.message;
            document.getElementById('regSuccess').classList.remove('hidden');
            document.getElementById('regError').classList.add('hidden');
            setTimeout(() => switchAuthTab('login'), 1500);
        } else {
            document.getElementById('regError').innerText = data.error;
            document.getElementById('regError').classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            token = data.token;
            currentUser = { email: data.email };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            checkAuth();
        } else {
            document.getElementById('loginError').innerText = data.error;
            document.getElementById('loginError').classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    checkAuth();
}

function switchAuthTab(tab) {
    const loginFormDiv = document.getElementById('loginForm');
    const registerFormDiv = document.getElementById('registerForm');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const regTabBtn = document.getElementById('registerTabBtn');
    if (tab === 'login') {
        loginFormDiv.classList.remove('hidden');
        registerFormDiv.classList.add('hidden');
        loginTabBtn.classList.add('active');
        regTabBtn.classList.remove('active');
    } else {
        loginFormDiv.classList.add('hidden');
        registerFormDiv.classList.remove('hidden');
        regTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
    }
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('regError').classList.add('hidden');
    document.getElementById('regSuccess').classList.add('hidden');
}

// Dark mode 
function initTheme() {
    const stored = localStorage.getItem('inno_theme');
    if (stored === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    if (darkModeToggle) {
        darkModeToggle.innerText = document.body.classList.contains('dark') ? 'Light mode' : 'Dark mode';
    }
}
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('inno_theme', isDark ? 'dark' : 'light');
    if (darkModeToggle) {
        darkModeToggle.innerText = isDark ? 'Light mode' : 'Dark mode';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleTheme);
    checkAuth();
    document.getElementById('loginTabBtn').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('registerTabBtn').addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('doLoginBtn').addEventListener('click', handleLogin);
    document.getElementById('doRegisterBtn').addEventListener('click', handleRegister);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
});
