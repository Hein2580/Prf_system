/**
 * Tools and utilities for EMS PRF System - Alpine.js Version
 * Compatible with Alpine.js stores and components
 */

// Alpine.js compatible alert function
window.showAlert = function(message, title = 'Notice') {
    // Check if Alpine is available
    if (typeof Alpine !== 'undefined' && Alpine.store) {
        return Alpine.store('ui').showAlert(message, title);
    }
    
    // Fallback to browser alert
    alert(title + ': ' + message);
    return Promise.resolve();
};

// Alpine.js compatible confirm function
window.showConfirm = function(message, title = 'Confirm') {
    // Check if Alpine is available
    if (typeof Alpine !== 'undefined' && Alpine.store) {
        return Alpine.store('ui').showConfirm(message, title);
    }
    
    // Fallback to browser confirm
    return Promise.resolve(confirm(title + ': ' + message));
};

// Alpine.js compatible prompt function
window.showPrompt = function(message, title = 'Input Required', defaultValue = '') {
    // Check if Alpine is available
    if (typeof Alpine !== 'undefined' && Alpine.store) {
        return new Promise((resolve) => {
            const input = prompt(title + ': ' + message, defaultValue);
            resolve(input);
        });
    }
    
    // Fallback to browser prompt
    return Promise.resolve(prompt(title + ': ' + message, defaultValue));
};

// Data management functions - kept for backward compatibility
function getAmbulances() {
    return JSON.parse(localStorage.getItem('ambulances') || '[]');
}

function saveAmbulances(arr) {
    localStorage.setItem('ambulances', JSON.stringify(arr));
}

// Checklist functions
function getChecklist(callSign) {
    return JSON.parse(localStorage.getItem(`checklist_${callSign}`) || '[]');
}

function saveChecklist(callSign, data) {
    localStorage.setItem(`checklist_${callSign}`, JSON.stringify(data));
}

function getChecklistItems(callSign) {
    return JSON.parse(localStorage.getItem(`checklistItems_${callSign}`) || 'null');
}

function saveChecklistItems(callSign, items) {
    localStorage.setItem(`checklistItems_${callSign}`, JSON.stringify(items));
}

// PRF functions
function getPRFs() {
    return JSON.parse(localStorage.getItem('prfs') || '[]');
}

function savePRFs(arr) {
    localStorage.setItem('prfs', JSON.stringify(arr));
}

function savePRF(data) {
    const prfs = getPRFs();
    prfs.push(data);
    savePRFs(prfs);
}

function loadPRF() {
    const saved = localStorage.getItem('currentPRF');
    return saved ? JSON.parse(saved) : null;
}

// System initialization
function initializeSystem() {
    // Initialize ambulances if not present
    if (!localStorage.getItem('ambulances')) {
        const defaultAmbulances = [
            { callSign: 'A1', status: 'Available', type: 'ALS', location: 'Station 1' },
            { callSign: 'A2', status: 'Available', type: 'BLS', location: 'Station 2' },
            { callSign: 'A3', status: 'Available', type: 'ALS', location: 'Station 3' },
            { callSign: 'A4', status: 'Available', type: 'BLS', location: 'Station 4' }
        ];
        saveAmbulances(defaultAmbulances);
    }
}

// Export all data
function exportAllData() {
    const data = {
        ambulances: getAmbulances(),
        trips: JSON.parse(localStorage.getItem('trips') || '[]'),
        prfs: getPRFs(),
        maintenance: JSON.parse(localStorage.getItem('maintenance') || '[]'),
        checklists: JSON.parse(localStorage.getItem('checklists') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `EMS_Data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import all data
function importAllData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.ambulances) saveAmbulances(data.ambulances);
        if (data.trips) localStorage.setItem('trips', JSON.stringify(data.trips));
        if (data.prfs) savePRFs(data.prfs);
        if (data.maintenance) localStorage.setItem('maintenance', JSON.stringify(data.maintenance));
        if (data.checklists) localStorage.setItem('checklists', JSON.stringify(data.checklists));
        
        // Refresh Alpine.js stores if available
        if (typeof Alpine !== 'undefined' && Alpine.store) {
            Alpine.store('ambulances').init();
            if (Alpine.store('trips')) Alpine.store('trips').init();
            if (Alpine.store('prfs')) Alpine.store('prfs').init();
            if (Alpine.store('maintenance')) Alpine.store('maintenance').init();
            if (Alpine.store('checklists')) Alpine.store('checklists').init();
        }
        
        showAlert('Data imported successfully!', 'Import Complete');
        
        // Refresh the page to update displays
        setTimeout(() => {
            location.reload();
        }, 1000);
        
    } catch (error) {
        showAlert('Error importing data: ' + error.message, 'Import Error');
    }
}

// Clear all data
async function clearAllData() {
    const confirmed = await showConfirm('This will delete ALL data including ambulances, trips, PRFs, and checklists. This action cannot be undone.\n\nAre you sure?', 'Clear All Data');
    
    if (confirmed) {
        localStorage.removeItem('ambulances');
        localStorage.removeItem('trips');
        localStorage.removeItem('prfs');
        localStorage.removeItem('maintenance');
        localStorage.removeItem('checklists');
        
        // Clear all checklist items
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('checklist_') || key.startsWith('checklistItems_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Reinitialize system
        initializeSystem();
        
        // Refresh Alpine.js stores if available
        if (typeof Alpine !== 'undefined' && Alpine.store) {
            Alpine.store('ambulances').init();
            if (Alpine.store('trips')) Alpine.store('trips').init();
            if (Alpine.store('prfs')) Alpine.store('prfs').init();
            if (Alpine.store('maintenance')) Alpine.store('maintenance').init();
            if (Alpine.store('checklists')) Alpine.store('checklists').init();
        }
        
        await showAlert('All data cleared successfully!', 'Data Cleared');
        location.reload();
    }
}

// Navigation setup - compatible with Alpine.js
function setupRoleBasedNavigation() {
    // This is now handled by Alpine.js stores and components
    // Keep for backward compatibility
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.role === 'Administrator') {
        // Admin has access to all pages
        return;
    }
    
    // Hide admin-only navigation items
    const adminNavItems = document.querySelectorAll('.admin-only');
    adminNavItems.forEach(item => {
        item.style.display = 'none';
    });
}

// Authentication utilities
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// PWA utilities
function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           (window.navigator && window.navigator.standalone) ||
           document.referrer.includes('android-app://');
}

function getPWADisplayMode() {
    if (isStandalone()) {
        return 'standalone';
    }
    return 'browser';
}

// Dark mode utilities
function toggleDarkMode() {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
        Alpine.store('ui').toggleDarkMode();
    } else {
        // Fallback
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const newDarkMode = !darkMode;
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

// Date and time utilities
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-ZA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(date) {
    return formatDate(date) + ' ' + formatTime(date);
}

// Validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateIdNumber(idNumber) {
    const idRegex = /^[0-9]{13}$/;
    return idRegex.test(idNumber);
}

// Number formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount);
}

function formatDistance(km) {
    return parseFloat(km).toFixed(1) + ' km';
}

// Initialize system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupRoleBasedNavigation();
    
    // Apply dark mode if set
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Export functions for global use
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.clearAllData = clearAllData;
window.setupRoleBasedNavigation = setupRoleBasedNavigation;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.requireAuth = requireAuth;
window.toggleDarkMode = toggleDarkMode;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateIdNumber = validateIdNumber;
window.formatCurrency = formatCurrency;
window.formatDistance = formatDistance;
window.isStandalone = isStandalone;
window.getPWADisplayMode = getPWADisplayMode;
