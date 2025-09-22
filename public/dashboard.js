// Dashboard functionality - only for authenticated users
// currentUser and authToken are now managed by shared-header.js

// DOM elements

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

// Initialize dashboard for authenticated user
function initializeDashboard() {
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
}

// Setup event listeners
function setupEventListeners() {
    // Code Clone button functionality
    const codeCloneBtn = document.getElementById('codeCloneBtn');
    if (codeCloneBtn) {
        codeCloneBtn.addEventListener('click', () => {
            window.location.href = '/clone';
        });
    }
    
    // Vikk Intelligence button functionality
    const vikkIntelligenceBtn = document.getElementById('vikkIntelligenceBtn');
    console.log('Vikk Intelligence button found:', !!vikkIntelligenceBtn);
    if (vikkIntelligenceBtn) {
        vikkIntelligenceBtn.addEventListener('click', () => {
            console.log('Vikk Intelligence button clicked, navigating to /vikk-intelligence');
            window.location.href = '/vikk-intelligence';
        });
        console.log('Vikk Intelligence button event listener attached');
    } else {
        console.log('Vikk Intelligence button not found in DOM');
    }
    
    // Knowledge Graph button functionality - Hidden for now
    /*
    const knowledgeGraphBtn = document.getElementById('knowledgeGraphBtn');
    if (knowledgeGraphBtn) {
        knowledgeGraphBtn.addEventListener('click', () => {
            window.location.href = '/knowledge-graph';
        });
    }
    */
}

// Load dashboard data
async function loadDashboardData() {
    // Get auth variables from shared-header.js
    const authToken = window.authToken || localStorage.getItem('authToken');
    const currentUser = window.currentUser || JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Check if we have authentication
    if (!authToken || !currentUser) {
        console.log('No authentication found, redirecting to login');
        if (window.redirectToLogin) {
            window.redirectToLogin();
        } else {
            window.location.href = '/';
        }
        return;
    }
    
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
                if (window.logout) {
                    window.logout();
                } else {
                    // Fallback if shared header not loaded yet
                    authToken = null;
                    currentUser = null;
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('currentUser');
                    window.location.href = '/';
                }
            } else {
                showError('Failed to load dashboard data');
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard with data
function updateDashboard(data) {
    // Dashboard data processing can be added here
}


// Logout and redirect functions are now provided by shared-header.js

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
    const authToken = window.authToken || localStorage.getItem('authToken');
    const currentUser = window.currentUser || JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (authToken && currentUser) {
        loadDashboardData();
    }
}, 30000);
