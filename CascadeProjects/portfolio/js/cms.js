// Simple CMS JavaScript
class ContentManagementSystem {
    constructor() {
        this.content = this.generateMockContent();
        this.filteredContent = [...this.content];
        this.selectedItems = new Set();
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.editingItem = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderContent();
        this.updatePagination();
    }

    generateMockContent() {
        const types = ['page', 'post', 'product', 'category'];
        const statuses = ['published', 'draft', 'archived'];
        const content = [];
        
        for (let i = 1; i <= 25; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            content.push({
                id: i,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
                slug: `${type}-${i}`,
                type: type,
                status: status,
                description: `This is a sample ${type} with rich content and engaging description. Perfect for demonstrating the CMS functionality.`,
                content: `<h2>Sample Content</h2><p>This is the full content for ${type} ${i}. It includes formatted text, links, and other elements to showcase the rich text editor capabilities.</p><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul>`,
                image: `https://picsum.photos/seed/content${i}/400/300`,
                featured: Math.random() > 0.7,
                tags: ['sample', 'demo', type],
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            });
        }
        
        return content;
    }

    setupEventListeners() {
        // Add content button
        document.getElementById('add-content-btn').addEventListener('click', () => {
            this.openContentModal();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentView = btn.dataset.view;
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderContent();
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchContent(e.target.value);
        });

        // Filter and sort
        document.getElementById('filter-type').addEventListener('change', () => {
            this.filterContent();
        });

        document.getElementById('sort-content').addEventListener('change', () => {
            this.sortContent();
        });

        // Bulk actions
        document.getElementById('bulk-actions-btn').addEventListener('click', () => {
            this.openBulkModal();
        });

        // Content form
        document.getElementById('content-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContent();
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal('content-modal');
        });

        // Save draft button
        document.getElementById('save-draft-btn').addEventListener('click', () => {
            this.saveDraft();
        });

