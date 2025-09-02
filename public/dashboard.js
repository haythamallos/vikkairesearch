// Dashboard functionality - only for authenticated users
let currentUser = null;
let authToken = null;

// Immediate authentication check (runs before DOM is ready)
(function() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // No token, redirect to login
        window.location.href = '/';
        return;
    }
})();

// DOM elements
const userDisplayName = document.getElementById('userDisplayName');
const logoutBtn = document.getElementById('logoutBtn');
const cloneLawyerBtn = document.getElementById('cloneLawyerBtn');
const activityList = document.getElementById('activityList');

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // First check if we have basic access to this page
    checkPageAccess();
    // Then verify the token is valid
    checkAuthentication();
});

// Check if user is authenticated
function checkAuthentication() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (!savedToken || !savedUser) {
        // No authentication, redirect to login
        redirectToLogin();
        return;
    }
    
    // Verify token is still valid
    verifyToken(savedToken, savedUser);
}

// Check if we're on a protected page without proper authentication
function checkPageAccess() {
    // If we're on a protected page but don't have auth, redirect immediately
    if (!localStorage.getItem('authToken')) {
        redirectToLogin();
        return;
    }
}

// Verify JWT token
async function verifyToken(token, userData) {
    try {
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            // Token is valid, set user data
            authToken = token;
            currentUser = JSON.parse(userData);
            initializeDashboard();
        } else {
            // Token is invalid, redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            redirectToLogin();
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        redirectToLogin();
    }
}

// Initialize dashboard for authenticated user
function initializeDashboard() {
    // Set user display name
    userDisplayName.textContent = currentUser.username;
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
}

// Setup event listeners
function setupEventListeners() {
    // Logout functionality
    logoutBtn.addEventListener('click', logout);
    
    // Clone Lawyer button functionality
    cloneLawyerBtn.addEventListener('click', () => {
        window.location.href = '/sample-lawyer-page';
    });
    
    // Code Clone button functionality
    const codeCloneBtn = document.getElementById('codeCloneBtn');
    if (codeCloneBtn) {
        codeCloneBtn.addEventListener('click', () => {
            window.location.href = '/clone';
        });
    }
}

// Logout functionality
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    redirectToLogin();
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = '/';
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            updateDashboard(data);
        } else {
            if (response.status === 401 || response.status === 403) {
                // Token expired or invalid
                logout();
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard with data
function updateDashboard(data) {
    // Update activity list
    updateActivityList(data.recentActivity);
}

// Update activity list
function updateActivityList(activities) {
    if (!activities || !Array.isArray(activities)) {
        activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = getActivityIcon(activity.action);
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-action">${activity.action}</div>
                <div class="activity-meta">
                    <span>${activity.time}</span>
                    <span>by ${activity.user}</span>
                </div>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Get activity icon based on action
function getActivityIcon(action) {
    if (action.includes('user')) return 'fa-user';
    if (action.includes('payment')) return 'fa-credit-card';
    if (action.includes('ticket')) return 'fa-ticket-alt';
    if (action.includes('backup')) return 'fa-database';
    return 'fa-info-circle';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Auto-refresh dashboard data every 30 seconds
setInterval(() => {
    if (authToken && currentUser) {
        loadDashboardData();
    }
}, 30000);
