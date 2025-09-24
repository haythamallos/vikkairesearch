// Whitepaper password protection functionality
document.addEventListener('DOMContentLoaded', () => {
    const whitepaperBtn = document.getElementById('whitepaperBtn');
    const passwordModal = document.getElementById('passwordModal');
    const closeModal = document.getElementById('closeModal');
    const cancelPassword = document.getElementById('cancelPassword');
    const submitPassword = document.getElementById('submitPassword');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hardcoded password
    const WHITEPAPER_PASSWORD = 'vikk2025';
    
    // Whitepaper URL
    const WHITEPAPER_URL = 'https://1drv.ms/b/c/db12b5aa8dc6c21a/EVRiyxhUVytCiRjqDuHaNikB-2-L09aWaMMy6GiZq0K5xg?e=haMqEL'
    // Open modal when whitepaper button is clicked
    whitepaperBtn.addEventListener('click', () => {
        passwordModal.style.display = 'block';
        passwordInput.focus();
        clearError();
    });
    
    // Close modal when X is clicked
    closeModal.addEventListener('click', () => {
        closeModalAndReset();
    });
    
    // Close modal when cancel is clicked
    cancelPassword.addEventListener('click', () => {
        closeModalAndReset();
    });
    
    // Close modal when clicking outside of it
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            closeModalAndReset();
        }
    });
    
    // Handle password submission
    submitPassword.addEventListener('click', () => {
        handlePasswordSubmit();
    });
    
    // Handle Enter key in password input
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handlePasswordSubmit();
        }
    });
    
    // Handle Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && passwordModal.style.display === 'block') {
            closeModalAndReset();
        }
    });
    
    function handlePasswordSubmit() {
        const enteredPassword = passwordInput.value.trim();
        
        if (enteredPassword === '') {
            showError('Please enter a password');
            return;
        }
        
        if (enteredPassword === WHITEPAPER_PASSWORD) {
            // Password is correct, open whitepaper in new tab
            window.open(WHITEPAPER_URL, '_blank', 'noopener,noreferrer');
            closeModalAndReset();
        } else {
            // Password is incorrect, show error and redirect to homepage
            showError('Incorrect password. Redirecting to homepage...');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    }
    
    function closeModalAndReset() {
        passwordModal.style.display = 'none';
        passwordInput.value = '';
        clearError();
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
});