        // Image upload
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('content-image').click();
        });

        document.getElementById('content-image').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Title to slug conversion
        document.getElementById('content-title').addEventListener('input', (e) => {
            if (!document.getElementById('content-slug').value) {
                const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim('-');
                document.getElementById('content-slug').value = slug;
            }
        });

        // Rich text editor
        this.setupEditor();

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                modal.classList.remove('active');
            });
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.openPreviewModal();
        });

        // Bulk action buttons
        document.querySelectorAll('.bulk-options button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.performBulkAction(btn.dataset.action);
            });
        });
    }

    setupEditor() {
        const editor = document.getElementById('content-editor');
        const contentTextarea = document.getElementById('content-content');
        
        document.querySelectorAll('.editor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                
                if (command === 'createLink') {
                    const url = prompt('Enter URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else if (command === 'insertImage') {
                    const url = prompt('Enter image URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else {
                    document.execCommand(command, false, null);
                }
                
                editor.focus();
            });
        });

        // Sync editor content with textarea
        editor.addEventListener('input', () => {
            contentTextarea.value = editor.innerHTML;
        });
    }

    renderContent() {
        const container = document.getElementById('content-grid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = this.filteredContent.slice(startIndex, endIndex);

        if (this.currentView === 'grid') {
            container.innerHTML = itemsToShow.map(item => this.createContentCard(item)).join('');
        } else {
            container.innerHTML = itemsToShow.map(item => this.createContentListItem(item)).join('');
        }

        // Add event listeners
        this.attachContentEventListeners();
    }

    createContentCard(item) {
        return `
            <div class="content-item" data-id="${item.id}">
                <div class="content-checkbox">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}">
                </div>
                <div class="content-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="placeholder"><i class="fas fa-image"></i></div>'}
                </div>
                <div class="content-details">
                    <span class="content-type ${item.type}">${item.type}</span>
                    <h3 class="content-title">${item.title}</h3>
                    <p class="content-description">${item.description}</p>
                    <div class="content-meta">
                        <span>Status: <span class="content-status ${item.status}">${item.status}</span></span>
                        <span>${this.formatDate(item.updatedAt)}</span>
                    </div>
                    <div class="content-actions">
                        <button class="action-btn edit" data-id="${item.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createContentListItem(item) {
        return `
            <div class="content-item" data-id="${item.id}">
                <div class="content-checkbox">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}">
                </div>
                <div class="content-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="placeholder"><i class="fas fa-image"></i></div>'}
                </div>
                <div class="content-details">
                    <div class="content-info">
                        <span class="content-type ${item.type}">${item.type}</span>
                        <h3 class="content-title">${item.title}</h3>
                        <p class="content-description">${item.description}</p>
                        <div class="content-meta">
                            <span>Status: <span class="content-status ${item.status}">${item.status}</span></span>
                            <span>Featured: ${item.featured ? 'Yes' : 'No'}</span>
                            <span>${this.formatDate(item.updatedAt)}</span>
                        </div>
                    </div>
                    <div class="content-actions">
                        <button class="action-btn edit" data-id="${item.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachContentEventListeners() {
        // Checkbox selection
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedItems.add(id);
                } else {
                    this.selectedItems.delete(id);
                }
                this.updateSelectionUI();
            });
        });

        // Edit buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.editContent(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.deleteContent(id);
            });
        });
    }

    updateSelectionUI() {
        document.querySelectorAll('.content-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            if (this.selectedItems.has(id)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    searchContent(query) {
        if (!query) {
            this.filteredContent = [...this.content];
        } else {
            this.filteredContent = this.content.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
        }
        
        this.currentPage = 1;
        this.renderContent();
        this.updatePagination();
    }

    filterContent() {
        const filterType = document.getElementById('filter-type').value;
        
        if (filterType === 'all') {
            this.filteredContent = [...this.content];
        } else {
            this.filteredContent = this.content.filter(item => item.type === filterType);
        }
        
        this.currentPage = 1;
        this.renderContent();
        this.updatePagination();
    }

    sortContent() {
        const sortBy = document.getElementById('sort-content').value;
        
        switch (sortBy) {
            case 'date-desc':
                this.filteredContent.sort((a, b) => b.updatedAt - a.updatedAt);
                break;
            case 'date-asc':
                this.filteredContent.sort((a, b) => a.updatedAt - b.updatedAt);
                break;
            case 'title-asc':
                this.filteredContent.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                this.filteredContent.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        this.renderContent();
    }

    openContentModal(item = null) {
        this.editingItem = item;
        const modal = document.getElementById('content-modal');
        const form = document.getElementById('content-form');
        
        if (item) {
            // Edit mode
            document.getElementById('modal-title').textContent = 'Edit Content';
            document.getElementById('content-title').value = item.title;
            document.getElementById('content-slug').value = item.slug;
            document.getElementById('content-type').value = item.type;
            document.getElementById('content-description').value = item.description;
            document.getElementById('content-editor').innerHTML = item.content;
            document.getElementById('content-content').value = item.content;
            document.getElementById('content-status').value = item.status;
            document.getElementById('content-featured').value = item.featured ? 'yes' : 'no';
            document.getElementById('content-tags').value = item.tags.join(', ');
            
            if (item.image) {
                document.getElementById('image-preview').innerHTML = `<img src="${item.image}" alt="Preview">`;
            }
        } else {
            // Add mode
            document.getElementById('modal-title').textContent = 'Add New Content';
            form.reset();
            document.getElementById('content-editor').innerHTML = '';
            document.getElementById('image-preview').innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>';
        }
        
        modal.classList.add('active');
    }

    editContent(id) {
        const item = this.content.find(c => c.id === id);
        if (item) {
            this.openContentModal(item);
        }
    }

    saveContent() {
        const formData = new FormData(document.getElementById('content-form'));
        const contentData = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            type: formData.get('type'),
            description: formData.get('description'),
            content: document.getElementById('content-content').value,
            status: formData.get('status'),
            featured: formData.get('featured') === 'yes',
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date()
        };
        
        if (this.editingItem) {
            // Update existing content
            const index = this.content.findIndex(c => c.id === this.editingItem.id);
            if (index !== -1) {
                this.content[index] = { ...this.content[index], ...contentData };
            }
        } else {
            // Create new content
            const newItem = {
                id: Math.max(...this.content.map(c => c.id)) + 1,
                ...contentData,
                createdAt: new Date(),
                image: document.querySelector('#image-preview img')?.src || null
            };
            this.content.unshift(newItem);
        }
        
        this.filteredContent = [...this.content];
        this.renderContent();
        this.closeModal('content-modal');
        this.showSuccess('Content saved successfully!');
    }

    saveDraft() {
        const formData = new FormData(document.getElementById('content-form'));
        const contentData = {
            title: formData.get('title') || 'Untitled Draft',
            slug: formData.get('slug') || 'untitled-draft',
            type: formData.get('type'),
            description: formData.get('description'),
            content: document.getElementById('content-content').value,
            status: 'draft',
            featured: formData.get('featured') === 'yes',
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date()
        };
        
        if (this.editingItem) {
            const index = this.content.findIndex(c => c.id === this.editingItem.id);
            if (index !== -1) {
                this.content[index] = { ...this.content[index], ...contentData };
            }
        } else {
            const newItem = {
                id: Math.max(...this.content.map(c => c.id)) + 1,
                ...contentData,
                createdAt: new Date(),
                image: document.querySelector('#image-preview img')?.src || null
            };
            this.content.unshift(newItem);
        }
        
        this.filteredContent = [...this.content];
        this.renderContent();
        this.closeModal('content-modal');
        this.showSuccess('Draft saved successfully!');
    }

    deleteContent(id) {
        if (confirm('Are you sure you want to delete this content?')) {
            this.content = this.content.filter(c => c.id !== id);
            this.filteredContent = this.filteredContent.filter(c => c.id !== id);
            this.renderContent();
            this.showSuccess('Content deleted successfully!');
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file');
            }
        }
    }

    openBulkModal() {
        const modal = document.getElementById('bulk-modal');
        document.getElementById('selected-count').textContent = this.selectedItems.size;
        modal.classList.add('active');
    }

    performBulkAction(action) {
        if (this.selectedItems.size === 0) {
            alert('No items selected');
            return;
        }
        
        if (action === 'delete' && !confirm(`Are you sure you want to delete ${this.selectedItems.size} items?`)) {
            return;
        }
        
        this.selectedItems.forEach(id => {
            const index = this.content.findIndex(c => c.id === id);
            if (index !== -1) {
                if (action === 'delete') {
                    this.content.splice(index, 1);
                } else {
                    this.content[index].status = action === 'publish' ? 'published' : 'draft';
                }
            }
        });
        
        this.filteredContent = [...this.content];
        this.selectedItems.clear();
        this.renderContent();
        this.closeModal('bulk-modal');
        this.showSuccess(`Bulk ${action} completed successfully!`);
    }

    openPreviewModal() {
        const modal = document.getElementById('preview-modal');
        const preview = document.getElementById('preview-container');
        
        // Create a sample preview
        preview.innerHTML = `
            <h1>Sample Page Preview</h1>
            <div class="meta">
                <span>Type: Page</span> • 
                <span>Status: Published</span> • 
                <span>Last updated: ${new Date().toLocaleDateString()}</span>
            </div>
            <img src="https://picsum.photos/seed/preview/800/400" alt="Preview Image">
            <div class="content">
                <h2>Welcome to Our Website</h2>
                <p>This is a preview of how your content will appear on the live site. The layout and styling will match your website's theme.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <ul>
                    <li>Responsive design</li>
                    <li>SEO optimized</li>
                    <li>Fast loading</li>
                </ul>
            </div>
        `;
        
        modal.classList.add('active');
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredContent.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="cms.goToPage(${this.currentPage - 1})">
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
            paginationHTML += `<button onclick="cms.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" onclick="cms.goToPage(${i})">${i}</button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="cms.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="cms.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderContent();
        this.updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showSuccess(message) {
        document.getElementById('success-message').textContent = message;
        document.getElementById('success-modal').classList.add('active');
        
        setTimeout(() => {
            document.getElementById('success-modal').classList.remove('active');
        }, 3000);
    }
}

// Initialize CMS when DOM is loaded
let cms;
document.addEventListener('DOMContentLoaded', () => {
    cms = new ContentManagementSystem();
});
