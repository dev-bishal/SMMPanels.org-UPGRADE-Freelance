// Modal System
class ModalSystem {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.activeModal = null;
        this.currentResolve = null;
    }

    createModal(options) {
        const {
            type = 'default',
            size = 'md',
            title = '',
            message = '',
            icon = null,
            content = '',
            buttons = [],
            onClose = null,
            closeOnOverlay = true,
            closeOnEscape = true
        } = options;

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Generate buttons HTML
        let buttonsHTML = '';
        if (buttons.length > 0) {
            buttonsHTML = `
                                <div class="modal-footer">
                                    ${buttons.map(btn => `
                                        <button class="btn ${btn.class || 'btn-outline'}" 
                                                data-action="${btn.action || 'close'}">
                                            ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                                            ${btn.text}
                                        </button>
                                    `).join('')}
                                </div>
                            `;
        }

        overlay.innerHTML = `
                            <div class="modal modal-${size}">
                                <button class="modal-close">
                                    <i class="fas fa-times"></i>
                                </button>
                                ${title ? `
                                    <div class="modal-header flex items-center gap-2">
                                        ${icon ? `<div class="modal-icon ${type}">${icon}</div>` : ''}
                                        <h2 class="text-xl font-semibold text-gray-800">${title}</h2>
                                    </div>
                                ` : ''}
                                <div class="modal-body">
                                    ${message ? `<p class="text-gray-600 mb-4">${message}</p>` : ''}
                                    ${content}
                                </div>
                                ${buttonsHTML}
                            </div>
                        `;

        // Store modal data
        overlay._modalData = { options, onClose };

        // Close button event
        const closeBtn = overlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(overlay));

        // Overlay click event
        if (closeOnOverlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal(overlay);
                }
            });
        }

        // Button click events
        overlay.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.closest('button').getAttribute('data-action');
                this.handleButtonAction(action, overlay);
            });
        });

        // Escape key event
        if (closeOnEscape) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && this.activeModal === overlay) {
                    this.closeModal(overlay);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            overlay._escapeHandler = escapeHandler;
        }

        return overlay;
    }

    handleButtonAction(action, modal) {
        let result = null;

        switch (action) {
            case 'close':
                result = 'Modal Closed';
                break;
            case 'confirm':
                result = 'Confirm Clicked';
                break;
            case 'delete':
                result = 'Delete Clicked';
                break;
            case 'submit':
                result = 'Submit Clicked';
                break;
            case 'try-again':
                result = 'Try Again Clicked';
                break;
            case 'contact-support':
                result = 'Contact Support Clicked';
                break;
            case 'view-docs':
                result = 'View Documentation Clicked';
                break;
            case 'proceed':
                result = 'Proceed Anyway Clicked';
                break;
            default:
                result = `Action: ${action}`;
        }

        // Close the modal
        this.closeModal(modal);

        // Resolve the promise with the result
        if (this.currentResolve) {
            this.currentResolve(result);
            this.currentResolve = null;
        }

        return result;
    }

    showModal(options) {
        return new Promise((resolve) => {
            // Store the resolve function
            this.currentResolve = resolve;

            // Close any existing modal
            if (this.activeModal) {
                this.closeModal(this.activeModal);
            }

            const modal = this.createModal(options);
            this.container.appendChild(modal);

            // Trigger animation
            setTimeout(() => modal.classList.add('active'), 10);

            this.activeModal = modal;
        });
    }

    closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('active');

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            if (modal._escapeHandler) {
                document.removeEventListener('keydown', modal._escapeHandler);
            }
            if (this.activeModal === modal) {
                this.activeModal = null;
            }
            // Call onClose callback if provided
            if (modal._modalData && modal._modalData.onClose) {
                modal._modalData.onClose();
            }

            // If modal was closed without a button action, resolve with 'Modal Closed'
            if (this.currentResolve) {
                this.currentResolve('Modal Closed');
                this.currentResolve = null;
            }
        }, 300);
    }

    closeAll() {
        const modals = this.container.querySelectorAll('.modal-overlay');
        modals.forEach(modal => this.closeModal(modal));
    }

    // Convenience methods for common modal types
    showSuccessModal(message) {
        return this.showModal({
            type: 'success',
            size: 'sm',
            icon: '<i class="fas fa-check"></i>',
            title: 'Success!',
            message: message,
            buttons: [
                {
                    text: 'Continue',
                    class: 'btn-primary',
                    action: 'close'
                }
            ],
            closeOnOverlay: false,
            closeOnEscape: false
        });
    }

    showLoadingModal() {
        return this.showModal({
            type: 'info',
            size: 'sm',
            title: 'Processing...',
            content: `
                                <div class="text-center">
                                    <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p class="text-gray-600">Please wait while we process your request.</p>
                                </div>
                            `,
            closeOnOverlay: false,
            closeOnEscape: false
        });
    }
}

// Initialize modal system
const modalSystem = new ModalSystem();

// Demo Modal Functions - Now returning Promises
function showConfirmationModal() {
    debugger
    return modalSystem.showModal({
        type: 'info',
        size: 'sm',
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this action? This cannot be undone.',
        buttons: [
            {
                text: 'Cancel',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Confirm',
                class: 'btn-primary',
                icon: 'fas fa-check',
                action: 'confirm'
            }
        ]
    });
}

function showDeleteModal() {
    return modalSystem.showModal({
        type: 'error',
        size: 'sm',
        icon: '<i class="fas fa-trash"></i>',
        title: 'Delete Item',
        message: 'This action will permanently delete this item and all associated data. This cannot be undone.',
        buttons: [
            {
                text: 'Cancel',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Delete',
                class: 'btn-danger',
                icon: 'fas fa-trash',
                action: 'delete'
            }
        ]
    });
}

