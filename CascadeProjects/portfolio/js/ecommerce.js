// E-commerce Logic JavaScript
class ECommerceApp {
    constructor() {
        this.products = this.generateMockProducts();
        this.cart = [];
        this.checkoutData = {
            shipping: {},
            payment: {},
            orderNumber: null
        };
        this.promoCodes = {
            'SAVE10': 0.1,
            'SAVE20': 0.2,
            'WELCOME': 0.15,
            'SPECIAL': 0.25
        };
        this.currentPromo = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartDisplay();
    }

    // Generate mock product data
    generateMockProducts() {
        const categories = ['electronics', 'clothing', 'home', 'sports'];
        const products = [];
        
        for (let i = 1; i <= 20; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const price = Math.floor(Math.random() * 500) + 20;
            const originalPrice = Math.random() > 0.7 ? price * 1.3 : null;
            const rating = (Math.random() * 2 + 3).toFixed(1);
            const reviews = Math.floor(Math.random() * 500) + 10;
            
            products.push({
                id: i,
                name: `Product ${i} - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                description: `High-quality ${category} product with excellent features and durability.`,
                price: price,
                originalPrice: originalPrice,
                category: category,
                rating: parseFloat(rating),
                reviews: reviews,
                image: `https://picsum.photos/seed/product${i}/300/200`,
                badge: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Sale' : 'New') : null,
                stock: Math.floor(Math.random() * 20) + 5
            });
        }
        
        return products;
    }

