/**
 * Modern Navigation System for EMS PRF
 * Provides consistent mobile-friendly navigation across all pages
 */

// Navigation configuration
const NAV_CONFIG = {
  pages: {
    'dashboard.html': { icon: '🏠', label: 'Home', primary: true },
    'ambulance-directory.html': { icon: '🚑', label: 'Fleet', primary: true },
    'checklist.html': { icon: '✅', label: 'Check', primary: true },
    'trip-log.html': { icon: '📜', label: 'Trips', primary: true },
    'prf-form.html': { icon: '📋', label: 'PRF Form', fab: true },
    'settings.html': { icon: '⚙️', label: 'Settings', menu: true }
  },
  fab: {
    href: 'prf-form.html',
    icon: '📋',
    title: 'Quick PRF Form'
  }
};

/**
 * Initialize modern navigation system
 */
function initModernNavigation() {
  createMobileNavigation();
  setupNavigationHandlers();
  updateUserInfo();
  applyDarkMode();
}

/**
 * Create mobile navigation HTML
 */
function createMobileNavigation() {
  const currentPage = getCurrentPage();
  
  // Create hamburger button
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'hamburger-btn';
  hamburgerBtn.id = 'hamburgerBtn';
  hamburgerBtn.innerHTML = '<span>☰</span>';
  document.body.appendChild(hamburgerBtn);
  
  // Create floating action button
  const fab = document.createElement('a');
  fab.className = 'fab';
  fab.href = NAV_CONFIG.fab.href;
  fab.title = NAV_CONFIG.fab.title;
  fab.innerHTML = NAV_CONFIG.fab.icon;
  document.body.appendChild(fab);
  
  // Create bottom navigation
  const bottomNav = document.createElement('div');
  bottomNav.className = 'bottom-nav';
  
  Object.entries(NAV_CONFIG.pages).forEach(([page, config]) => {
    if (config.primary) {
      const navItem = document.createElement('a');
      navItem.href = page;
      navItem.className = `bottom-nav-item ${currentPage === page ? 'active' : ''}`;
      navItem.innerHTML = `
        <div class="bottom-nav-icon">${config.icon}</div>
        <div class="bottom-nav-label">${config.label}</div>
      `;
      bottomNav.appendChild(navItem);
    }
  });
  
  document.body.appendChild(bottomNav);
  
  // Create slide-out menu
  createSlideMenu();
}

/**
 * Create slide-out menu
 */
