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
        // Don't redirect here - let checkPageAccess handle it
        return;
    }
    
    verifyToken(savedToken, savedUser);
}

function checkPageAccess() {
    const currentPath = window.location.pathname;
    const hasToken = localStorage.getItem('authToken');
    
    // For home page, don't redirect - just show appropriate navigation
    if (currentPath === '/' || currentPath === '/index.html') {
        if (hasToken) {
            // User is logged in, show user menu
            showUserMenu();
        } else {
            // User is not logged in, show main navigation
            hideUserMenu();
        }
        return;
    }
    
    // For login page, show appropriate navigation
    if (currentPath === '/login') {
        if (hasToken) {
            // User is already logged in, redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            // User is not logged in, show main navigation
            hideUserMenu();
        }
        return;
    }
    
    // For aws-meta page, show appropriate navigation (public page)
    if (currentPath === '/aws-meta') {
        if (hasToken) {
            // User is logged in, show user menu
            showUserMenu();
        } else {
            // User is not logged in, show main navigation
            hideUserMenu();
        }
        return;
    }
    
    // For other pages, require authentication
    if (!hasToken) {
        redirectToLogin();
        return;
    }
    
    // For protected pages, show user menu if logged in
    showUserMenu();
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
    
    // Then set the username and show user menu
    updateUsernameDisplay();
    
    // Show user menu for authenticated users
    showUserMenu();
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

function showUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const mainNav = document.getElementById('mainNav');
    
    if (userMenu && mainNav) {
        // Show user menu and hide main nav when logged in
        userMenu.style.display = 'flex';
        mainNav.style.display = 'none';
    }
}

function hideUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const mainNav = document.getElementById('mainNav');
    
    if (userMenu && mainNav) {
        // Hide user menu and show main nav when not logged in
        userMenu.style.display = 'none';
        mainNav.style.display = 'flex';
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

// Use event delegation for reliable event handling
function setupEventDelegation() {
    // Use event delegation on the document body to catch clicks on logout button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn') {
            logout();
        }
    });
}

// Setup event delegation immediately
setupEventDelegation();

function setupHeaderEventListeners() {
    // Event listeners are handled by delegation, no need for direct listeners
}

function logout() {
    authToken = null;
    currentUser = null;
    // Update global references
    window.authToken = null;
    window.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Hide user menu and show main navigation
    hideUserMenu();
    
    window.location.href = '/';
}

// Make logout function globally available
window.logout = logout;

function redirectToLogin() {
    window.location.href = '/login';
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
    // Use a small delay to ensure all elements are loaded
    setTimeout(() => {
        // Always call checkPageAccess first to set the correct navigation state
        checkPageAccess();
        
        // Only check authentication for pages that require it
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '/login' && currentPath !== '/aws-meta') {
            checkAuthentication();
        }
    }, 100);
});


