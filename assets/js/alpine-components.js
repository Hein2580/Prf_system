/**
 * Alpine.js Components for EMS PRF System
 * Reusable components for the application
 */

// Modal Component HTML Template
window.modalTemplate = `
<div x-data="{ show: $store.ui.modal.show }" 
     x-show="$store.ui.modal.show" 
     x-transition.opacity.duration.300ms
     style="display: none;"
     class="modal-overlay">
    <div class="modal-container" @click.away="$store.ui.cancelModal()">
        <div class="modal-header">
            <h3 x-text="$store.ui.modal.title"></h3>
        </div>
        <div class="modal-body">
            <p x-text="$store.ui.modal.message" style="white-space: pre-line;"></p>
        </div>
        <div class="modal-footer">
            <button type="button" 
                    x-show="$store.ui.modal.type === 'confirm'" 
                    @click="$store.ui.cancelModal()"
                    style="background: #666; color: white;">
                Cancel
            </button>
            <button type="button" 
                    @click="$store.ui.confirmModal()"
                    style="background: #1976d2; color: white;">
                <span x-text="$store.ui.modal.type === 'confirm' ? 'OK' : 'OK'"></span>
            </button>
        </div>
    </div>
</div>
`;

// Navigation Component
window.navigationComponent = function() {
    return {
        showMenu: false,
        
        init() {
            // Setup event listeners for navigation
            this.setupKeyboardNavigation();
        },
        
        setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.showMenu) {
                    this.closeMenu();
                }
            });
        },
        
        openMenu() {
            this.showMenu = true;
            document.body.style.overflow = 'hidden';
        },
        
        closeMenu() {
            this.showMenu = false;
            document.body.style.overflow = '';
        },
        
        toggleDarkMode() {
            this.$store.ui.toggleDarkMode();
        },
        
        async logout() {
            const confirmed = await this.$store.ui.showConfirm('Are you sure you want to logout?', 'Logout');
            if (confirmed) {
                this.$store.auth.logout();
            }
        },
        
        get userInitials() {
            const user = this.$store.auth.currentUser;
            if (!user?.name) return 'U';
            return user.name.split(' ').map(n => n[0]).join('');
        },
        
        get darkModeIcon() {
            return this.$store.ui.darkMode ? '☀️' : '🌙';
        },
        
        get darkModeLabel() {
            return this.$store.ui.darkMode ? 'Light Mode' : 'Dark Mode';
        }
    }
};

// Dashboard Component
window.dashboardComponent = () => ({
    stats: {
        activeTrips: 0,
        completedTrips: 0,
        totalKilometers: 0,
        fuelUsed: 0,
        todayPRFs: 0,
        checklistProgress: 0
    },
    
    init() {
        this.updateStats();
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
    },
    
    updateStats() {
        const trips = JSON.parse(localStorage.getItem('trips') || '[]');
        const prfs = JSON.parse(localStorage.getItem('prfs') || '[]');
        const currentUser = this.$store.auth.currentUser;
        const today = new Date().toISOString().split('T')[0];
        
        // Filter data based on user role
        let todayTrips = trips.filter(trip => trip.tripDate === today);
        let todayPRFs = prfs.filter(prf => prf.incidentDate === today);
        
        if (currentUser?.role !== 'Administrator' && currentUser?.assignedAmbulance) {
            todayTrips = todayTrips.filter(trip => trip.ambulanceUnit === currentUser.assignedAmbulance);
            todayPRFs = todayPRFs.filter(prf => prf.ambulanceUnit === currentUser.assignedAmbulance);
        }
        
        this.stats.activeTrips = todayTrips.filter(trip => trip.status === 'active').length;
        this.stats.completedTrips = todayTrips.filter(trip => trip.status === 'completed').length;
        this.stats.totalKilometers = todayTrips.reduce((sum, trip) => sum + (parseFloat(trip.totalKilometers) || 0), 0);
        this.stats.fuelUsed = todayTrips.reduce((sum, trip) => sum + (parseFloat(trip.fuelUsed) || 0), 0);
        this.stats.todayPRFs = todayPRFs.length;
        
        // Calculate checklist progress
        if (currentUser?.assignedAmbulance) {
            const checklist = JSON.parse(localStorage.getItem('checklists') || '{}');
            const items = JSON.parse(localStorage.getItem(`checklistItems_${currentUser.assignedAmbulance}`) || 'null');
            
            if (items && items.length > 0) {
                const ambulanceChecklist = checklist[currentUser.assignedAmbulance] || [];
                let completed = 0;
                
                items.forEach((item, idx) => {
                    if (typeof item === 'object') {
                        if (item.current >= item.required) completed++;
                    } else {
                        if (ambulanceChecklist[idx]) completed++;
                    }
                });
                
                this.stats.checklistProgress = Math.round((completed / items.length) * 100);
            } else {
                this.stats.checklistProgress = 0;
            }
        }
    }
});

