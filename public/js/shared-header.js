// Shared Header Functionality
let currentUser = null;
let authToken = null;

// Common authentication functions
function checkAuthentication() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (!savedToken || !savedUser) {
        redirectToLogin();
        return;
    }
    
    verifyToken(savedToken, savedUser);
}

function checkPageAccess() {
    if (!localStorage.getItem('authToken')) {
        redirectToLogin();
        return;
    }
}

async function verifyToken(token, userData) {
    try {
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            authToken = token;
            currentUser = JSON.parse(userData);
            initializeHeader();
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            redirectToLogin();
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        redirectToLogin();
    }
}

function initializeHeader() {
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName && currentUser) {
        userDisplayName.textContent = currentUser.username;
    }
    
    setupHeaderEventListeners();
}

function setupHeaderEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    redirectToLogin();
}

function redirectToLogin() {
    window.location.href = '/';
}

function setHeaderTitle(title, icon = 'fas fa-chart-line') {
    const headerTitle = document.getElementById('headerTitle');
    const logoIcon = document.querySelector('.logo i');
    
    if (headerTitle) {
        headerTitle.textContent = title;
    }
    
    if (logoIcon) {
        logoIcon.className = icon;
    }
}

function addBackButton(backUrl = '/dashboard') {
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft && !document.getElementById('backBtn')) {
        const backBtn = document.createElement('button');
        backBtn.id = 'backBtn';
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i><span>Back to Dashboard</span>';
        
        backBtn.addEventListener('click', () => {
            window.location.href = backUrl;
        });
        
        headerLeft.insertBefore(backBtn, headerLeft.firstChild);
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    checkPageAccess();
    checkAuthentication();
});

