// User Dashboard JavaScript
class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.activities = this.generateMockActivities();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                
                // Update active nav
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Password form
        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Password strength indicator
        document.getElementById('new-password').addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Activity filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterActivities(filter);
                
                // Update active filter
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Notification button
        document.getElementById('notification-btn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent.trim();
                this.handleQuickAction(action);
            });
        });

        // Settings toggles
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.saveSetting(toggle.id, toggle.checked);
            });
        });
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('dashboardUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.showDashboard();
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            if (window.apiClient) {
                // Use real API
                const data = await window.apiClient.login(email, password);
                this.currentUser = data.user;
                this.isLoggedIn = true;
                
                this.showDashboard();
                this.showNotification('Login successful! Welcome back.');
            } else {
                // Fallback to demo authentication
                if (email === 'demo@example.com' && password === 'demo123') {
                    this.currentUser = {
                        name: 'John Doe',
                        email: email,
                        memberSince: 'January 2024',
                        avatar: 'https://picsum.photos/seed/user-avatar/150/150'
                    };
                    
                    this.isLoggedIn = true;
                    localStorage.setItem('dashboardUser', JSON.stringify(this.currentUser));
                    
                    this.showDashboard();
                    this.showNotification('Login successful! Welcome back.');
                } else {
                    this.showNotification('Invalid email or password', 'error');
                }
            }
        } catch (error) {
            this.showNotification('Login failed: ' + error.message, 'error');
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.isLoggedIn = false;
            this.currentUser = null;
            localStorage.removeItem('dashboardUser');
            
            document.getElementById('login-modal').classList.add('active');
            document.getElementById('dashboard-container').classList.remove('active');
            
            this.showNotification('Logged out successfully');
        }
    }

    showDashboard() {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('dashboard-container').classList.add('active');
        
        // Update user info
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-email').textContent = this.currentUser.email;
        
        // Update profile form
        document.getElementById('first-name').value = 'John';
        document.getElementById('last-name').value = 'Doe';
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('phone').value = '+1 (555) 123-4567';
        document.getElementById('bio').value = 'Tech enthusiast and early adopter of new technologies.';
        
        // Initialize dashboard
        this.updateStats();
        this.renderActivities();
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Update page title
        const titles = {
            overview: 'Dashboard Overview',
            profile: 'Profile Settings',
            security: 'Security Settings',
            activity: 'Activity History',
            settings: 'Application Settings'
        };
        
        document.getElementById('page-title').textContent = titles[sectionName];
    }

    generateMockActivities() {
        return [
            {
                id: 1,
                type: 'orders',
                title: 'Order #1234 Placed',
                description: 'Items: Wireless Headphones, Phone Case',
                date: new Date(),
                dateGroup: 'Today'
            },
            {
                id: 2,
                type: 'wishlist',
                title: 'Added to Wishlist',
                description: 'Smart Watch Pro - $299.99',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                dateGroup: 'Today'
            },
            {
                id: 3,
                type: 'reviews',
                title: 'Reviewed Product',
                description: 'Laptop Stand - 5 stars',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                dateGroup: 'Yesterday'
            },
            {
                id: 4,
                type: 'orders',
                title: 'Order #1233 Delivered',
                description: 'USB-C Hub, Mouse Pad',
                date: new Date(Date.now() - 25 * 60 * 60 * 1000),
                dateGroup: 'Yesterday'
            },
            {
                id: 5,
                type: 'profile',
                title: 'Profile Updated',
                description: 'Changed phone number',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                dateGroup: '3 days ago'
            }
        ];
    }

    updateStats() {
        // Animate stats on load
        const stats = [
            { id: 'orders', value: 24, suffix: '' },
            { id: 'spent', value: 1234, prefix: '$' },
            { id: 'wishlist', value: 18, suffix: '' },
            { id: 'rating', value: 4.8, suffix: '' }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(`.stat-card:nth-child(${stat.id}) .stat-info h3`);
            if (element) {
                this.animateValue(element, 0, stat.value, 1000, stat.prefix, stat.suffix);
            }
        });
    }

    animateValue(element, start, end, duration, prefix = '', suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = prefix + current.toFixed(end % 1 !== 0 ? 1 : 0) + suffix;
        }, 16);
    }

    renderActivities(filter = 'all') {
        const filteredActivities = filter === 'all' 
            ? this.activities 
            : this.activities.filter(activity => activity.type === filter);
        
        const timelineContainer = document.querySelector('.activity-timeline');
        if (!timelineContainer) return;

        // Group activities by date
        const groupedActivities = {};
        filteredActivities.forEach(activity => {
            if (!groupedActivities[activity.dateGroup]) {
                groupedActivities[activity.dateGroup] = [];
            }
            groupedActivities[activity.dateGroup].push(activity);
        });

        // Render timeline
        let timelineHTML = '';
        Object.keys(groupedActivities).forEach(dateGroup => {
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-date">${dateGroup}</div>
                    <div class="timeline-events">
                        ${groupedActivities[dateGroup].map(activity => this.createActivityHTML(activity)).join('')}
                    </div>
                </div>
            `;
        });

        timelineContainer.innerHTML = timelineHTML;
    }

    createActivityHTML(activity) {
        const icons = {
            orders: 'fas fa-shopping-bag',
            reviews: 'fas fa-star',
            wishlist: 'fas fa-heart',
            profile: 'fas fa-user'
        };

        return `
            <div class="event-item" data-type="${activity.type}">
                <div class="event-icon">
                    <i class="${icons[activity.type] || 'fas fa-circle'}"></i>
                </div>
                <div class="event-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="event-time">${this.formatTime(activity.date)}</span>
                </div>
            </div>
        `;
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    filterActivities(filter) {
        this.renderActivities(filter);
    }

    saveProfile() {
        // Collect form data
        const formData = new FormData(document.getElementById('profile-form'));
        const profileData = Object.fromEntries(formData);
        
        // Simulate saving
        console.log('Saving profile:', profileData);
        
        this.showNotification('Profile updated successfully!');
        this.addActivity('profile', 'Profile Updated', 'Changed personal information');
    }

    changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Simulate password change
        console.log('Changing password');
        
        this.showNotification('Password changed successfully!');
        
        // Reset form
        document.getElementById('password-form').reset();
        document.querySelector('.strength-bar::before').style.width = '0';
        document.querySelector('.strength-text').textContent = 'Password strength';
        
        this.addActivity('security', 'Password Changed', 'Updated account password');
    }

    updatePasswordStrength(password) {
        let strength = 0;
        let strengthText = 'Very Weak';
        let strengthColor = '#dc3545';
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        const strengthPercentage = (strength / 4) * 100;
        
        const strengthLevels = [
            { text: 'Very Weak', color: '#dc3545' },
            { text: 'Weak', color: '#ffc107' },
            { text: 'Fair', color: '#fd7e14' },
            { text: 'Good', color: '#20c997' },
            { text: 'Strong', color: '#28a745' }
        ];
        
        const level = strengthLevels[strength];
        strengthText = level.text;
        strengthColor = level.color;
        
        // Update UI
        const style = document.createElement('style');
        style.textContent = `
            .strength-bar::before {
                width: ${strengthPercentage}%;
                background: ${strengthColor};
            }
        `;
        
        // Remove old style
        const oldStyle = document.querySelector('style[data-password-strength]');
        if (oldStyle) oldStyle.remove();
        
        style.setAttribute('data-password-strength', 'true');
        document.head.appendChild(style);
        
        document.querySelector('.strength-text').textContent = strengthText;
        document.querySelector('.strength-text').style.color = strengthColor;
    }

    addActivity(type, title, description) {
        const newActivity = {
            id: this.activities.length + 1,
            type: type,
            title: title,
            description: description,
            date: new Date(),
            dateGroup: 'Today'
        };
        
        this.activities.unshift(newActivity);
        this.renderActivities();
    }

    handleQuickAction(action) {
        switch (action) {
            case 'New Order':
                this.showNotification('Redirecting to order page...');
                break;
            case 'View Orders':
                this.showSection('activity');
                this.filterActivities('orders');
                break;
            case 'Wishlist':
                this.showNotification('Opening wishlist...');
                break;
            case 'Settings':
                this.showSection('settings');
                break;
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        const icon = document.querySelector('#theme-toggle i');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        
        localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
    }

    showNotifications() {
        const notifications = [
            'Your order #1234 has been shipped',
            'New product recommendations available',
            'Your profile is 80% complete'
        ];
        
        this.showNotification('You have 3 new notifications');
    }

    saveSetting(settingId, value) {
        console.log(`Setting ${settingId}:`, value);
        this.showNotification('Setting saved successfully');
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showModal(message) {
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('success-modal').classList.remove('active');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard();
});

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
