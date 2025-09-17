// Vikk Intelligence page functionality
// currentUser and authToken are now managed by shared-header.js

// Load shared header
document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedHeader();
    initializePage();
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
        
        // Setup event listeners immediately after header loads
        if (window.setupEventListenersImmediately) {
            window.setupEventListenersImmediately();
        }
        
        // Update username display after header is loaded
        if (window.updateUsernameDisplay) {
            window.updateUsernameDisplay();
        }
        
        // Configure header for vikk intelligence page
        setHeaderTitle('Vikk Intelligence', 'fas fa-brain');
        addBackButton('/dashboard');
    } catch (error) {
        console.error('Error loading shared header:', error);
    }
}

// Initialize page for authenticated user
function initializePage() {
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Add any page-specific event listeners here
    console.log('Vikk Intelligence page initialized');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
