// Modal System
function createModal() {
    const existingModal = document.getElementById('customModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Notice</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p id="modalMessage"></p>
            </div>
            <div class="modal-footer">
                <button id="modalConfirm" class="btn btn-primary">OK</button>
                <button id="modalCancel" class="btn btn-secondary" style="display: none;">Cancel</button>
            </div>
        </div>
    `;

    if (!document.getElementById('modalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'modalStyles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease-out;
                padding: 1rem;
                box-sizing: border-box;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 100%;
                max-height: calc(100vh - 2rem);
                overflow-y: auto;
                animation: slideIn 0.3s ease-out;
                -webkit-overflow-scrolling: touch;
            }
            
            .modal-header {
                padding: 1.25rem;
                border-bottom: 2px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.25rem;
                font-weight: 600;
                line-height: 1.3;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .modal-close:hover {
                background-color: #f0f0f0;
            }
            
            .modal-body {
                padding: 1.25rem;
                line-height: 1.6;
                font-size: 1rem;
            }
            
            .modal-footer {
                padding: 1.25rem;
                border-top: 2px solid #e0e0e0;
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                flex-wrap: wrap;
            }
            
            .modal-footer .btn {
                padding: 0.875rem 1.5rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.2s;
                min-width: 100px;
                min-height: 44px;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .modal-footer .btn-primary {
                background-color: #007bff;
                color: white;
            }
            
            .modal-footer .btn-primary:hover {
                background-color: #0056b3;
                transform: translateY(-1px);
            }
            
            .modal-footer .btn-secondary {
                background-color: #6c757d;
                color: white;
            }
            
            .modal-footer .btn-secondary:hover {
                background-color: #545b62;
                transform: translateY(-1px);
            }
            
            /* Mobile-specific styles */
            @media (max-width: 480px) {
                .modal-overlay {
                    padding: 0.5rem;
                    align-items: flex-start;
                    padding-top: 2rem;
                }
                .modal-content {
                    max-width: 100%;
                    width: 100%;
                    margin: 0;
                    border-radius: 12px 12px 0 0;
                    max-height: calc(100vh - 2rem);
                }
                .modal-header {
                    padding: 1rem;
                }
                .modal-header h3 {
                    font-size: 1.1rem;
                }
                .modal-body {
                    padding: 1rem;
                    font-size: 0.95rem;
                }
                .modal-footer {
                    padding: 1rem;
                    justify-content: stretch;
                    gap: 0.5rem;
                }
                .modal-footer .btn {
                    flex: 1;
                    padding: 1rem;
                    font-size: 1rem;
                    min-height: 48px;
                }
            }
            
            /* Tablet styles */
            @media (min-width: 481px) and (max-width: 768px) {
                .modal-content {
                    max-width: 90%;
                }
                .modal-footer .btn {
                    min-height: 46px;
                    padding: 0.9rem 1.25rem;
                }
            }
            
            /* Input field styling in modals */
            #modalInput {
                width: 100%;
                padding: 0.875rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
                margin-top: 0.5rem;
                box-sizing: border-box;
                min-height: 44px;
                -webkit-appearance: none;
                appearance: none;
            }
            
            #modalInput:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            }
            
            /* Touch device optimizations */
            @media (hover: none) and (pointer: coarse) {
                .modal-footer .btn {
                    min-height: 48px;
                    min-width: 48px;
                }
                #modalInput {
                    min-height: 48px;
                    font-size: 16px; /* Prevents zoom on iOS */
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    transform: translateY(-30px); 
                    opacity: 0; 
                    scale: 0.95;
                }
                to { 
                    transform: translateY(0); 
                    opacity: 1; 
                    scale: 1;
                }
            }
            
            /* Dark mode support */
            [data-theme="dark"] .modal-content {
                background: #1f2937;
                color: #f9fafb;
            }
            
            [data-theme="dark"] .modal-header {
                border-bottom-color: #374151;
            }
            
            [data-theme="dark"] .modal-footer {
                border-top-color: #374151;
            }
            
            [data-theme="dark"] .modal-header h3 {
                color: #f9fafb;
            }
            
            [data-theme="dark"] .modal-close {
                color: #9ca3af;
            }
            
            [data-theme="dark"] .modal-close:hover {
                background-color: #374151;
            }
            
            [data-theme="dark"] #modalInput {
                background-color: #374151 !important;
                color: #f9fafb !important;
                border-color: #4b5563 !important;
            }
            
            [data-theme="dark"] #modalInput:focus {
                border-color: #3b82f6 !important;
                outline: none;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    return modal;
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => modal.remove(), 200);
    }
}


function showAlert(message, title = 'Notice') {
    return new Promise((resolve) => {
        const modal = createModal();
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modalConfirm').onclick = () => {
            closeModal();
            resolve(true);
        };
        
        // Close on overlay click
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(true);
            }
        };
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
                resolve(true);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
}


function showConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        const modal = createModal();
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modalCancel').style.display = 'inline-block';
        
        document.getElementById('modalConfirm').onclick = () => {
            closeModal();
            resolve(true);
        };
        
        document.getElementById('modalCancel').onclick = () => {
            closeModal();
            resolve(false);
        };
        
        // Close on overlay click (cancel)
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        };
        
        // Close on escape key (cancel)
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
                resolve(false);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
}


function showPrompt(message, title = 'Input Required', defaultValue = '') {
    return new Promise((resolve) => {
        const modal = createModal();
        document.getElementById('modalTitle').textContent = title;

        const modalBody = document.getElementById('modalMessage').parentElement;
        modalBody.innerHTML = `
            <p style="margin-bottom: 15px;">${message}</p>
            <input type="text" id="modalInput" value="${defaultValue}" style="
                width: 100%; 
                padding: 8px 12px; 
                border: 2px solid #ddd; 
                border-radius: 4px; 
                font-size: 14px;
                box-sizing: border-box;
                margin-bottom: 10px;
            " placeholder="Enter injury type...">
        `;
        
        document.getElementById('modalCancel').style.display = 'inline-block';
        
        const input = document.getElementById('modalInput');
        input.focus();
        input.select();
        
        document.getElementById('modalConfirm').onclick = () => {
            const value = input.value.trim();
            closeModal();
            resolve(value || null);
        };
        
        document.getElementById('modalCancel').onclick = () => {
            closeModal();
            resolve(null);
        };

        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                closeModal();
                resolve(value || null);
            }
        };
        
        // Close on overlay click (cancel)
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(null);
            }
        };
        
        // Close on escape key (cancel)
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
                resolve(null);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
}


function getAmbulances() {
  return JSON.parse(localStorage.getItem('ambulances') || '[]');
}
function saveAmbulances(arr) {
  localStorage.setItem('ambulances', JSON.stringify(arr));
}


function getChecklist(callSign) {
  return JSON.parse(localStorage.getItem('checklist_' + callSign) || '[]');
}
function saveChecklist(callSign, data) {
  localStorage.setItem('checklist_' + callSign, JSON.stringify(data));
}
function getChecklistItems(callSign) {
  return JSON.parse(localStorage.getItem('checklist_items_' + callSign) || 'null');
}
function saveChecklistItems(callSign, items) {
  localStorage.setItem('checklist_items_' + callSign, JSON.stringify(items));
}


function getPRFs() {
  return JSON.parse(localStorage.getItem('prfs') || '[]');
}
function savePRFs(arr) {
  localStorage.setItem('prfs', JSON.stringify(arr));
}
function savePRF(data) {
  localStorage.setItem('lastPRF', JSON.stringify(data));
}
function loadPRF() {
  return JSON.parse(localStorage.getItem('lastPRF') || 'null');
}


function initializeSystem() {
  if (getAmbulances().length === 0) {
    const defaultAmbulances = [
      { callSign: 'A1', status: 'Available', type: 'ALS', location: 'Station 1' },
      { callSign: 'A2', status: 'Available', type: 'BLS', location: 'Station 2' },
      { callSign: 'A3', status: 'Available', type: 'ALS', location: 'Station 3' },
      { callSign: 'A4', status: 'Available', type: 'BLS', location: 'Station 4' }
    ];
    saveAmbulances(defaultAmbulances);
  }
}


function exportAllData() {
  const data = {
    ambulances: getAmbulances(),
    prfs: getPRFs(),
    checklists: {},
    checklistItems: {}
  };
  
  // Export all checklist data
  getAmbulances().forEach(amb => {
    data.checklists[amb.callSign] = getChecklist(amb.callSign);
    data.checklistItems[amb.callSign] = getChecklistItems(amb.callSign);
  });
  
  return JSON.stringify(data, null, 2);
}

function importAllData(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.ambulances) saveAmbulances(data.ambulances);
    if (data.prfs) savePRFs(data.prfs);
    
    if (data.checklists) {
      Object.keys(data.checklists).forEach(callSign => {
        saveChecklist(callSign, data.checklists[callSign]);
      });
    }
    
    if (data.checklistItems) {
      Object.keys(data.checklistItems).forEach(callSign => {
        saveChecklistItems(callSign, data.checklistItems[callSign]);
      });
    }
    
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}


async function clearAllData() {
  const confirmed = await showConfirm('Are you sure you want to clear ALL data? This cannot be undone.', 'Clear All Data');
  if (confirmed) {
    localStorage.clear();
    initializeSystem();
    return true;
  }
  return false;
}


function setupRoleBasedNavigation() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (currentUser.role !== 'Administrator') {
    // Hide ambulance directory for non-admin users
    const ambulanceDirectoryLink = document.querySelector('nav a[href="ambulance-directory.html"]');
    if (ambulanceDirectoryLink) {
      ambulanceDirectoryLink.style.display = 'none';
    }
  }
}


initializeSystem();
