// Form Suite JavaScript
class FormSuite {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupMultiStepForm();
        this.setupAuthTabs();
        this.setupPasswordToggle();
        this.setupFormValidation();
        this.setupPasswordStrength();
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const formContainers = document.querySelectorAll('.form-container');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetForm = btn.dataset.form;
                
                // Update active states
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                formContainers.forEach(container => {
                    container.classList.remove('active');
                    if (container.id === targetForm) {
                        container.classList.add('active');
                    }
                });
            });
        });
    }

    // Auth Tab Navigation
    setupAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');

        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetAuth = tab.dataset.auth;
                
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${targetAuth}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    // Multi-Step Form
    setupMultiStepForm() {
        const getMatchedForm = document.getElementById('get-matched-form');
        if (!getMatchedForm) return;

        // Next button
        getMatchedForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next')) {
                const currentStepElement = getMatchedForm.querySelector('.form-step.active');
                const stepNumber = parseInt(currentStepElement.dataset.step);
                
                if (this.validateStep(currentStepElement)) {
                    if (stepNumber < 4) {
                        this.goToStep(stepNumber + 1);
                    } else {
                        this.submitMultiStepForm();
                    }
                }
            }
        });

        // Previous button
        getMatchedForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-prev')) {
                const currentStepElement = getMatchedForm.querySelector('.form-step.active');
                const stepNumber = parseInt(currentStepElement.dataset.step);
                this.goToStep(stepNumber - 1);
            }
        });
    }

    goToStep(step) {
        const form = document.getElementById('get-matched-form');
        const steps = form.querySelectorAll('.form-step');
        const progressSteps = document.querySelectorAll('.progress-step');

        // Update form steps
        steps.forEach(s => s.classList.remove('active'));
        form.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

        // Update progress bar
        progressSteps.forEach((ps, index) => {
            ps.classList.remove('active', 'completed');
            if (index < step - 1) {
                ps.classList.add('completed');
            } else if (index === step - 1) {
                ps.classList.add('active');
            }
        });

        this.currentStep = step;
    }

    validateStep(stepElement) {
        let isValid = true;
        const requiredFields = stepElement.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (!this.validateField(field)) {
                isValid = false;
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            return phoneRegex.test(value) && value.length >= 10;
        }

        if (field.type === 'radio') {
            const radioGroup = field.closest('.radio-group');
            const checkedRadio = radioGroup.querySelector('input[type="radio"]:checked');
            return checkedRadio !== null;
        }

        if (field.type === 'checkbox' && field.hasAttribute('required')) {
            return field.checked;
        }

        return true;
    }

    setupFormValidation() {
        // Single forms
        const singleForms = document.querySelectorAll('.single-form');
        
        singleForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    this.submitForm(form);
                }
            });

            // Real-time validation
            form.addEventListener('input', (e) => {
                const field = e.target;
                const formGroup = field.closest('.form-group');
                
                if (formGroup) {
                    if (this.validateField(field)) {
                        formGroup.classList.remove('error');
                    }
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (!this.validateField(field)) {
                isValid = false;
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        });

        // Special validation for password confirmation
        const password = form.querySelector('#signup-password');
        const confirmPassword = form.querySelector('#signup-confirm');
        
        if (password && confirmPassword) {
            if (password.value !== confirmPassword.value) {
                const confirmGroup = confirmPassword.closest('.form-group');
                confirmGroup.classList.add('error');
                confirmGroup.querySelector('.error-message').textContent = 'Passwords do not match';
                isValid = false;
            }
        }

        return isValid;
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const passwordInput = button.previousElementSibling;
                const icon = button.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.querySelector('#signup-password');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strengthBar = document.querySelector('.strength-bar::before') || 
                               document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            const strengthPercentage = (strength / 4) * 100;
            
            // Update strength bar
            const barElement = document.createElement('style');
            barElement.textContent = `.strength-bar::before { width: ${strengthPercentage}%; }`;
            
            // Remove old style if exists
            const oldStyle = document.querySelector('style[data-strength]');
            if (oldStyle) oldStyle.remove();
            
            barElement.setAttribute('data-strength', 'true');
            document.head.appendChild(barElement);
            
            // Update strength text and color
            const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            const strengthColors = ['#dc3545', '#ffc107', '#fd7e14', '#20c997', '#28a745'];
            
            strengthText.textContent = strengthLevels[strength];
            strengthText.style.color = strengthColors[strength];
            
            // Update bar color
            const styleElement = document.createElement('style');
            styleElement.textContent = `.strength-bar::before { background: ${strengthColors[strength]}; }`;
            document.head.appendChild(styleElement);
        });
    }

    submitForm(form) {
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        console.log('Form submitted:', data);
        
        // Show success modal
        this.showSuccessModal('Your form has been submitted successfully!');
        
        // Reset form
        form.reset();
    }

    submitMultiStepForm() {
        const form = document.getElementById('get-matched-form');
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        console.log('Multi-step form submitted:', data);
        
        // Generate summary
        this.generateSummary(data);
        
        // Go to completion step
        this.goToStep(4);
    }

    generateSummary(data) {
        const summaryContainer = document.getElementById('get-matched-summary');
        if (!summaryContainer) return;

        const summaryHTML = `
            <div class="summary-item">
                <span class="summary-label">Name:</span>
                <span class="summary-value">${data.fullName || 'N/A'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Email:</span>
                <span class="summary-value">${data.email || 'N/A'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Age Range:</span>
                <span class="summary-value">${data.age || 'N/A'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Budget:</span>
                <span class="summary-value">${data.budget || 'N/A'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Experience:</span>
                <span class="summary-value">${data.experience || 'N/A'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Interests:</span>
                <span class="summary-value">${Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || 'N/A'}</span>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    showSuccessModal(message) {
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        modal.classList.add('active');
        
        // Close modal on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Close modal on close button click
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            modal.classList.remove('active');
        }, 3000);
    }
}

// Reset form function
function resetForm(formId) {
    const form = document.getElementById(`${formId}-form`);
    if (form) {
        form.reset();
        
        // Reset to first step
    if (formId === 'get-matched') {
        const formSuite = new FormSuite();
        formSuite.goToStep(1);
    }
    
    // Clear all error states
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Clear progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) {
            step.classList.add('active');
        }
    });
}
}

// Initialize the form suite when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormSuite();
});

// Social login handlers
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-social')) {
        e.preventDefault();
        const provider = e.target.textContent.trim();
        console.log(`Social login with ${provider}`);
        
        // Show success modal
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        
        if (messageElement) {
            messageElement.textContent = `${provider} login would be implemented here with OAuth integration.`;
        }
        
        modal.classList.add('active');
        
        setTimeout(() => {
            modal.classList.remove('active');
        }, 3000);
    }
});

// Forgot password handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('forgot-password')) {
        e.preventDefault();
        
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        
        if (messageElement) {
            messageElement.textContent = 'Password reset link has been sent to your email address.';
        }
        
        modal.classList.add('active');
        
        setTimeout(() => {
            modal.classList.remove('active');
        }, 3000);
    }
});
