// Auth JavaScript - Login and Registration Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggles
    initPasswordToggles();
    
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Initialize registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
});

// Toggle password visibility
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('ri-eye-line');
                icon.classList.add('ri-eye-off-line');
            } else {
                input.type = 'password';
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
            }
        });
    });
}

// Handle Login Form Submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = e.target.querySelector('.btn-primary');
    
    // Hide any existing error
    errorDiv.classList.remove('show');
    
    // Add loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        // Get stored users from localStorage
        const users = JSON.parse(localStorage.getItem('golfUsers')) || [];
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user
            const sessionData = {
                email: user.email,
                fullname: user.fullname,
                loggedIn: true
            };
            
            if (remember) {
                localStorage.setItem('currentUser', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
            }
            
            // Show success and redirect
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="ri-check-line"></i> <span>Success!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Show error
            submitBtn.classList.remove('loading');
            errorDiv.classList.add('show');
            
            // Shake the form
            e.target.classList.add('shake');
            setTimeout(() => e.target.classList.remove('shake'), 500);
        }
    }, 1500);
}

// Handle Registration Form Submission
function handleRegistration(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const ageGroup = document.getElementById('age-group').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    const subscribe = document.getElementById('subscribe').checked;
    
    const errorDiv = document.getElementById('register-error');
    const errorSpan = errorDiv.querySelector('span');
    const submitBtn = e.target.querySelector('.btn-primary');
    
    // Hide any existing error
    errorDiv.classList.remove('show');
    
    // Validation
    if (!fullname || !email || !phone || !ageGroup || !password || !confirmPassword) {
        showError(errorDiv, errorSpan, 'Please fill in all required fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(errorDiv, errorSpan, 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError(errorDiv, errorSpan, 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(errorDiv, errorSpan, 'Passwords do not match');
        return;
    }
    
    if (!terms) {
        showError(errorDiv, errorSpan, 'You must agree to the Terms & Privacy Policy');
        return;
    }
    
    // Add loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('golfUsers')) || [];
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            submitBtn.classList.remove('loading');
            showError(errorDiv, errorSpan, 'An account with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            fullname,
            email,
            phone,
            ageGroup,
            password,
            subscribe,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('golfUsers', JSON.stringify(users));
        
        // Auto-login the new user
        const sessionData = {
            email: newUser.email,
            fullname: newUser.fullname,
            loggedIn: true
        };
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        // Show success and redirect
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="ri-check-line"></i> <span>Account Created!</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Show error message
function showError(errorDiv, errorSpan, message) {
    errorSpan.textContent = message;
    errorDiv.classList.add('show');
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if user is logged in (can be used on other pages)
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || 
                 JSON.parse(sessionStorage.getItem('currentUser'));
    return user && user.loggedIn;
}

// Get current user info
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || 
           JSON.parse(sessionStorage.getItem('currentUser'));
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

