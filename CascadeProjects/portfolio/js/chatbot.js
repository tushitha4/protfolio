// AI-Style ChatBot JavaScript
class ChatBot {
    constructor() {
        this.messageCount = 1;
        this.chatStartTime = Date.now();
        this.settings = {
            theme: 'light',
            fontSize: 'medium',
            soundNotifications: true,
            typingIndicator: true,
            autoScroll: true
        };
        this.responses = {
            greetings: [
                "Hello! How can I assist you today?",
                "Hi there! What can I help you with?",
                "Greetings! How may I be of service?",
                "Welcome! I'm here to help. What do you need?"
            ],
            services: [
                "We offer web development, mobile app development, AI solutions, and digital marketing services. Our team specializes in creating custom solutions tailored to your needs.",
                "Our services include frontend and backend development, UI/UX design, cloud deployment, and ongoing maintenance. We work with various technologies including React, Node.js, Python, and more.",
                "We provide comprehensive digital solutions including website development, mobile applications, e-commerce platforms, and AI integration. Each project is handled by our expert team."
            ],
            hours: [
                "We're available Monday through Friday, 9 AM to 6 PM EST. For urgent matters, we offer 24/7 emergency support.",
                "Our business hours are 9:00 AM - 6:00 PM EST, Monday to Friday. You can also reach us via email anytime, and we'll respond within 24 hours.",
                "We operate Monday-Friday from 9 AM to 6 PM Eastern Time. Weekend support is available for premium clients."
            ],
            support: [
                "You can contact our support team via email at support@example.com or call us at 1-800-123-4567. We typically respond within 2-4 hours during business hours.",
                "For support, email us at support@example.com or use our live chat feature. Phone support is available at 1-800-123-4567 during business hours.",
                "Reach our support team through multiple channels: Email (support@example.com), Phone (1-800-123-4567), or Live Chat. We're here to help!"
            ],
            pricing: [
                "Our pricing varies based on project complexity and scope. We offer flexible pricing models including fixed-price projects, hourly rates ($75-150/hour), and monthly retainers. Would you like a detailed quote?",
                "Pricing depends on your specific needs. Small projects start at $2,500, while enterprise solutions can range from $25,000 to $100,000+. Contact us for a custom quote tailored to your requirements.",
                "We offer competitive pricing with packages starting at $2,500 for basic websites. Custom solutions are quoted based on your specific requirements. Schedule a free consultation to discuss your budget and needs."
            ],
            consultation: [
                "Yes! We offer a free 30-minute consultation for new clients. During this session, we'll discuss your project requirements, timeline, and budget. You can schedule it through our website or by calling us.",
                "Absolutely! Our free consultation includes project assessment, technical recommendations, and a detailed proposal. Book yours today to get started.",
                "We provide complimentary 30-minute consultations to understand your needs and propose the best solution. Schedule yours now and let's bring your ideas to life!"
            ],
            portfolio: [
                "You can view our portfolio on our website at example.com/portfolio. We showcase various projects including e-commerce sites, mobile apps, and custom software solutions.",
                "Our portfolio features over 50 completed projects across different industries. Visit example.com/portfolio to see our work and read client testimonials.",
                "Check out our portfolio at example.com/portfolio to see examples of our work in web development, mobile apps, and AI solutions. Each case study includes project details and results."
            ],
            technology: [
                "We work with modern technologies including React, Vue.js, Angular, Node.js, Python, Django, Ruby on Rails, and various cloud platforms like AWS, Google Cloud, and Azure.",
                "Our tech stack includes frontend frameworks (React, Vue, Angular), backend technologies (Node.js, Python, Ruby), databases (PostgreSQL, MongoDB), and cloud services (AWS, GCP, Azure).",
                "We're proficient in cutting-edge technologies: React/Next.js for frontend, Node.js/Python for backend, various databases, and cloud platforms. We choose the best tech for your specific needs."
            ],
            timeline: [
                "Project timelines vary based on complexity. A simple website typically takes 2-4 weeks, while complex applications can take 3-6 months. We'll provide a detailed timeline during consultation.",
                "Timeline depends on project scope: Basic websites (2-4 weeks), e-commerce platforms (6-8 weeks), custom applications (3-6 months). We always meet deadlines with regular updates.",
                "We deliver projects efficiently: Small websites in 2-3 weeks, medium projects in 1-2 months, enterprise solutions in 3-6 months. Rush delivery options are available for urgent needs."
            ],
            default: [
                "I understand your question. Let me help you with that. Could you provide more details so I can give you a better response?",
                "That's an interesting question. To provide you with the most accurate information, could you please elaborate a bit more?",
                "I'd be happy to help! Could you share more context about what you're looking for? This will help me provide a more tailored response."
            ]
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startChatTimer();
        this.loadSettings();
    }

    setupEventListeners() {
        // Send message
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        sendBtn.addEventListener('click', () => this.sendMessage());
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.dataset.message;
                this.sendQuickReply(message);
            }
        });

        // Clear chat
        document.getElementById('clear-chat').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the chat history?')) {
                this.clearChat();
            }
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });

        // Minimize chat (placeholder)
        document.getElementById('minimize-chat').addEventListener('click', () => {
            alert('Minimize functionality would be implemented here in a real application');
        });

        // Emoji picker
        document.getElementById('emoji-btn').addEventListener('click', () => {
            this.toggleEmojiPicker();
        });

        // Attachment button
        document.getElementById('attachment-btn').addEventListener('click', () => {
            alert('File attachment would be implemented here in a real application');
        });

        // Emoji buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-btn')) {
                const emoji = e.target.dataset.emoji;
                this.insertEmoji(emoji);
            }
        });

        // Close emoji picker
        document.querySelector('.close-emoji-picker').addEventListener('click', () => {
            this.closeEmojiPicker();
        });

        // Settings modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });

        // FAQ items
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.closest('.faq-item');
                faqItem.classList.toggle('active');
            });
        });

        // Chat history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Input suggestions
        messageInput.addEventListener('input', (e) => {
            this.updateSuggestions(e.target.value);
        });
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        messageInput.value = '';
        
        // Update message count
        this.messageCount++;
        this.updateStats();

        // Show typing indicator
        this.showTypingIndicator();

        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            
            // Play notification sound if enabled
            if (this.settings.soundNotifications) {
                this.playNotificationSound();
            }
        }, 1000 + Math.random() * 2000);
    }

    sendQuickReply(message) {
        this.addMessage(message, 'user');
        this.messageCount++;
        this.updateStats();
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            
            if (this.settings.soundNotifications) {
                this.playNotificationSound();
            }
        }, 1000 + Math.random() * 2000);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for keywords and return appropriate response
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomResponse('greetings');
        }
        
        if (message.includes('service') || message.includes('offer') || message.includes('provide')) {
            return this.getRandomResponse('services');
        }
        
        if (message.includes('hour') || message.includes('time') || message.includes('available')) {
            return this.getRandomResponse('hours');
        }
        
        if (message.includes('support') || message.includes('help') || message.includes('contact')) {
            return this.getRandomResponse('support');
        }
        
        if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
            return this.getRandomResponse('pricing');
        }
        
        if (message.includes('consultation') || message.includes('consult') || message.includes('meeting')) {
            return this.getRandomResponse('consultation');
        }
        
        if (message.includes('portfolio') || message.includes('work') || message.includes('example')) {
            return this.getRandomResponse('portfolio');
        }
        
        if (message.includes('technology') || message.includes('tech') || message.includes('stack')) {
            return this.getRandomResponse('technology');
        }
        
        if (message.includes('timeline') || message.includes('duration') || message.includes('long')) {
            return this.getRandomResponse('timeline');
        }
        
        // Default response
        return this.getRandomResponse('default');
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? 
            '<i class="fas fa-robot"></i>' : 
            '<i class="fas fa-user"></i>';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                ${sender === 'bot' && Math.random() > 0.7 ? this.generateQuickReplies() : ''}
                <div class="message-time">
                    <span>${time}</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll to bottom if enabled
        if (this.settings.autoScroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    generateQuickReplies() {
        const quickReplies = [
            ['Tell me more', 'How does it work?'],
            ['Pricing info', 'Get started'],
            ['Contact support', 'Schedule consultation'],
            ['View portfolio', 'Technology stack']
        ];
        
        const replies = quickReplies[Math.floor(Math.random() * quickReplies.length)];
        
        return `
            <div class="quick-replies">
                ${replies.map(reply => `<button class="quick-reply" data-message="${reply}">${reply}</button>`).join('')}
            </div>
        `;
    }

    showTypingIndicator() {
        if (!this.settings.typingIndicator) return;
        
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.add('active');
        
        // Scroll to typing indicator
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.remove('active');
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Chat cleared. How can I help you today?
                    </div>
                    <div class="quick-replies">
                        <button class="quick-reply" data-message="Tell me about your services">Services</button>
                        <button class="quick-reply" data-message="What are your hours?">Hours</button>
                        <button class="quick-reply" data-message="How can I contact support?">Support</button>
                        <button class="quick-reply" data-message="Do you have pricing information?">Pricing</button>
                    </div>
                    <div class="message-time">
                        <span>Just now</span>
                    </div>
                </div>
            </div>
        `;
        
        this.messageCount = 1;
        this.chatStartTime = Date.now();
        this.updateStats();
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        picker.classList.toggle('active');
    }

    closeEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        picker.classList.remove('active');
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('message-input');
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        
        messageInput.value = messageInput.value.substring(0, start) + emoji + messageInput.value.substring(end);
        messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
        messageInput.focus();
        
        this.closeEmojiPicker();
    }

    updateSuggestions(query) {
        const suggestionsContainer = document.getElementById('input-suggestions');
        
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }
        
        const suggestions = [
            'services', 'pricing', 'hours', 'support', 'consultation',
            'portfolio', 'technology', 'timeline', 'contact', 'help'
        ].filter(s => s.includes(query.toLowerCase()));
        
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions
                .map(s => `<span class="suggestion-chip" data-suggestion="${s}">${s}</span>`)
                .join('');
            
            // Add click handlers to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    document.getElementById('message-input').value = chip.dataset.suggestion;
                    suggestionsContainer.innerHTML = '';
                });
            });
        } else {
            suggestionsContainer.innerHTML = '';
        }
    }

    openSettings() {
        document.getElementById('settings-modal').classList.add('active');
        this.loadSettingsToForm();
    }

    closeSettings() {
        document.getElementById('settings-modal').classList.remove('active');
    }

    loadSettingsToForm() {
        document.getElementById('theme-select').value = this.settings.theme;
        document.getElementById('font-size').value = this.settings.fontSize;
        document.getElementById('sound-notifications').checked = this.settings.soundNotifications;
        document.getElementById('typing-indicator').checked = this.settings.typingIndicator;
        document.getElementById('auto-scroll').checked = this.settings.autoScroll;
    }

    saveSettings() {
        this.settings.theme = document.getElementById('theme-select').value;
        this.settings.fontSize = document.getElementById('font-size').value;
        this.settings.soundNotifications = document.getElementById('sound-notifications').checked;
        this.settings.typingIndicator = document.getElementById('typing-indicator').checked;
        this.settings.autoScroll = document.getElementById('auto-scroll').checked;
        
        // Save to localStorage
        localStorage.setItem('chatbot-settings', JSON.stringify(this.settings));
        
        this.applySettings();
        this.closeSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('chatbot-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applySettings();
        }
    }

    applySettings() {
        // Apply font size
        document.body.className = `font-size-${this.settings.fontSize}`;
        
        // Apply theme (placeholder)
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    resetSettings() {
        this.settings = {
            theme: 'light',
            fontSize: 'medium',
            soundNotifications: true,
            typingIndicator: true,
            autoScroll: true
        };
        
        localStorage.removeItem('chatbot-settings');
        this.loadSettingsToForm();
        this.applySettings();
    }

    startChatTimer() {
        setInterval(() => {
            this.updateChatDuration();
        }, 1000);
    }

    updateChatDuration() {
        const duration = Date.now() - this.chatStartTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        document.getElementById('chat-duration').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStats() {
        document.getElementById('message-count').textContent = this.messageCount;
    }

    playNotificationSound() {
        // Create a simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
