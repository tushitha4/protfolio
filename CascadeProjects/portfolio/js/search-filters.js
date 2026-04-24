// Advanced Search Filters JavaScript
class SearchFilters {
    constructor() {
        this.products = this.generateMockProducts();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.viewMode = 'grid';
        this.filters = {
            search: '',
            categories: [],
            brands: [],
            rating: null,
            priceRange: { min: 0, max: 10000 },
            location: '',
            availability: [],
            quickFilter: null
        };
        this.sortBy = 'relevance';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPriceRangeSlider();
        this.renderProducts();
        this.updateResultsCount();
    }

    // Generate mock product data
    generateMockProducts() {
        const categories = ['electronics', 'clothing', 'home', 'sports', 'books', 'toys'];
        const brands = ['apple', 'samsung', 'sony', 'nike', 'adidas'];
        const locations = ['local', 'national', 'international'];
        const availability = ['in-stock', 'pre-order', 'out-of-stock'];
        
        const products = [];
        for (let i = 1; i <= 100; i++) {
            const price = Math.floor(Math.random() * 10000) + 100;
            const originalPrice = Math.random() > 0.7 ? price * 1.3 : null;
            const rating = (Math.random() * 2 + 3).toFixed(1);
            const reviews = Math.floor(Math.random() * 500) + 10;
            
            products.push({
                id: i,
                title: `Product ${i} - ${categories[Math.floor(Math.random() * categories.length)].charAt(0).toUpperCase() + categories[Math.floor(Math.random() * categories.length)].slice(1)}`,
                description: `This is a high-quality product with excellent features and great value for money. Perfect for everyday use.`,
                price: price,
                originalPrice: originalPrice,
                rating: parseFloat(rating),
                reviews: reviews,
                category: categories[Math.floor(Math.random() * categories.length)],
                brand: brands[Math.floor(Math.random() * brands.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                availability: availability[Math.floor(Math.random() * availability.length)],
                image: `https://picsum.photos/seed/product${i}/400/300`,
                badge: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Sale' : 'New') : null
            });
        }
        return products;
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const clearSearch = document.getElementById('clear-search');

        searchInput.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        searchBtn.addEventListener('click', () => {
            this.applyFilters();
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.filters.search = '';
            this.applyFilters();
        });

        // Quick filters
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Toggle active state
                document.querySelectorAll('.quick-filter').forEach(b => b.classList.remove('active'));
                
                if (this.filters.quickFilter === filter) {
                    this.filters.quickFilter = null;
                } else {
                    btn.classList.add('active');
                    this.filters.quickFilter = filter;
                }
                
                this.applyFilters();
            });
        });

        // Category filters
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilterArray('categories', checkbox.value, checkbox.checked);
                this.applyFilters();
            });
        });

        // Brand filters
        document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilterArray('brands', checkbox.value, checkbox.checked);
                this.applyFilters();
            });
        });

        // Rating filter
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.filters.rating = radio.value ? parseFloat(radio.value) : null;
                this.applyFilters();
            });
        });

        // Location filter
        document.getElementById('location-filter').addEventListener('change', (e) => {
            this.filters.location = e.target.value;
            this.applyFilters();
        });

        // Availability filters
        document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilterArray('availability', checkbox.value, checkbox.checked);
                this.applyFilters();
            });
        });

        // Brand search
        document.getElementById('brand-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.brand-filters .checkbox-label').forEach(label => {
                const brandName = label.textContent.toLowerCase();
                label.style.display = brandName.includes(searchTerm) ? 'flex' : 'none';
            });
        });

        // Sort options
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.viewMode = btn.dataset.view;
                this.renderProducts();
            });
        });

        // Reset filters
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetAllFilters();
        });

        // Price range inputs
        document.getElementById('min-price').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            this.filters.priceRange.min = value;
            this.updatePriceRangeSlider();
            this.applyFilters();
        });

        document.getElementById('max-price').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 10000;
            this.filters.priceRange.max = value;
            this.updatePriceRangeSlider();
            this.applyFilters();
        });
    }

    setupPriceRangeSlider() {
        const minRange = document.getElementById('price-min-range');
        const maxRange = document.getElementById('price-max-range');
        
        minRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.filters.priceRange.min = value;
            document.getElementById('min-price').value = value;
            this.updatePriceRangeSlider();
            this.applyFilters();
        });

        maxRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.filters.priceRange.max = value;
            document.getElementById('max-price').value = value;
            this.updatePriceRangeSlider();
            this.applyFilters();
        });
    }

    updatePriceRangeSlider() {
        const minRange = document.getElementById('price-min-range');
        const maxRange = document.getElementById('price-max-range');
        const sliderRange = document.querySelector('.slider-range');
        
        const minPercent = (this.filters.priceRange.min / 10000) * 100;
        const maxPercent = (this.filters.priceRange.max / 10000) * 100;
        
        sliderRange.style.left = `${minPercent}%`;
        sliderRange.style.width = `${maxPercent - minPercent}%`;
    }

    updateFilterArray(filterType, value, isChecked) {
        if (isChecked) {
            if (!this.filters[filterType].includes(value)) {
                this.filters[filterType].push(value);
            }
        } else {
            const index = this.filters[filterType].indexOf(value);
            if (index > -1) {
                this.filters[filterType].splice(index, 1);
            }
        }
    }

    applyFilters() {
        this.showLoading();
        
        setTimeout(() => {
            this.filteredProducts = this.products.filter(product => {
                // Search filter
                if (this.filters.search && !this.matchesSearch(product, this.filters.search)) {
                    return false;
                }

                // Category filter
                if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                    return false;
                }

                // Brand filter
                if (this.filters.brands.length > 0 && !this.filters.brands.includes(product.brand)) {
                    return false;
                }

                // Rating filter
                if (this.filters.rating && product.rating < this.filters.rating) {
                    return false;
                }

                // Price range filter
                if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                    return false;
                }

                // Location filter
                if (this.filters.location && product.location !== this.filters.location) {
                    return false;
                }

                // Availability filter
                if (this.filters.availability.length > 0 && !this.filters.availability.includes(product.availability)) {
                    return false;
                }

                // Quick filter
                if (this.filters.quickFilter) {
                    switch (this.filters.quickFilter) {
                        case 'trending':
                            return product.reviews > 300;
                        case 'new':
                            return product.badge === 'New';
                        case 'sale':
                            return product.badge === 'Sale' || product.originalPrice;
                        case 'popular':
                            return product.rating >= 4.5;
                        default:
                            return true;
                    }
                }

                return true;
            });

            this.sortProducts();
            this.currentPage = 1;
            this.renderProducts();
            this.updateResultsCount();
            this.updateActiveFilters();
            this.hideLoading();
        }, 300);
    }

    matchesSearch(product, searchTerm) {
        const searchFields = [
            product.title,
            product.description,
            product.category,
            product.brand
        ].join(' ').toLowerCase();
        
        return searchFields.includes(searchTerm);
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'relevance':
            default:
                // Default sorting (could be enhanced with actual relevance algorithm)
                this.filteredProducts.sort((a, b) => {
                    const aMatches = this.matchesSearch(a, this.filters.search);
                    const bMatches = this.matchesSearch(b, this.filters.search);
                    
                    if (aMatches && !bMatches) return -1;
                    if (!aMatches && bMatches) return 1;
                    return b.rating - a.rating;
                });
                break;
        }
    }

    renderProducts() {
        const resultsGrid = document.getElementById('results-grid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn-primary" onclick="searchFilters.resetAllFilters()">Reset All Filters</button>
                </div>
            `;
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        resultsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.renderPagination();
    }

    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const availabilityClass = product.availability === 'in-stock' ? 'in-stock' : 'out-of-stock';
        const availabilityText = product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock';

        return `
            <div class="result-item" onclick="searchFilters.viewProduct(${product.id})">
                <div class="result-image">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.badge ? `<div class="result-badge">${product.badge}</div>` : ''}
                </div>
                <div class="result-info">
                    <h3 class="result-title">${product.title}</h3>
                    <p class="result-description">${product.description}</p>
                    <div class="result-meta">
                        <div class="result-rating">
                            ${stars}
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="result-price">
                            $${product.price}
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div class="result-footer">
                        <div class="result-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${product.location}
                        </div>
                        <div class="result-availability ${availabilityClass}">
                            ${availabilityText}
                        </div>
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

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="searchFilters.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `
                <button onclick="searchFilters.goToPage(1)">1</button>
            `;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" onclick="searchFilters.goToPage(${i})">${i}</button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `
                <button onclick="searchFilters.goToPage(${totalPages})">${totalPages}</button>
            `;
        }

        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="searchFilters.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        resultsCount.textContent = this.filteredProducts.length;
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        let activeFiltersHTML = '';

        // Search filter
        if (this.filters.search) {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Search: "${this.filters.search}"
                    <button onclick="searchFilters.removeFilter('search')">&times;</button>
                </div>
            `;
        }

        // Category filters
        this.filters.categories.forEach(category => {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Category: ${category}
                    <button onclick="searchFilters.removeFilterFromArray('categories', '${category}')">&times;</button>
                </div>
            `;
        });

        // Brand filters
        this.filters.brands.forEach(brand => {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Brand: ${brand}
                    <button onclick="searchFilters.removeFilterFromArray('brands', '${brand}')">&times;</button>
                </div>
            `;
        });

        // Rating filter
        if (this.filters.rating) {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Rating: ${this.filters.rating}+ stars
                    <button onclick="searchFilters.removeFilter('rating')">&times;</button>
                </div>
            `;
        }

        // Price range filter
        if (this.filters.priceRange.min > 0 || this.filters.priceRange.max < 10000) {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Price: $${this.filters.priceRange.min} - $${this.filters.priceRange.max}
                    <button onclick="searchFilters.removeFilter('priceRange')">&times;</button>
                </div>
            `;
        }

        // Location filter
        if (this.filters.location) {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Location: ${this.filters.location}
                    <button onclick="searchFilters.removeFilter('location')">&times;</button>
                </div>
            `;
        }

        // Availability filters
        this.filters.availability.forEach(availability => {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Availability: ${availability}
                    <button onclick="searchFilters.removeFilterFromArray('availability', '${availability}')">&times;</button>
                </div>
            `;
        });

        // Quick filter
        if (this.filters.quickFilter) {
            activeFiltersHTML += `
                <div class="active-filter-tag">
                    Filter: ${this.filters.quickFilter}
                    <button onclick="searchFilters.removeFilter('quickFilter')">&times;</button>
                </div>
            `;
        }

        activeFiltersContainer.innerHTML = activeFiltersHTML;
    }

    removeFilter(filterType) {
        switch (filterType) {
            case 'search':
                this.filters.search = '';
                document.getElementById('search-input').value = '';
                break;
            case 'rating':
                this.filters.rating = null;
                document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
                break;
            case 'priceRange':
                this.filters.priceRange = { min: 0, max: 10000 };
                document.getElementById('min-price').value = '';
                document.getElementById('max-price').value = '';
                document.getElementById('price-min-range').value = 0;
                document.getElementById('price-max-range').value = 10000;
                this.updatePriceRangeSlider();
                break;
            case 'location':
                this.filters.location = '';
                document.getElementById('location-filter').value = '';
                break;
            case 'quickFilter':
                this.filters.quickFilter = null;
                document.querySelectorAll('.quick-filter').forEach(btn => btn.classList.remove('active'));
                break;
        }
        this.applyFilters();
    }

    removeFilterFromArray(filterType, value) {
        const index = this.filters[filterType].indexOf(value);
        if (index > -1) {
            this.filters[filterType].splice(index, 1);
        }
        
        // Uncheck the corresponding checkbox
        const checkbox = document.querySelector(`input[name="${filterType === 'categories' ? 'category' : filterType === 'brands' ? 'brand' : 'availability'}"][value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
        
        this.applyFilters();
    }

    resetAllFilters() {
        this.filters = {
            search: '',
            categories: [],
            brands: [],
            rating: null,
            priceRange: { min: 0, max: 10000 },
            location: '',
            availability: [],
            quickFilter: null
        };
        
        // Reset all form elements
        document.getElementById('search-input').value = '';
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('location-filter').value = '';
        document.getElementById('price-min-range').value = 0;
        document.getElementById('price-max-range').value = 10000;
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('.quick-filter').forEach(btn => btn.classList.remove('active'));
        
        this.updatePriceRangeSlider();
        this.applyFilters();
    }

    viewProduct(productId) {
        console.log('Viewing product:', productId);
        // In a real application, this would navigate to a product detail page
        alert(`Product ID: ${productId}\nIn a real application, this would navigate to the product detail page.`);
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Initialize the search filters when DOM is loaded
let searchFilters;
document.addEventListener('DOMContentLoaded', () => {
    searchFilters = new SearchFilters();
});
