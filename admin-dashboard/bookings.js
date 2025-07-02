// Bookings Management JavaScript

// State
let currentPage = 1;
const itemsPerPage = 10;
let totalBookings = 0;
let bookings = [];
let selectedBooking = null;

// DOM Elements
const bookingsTableBody = document.getElementById('bookingsTableBody');
const bookingSearch = document.getElementById('bookingSearch');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const bookingDetailsModal = document.getElementById('bookingDetailsModal');
const bookingDetails = document.getElementById('bookingDetails');
const updateStatusButton = document.getElementById('updateStatusButton');

// Fetch bookings
async function fetchBookings(page = 1, filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            ...filters
        });

        const response = await fetch(`${API_BASE_URL}/admin/bookings?${queryParams}`);
        const data = await response.json();

        if (data.success) {
            bookings = data.data.bookings;
            totalBookings = data.data.total;
            updateBookingsTable();
            updatePagination();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
        showNotification('Failed to fetch bookings', 'error');
    }
}

// Update bookings table
function updateBookingsTable() {
    bookingsTableBody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.customer_name}</td>
            <td>${booking.pickup_location}</td>
            <td>${booking.delivery_location}</td>
            <td>$${booking.amount.toFixed(2)}</td>
            <td>
                <span class="status-badge ${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </td>
            <td>${formatDate(booking.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewBookingDetails('${booking.id}')" class="action-button view">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button onclick="updateBookingStatus('${booking.id}')" class="action-button edit">
                        <span class="material-icons">edit</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View booking details
async function viewBookingDetails(bookingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`);
        const data = await response.json();

        if (data.success) {
            selectedBooking = data.data;
            showBookingDetails();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        showNotification('Failed to fetch booking details', 'error');
    }
}

// Show booking details modal
function showBookingDetails() {
    bookingDetails.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <label>Booking ID</label>
                <p>${selectedBooking.id}</p>
            </div>
            <div class="detail-item">
                <label>Customer</label>
                <p>${selectedBooking.customer_name}</p>
            </div>
            <div class="detail-item">
                <label>Phone</label>
                <p>${selectedBooking.customer_phone}</p>
            </div>
            <div class="detail-item">
                <label>Pickup Location</label>
                <p>${selectedBooking.pickup_location}</p>
            </div>
            <div class="detail-item">
                <label>Delivery Location</label>
                <p>${selectedBooking.delivery_location}</p>
            </div>
            <div class="detail-item">
                <label>Amount</label>
                <p>$${selectedBooking.amount.toFixed(2)}</p>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <p>
                    <span class="status-badge ${selectedBooking.status.toLowerCase()}">
                        ${selectedBooking.status}
                    </span>
                </p>
            </div>
            <div class="detail-item">
                <label>Created At</label>
                <p>${formatDate(selectedBooking.created_at)}</p>
            </div>
        </div>
    `;

    bookingDetailsModal.style.display = 'block';
}

// Close booking details modal
function closeBookingDetailsModal() {
    bookingDetailsModal.style.display = 'none';
    selectedBooking = null;
}

// Update booking status
async function updateBookingStatus(bookingId) {
    const newStatus = prompt('Enter new status (pending/in_progress/completed/cancelled):');
    
    if (!newStatus) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            fetchBookings(currentPage, getFilters());
            showNotification('Booking status updated successfully', 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showNotification('Failed to update booking status', 'error');
    }
}

// Get current filters
function getFilters() {
    return {
        search: bookingSearch.value,
        status: statusFilter.value,
        date: dateFilter.value
    };
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(totalBookings / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

// Event Listeners
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBookings(currentPage, getFilters());
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(totalBookings / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchBookings(currentPage, getFilters());
    }
});

bookingSearch.addEventListener('input', debounce((e) => {
    currentPage = 1;
    fetchBookings(currentPage, getFilters());
}, 300));

statusFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchBookings(currentPage, getFilters());
});

dateFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchBookings(currentPage, getFilters());
});

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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

// Initialize
fetchBookings(); 