/**
 * Government of India LCA Tool - Main JavaScript
 * Handles common functionality across all pages
 */

// Global App Object
window.LCAApp = {
    // Configuration
    config: {
        apiBaseUrl: '/api',
        version: '1.0.0',
        debug: true
    },
    
    // Utility Functions
    utils: {
        // Show notification
        showNotification: function(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas ${this.getNotificationIcon(type)} text-${this.getNotificationColor(type)}-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">${message}</p>
                    </div>
                    <div class="ml-auto pl-3">
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Auto remove
            if (duration > 0) {
                setTimeout(() => {
                    notification.classList.add('hide');
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }
        },
        
        getNotificationIcon: function(type) {
            const icons = {
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-circle',
                'warning': 'fa-exclamation-triangle',
                'info': 'fa-info-circle'
            };
            return icons[type] || icons.info;
        },
        
        getNotificationColor: function(type) {
            const colors = {
                'success': 'green',
                'error': 'red',
                'warning': 'yellow',
                'info': 'blue'
            };
            return colors[type] || colors.info;
        },
        
        // Format numbers
        formatNumber: function(num, decimals = 2) {
            if (num === null || num === undefined || isNaN(num)) return '-';
            return new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        },
        
        // Format currency (Indian Rupees)
        formatCurrency: function(amount) {
            if (amount === null || amount === undefined || isNaN(amount)) return '-';
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        },
        
        // API Call wrapper
        apiCall: function(endpoint, options = {}) {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const finalOptions = { ...defaultOptions, ...options };
            
            if (this.config.debug) {
                console.log(`API Call: ${endpoint}`, finalOptions);
            }
            
            return fetch(`${this.config.apiBaseUrl}${endpoint}`, finalOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('API Error:', error);
                    this.showNotification('An error occurred while communicating with the server', 'error');
                    throw error;
                });
        },
        
        // Show loading spinner
        showLoading: function(element, message = 'Loading...') {
            element.innerHTML = `
                <div class="flex items-center justify-center py-8">
                    <div class="spinner mr-3"></div>
                    <span class="text-gray-600">${message}</span>
                </div>
            `;
        },
        
        // Validate form data
        validateForm: function(formData, rules) {
            const errors = {};
            
            for (const [field, rule] of Object.entries(rules)) {
                const value = formData[field];
                
                if (rule.required && (!value || value.toString().trim() === '')) {
                    errors[field] = `${rule.label || field} is required`;
                    continue;
                }
                
                if (value && rule.min && parseFloat(value) < rule.min) {
                    errors[field] = `${rule.label || field} must be at least ${rule.min}`;
                }
                
                if (value && rule.max && parseFloat(value) > rule.max) {
                    errors[field] = `${rule.label || field} must not exceed ${rule.max}`;
                }
                
                if (value && rule.pattern && !rule.pattern.test(value)) {
                    errors[field] = `${rule.label || field} format is invalid`;
                }
            }
            
            return errors;
        },
        
        // Display form errors
        displayFormErrors: function(errors) {
            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(el => el.remove());
            
            for (const [field, message] of Object.entries(errors)) {
                const input = document.querySelector(`[name="${field}"]`);
                if (input) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'form-error text-red-500 text-sm mt-1';
                    errorDiv.textContent = message;
                    input.parentNode.appendChild(errorDiv);
                    input.classList.add('border-red-500');
                }
            }
        },
        
        // Clear form errors
        clearFormErrors: function() {
            document.querySelectorAll('.form-error').forEach(el => el.remove());
            document.querySelectorAll('.border-red-500').forEach(el => {
                el.classList.remove('border-red-500');
            });
        },
        
        // Download file
        downloadFile: function(url, filename) {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        // Copy to clipboard
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showNotification('Copied to clipboard!', 'success', 2000);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('Copied to clipboard!', 'success', 2000);
            }
        }
    },
    
    // Common event handlers
    events: {
        // Initialize common event listeners
        init: function() {
            // Mobile menu toggle
            const mobileMenuButton = document.querySelector('.mobile-menu-button');
            const mobileNav = document.querySelector('.mobile-nav');
            
            if (mobileMenuButton && mobileNav) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileNav.classList.toggle('hidden');
                });
            }
            
            // Form validation on submit
            document.querySelectorAll('form[data-validate]').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const rules = JSON.parse(form.dataset.validate);
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    const errors = LCAApp.utils.validateForm(data, rules);
                    
                    if (Object.keys(errors).length > 0) {
                        e.preventDefault();
                        LCAApp.utils.displayFormErrors(errors);
                        LCAApp.utils.showNotification('Please correct the errors below', 'error');
                    } else {
                        LCAApp.utils.clearFormErrors();
                    }
                });
            });
            
            // Auto-save functionality
            document.querySelectorAll('[data-autosave]').forEach(input => {
                let timeoutId;
                input.addEventListener('input', () => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        this.saveFormData();
                    }, 2000);
                });
            });
        },
        
        // Save form data to localStorage
        saveFormData: function() {
            const forms = document.querySelectorAll('form[data-autosave]');
            forms.forEach(form => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                const formId = form.id || 'default-form';
                localStorage.setItem(`lca-form-${formId}`, JSON.stringify(data));
            });
        },
        
        // Load form data from localStorage
        loadFormData: function() {
            const forms = document.querySelectorAll('form[data-autosave]');
            forms.forEach(form => {
                const formId = form.id || 'default-form';
                const savedData = localStorage.getItem(`lca-form-${formId}`);
                
                if (savedData) {
                    try {
                        const data = JSON.parse(savedData);
                        for (const [key, value] of Object.entries(data)) {
                            const input = form.querySelector(`[name="${key}"]`);
                            if (input) {
                                input.value = value;
                            }
                        }
                    } catch (e) {
                        console.error('Error loading saved form data:', e);
                    }
                }
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('LCA App initialized');
    LCAApp.events.init();
    LCAApp.events.loadFormData();
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

// Export for use in other scripts
window.LCAApp = LCAApp;