// Ambulance Directory Component
window.ambulanceDirectoryComponent = () => ({
    ambulances: [],
    editingIndex: -1,
    editForm: {
        callSign: '',
        status: 'Available',
        type: 'ALS',
        location: ''
    },
    
    init() {
        this.loadAmbulances();
    },
    
    loadAmbulances() {
        this.ambulances = this.$store.ambulances.list;
    },
    
    toggleStatus(index) {
        try {
            this.$store.ambulances.toggleStatus(index);
            this.loadAmbulances();
        } catch (error) {
            this.$store.ui.showAlert(error.message, 'Error');
        }
    },
    
    startEdit(index) {
        this.editingIndex = index;
        const ambulance = this.ambulances[index];
        this.editForm = { ...ambulance };
    },
    
    cancelEdit() {
        this.editingIndex = -1;
        this.editForm = { callSign: '', status: 'Available', type: 'ALS', location: '' };
    },
    
    saveEdit() {
        try {
            if (this.editingIndex === -1) {
                this.$store.ambulances.add(this.editForm);
            } else {
                this.$store.ambulances.update(this.editingIndex, this.editForm);
            }
            this.loadAmbulances();
            this.cancelEdit();
        } catch (error) {
            this.$store.ui.showAlert(error.message, 'Error');
        }
    },
    
    deleteAmbulance(index) {
        this.$store.ui.showConfirm('Delete this ambulance?', 'Delete Ambulance').then((confirmed) => {
            if (confirmed) {
                this.$store.ambulances.delete(index);
                this.loadAmbulances();
            }
        });
    },
    
    assignToUser(callSign) {
        this.$store.auth.assignAmbulance(callSign);
        this.$store.ui.showAlert(`Assigned ${callSign} to your account`, 'Assignment Updated');
    }
});

