// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';
const ENDPOINTS = {
    stats: '/admin/stats',
    recentActivity: '/admin/recent-activity'
};

// DOM Elements
const statsElements = {
    totalUsers: document.getElementById('totalUsers'),
    totalBookings: document.getElementById('totalBookings'),
    totalRevenue: document.getElementById('totalRevenue'),
    pendingBookings: document.getElementById('pendingBookings')
};

const activityList = document.getElementById('activityList');

// Fetch dashboard statistics
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.stats}`);
        const data = await response.json();

        if (data.success) {
            updateStats(data.data);
        } else {
            console.error('Failed to fetch stats:', data.error);
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Update statistics in the UI
function updateStats(stats) {
    statsElements.totalUsers.textContent = stats.totalUsers;
    statsElements.totalBookings.textContent = stats.totalBookings;
    statsElements.totalRevenue.textContent = `$${stats.totalRevenue.toFixed(2)}`;
    statsElements.pendingBookings.textContent = stats.pendingBookings;
}

// Fetch recent activity
async function fetchRecentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.recentActivity}`);
        const data = await response.json();

        if (data.success) {
            updateActivityList(data.data);
        } else {
            console.error('Failed to fetch recent activity:', data.error);
        }
    } catch (error) {
        console.error('Error fetching recent activity:', error);
    }
}

// Update activity list in the UI
function updateActivityList(activities) {
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon" style="background-color: ${getActivityColor(activity.type)}">
                <span class="material-icons">${getActivityIcon(activity.type)}</span>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">
                ${formatTime(activity.timestamp)}
            </div>
        </div>
    `).join('');
}

// Helper function to get activity color based on type
function getActivityColor(type) {
    const colors = {
        user: '#3737ff',
        booking: '#FF6B00',
        payment: '#4CAF50',
        system: '#8e44ad'
    };
    return colors[type] || '#666';
}

// Helper function to get activity icon based on type
function getActivityIcon(type) {
    const icons = {
        user: 'person',
        booking: 'local_shipping',
        payment: 'payments',
        system: 'settings'
    };
    return icons[type] || 'info';
}

// Helper function to format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Otherwise show date
    return date.toLocaleDateString();
}

// Navigation handling
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href').substring(1);
        
        // Remove active class from all links
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.currentTarget.parentElement.classList.add('active');
        
        // Update header title
        document.querySelector('.header-content h1').textContent = 
            target.charAt(0).toUpperCase() + target.slice(1);
    });
});

// Initialize dashboard
async function initDashboard() {
    await Promise.all([
        fetchStats(),
        fetchRecentActivity()
    ]);
}

// Refresh data every 5 minutes
setInterval(initDashboard, 5 * 60 * 1000);

// Initial load
initDashboard(); 