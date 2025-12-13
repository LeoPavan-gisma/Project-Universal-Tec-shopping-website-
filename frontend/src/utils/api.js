const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
    const headers = options.headers || {};
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');

    // Add API Key to headers (REQUIRED for all requests)
    if (apiKey) headers['X-API-Key'] = apiKey;
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!headers['Content-Type'])
        headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    return res.json();
}

export const login = async (credentials) => {
    try {
        return await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    } catch (err) {
        // Backend unavailable — return a mock token/user for local dev
        console.log('Login fallback to mock (backend unreachable)');
        return {
            token: 'mock-token',
            user: {
                name: credentials.email.split('@')[0] || 'Demo User',
                email: credentials.email,
                isAdmin: credentials.email === 'admin@dev'
            }
        };
    }
};

export const register = async (userData) => {
    try {
        return await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    } catch (err) {
        console.log('Register fallback to mock (backend unreachable)');
        return { message: 'Registered (mock)', user: { ...userData } };
    }
};
export const getProducts = () => request('/products');
export const getProductById = (id) => request(`/products/${id}`);

export const createCheckout = (items) =>
    request('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ items })
    });

// Admin / product management
export const createProduct = (product, token) => {
    const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : undefined;
    return request('/products', { method: 'POST', body: JSON.stringify(product), headers });
};

export const updateProduct = (id, product, token) => {
    const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : undefined;
    return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product), headers });
};

export const deleteProduct = (id, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return request(`/products/${id}`, { method: 'DELETE', headers });
};

// Orders management
export const getOrders = async (token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return await request('/orders', { headers });
    } catch (error) {
        console.log('Failed to fetch orders, returning mock data');
        return [];
    }
};

// Users management
export const getUsers = async (token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return await request('/auth/users', { headers });
    } catch (error) {
        console.log('Failed to fetch users, returning mock data');
        return [];
    }
};
