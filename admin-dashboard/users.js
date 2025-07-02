// Users Management JavaScript

// State
let currentPage = 1;
const itemsPerPage = 10;
let totalUsers = 0;
let users = [];

// DOM Elements
const usersTableBody = document.getElementById('usersTableBody');
const userSearch = document.getElementById('userSearch');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const addUserModal = document.getElementById('addUserModal');
const addUserForm = document.getElementById('addUserForm');

// Fetch users
async function fetchUsers(page = 1, search = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&search=${search}`);
        const data = await response.json();

        if (data.success) {
            users = data.data.users;
            totalUsers = data.data.total;
            updateUsersTable();
            updatePagination();
        } else {
            console.error('Failed to fetch users:', data.error);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Update users table
function updateUsersTable() {
    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <span class="status-badge ${user.status.toLowerCase()}">
                    ${user.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button onclick="editUser('${user.id}')" class="action-button edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button onclick="deleteUser('${user.id}')" class="action-button delete">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

// Event Listeners
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers(currentPage, userSearch.value);
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchUsers(currentPage, userSearch.value);
    }
});

userSearch.addEventListener('input', debounce((e) => {
    currentPage = 1;
    fetchUsers(currentPage, e.target.value);
}, 300));

// Modal Functions
function showAddUserModal() {
    addUserModal.style.display = 'block';
}

function closeAddUserModal() {
    addUserModal.style.display = 'none';
    addUserForm.reset();
}

// Form Submission
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        role: document.getElementById('userRole').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (data.success) {
            closeAddUserModal();
            fetchUsers(currentPage, userSearch.value);
            showNotification('User added successfully', 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification('Failed to add user', 'error');
    }
});

// User Actions
async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`);
        const data = await response.json();

        if (data.success) {
            // Populate and show edit modal
            // Implementation depends on your UI requirements
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        showNotification('Failed to fetch user details', 'error');
    }
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                fetchUsers(currentPage, userSearch.value);
                showNotification('User deleted successfully', 'success');
            } else {
                showNotification(data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Failed to delete user', 'error');
        }
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type) {
    // Implementation depends on your notification system
    console.log(`${type}: ${message}`);
}

// Initialize
fetchUsers(); 