// Inject modal into DOM when Alpine is ready
document.addEventListener('alpine:init', () => {
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.modalTemplate;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add mobile navigation styles if not already present
    if (!document.querySelector('#mobile-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-nav-styles';
        style.textContent = `
            /* Mobile Navigation Styles */
            .hamburger-btn {
                position: fixed;
                top: 1rem;
                right: 1rem;
                z-index: 1000;
                background: #1976d2;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: none;
            }
            
            .fab {
                position: fixed;
                bottom: 80px;
                right: 1rem;
                z-index: 1000;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 56px;
                height: 56px;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: none;
                text-decoration: none;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            .fab:hover {
                transform: scale(1.1);
                text-decoration: none;
                color: white;
            }
            
            .bottom-nav {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e0e0e0;
                display: none;
                z-index: 999;
                padding: 0.5rem 0;
            }
            
            .bottom-nav-content {
                display: flex;
                justify-content: space-around;
                align-items: center;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .bottom-nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                color: #666;
                padding: 0.25rem;
                min-width: 60px;
                transition: color 0.2s;
            }
            
            .bottom-nav-item.active {
                color: #1976d2;
            }
            
            .bottom-nav-icon {
                font-size: 1.2rem;
                margin-bottom: 0.25rem;
            }
            
            .bottom-nav-label {
                font-size: 0.7rem;
                font-weight: 500;
            }
            
            .slide-menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1100;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }
            
            .slide-menu-overlay.open {
                opacity: 1;
                visibility: visible;
            }
            
            .slide-menu {
                position: fixed;
                top: 0;
                right: 0;
                width: 280px;
                height: 100%;
                background: white;
                z-index: 1200;
                transform: translateX(100%);
                transition: transform 0.3s;
                overflow-y: auto;
                padding: 1rem 0;
            }
            
            .slide-menu.open {
                transform: translateX(0);
            }
            
            .user-profile {
                padding: 1.5rem 1rem;
                border-bottom: 1px solid #e0e0e0;
                text-align: center;
            }
            
            .user-avatar-menu {
                width: 60px;
                height: 60px;
                background: #1976d2;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 1.5rem;
                margin: 0 auto 1rem auto;
            }
            
            .user-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 0.25rem;
            }
            
            .user-role {
                color: #666;
                font-size: 0.9rem;
            }
            
            .menu-section {
                border-bottom: 1px solid #e0e0e0;
                padding: 0.5rem 0;
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                padding: 1rem 1.5rem;
                text-decoration: none;
                color: #333;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .menu-item:hover {
                background: #f5f5f5;
                text-decoration: none;
                color: #333;
            }
            
            .menu-icon {
                font-size: 1.2rem;
                margin-right: 1rem;
                width: 20px;
                text-align: center;
            }
            
            .menu-label {
                flex: 1;
                font-weight: 500;
            }
            
            .dark-mode .bottom-nav {
                background: #1f2937;
                border-top-color: #374151;
            }
            
            .dark-mode .slide-menu {
                background: #1f2937;
                color: #f9fafb;
            }
            
            .dark-mode .user-name {
                color: #f9fafb;
            }
            
            .dark-mode .user-role {
                color: #9ca3af;
            }
            
            .dark-mode .menu-section {
                border-bottom-color: #374151;
            }
            
            .dark-mode .menu-item {
                color: #f9fafb;
            }
            
            .dark-mode .menu-item:hover {
                background: #374151;
                color: #f9fafb;
            }
            
            /* Show mobile navigation on mobile devices */
            @media (max-width: 768px) {
                .hamburger-btn,
                .fab,
                .bottom-nav {
                    display: flex;
                }
                
                nav {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add mobile navigation HTML if on mobile
    if (window.innerWidth <= 768) {
        addMobileNavigation();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            addMobileNavigation();
        } else {
            removeMobileNavigation();
        }
    });
});

function addMobileNavigation() {
    // Don't add if already exists
    if (document.querySelector('.hamburger-btn')) return;
    
    const currentPage = getCurrentPage();
    
    // Add hamburger button
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.innerHTML = '☰';
    hamburgerBtn.setAttribute('x-data', '{}');
    hamburgerBtn.setAttribute('@click', '$refs.navComponent.openMenu()');
    document.body.appendChild(hamburgerBtn);
    
    // Add FAB
    const fab = document.createElement('a');
    fab.className = 'fab';
    fab.href = 'prf-form.html';
    fab.title = 'Quick PRF Form';
    fab.innerHTML = '📋';
    document.body.appendChild(fab);
    
    // Add bottom navigation
    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav';
    bottomNav.innerHTML = `
        <div class="bottom-nav-content">
            <a href="dashboard.html" class="bottom-nav-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
                <div class="bottom-nav-icon">🏠</div>
                <div class="bottom-nav-label">Home</div>
            </a>
            <a href="checklist.html" class="bottom-nav-item ${currentPage === 'checklist.html' ? 'active' : ''}">
                <div class="bottom-nav-icon">✅</div>
                <div class="bottom-nav-label">Check</div>
            </a>
            <a href="trip-log.html" class="bottom-nav-item ${currentPage === 'trip-log.html' ? 'active' : ''}">
                <div class="bottom-nav-icon">📜</div>
                <div class="bottom-nav-label">Trips</div>
            </a>
            <a href="settings.html" class="bottom-nav-item ${currentPage === 'settings.html' ? 'active' : ''}">
                <div class="bottom-nav-icon">⚙️</div>
                <div class="bottom-nav-label">Settings</div>
            </a>
        </div>
    `;
    document.body.appendChild(bottomNav);
    
    // Add slide menu
    const slideMenuOverlay = document.createElement('div');
    slideMenuOverlay.setAttribute('x-data', '{}');
    slideMenuOverlay.setAttribute('x-show', '$refs.navComponent && $refs.navComponent.showMenu');
    slideMenuOverlay.setAttribute('x-transition.opacity.duration.300ms');
    slideMenuOverlay.setAttribute('@click', '$refs.navComponent.closeMenu()');
    slideMenuOverlay.className = 'slide-menu-overlay';
    slideMenuOverlay.style.display = 'none';
    document.body.appendChild(slideMenuOverlay);
    
    const slideMenu = document.createElement('div');
    slideMenu.setAttribute('x-data', 'navigationComponent()');
    slideMenu.setAttribute('x-ref', 'navComponent');
    slideMenu.setAttribute('x-init', 'init()');
    slideMenu.setAttribute('x-show', 'showMenu');
    slideMenu.setAttribute('x-transition:enter', 'transition ease-out duration-300');
    slideMenu.setAttribute('x-transition:enter-start', 'transform translate-x-full');
    slideMenu.setAttribute('x-transition:enter-end', 'transform translate-x-0');
    slideMenu.setAttribute('x-transition:leave', 'transition ease-in duration-300');
    slideMenu.setAttribute('x-transition:leave-start', 'transform translate-x-0');
    slideMenu.setAttribute('x-transition:leave-end', 'transform translate-x-full');
    slideMenu.className = 'slide-menu';
    slideMenu.style.display = 'none';
    slideMenu.innerHTML = `
        <!-- User Profile Section -->
        <div class="user-profile">
            <div class="user-avatar-menu" x-text="userInitials"></div>
            <div class="user-name" x-text="$store.auth.currentUser?.name || 'Unknown User'"></div>
            <div class="user-role" x-text="$store.auth.currentUser?.role || 'Unknown Role'"></div>
        </div>

        <!-- Navigation Items -->
        <div class="menu-section">
            <a href="dashboard.html" class="menu-item" @click="closeMenu()">
                <span class="menu-icon">🏠</span>
                <span class="menu-label">Dashboard</span>
            </a>
            <a href="ambulance-directory.html" class="menu-item" @click="closeMenu()" x-show="$store.auth.isAdmin">
                <span class="menu-icon">🚑</span>
                <span class="menu-label">Ambulance Directory</span>
            </a>
            <a href="checklist.html" class="menu-item" @click="closeMenu()">
                <span class="menu-icon">✅</span>
                <span class="menu-label">Checklist</span>
            </a>
            <a href="prf-form.html" class="menu-item" @click="closeMenu()">
                <span class="menu-icon">📋</span>
                <span class="menu-label">PRF Form</span>
            </a>
            <a href="trip-log.html" class="menu-item" @click="closeMenu()">
                <span class="menu-icon">📜</span>
                <span class="menu-label">Trip Log</span>
            </a>
            <a href="settings.html" class="menu-item" @click="closeMenu()">
                <span class="menu-icon">⚙️</span>
                <span class="menu-label">Settings</span>
            </a>
        </div>

        <!-- Settings & Options -->
        <div class="menu-section">
            <button class="menu-item" @click="toggleDarkMode()">
                <span class="menu-icon" x-text="darkModeIcon"></span>
                <span class="menu-label" x-text="darkModeLabel"></span>
            </button>
        </div>

        <!-- Account Actions -->
        <div class="menu-section">
            <button class="menu-item" @click="logout()" style="color: #dc2626;">
                <span class="menu-icon">🚪</span>
                <span class="menu-label">Logout</span>
            </button>
        </div>
    `;
    document.body.appendChild(slideMenu);
}

function removeMobileNavigation() {
    document.querySelector('.hamburger-btn')?.remove();
    document.querySelector('.fab')?.remove();
    document.querySelector('.bottom-nav')?.remove();
    document.querySelector('.slide-menu-overlay')?.remove();
    document.querySelector('.slide-menu')?.remove();
}

function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
} 