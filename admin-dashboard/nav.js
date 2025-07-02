// Navigation Component

function createNavigation(currentPage) {
    const nav = `
        <nav class="sidebar">
            <div class="logo">
                <img src="../assets/images/logo.png" alt="Buddy Logo">
                <h2>Buddy Admin</h2>
            </div>
            <ul class="nav-links">
                <li class="${currentPage === 'dashboard' ? 'active' : ''}">
                    <a href="index.html">
                        <span class="material-icons">dashboard</span>
                        Dashboard
                    </a>
                </li>
                <li class="${currentPage === 'users' ? 'active' : ''}">
                    <a href="users.html">
                        <span class="material-icons">people</span>
                        Users
                    </a>
                </li>
                <li class="${currentPage === 'bookings' ? 'active' : ''}">
                    <a href="bookings.html">
                        <span class="material-icons">local_shipping</span>
                        Bookings
                    </a>
                </li>
                <li class="${currentPage === 'payments' ? 'active' : ''}">
                    <a href="payments.html">
                        <span class="material-icons">payments</span>
                        Payments
                    </a>
                </li>
                <li class="${currentPage === 'profile' ? 'active' : ''}">
                    <a href="profile.html">
                        <span class="material-icons">person</span>
                        Profile
                    </a>
                </li>
                <li class="${currentPage === 'settings' ? 'active' : ''}">
                    <a href="settings.html">
                        <span class="material-icons">settings</span>
                        Settings
                    </a>
                </li>
            </ul>
        </nav>
    `;

    // Insert navigation into the container
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterbegin', nav);
    }
}

// Create header component
function createHeader(title) {
    const header = `
        <header>
            <div class="header-content">
                <h1>${title}</h1>
                <div class="user-info">
                    <span class="material-icons">notifications</span>
                    <div class="user-profile">
                        <img src="../assets/images/profile.png" alt="Admin Profile">
                        <span>Admin</span>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Insert header into main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertAdjacentHTML('afterbegin', header);
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Create navigation
    createNavigation(currentPage);
    
    // Create header with page title
    const pageTitle = document.title.split(' - ')[0];
    createHeader(pageTitle);
}); 