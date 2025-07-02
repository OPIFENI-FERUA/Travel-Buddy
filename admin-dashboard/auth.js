// Authentication Management JavaScript

// Constants
const API_BASE_URL = 'http://localhost:3000/api'; // Base URL for API endpoints
const TOKEN_KEY = 'admin_token'; // Key for storing JWT token in localStorage
const USE_MOCK_DATA = true; // Flag to use mock data for testing

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const errorMessage = document.getElementById('errorMessage');

/**
 * Simulates API delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handles the login form submission
 * @param {Event} e - The form submission event
 */
async function handleLogin(e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    try {
        // Show loading state
        setLoading(true);

        // Simulate API delay
        await delay(1000);

        if (USE_MOCK_DATA) {
            // Use mock data for testing
            const admin = window.MOCK_DATA.TEST_ADMINS.find(
                a => a.email === email && a.password === password
            );

            if (admin) {
                // Simulate successful login
                localStorage.setItem(TOKEN_KEY, window.MOCK_DATA.MOCK_LOGIN_RESPONSE.token);
                window.location.href = 'index.html';
            } else {
                // Simulate failed login
                showError(window.MOCK_DATA.MOCK_LOGIN_ERROR.error);
            }
        } else {
            // Real API call
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem(TOKEN_KEY, data.token);
                window.location.href = 'index.html';
            } else {
                showError(data.error || 'Login failed');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login');
    } finally {
        setLoading(false);
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_KEY);
    
    // Redirect to login page
    window.location.href = 'login.html';
}

/**
 * Checks if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Gets the authentication token
 * @returns {string|null} The authentication token or null if not found
 */
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Adds authentication header to fetch requests
 * @param {Object} options - Fetch options
 * @returns {Object} Modified fetch options with auth header
 */
function addAuthHeader(options = {}) {
    const token = getAuthToken();
    if (!token) return options;

    return {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };
}

/**
 * Toggles password visibility
 */
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    passwordToggle.textContent = type === 'password' ? 'visibility' : 'visibility_off';
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Sets loading state
 * @param {boolean} isLoading - Whether the form is loading
 */
function setLoading(isLoading) {
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading ? 
        '<span class="material-icons rotating">refresh</span> Loading...' : 
        'Login';
}

/**
 * Checks authentication on protected pages
 */
function checkAuth() {
    // Skip check on login page
    if (window.location.pathname.includes('login.html')) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (passwordToggle) {
    passwordToggle.addEventListener('click', togglePasswordVisibility);
}

// Check authentication on page load
checkAuth();

// Export functions for use in other files
window.auth = {
    handleLogout,
    isAuthenticated,
    getAuthToken,
    addAuthHeader
}; 