// Dashboard functionality - only for authenticated users
let currentUser = null;
let authToken = null;

// DOM elements
const cloneLawyerBtn = document.getElementById('cloneLawyerBtn');

// Load shared header
document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedHeader();
    initializeDashboard();
});

async function loadSharedHeader() {
    try {
        const response = await fetch('/components/header.html');
        const headerHtml = await response.text();
        document.getElementById('header-container').innerHTML = headerHtml;
        
        // Load shared header JavaScript
        const script = document.createElement('script');
        script.src = '/js/shared-header.js';
        document.head.appendChild(script);
        
        // Wait for shared header to initialize
        await new Promise(resolve => {
            script.onload = resolve;
        });
    } catch (error) {
        console.error('Error loading shared header:', error);
    }
}

// Initialize dashboard for authenticated user
function initializeDashboard() {
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
}

// Setup event listeners
function setupEventListeners() {
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
    
    // Knowledge Graph button functionality
    const knowledgeGraphBtn = document.getElementById('knowledgeGraphBtn');
    if (knowledgeGraphBtn) {
        knowledgeGraphBtn.addEventListener('click', () => {
            window.location.href = '/knowledge-graph';
        });
    }
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
    // Dashboard data processing can be added here
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