function showSuccessModal(message = 'Operation completed successfully!') {
    return modalSystem.showSuccessModal(message);
}

function showErrorModal() {
    return modalSystem.showModal({
        type: 'error',
        size: 'md',
        icon: '<i class="fas fa-exclamation-triangle"></i>',
        title: 'Error Occurred',
        message: 'We encountered an issue while processing your request. Please try again in a few moments.',
        buttons: [
            {
                text: 'Try Again',
                class: 'btn-primary',
                action: 'try-again'
            },
            {
                text: 'Contact Support',
                class: 'btn-outline',
                action: 'contact-support'
            }
        ]
    });
}

function showWarningModal() {
    return modalSystem.showModal({
        type: 'warning',
        size: 'md',
        icon: '<i class="fas fa-exclamation"></i>',
        title: 'Warning',
        message: 'You are about to perform an action that may have unintended consequences. Please review your changes carefully.',
        buttons: [
            {
                text: 'Cancel',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Proceed Anyway',
                class: 'btn-primary',
                action: 'proceed'
            }
        ]
    });
}

function showFormModal(options = {}) {
    const {
        title = 'Form',
        content = '',
        buttons = [
            {
                text: 'Cancel',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Submit',
                class: 'btn-primary',
                action: 'submit'
            }
        ],
        size = 'lg',
        type = 'info'
    } = options;

    return modalSystem.showModal({
        type: type,
        size: size,
        title: title,
        content: content,
        buttons: buttons
    });
}
function showFormModal2() {
    return modalSystem.showModal({
        type: 'info',
        size: 'lg',
        title: 'Create New User',
        content: `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="input-group">
                        <label class="input-label">First Name</label>
                        <input type="text" class="input-field" placeholder="John">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Last Name</label>
                        <input type="text" class="input-field" placeholder="Doe">
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label">Email</label>
                    <input type="email" class="input-field" placeholder="john@example.com">
                </div>
                <div class="input-group">
                    <label class="input-label">Role</label>
                    <select class="input-field">
                        <option>User</option>
                        <option>Admin</option>
                        <option>Editor</option>
                    </select>
                </div>
            </div>
        `,
        buttons: [
            {
                text: 'Cancel',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Create User',
                class: 'btn-primary',
                icon: 'fas fa-plus',
                action: 'submit'
            }
        ]
    });
}

function showInfoModal() {
    return modalSystem.showModal({
        type: 'info',
        size: 'md',
        icon: '<i class="fas fa-info-circle"></i>',
        title: 'New Features Available',
        message: 'We\'ve added several new features to improve your experience. Check out the updated documentation to learn more about what\'s new.',
        buttons: [
            {
                text: 'View Documentation',
                class: 'btn-primary',
                action: 'view-docs'
            },
            {
                text: 'Maybe Later',
                class: 'btn-outline',
                action: 'close'
            }
        ]
    });
}

function showLoadingModal() {
    return modalSystem.showLoadingModal();
}

function showCustomModal() {
    return modalSystem.showModal({
        size: 'xl',
        title: 'Custom Modal Example',
        content: `
                            <div class="space-y-4">
                                <p class="text-gray-600">This is a fully customizable modal with any content you want to display.</p>
                                
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <h4 class="font-semibold text-gray-800 mb-2">Custom Content Section</h4>
                                    <p class="text-gray-600 text-sm">You can add forms, images, lists, or any other HTML content here.</p>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                                        <i class="fas fa-chart-bar text-blue-600 text-2xl mb-2"></i>
                                        <p class="text-sm text-blue-800">Analytics</p>
                                    </div>
                                    <div class="bg-green-50 rounded-lg p-4 text-center">
                                        <i class="fas fa-users text-green-600 text-2xl mb-2"></i>
                                        <p class="text-sm text-green-800">Team</p>
                                    </div>
                                </div>
                            </div>
                        `,
        buttons: [
            {
                text: 'Close',
                class: 'btn-outline',
                action: 'close'
            },
            {
                text: 'Save Changes',
                class: 'btn-primary',
                action: 'submit'
            }
        ]
    });
}

// Test function to demonstrate the new functionality
async function testModal(type, configuration) {
    const responseOutput = document.getElementById('responseOutput');
    let response;

    try {
        switch (type) {
            case 'delete':
                response = await showDeleteModal();
                break;
            case 'confirm':
                response = await showConfirmationModal();
                break;
            case 'success':
                response = await showSuccessModal('This is a test success message!');
                break;
            case 'error':
                response = await showErrorModal();
                break;
            case 'warning':
                response = await showWarningModal();
                break;
            case 'formCustom':
                response = await showFormModal(configuration);
                break;
            case 'form':
                response = await showFormModal2();
                break;
            case 'info':
                response = await showInfoModal();
                break;
            case 'custom':
                response = await showCustomModal();
                break;
        }

        responseOutput.innerHTML = `
                    <div class="text-green-600 font-medium">Modal Response:</div>
                    <div class="mt-1">${response}</div>
                    <div class="mt-2 text-sm text-gray-500">Timestamp: ${new Date().toLocaleTimeString()}</div>
                `;

        console.log(`Modal ${type} response:`, response);
    } catch (error) {
        responseOutput.innerHTML = `
                    <div class="text-red-600 font-medium">Error:</div>
                    <div class="mt-1">${error.message}</div>
                `;
        console.error('Modal error:', error);
    }
}


// Close all modals when clicking demo cards (prevent multiple modals)
/* document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.demo-card').forEach(card => {
        card.addEventListener('click', function(e) {
            modalSystem.closeAll();
        });
    });
}); */