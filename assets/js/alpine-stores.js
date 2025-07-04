/**
 * Alpine.js Stores for EMS PRF System
 * Centralized state management for all application data
 */

// Initialize Alpine.js stores
document.addEventListener('alpine:init', () => {
    
    // Authentication Store
    Alpine.store('auth', {
        isLoggedIn: false,
        currentUser: null,
        
        init() {
            this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        },
        
        login(username, password) {
            const users = [
                { username: 'admin', password: 'admin123', role: 'Administrator', name: 'Administrator' },
                { username: 'paramedic', password: 'password123', role: 'Paramedic', name: 'John Paramedic' },
                { username: 'emt', password: 'emt123', role: 'EMT', name: 'Jane EMT' }
            ];
            
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                user.loginTime = new Date().toISOString();
                this.currentUser = user;
                this.isLoggedIn = true;
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                return { success: true, user };
            }
            
            return { success: false, message: 'Invalid username or password' };
        },
        
        logout() {
            this.isLoggedIn = false;
            this.currentUser = null;
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        },
        
        assignAmbulance(callSign) {
            if (this.currentUser) {
                this.currentUser.assignedAmbulance = callSign;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        },
        
        get isAdmin() {
            return this.currentUser?.role === 'Administrator';
        },
        
        get isParamedic() {
            return this.currentUser?.role === 'Paramedic';
        },
        
        get isEMT() {
            return this.currentUser?.role === 'EMT';
        },
        
        get hasAmbulanceAccess() {
            return this.isAdmin || this.currentUser?.assignedAmbulance;
        }
    });
    
    // UI Store for modal and notification management
    Alpine.store('ui', {
        modal: {
            show: false,
            title: '',
            message: '',
            type: 'alert', // 'alert' or 'confirm'
            resolve: null
        },
        
        darkMode: false,
        
        init() {
            this.darkMode = localStorage.getItem('darkMode') === 'true';
            this.applyDarkMode();
        },
        
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode.toString());
            this.applyDarkMode();
        },
        
        applyDarkMode() {
            if (this.darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        },
        
        showAlert(message, title = 'Alert') {
            return new Promise((resolve) => {
                this.modal = {
                    show: true,
                    title,
                    message,
                    type: 'alert',
                    resolve
                };
            });
        },
        
        showConfirm(message, title = 'Confirm') {
            return new Promise((resolve) => {
                this.modal = {
                    show: true,
                    title,
                    message,
                    type: 'confirm',
                    resolve
                };
            });
        },
        
        closeModal(result = false) {
            if (this.modal.resolve) {
                this.modal.resolve(result);
            }
            this.modal.show = false;
            this.modal.resolve = null;
        },
        
        confirmModal() {
            this.closeModal(true);
        },
        
        cancelModal() {
            this.closeModal(false);
        }
    });
    
    // Ambulance Store
    Alpine.store('ambulances', {
        list: [],
        
        init() {
            this.list = JSON.parse(localStorage.getItem('ambulances') || '[]');
            if (this.list.length === 0) {
                this.initializeDefault();
            }
        },
        
        initializeDefault() {
            const defaultAmbulances = [
                { callSign: 'A1', status: 'Available', type: 'ALS', location: 'Station 1' },
                { callSign: 'A2', status: 'Available', type: 'BLS', location: 'Station 2' },
                { callSign: 'A3', status: 'Available', type: 'ALS', location: 'Station 3' },
                { callSign: 'A4', status: 'Available', type: 'BLS', location: 'Station 4' }
            ];
            this.list = defaultAmbulances;
            this.save();
        },
        
        save() {
            localStorage.setItem('ambulances', JSON.stringify(this.list));
        },
        
        add(ambulance) {
            // Check for duplicate call signs
            if (this.list.find(amb => amb.callSign === ambulance.callSign)) {
                throw new Error('Call sign already exists');
            }
            this.list.push(ambulance);
            this.save();
        },
        
        update(index, ambulance) {
            // Check for duplicate call signs (except current)
            const existing = this.list.find((amb, idx) => amb.callSign === ambulance.callSign && idx !== index);
            if (existing) {
                throw new Error('Call sign already exists');
            }
            this.list[index] = ambulance;
            this.save();
        },
        
        delete(index) {
            this.list.splice(index, 1);
            this.save();
        },
        
        toggleStatus(index) {
            const ambulance = this.list[index];
            ambulance.status = ambulance.status === 'Available' ? 'Out of Service' : 'Available';
            this.save();
            return ambulance;
        },
        
        setStatus(callSign, status) {
            const ambulance = this.list.find(amb => amb.callSign === callSign);
            if (ambulance) {
                ambulance.status = status;
                this.save();
            }
        },
        
        findByCallSign(callSign) {
            return this.list.find(amb => amb.callSign === callSign);
        },
        
        get available() {
            return this.list.filter(amb => amb.status === 'Available');
        },
        
        get onCall() {
            return this.list.filter(amb => amb.status === 'On Call');
        },
        
        get outOfService() {
            return this.list.filter(amb => amb.status === 'Out of Service');
        }
    });
    
    // Trip Log Store
    Alpine.store('trips', {
        list: [],
        currentTrip: null,
        
        init() {
            this.list = JSON.parse(localStorage.getItem('trips') || '[]');
            // Find any active trip for current user
            const currentUser = Alpine.store('auth').currentUser;
            if (currentUser) {
                const activeTrip = this.list.find(trip => 
                    trip.status === 'active' && 
                    trip.driver === currentUser.name
                );
                if (activeTrip) {
                    this.currentTrip = activeTrip;
                }
            }
        },
        
        save() {
            localStorage.setItem('trips', JSON.stringify(this.list));
        },
        
        startTrip(tripData) {
            const trip = {
                ...tripData,
                id: Date.now(),
                status: 'active',
                timestamp: new Date().toISOString(),
                timestamps: {},
                currentStatus: 'started'
            };
            
            this.list.push(trip);
            this.currentTrip = trip;
            this.save();
            
            // Update ambulance status
            Alpine.store('ambulances').setStatus(trip.ambulanceUnit, 'On Call');
            
            return trip;
        },
        
        updateTripStatus(status, timestamp = null) {
            if (!this.currentTrip) return;
            
            const time = timestamp || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            
            this.currentTrip.currentStatus = status;
            if (!this.currentTrip.timestamps) this.currentTrip.timestamps = {};
            this.currentTrip.timestamps[status] = time;
            
            // Update the trip in the list
            const tripIndex = this.list.findIndex(t => t.id === this.currentTrip.id);
            if (tripIndex !== -1) {
                this.list[tripIndex] = { ...this.currentTrip };
            }
            
            this.save();
        },
        
        completeTrip(endData = {}) {
            if (!this.currentTrip) return;
            
            const now = new Date();
            const endTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            this.currentTrip.endTime = endTime;
            this.currentTrip.status = 'completed';
            this.currentTrip.endTimestamp = now.toISOString();
            
            // Add end data
            Object.assign(this.currentTrip, endData);
            
            // Calculate total kilometers if both start and end mileage provided
            if (endData.endMileage && this.currentTrip.startMileage) {
                this.currentTrip.totalKilometers = (parseFloat(endData.endMileage) - parseFloat(this.currentTrip.startMileage)).toFixed(1);
            }
            
            // Update ambulance status back to available
            Alpine.store('ambulances').setStatus(this.currentTrip.ambulanceUnit, 'Available');
            
            // Update the trip in the list
            const tripIndex = this.list.findIndex(t => t.id === this.currentTrip.id);
            if (tripIndex !== -1) {
                this.list[tripIndex] = { ...this.currentTrip };
            }
            
            this.currentTrip = null;
            this.save();
        },
        
        cancelTrip() {
            if (!this.currentTrip) return;
            
            this.currentTrip.status = 'cancelled';
            
            // Update ambulance status back to available
            Alpine.store('ambulances').setStatus(this.currentTrip.ambulanceUnit, 'Available');
            
            // Update the trip in the list
            const tripIndex = this.list.findIndex(t => t.id === this.currentTrip.id);
            if (tripIndex !== -1) {
                this.list[tripIndex] = { ...this.currentTrip };
            }
            
            this.currentTrip = null;
            this.save();
        },
        
        delete(index) {
            this.list.splice(index, 1);
            this.save();
        },
        
        get todayTrips() {
            const today = new Date().toISOString().split('T')[0];
            const currentUser = Alpine.store('auth').currentUser;
            
            let todayTrips = this.list.filter(trip => trip.tripDate === today);
            
            // Filter by user's ambulance if not admin
            if (currentUser?.role !== 'Administrator' && currentUser?.assignedAmbulance) {
                todayTrips = todayTrips.filter(trip => trip.ambulanceUnit === currentUser.assignedAmbulance);
            }
            
            return todayTrips;
        },
        
        get activeTrips() {
            const currentUser = Alpine.store('auth').currentUser;
            let activeTrips = this.list.filter(trip => trip.status === 'active');
            
            // Filter by user's ambulance if not admin
            if (currentUser?.role !== 'Administrator' && currentUser?.assignedAmbulance) {
                activeTrips = activeTrips.filter(trip => trip.ambulanceUnit === currentUser.assignedAmbulance);
            }
            
            return activeTrips;
        },
        
        get completedTrips() {
            return this.todayTrips.filter(trip => trip.status === 'completed');
        },
        
        get totalKilometers() {
            return this.todayTrips.reduce((sum, trip) => sum + (parseFloat(trip.totalKilometers) || 0), 0);
        },
        
        get fuelUsed() {
            return this.todayTrips.reduce((sum, trip) => sum + (parseFloat(trip.fuelUsed) || 0), 0);
        }
    });
    
    // Maintenance Store
    Alpine.store('maintenance', {
        list: [],
        
        init() {
            this.list = JSON.parse(localStorage.getItem('maintenance') || '[]');
        },
        
        save() {
            localStorage.setItem('maintenance', JSON.stringify(this.list));
        },
        
        add(maintenance) {
            const record = {
                ...maintenance,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            };
            
            this.list.push(record);
            this.save();
            return record;
        },
        
        delete(id) {
            this.list = this.list.filter(record => record.id !== id);
            this.save();
        },
        
        get recent() {
            return this.list.slice(-20).reverse();
        }
    });
    
    // Initialize stores
    Alpine.store('auth').init();
    Alpine.store('ui').init();
    Alpine.store('ambulances').init();
    Alpine.store('trips').init();
    Alpine.store('maintenance').init();
});