    setupEventListeners() {
        // Product filtering and sorting
        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('sort-products').addEventListener('change', () => {
            this.sortProducts();
        });

        // Cart actions
        document.getElementById('clear-cart').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.clearCart();
            }
        });

        document.getElementById('proceed-checkout').addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Promo code
        document.getElementById('apply-promo').addEventListener('click', () => {
            this.applyPromoCode();
        });

        document.getElementById('promo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyPromoCode();
            }
        });

        // Checkout steps
        document.getElementById('continue-to-payment').addEventListener('click', () => {
            this.continueToPayment();
        });

        document.getElementById('back-to-shipping').addEventListener('click', () => {
            this.goToStep(1);
        });

        document.getElementById('continue-to-review').addEventListener('click', () => {
            this.continueToReview();
        });

        document.getElementById('back-to-payment').addEventListener('click', () => {
            this.goToStep(2);
        });

        document.getElementById('place-order').addEventListener('click', () => {
            this.placeOrder();
        });

        // Payment method selection
        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.showPaymentDetails(e.target.value);
            });
        });

        // Card number formatting
        document.getElementById('card-number').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Card expiry formatting
        document.getElementById('card-expiry').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // CVV validation
        document.getElementById('card-cvv').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('continue-shopping').addEventListener('click', () => {
            this.closeModal();
            this.goToStep(1);
            this.clearCart();
        });
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners to product cards
        productsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            } else if (e.target.classList.contains('quantity-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;
                this.updateQuantity(productId, action);
            }
        });
    }

    createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <div class="product-rating">
                            ${this.generateStars(product.rating)}
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="product-price">
                            $${product.price}
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn" data-product-id="${product.id}" data-action="decrease">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}" readonly>
                            <button class="quantity-btn" data-product-id="${product.id}" data-action="increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    filterProducts() {
        const category = document.getElementById('category-filter').value;
        
        if (category === 'all') {
            this.renderProducts();
        } else {
            const filtered = this.products.filter(product => product.category === category);
            const productsGrid = document.getElementById('products-grid');
            productsGrid.innerHTML = filtered.map(product => this.createProductCard(product)).join('');
        }
    }

    sortProducts() {
        const sortBy = document.getElementById('sort-products').value;
        
        switch (sortBy) {
            case 'name':
                this.products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.products.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }

    updateQuantity(productId, action) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (!cartItem) return;
        
        if (action === 'increase' && cartItem.quantity < cartItem.stock) {
            cartItem.quantity++;
        } else if (action === 'decrease' && cartItem.quantity > 1) {
            cartItem.quantity--;
        }
        
        this.updateCartDisplay();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    clearCart() {
        this.cart = [];
        this.currentPromo = null;
        document.getElementById('promo-input').value = '';
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        
        cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
        }
        
        this.updateOrderSummary();
    }

    createCartItem(item) {
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">
                        $${item.price}
                        ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="ecommerceApp.updateQuantity(${item.id}, 'decrease')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="ecommerceApp.updateQuantity(${item.id}, 'increase')">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="ecommerceApp.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateOrderSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const shipping = subtotal > 100 ? 0 : 10;
        const discount = this.currentPromo ? subtotal * this.currentPromo : 0;
        const total = subtotal + tax + shipping - discount;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        // Update review summary if on checkout page
        document.getElementById('review-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('review-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('review-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('review-discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('review-total').textContent = `$${total.toFixed(2)}`;
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        const code = promoInput.value.toUpperCase().trim();
        
        if (this.promoCodes[code]) {
            this.currentPromo = this.promoCodes[code];
            this.updateOrderSummary();
            this.showNotification(`Promo code applied! ${this.currentPromo * 100}% discount`);
        } else {
            this.showNotification('Invalid promo code', 'error');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Scroll to checkout section
        document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
        this.goToStep(1);
    }

    goToStep(stepNumber) {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= stepNumber);
        });
        
        // Show/hide checkout steps
        document.querySelectorAll('.checkout-step').forEach(step => {
            step.classList.remove('active');
        });
        
        if (stepNumber === 1) {
            document.getElementById('shipping-step').classList.add('active');
        } else if (stepNumber === 2) {
            document.getElementById('payment-step').classList.add('active');
        } else if (stepNumber === 3) {
            document.getElementById('review-step').classList.add('active');
            this.populateReviewStep();
        }
    }

    continueToPayment() {
        const shippingForm = document.getElementById('shipping-form');
        
        if (!this.validateForm(shippingForm)) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Save shipping data
        const formData = new FormData(shippingForm);
        this.checkoutData.shipping = Object.fromEntries(formData);
        
        this.goToStep(2);
    }

    continueToReview() {
        const paymentForm = document.getElementById('payment-form');
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (paymentMethod === 'card' && !this.validateCardDetails()) {
            this.showNotification('Please fill in all card details', 'error');
            return;
        }
        
        // Save payment data
        this.checkoutData.payment = {
            method: paymentMethod,
            cardNumber: document.getElementById('card-number').value,
            expiry: document.getElementById('card-expiry').value,
            cvv: document.getElementById('card-cvv').value,
            name: document.getElementById('card-name').value
        };
        
        this.goToStep(3);
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc3545';
            } else {
                field.style.borderColor = '#e9ecef';
            }
        });
        
        return isValid;
    }

    validateCardDetails() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiry = document.getElementById('card-expiry').value;
        const cvv = document.getElementById('card-cvv').value;
        const name = document.getElementById('card-name').value;
        
        return cardNumber.length === 16 && expiry.length === 5 && cvv.length >= 3 && name.trim();
    }

    showPaymentDetails(method) {
        document.getElementById('card-details').style.display = method === 'card' ? 'block' : 'none';
        document.getElementById('paypal-details').style.display = method === 'paypal' ? 'block' : 'none';
        document.getElementById('apple-details').style.display = method === 'apple' ? 'block' : 'none';
    }

    populateReviewStep() {
        // Shipping information
        const shippingInfo = document.getElementById('review-shipping-info');
        shippingInfo.innerHTML = `
            <p><strong>${this.checkoutData.shipping.firstName} ${this.checkoutData.shipping.lastName}</strong></p>
            <p>${this.checkoutData.shipping.email}</p>
            <p>${this.checkoutData.shipping.address}</p>
            <p>${this.checkoutData.shipping.city}, ${this.checkoutData.shipping.state} ${this.checkoutData.shipping.zip}</p>
            ${this.checkoutData.shipping.phone ? `<p>${this.checkoutData.shipping.phone}</p>` : ''}
        `;
        
        // Payment information
        const paymentInfo = document.getElementById('review-payment-info');
        const method = this.checkoutData.payment.method;
        let paymentText = '';
        
        switch (method) {
            case 'card':
                paymentText = `Credit Card ending in ${this.checkoutData.payment.cardNumber.slice(-4)}`;
                break;
            case 'paypal':
                paymentText = 'PayPal';
                break;
            case 'apple':
                paymentText = 'Apple Pay';
                break;
        }
        
        paymentInfo.innerHTML = `<p><strong>${paymentText}</strong></p>`;
        
        // Order items
        const reviewItems = document.getElementById('review-items');
        reviewItems.innerHTML = this.cart.map(item => `
            <div class="review-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    placeOrder() {
        // Generate order number
        this.checkoutData.orderNumber = 'ORD' + Date.now();
        
        // Show success modal
        document.getElementById('order-number').textContent = this.checkoutData.orderNumber;
        document.getElementById('success-modal').classList.add('active');
        
        // Clear cart and reset checkout
        this.cart = [];
        this.currentPromo = null;
        this.checkoutData = { shipping: {}, payment: {}, orderNumber: null };
        
        // Reset forms
        document.getElementById('shipping-form').reset();
        document.getElementById('payment-form').reset();
        document.getElementById('promo-input').value = '';
        
        this.updateCartDisplay();
    }

    closeModal() {
        document.getElementById('success-modal').classList.remove('active');
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
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the e-commerce app when DOM is loaded
let ecommerceApp;
document.addEventListener('DOMContentLoaded', () => {
    ecommerceApp = new ECommerceApp();
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
