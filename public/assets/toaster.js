// Toast Notification System with Position Support
class ToastSystem {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Set();
        this.currentPosition = 'top-right';
    }

    setPosition(position) {
        // Remove all position classes
        this.container.className = 'toast-container';
        // Add new position class
        this.container.classList.add(position);
        this.currentPosition = position;

        // Update active state in position buttons
        document.querySelectorAll('.position-option').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            dismissible = true
        } = options;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
                    <div class="toast-icon">
                        <i class="fas ${this.getIcon(type)}"></i>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-message">${message}</div>
                    </div>
                    ${dismissible ? '<button class="toast-close"><i class="fas fa-times"></i></button>' : ''}
                    ${duration > 0 ? `<div class="progress-bar" style="animation-duration: ${duration}ms"></div>` : ''}
                `;

        // Add to container based on position
        if (this.currentPosition.includes('bottom')) {
            this.container.appendChild(toast);
        } else {
            this.container.insertBefore(toast, this.container.firstChild);
        }

        this.toasts.add(toast);

        // Show animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove if duration is set
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        // Close button event
        if (dismissible) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.remove(toast));
        }

        return toast;
    }

    remove(toast) {
        if (!this.toasts.has(toast)) return;

        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(toast);
        }, 300);
    }

    clearAll() {
        this.toasts.forEach(toast => this.remove(toast));
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check',
            error: 'fa-exclamation',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info'
        };
        return icons[type] || 'fa-info';
    }
}

// Initialize toast system
const toastSystem = new ToastSystem();

// Position Change Function
function changeToastPosition(position) {
    toastSystem.setPosition(position);

    // Show a confirmation toast in the new position
    toastSystem.show({
        type: 'info',
        title: 'Position Changed',
        message: `Toasts will now appear in the ${position.replace('-', ' ')}`,
        duration: 3000
    });
}

// Demo Functions
function showSuccessToast() {
    toastSystem.show({
        type: 'success',
        title: 'Success!',
        message: 'Your action was completed successfully.',
        duration: 5000
    });
}

function showErrorToast() {
    toastSystem.show({
        type: 'error',
        title: 'Error!',
        message: 'Something went wrong. Please try again.',
        duration: 6000
    });
}

function showWarningToast() {
    toastSystem.show({
        type: 'warning',
        title: 'Warning!',
        message: 'This action cannot be undone.',
        duration: 7000
    });
}

function showInfoToast() {
    toastSystem.show({
        type: 'info',
        title: 'Information',
        message: 'Here is some important information for you.',
        duration: 4000
    });
}

function showCustomToast() {
    toastSystem.show({
        type: 'info',
        title: 'Custom Notification',
        message: 'This is a custom toast with different settings.',
        duration: 8000,
        dismissible: true
    });
}

function clearAllToasts() {
    toastSystem.clearAll();
}

// Simulated Actions
function simulateUserRegistration() {
    toastSystem.show({
        type: 'success',
        title: 'User Registered',
        message: 'New user has been successfully added to the system.',
        duration: 4000
    });
}

function simulateOrderProcessing() {
    toastSystem.show({
        type: 'info',
        title: 'Processing Orders',
        message: 'Processing 15 pending orders...',
        duration: 3000
    });

    // Simulate completion after delay
    setTimeout(() => {
        toastSystem.show({
            type: 'success',
            title: 'Orders Processed',
            message: 'All orders have been successfully processed.',
            duration: 4000
        });
    }, 2000);
}

function simulateDataExport() {
    toastSystem.show({
        type: 'info',
        title: 'Export Started',
        message: 'Preparing your data for export...',
        duration: 2000
    });

    setTimeout(() => {
        toastSystem.show({
            type: 'success',
            title: 'Export Complete',
            message: 'Your data has been exported successfully.',
            duration: 4000
        });
    }, 1500);
}

// Show notifications on button click
/* document.getElementById('show-notifications').addEventListener('click', function () {
    showSuccessToast();
    setTimeout(showInfoToast, 500);
    setTimeout(showWarningToast, 1000);
    setTimeout(showErrorToast, 1500);
}); */

