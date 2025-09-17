// Shared Header Functionality
let currentUser = null;
let authToken = null;

// Make auth variables globally accessible
window.currentUser = currentUser;
window.authToken = authToken;

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
            // Update global references
            window.authToken = authToken;
            window.currentUser = currentUser;
            
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
    // Set up event listeners first
    setupHeaderEventListeners();
    
    // Then set the username
    updateUsernameDisplay();
}

function updateUsernameDisplay() {
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        // Try to get username from currentUser, localStorage, or default to 'User'
        const username = (currentUser && currentUser.username) || 
                        (JSON.parse(localStorage.getItem('currentUser') || '{}').username) || 
                        'User';
        userDisplayName.textContent = username;
        console.log('Username display updated to:', username);
    } else {
        console.log('userDisplayName element not found in DOM');
    }
}

// Also setup event listeners immediately when DOM is ready
function setupEventListenersImmediately() {
    // Use a small delay to ensure the header is loaded
    setTimeout(() => {
        setupHeaderEventListeners();
    }, 100);
}

// Make functions globally available
window.setupEventListenersImmediately = setupEventListenersImmediately;
window.updateUsernameDisplay = updateUsernameDisplay;

// Alternative approach: Use event delegation for more reliable event handling
function setupEventDelegation() {
    // Use event delegation on the document body to catch clicks on logout button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn') {
            console.log('Logout button clicked via event delegation');
            logout();
        }
    });
    console.log('Event delegation setup for logout button');
}

// Setup event delegation immediately
setupEventDelegation();

function setupHeaderEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    console.log('Setting up header event listeners, logoutBtn found:', !!logoutBtn);
    if (logoutBtn) {
        // Remove any existing event listeners to avoid duplicates
        logoutBtn.removeEventListener('click', logout);
        logoutBtn.addEventListener('click', logout);
        console.log('Logout button event listener attached');
    } else {
        console.log('Logout button not found in DOM');
    }
}

function logout() {
    console.log('Logout function called');
    authToken = null;
    currentUser = null;
    // Update global references
    window.authToken = null;
    window.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('Cleared auth data, redirecting to login');
    redirectToLogin();
}

// Make logout function globally available
window.logout = logout;

function redirectToLogin() {
    window.location.href = '/';
}

// Make redirectToLogin function globally available
window.redirectToLogin = redirectToLogin;

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


