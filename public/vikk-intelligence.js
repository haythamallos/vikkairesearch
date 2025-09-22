// Vikk Intelligence page functionality
// currentUser and authToken are now managed by shared-header.js

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Configure header for vikk intelligence page
    if (window.setHeaderTitle) {
        setHeaderTitle('Vikk Intelligence', 'fas fa-brain');
    }
    if (window.addBackButton) {
        addBackButton('/dashboard');
    }
    initializePage();
});

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
