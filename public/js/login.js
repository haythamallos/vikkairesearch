// Login functionality for login page
// DOM elements
const loginForm = document.getElementById('loginForm');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/dashboard';
    }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Redirect to dashboard
            redirectToDashboard();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Network error. Please try again.');
    }
});

// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = '/dashboard';
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