function createSlideMenu() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'slide-menu-overlay';
  overlay.id = 'menuOverlay';
  document.body.appendChild(overlay);
  
  // Create menu
  const menu = document.createElement('div');
  menu.className = 'slide-menu';
  menu.id = 'slideMenu';
  
  menu.innerHTML = `
    <!-- User Profile Section -->
    <div class="user-profile">
      <div class="user-avatar-menu" id="userAvatarMenu">--</div>
      <div class="user-name" id="userNameMenu">Loading...</div>
      <div class="user-role" id="userRoleMenu">--</div>
    </div>

    <!-- Navigation Items -->
    <div class="menu-section">
      ${Object.entries(NAV_CONFIG.pages).map(([page, config]) => `
        <a href="${page}" class="menu-item">
          <span class="menu-icon">${config.icon}</span>
          <span class="menu-label">${config.label}</span>
        </a>
      `).join('')}
    </div>

    <!-- Settings & Options -->
    <div class="menu-section">
      <button class="menu-item" id="darkModeToggle">
        <span class="menu-icon">🌙</span>
        <span class="menu-label">Dark Mode</span>
      </button>
    </div>

    <!-- Account Actions -->
    <div class="menu-section">
      <button class="menu-item" id="logoutBtnMenu" style="color: #dc2626;">
        <span class="menu-icon">🚪</span>
        <span class="menu-label">Logout</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(menu);
}

/**
 * Setup navigation event handlers
 */
function setupNavigationHandlers() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const logoutBtnMenu = document.getElementById('logoutBtnMenu');
  
  // Hamburger menu toggle
  hamburgerBtn?.addEventListener('click', function() {
    slideMenu.classList.add('open');
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  
  // Close menu when clicking overlay
  menuOverlay?.addEventListener('click', function() {
    closeMenu();
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && slideMenu?.classList.contains('open')) {
      closeMenu();
    }
  });
  
  // Dark mode toggle
  darkModeToggle?.addEventListener('click', function() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    
    // Update toggle text
    const icon = darkModeToggle.querySelector('.menu-icon');
    const label = darkModeToggle.querySelector('.menu-label');
    if (isDarkMode) {
      icon.textContent = '☀️';
      label.textContent = 'Light Mode';
    } else {
      icon.textContent = '🌙';
      label.textContent = 'Dark Mode';
    }
  });
  
  // Menu logout
  logoutBtnMenu?.addEventListener('click', async function() {
    const confirmed = window.showConfirm ? 
      await showConfirm('Are you sure you want to logout?', 'Logout') :
      confirm('Are you sure you want to logout?');
      
    if (confirmed) {
      localStorage.removeItem('isLoggedIn');
      if (localStorage.getItem('rememberLogin') !== 'true') {
        localStorage.removeItem('currentUser');
      }
      window.location.href = 'index.html';
    }
  });
  
  // Close menu when navigating
  document.querySelectorAll('.menu-item[href]').forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
}

/**
 * Close slide menu
 */
function closeMenu() {
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  slideMenu?.classList.remove('open');
  menuOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Update user info in navigation
 */
function updateUserInfo() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser) {
    const userNameMenu = document.getElementById('userNameMenu');
    const userRoleMenu = document.getElementById('userRoleMenu');
    const userAvatarMenu = document.getElementById('userAvatarMenu');
    
    if (userNameMenu) userNameMenu.textContent = currentUser.name;
    if (userRoleMenu) userRoleMenu.textContent = currentUser.role;
    
    if (userAvatarMenu) {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('');
      userAvatarMenu.textContent = initials;
    }
  }
}

/**
 * Apply dark mode if saved
 */
function applyDarkMode() {
  if (localStorage.getItem('darkMode') === null) {
    localStorage.setItem('darkMode', 'true');
    document.body.classList.add('dark-mode');
  } else if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

/**
 * Get current page filename
 */
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

/**
 * Hide navigation elements that don't exist on current page
 */
function cleanupNavigation() {
  // Remove any existing mobile nav elements to prevent duplicates
  const existingElements = [
    '.hamburger-btn',
    '.fab', 
    '.bottom-nav',
    '.slide-menu',
    '.slide-menu-overlay'
  ];
  
  existingElements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.remove();
    }
  });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we're on a logged-in page (not index/landing) AND on mobile
  const currentPage = getCurrentPage();
  const publicPages = ['index.html', 'landing.html'];
  const isMobile = window.innerWidth < 768;
  
  if (!publicPages.includes(currentPage) && localStorage.getItem('isLoggedIn') === 'true' && isMobile) {
    cleanupNavigation();
    initModernNavigation();
  }
});

// Re-check on window resize
window.addEventListener('resize', function() {
  const currentPage = getCurrentPage();
  const publicPages = ['index.html', 'landing.html'];
  const isMobile = window.innerWidth < 768;
  
  if (!publicPages.includes(currentPage) && localStorage.getItem('isLoggedIn') === 'true') {
    if (isMobile) {
      // Initialize mobile nav if not already present
      if (!document.querySelector('.bottom-nav')) {
        cleanupNavigation();
        initModernNavigation();
      }
    } else {
      // Remove mobile nav on desktop
      cleanupNavigation();
    }
  }
});

// Export for manual initialization
window.initModernNavigation = initModernNavigation;
window.updateUserInfo = updateUserInfo; 