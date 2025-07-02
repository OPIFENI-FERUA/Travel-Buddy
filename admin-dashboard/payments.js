// Payments Management JavaScript

// State
let currentPage = 1;
const itemsPerPage = 10;
let totalPayments = 0;
let payments = [];
let selectedPayment = null;

// DOM Elements
const paymentsTableBody = document.getElementById('paymentsTableBody');
const paymentSearch = document.getElementById('paymentSearch');
const statusFilter = document.getElementById('statusFilter');
const methodFilter = document.getElementById('methodFilter');
const dateFilter = document.getElementById('dateFilter');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const paymentDetailsModal = document.getElementById('paymentDetailsModal');
const paymentDetails = document.getElementById('paymentDetails');
const updateStatusButton = document.getElementById('updateStatusButton');

// Summary elements
const totalRevenueElement = document.getElementById('totalRevenue');
const pendingPaymentsElement = document.getElementById('pendingPayments');
const todayRevenueElement = document.getElementById('todayRevenue');

// Fetch payments
async function fetchPayments(page = 1, filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            ...filters
        });

        const response = await fetch(`${API_BASE_URL}/admin/payments?${queryParams}`);
        const data = await response.json();

        if (data.success) {
            payments = data.data.payments;
            totalPayments = data.data.total;
            updatePaymentsTable();
            updatePagination();
            updateSummary(data.data.summary);
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error fetching payments:', error);
        showNotification('Failed to fetch payments', 'error');
    }
}

// Update payments table
function updatePaymentsTable() {
    paymentsTableBody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.id}</td>
            <td>${payment.booking_id}</td>
            <td>${payment.customer_name}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${formatPaymentMethod(payment.method)}</td>
            <td>
                <span class="status-badge ${payment.status.toLowerCase()}">
                    ${payment.status}
                </span>
            </td>
            <td>${formatDate(payment.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewPaymentDetails('${payment.id}')" class="action-button view">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button onclick="updatePaymentStatus('${payment.id}')" class="action-button edit">
                        <span class="material-icons">edit</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update summary information
function updateSummary(summary) {
    totalRevenueElement.textContent = `$${summary.total_revenue.toFixed(2)}`;
    pendingPaymentsElement.textContent = `$${summary.pending_payments.toFixed(2)}`;
    todayRevenueElement.textContent = `$${summary.today_revenue.toFixed(2)}`;
}

// View payment details
async function viewPaymentDetails(paymentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}`);
        const data = await response.json();

        if (data.success) {
            selectedPayment = data.data;
            showPaymentDetails();
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error fetching payment details:', error);
        showNotification('Failed to fetch payment details', 'error');
    }
}

// Show payment details modal
function showPaymentDetails() {
    paymentDetails.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <label>Payment ID</label>
                <p>${selectedPayment.id}</p>
            </div>
            <div class="detail-item">
                <label>Booking ID</label>
                <p>${selectedPayment.booking_id}</p>
            </div>
            <div class="detail-item">
                <label>Customer</label>
                <p>${selectedPayment.customer_name}</p>
            </div>
            <div class="detail-item">
                <label>Amount</label>
                <p>$${selectedPayment.amount.toFixed(2)}</p>
            </div>
            <div class="detail-item">
                <label>Payment Method</label>
                <p>${formatPaymentMethod(selectedPayment.method)}</p>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <p>
                    <span class="status-badge ${selectedPayment.status.toLowerCase()}">
                        ${selectedPayment.status}
                    </span>
                </p>
            </div>
            <div class="detail-item">
                <label>Transaction ID</label>
                <p>${selectedPayment.transaction_id || 'N/A'}</p>
            </div>
            <div class="detail-item">
                <label>Created At</label>
                <p>${formatDate(selectedPayment.created_at)}</p>
            </div>
        </div>
    `;

    paymentDetailsModal.style.display = 'block';
}

// Close payment details modal
function closePaymentDetailsModal() {
    paymentDetailsModal.style.display = 'none';
    selectedPayment = null;
}

// Update payment status
async function updatePaymentStatus(paymentId) {
    const newStatus = prompt('Enter new status (pending/completed/failed):');
    
    if (!newStatus) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            fetchPayments(currentPage, getFilters());
            showNotification('Payment status updated successfully', 'success');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        showNotification('Failed to update payment status', 'error');
    }
}

// Get current filters
function getFilters() {
    return {
        search: paymentSearch.value,
        status: statusFilter.value,
        method: methodFilter.value,
        date: dateFilter.value
    };
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(totalPayments / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

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

function formatPaymentMethod(method) {
    return method.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

// Event Listeners
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPayments(currentPage, getFilters());
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(totalPayments / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchPayments(currentPage, getFilters());
    }
});

paymentSearch.addEventListener('input', debounce((e) => {
    currentPage = 1;
    fetchPayments(currentPage, getFilters());
}, 300));

statusFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchPayments(currentPage, getFilters());
});

methodFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchPayments(currentPage, getFilters());
});

dateFilter.addEventListener('change', () => {
    currentPage = 1;
    fetchPayments(currentPage, getFilters());
});

// Initialize
fetchPayments(); 