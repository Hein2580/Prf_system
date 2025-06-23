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
            }
            
            .modal-content {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease-out;
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.2em;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .modal-close:hover {
                background-color: #f0f0f0;
            }
            
            .modal-body {
                padding: 20px;
                line-height: 1.5;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .modal-footer .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .modal-footer .btn-primary {
                background-color: #007bff;
                color: white;
            }
            
            .modal-footer .btn-primary:hover {
                background-color: #0056b3;
            }
            
            .modal-footer .btn-secondary {
                background-color: #6c757d;
                color: white;
            }
            
            .modal-footer .btn-secondary:hover {
                background-color: #545b62;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            [data-theme="dark"] .modal-content {
                background: #2c3e50;
                color: #ecf0f1;
            }
            
            [data-theme="dark"] .modal-header {
                border-bottom-color: #34495e;
            }
            
            [data-theme="dark"] .modal-footer {
                border-top-color: #34495e;
            }
            
            [data-theme="dark"] .modal-header h3 {
                color: #ecf0f1;
            }
            
            [data-theme="dark"] .modal-close {
                color: #bdc3c7;
            }
            
            [data-theme="dark"] .modal-close:hover {
                background-color: #34495e;
            }
            [data-theme="dark"] #modalInput {
                background-color: #34495e !important;
                color: #ecf0f1 !important;
                border-color: #4a5f7a !important;
            }
            
            [data-theme="dark"] #modalInput:focus {
                border-color: #3498db !important;
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
