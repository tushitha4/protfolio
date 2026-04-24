// Backend API Client
class ApiClient {
    constructor() {
        this.baseUrl = window.location.origin === 'http://localhost:8000' 
            ? 'http://localhost:3000/api' 
            : '/api';
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth methods
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        this.token = data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    // Dashboard methods
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    // Live Data methods
    async getWeather() {
        return this.request('/weather');
    }

    async getCrypto() {
        return this.request('/crypto');
    }

    async getStocks() {
        return this.request('/stocks');
    }

    async getNews() {
        return this.request('/news');
    }

    async getAnalytics(range = '24h') {
        return this.request(`/analytics?range=${range}`);
    }

    // CMS methods
    async getContent() {
        return this.request('/content');
    }

    async createContent(content) {
        return this.request('/content', {
            method: 'POST',
            body: JSON.stringify(content)
        });
    }

    async updateContent(id, content) {
        return this.request(`/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify(content)
        });
    }

    async deleteContent(id) {
        return this.request(`/content/${id}`, {
            method: 'DELETE'
        });
    }

    // E-commerce methods
    async getProducts() {
        return this.request('/products');
    }

    async placeOrder(orderData) {
        return this.request('/cart', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Helper method to check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// Global API client instance
window.apiClient = new ApiClient();
