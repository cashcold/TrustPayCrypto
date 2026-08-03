// API client service for TrustPay Crypto Express backend

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api'
).replace(/\/$/, '');

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      console.error(
        `API Error ${res.status}:`,
        await res.text()
      );

      return {
        success: false,
        message: `Server error: ${res.status}`
      };
    }

    return await res.json();

  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);

    return {
      success: false,
      message: 'Network error or server unavailable'
    };
  }
}

export const api = {
  // Currencies
  getCurrencies: () => request('/currencies'),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getUserProfile: (userId) => request(`/auth/me/${userId}`),

  // Rates
  getRates: () => request('/rates'),
  updateRate: (coin, usdPrice) => request('/rates', { method: 'PUT', body: JSON.stringify({ coin, usdPrice }) }),

  // Orders
  getOrders: (userId) => request(`/orders${userId ? `?userId=${userId}` : ''}`),
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  updateOrderStatus: (id, status, adminNotes, txHash) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, adminNotes, txHash }) }),

  // Swaps
  getSwaps: (userId) => request(`/swaps${userId ? `?userId=${userId}` : ''}`),
  createSwap: (swapData) => request('/swaps', { method: 'POST', body: JSON.stringify(swapData) }),
  updateSwapStatus: (id, status, adminNotes, txHashTo) => request(`/swaps/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, adminNotes, txHashTo }) }),

  // Wallets & Payment Methods
  getWallets: () => request('/wallets'),
  updatePlatformWallet: (coin, address) => request('/wallets', { method: 'PUT', body: JSON.stringify({ coin, address }) }),

  // Referrals
  getReferralStats: (userId) => request(`/referral/stats/${userId}`),

  // Notifications
  getNotifications: (userId) => request(`/notifications/${userId}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

  // Support Tickets
  getTickets: (userId) => request(`/support/tickets${userId ? `?userId=${userId}` : ''}`),
  createTicket: (ticketData) => request('/support/tickets', { method: 'POST', body: JSON.stringify(ticketData) }),
  replyTicket: (id, sender, message) => request(`/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ sender, message }) }),

  // Contact
  sendContactMessage: (msgData) => request('/contact', { method: 'POST', body: JSON.stringify(msgData) }),

  // Admin
  getAdminOverview: () => request('/admin/overview'),
  updateUserStatus: (userId, status, kycStatus) => request(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status, kycStatus }) }),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' }),

  // News
  getNews: () => request('/news'),

  // Schemas
  getSchemas: () => request('/schemas')
};
