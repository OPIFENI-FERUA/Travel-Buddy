// Dummy Data for Testing

// Test Admin Credentials
const TEST_ADMINS = [
    {
        id: 1,
        email: 'admin@buddy.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'super_admin'
    },
    {
        id: 2,
        email: 'manager@buddy.com',
        password: 'manager123',
        name: 'Manager User',
        role: 'manager'
    }
];

// Mock API Response for Login
const MOCK_LOGIN_RESPONSE = {
    success: true,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@buddy.com',
        role: 'super_admin'
    }
};

// Mock API Response for Failed Login
const MOCK_LOGIN_ERROR = {
    success: false,
    error: 'Invalid email or password'
};

// Mock API Response for User Data
const MOCK_USER_DATA = {
    success: true,
    data: {
        id: 1,
        name: 'Admin User',
        email: 'admin@buddy.com',
        role: 'super_admin',
        lastLogin: '2024-03-20T10:00:00Z',
        permissions: [
            'manage_users',
            'manage_bookings',
            'manage_payments',
            'view_reports'
        ]
    }
};

// Mock API Response for Stats
const MOCK_STATS = {
    success: true,
    data: {
        totalUsers: 150,
        totalBookings: 75,
        totalRevenue: 15000,
        pendingPayments: 2500,
        todayRevenue: 1200,
        activeUsers: 45
    }
};

// Mock API Response for Recent Activity
const MOCK_RECENT_ACTIVITY = {
    success: true,
    data: [
        {
            id: 1,
            type: 'booking',
            description: 'New booking created',
            timestamp: '2024-03-20T09:30:00Z',
            user: 'John Doe'
        },
        {
            id: 2,
            type: 'payment',
            description: 'Payment received',
            timestamp: '2024-03-20T09:15:00Z',
            amount: 150
        },
        {
            id: 3,
            type: 'user',
            description: 'New user registered',
            timestamp: '2024-03-20T09:00:00Z',
            user: 'Jane Smith'
        }
    ]
};

// Mock API Response for Error
const MOCK_ERROR = {
    success: false,
    error: 'Something went wrong'
};

// Mock API Response for Network Error
const MOCK_NETWORK_ERROR = {
    success: false,
    error: 'Network error occurred'
};

// Mock API Response for Unauthorized
const MOCK_UNAUTHORIZED = {
    success: false,
    error: 'Unauthorized access'
};

// Mock API Response for Token Expired
const MOCK_TOKEN_EXPIRED = {
    success: false,
    error: 'Token expired'
};

// Export all mock data
window.MOCK_DATA = {
    TEST_ADMINS,
    MOCK_LOGIN_RESPONSE,
    MOCK_LOGIN_ERROR,
    MOCK_USER_DATA,
    MOCK_STATS,
    MOCK_RECENT_ACTIVITY,
    MOCK_ERROR,
    MOCK_NETWORK_ERROR,
    MOCK_UNAUTHORIZED,
    MOCK_TOKEN_EXPIRED,
    MOCK_STATS: {
        data: {
            totalUsers: 1234,
            totalBookings: 567,
            totalRevenue: 89432,
            activeUsers: 789
        }
    },
    MOCK_RECENT_ACTIVITY: {
        data: [
            {
                type: 'user',
                description: 'New user registration',
                details: 'John Doe registered as a new user',
                timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
            },
            {
                type: 'booking',
                description: 'New booking created',
                details: 'Booking #1234 was created',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
            },
            {
                type: 'payment',
                description: 'Payment received',
                details: 'Payment of $500 received for booking #1234',
                timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
            }
        ]
    }
}; 