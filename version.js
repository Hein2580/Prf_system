/**
 * EMS PRF System Version Management
 * Centralized version information and display utilities
 */

const APP_VERSION = {
  major: 2,
  minor: 0,
  patch: 0,
  build: '20241212',
  name: 'Professional Navigation',
  codename: 'Mobile First'
};

// Generate version strings
const VERSION_STRING = `${APP_VERSION.major}.${APP_VERSION.minor}.${APP_VERSION.patch}`;
const FULL_VERSION = `v${VERSION_STRING} (${APP_VERSION.build})`;
const VERSION_DISPLAY = `EMS PRF System v${VERSION_STRING}`;

/**
 * Get current app version information
 */
function getVersionInfo() {
  return {
    version: VERSION_STRING,
    fullVersion: FULL_VERSION,
    build: APP_VERSION.build,
    name: APP_VERSION.name,
    codename: APP_VERSION.codename,
    buildDate: new Date(
      APP_VERSION.build.substring(0, 4),
      APP_VERSION.build.substring(4, 6) - 1,
      APP_VERSION.build.substring(6, 8)
    ).toLocaleDateString()
  };
}

/**
 * Create version badge element
 */
function createVersionBadge(compact = false) {
  const badge = document.createElement('div');
  badge.className = compact ? 'version-badge-compact' : 'version-badge';
  badge.textContent = compact ? `v${VERSION_STRING}` : VERSION_DISPLAY;
  badge.title = `${VERSION_DISPLAY}\nBuild: ${APP_VERSION.build}\nCodename: ${APP_VERSION.codename}`;
  return badge;
}

/**
 * Add version info to page footer
 */
function addVersionToFooter() {
  // Check if footer already exists
  let footer = document.querySelector('.app-footer');
  
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'app-footer';
    document.body.appendChild(footer);
  }
  
  const versionInfo = getVersionInfo();
  footer.innerHTML = `
    <div class="footer-content">
      <div class="version-info">
        <span class="app-name">EMS PRF System</span>
        <span class="version-number">v${versionInfo.version}</span>
        <span class="build-info">Build ${versionInfo.build}</span>
      </div>
      <div class="copyright">
        © ${new Date().getFullYear()} Emergency Medical Services
      </div>
    </div>
  `;
}

/**
 * Add version badge to navigation
 */
function addVersionToNav() {
  // Add to slide menu if it exists (mobile)
  const slideMenu = document.querySelector('.slide-menu');
  if (slideMenu) {
    const versionSection = document.createElement('div');
    versionSection.className = 'menu-section version-section';
    versionSection.innerHTML = `
      <div class="menu-version">
        <span class="menu-icon">ℹ️</span>
        <div class="menu-label">
          <div class="version-primary">v${VERSION_STRING}</div>
          <div class="version-secondary">Build ${APP_VERSION.build}</div>
        </div>
      </div>
    `;
    slideMenu.appendChild(versionSection);
  }
  
  // Add to desktop nav if exists
  const nav = document.querySelector('nav');
  if (nav && window.innerWidth >= 768) {
    const versionBadge = createVersionBadge(true);
    versionBadge.style.marginLeft = 'auto';
    nav.appendChild(versionBadge);
  }
}

/**
 * Initialize version display
 */
function initVersionDisplay() {
  // Add CSS for version elements
  const style = document.createElement('style');
  style.textContent = `
    /* Version Badge Styles */
    .version-badge, .version-badge-compact {
      background: rgba(255,255,255,0.1);
      color: #fff;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: help;
      transition: all 0.2s;
    }
    
    .version-badge-compact {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
    }
    
    .version-badge:hover, .version-badge-compact:hover {
      background: rgba(255,255,255,0.2);
      transform: scale(1.05);
    }
    
    /* Footer Styles */
    .app-footer {
      background: #f8f9fa;
      border-top: 1px solid #e5e7eb;
      padding: 1rem;
      margin-top: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: #6b7280;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .version-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .app-name {
      font-weight: 600;
      color: #1976d2;
    }
    
    .version-number {
      background: #1976d2;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }
    
    .build-info {
      color: #9ca3af;
      font-size: 0.75rem;
    }
    
    /* Menu Version Styles */
    .version-section {
      border-top: 1px solid #e0e0e0;
      border-bottom: none;
    }
    
    .menu-version {
      display: flex;
      align-items: center;
      padding: 0.875rem 1.5rem;
      color: #666;
      cursor: help;
    }
    
    .menu-version .menu-icon {
      margin-right: 1rem;
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }
    
    .version-primary {
      font-weight: 600;
      color: #1976d2;
    }
    
    .version-secondary {
      font-size: 0.75rem;
      color: #9ca3af;
    }
    
    /* Dark Mode Support */
    .dark-mode .app-footer {
      background: #1f2937;
      border-color: #374151;
      color: #9ca3af;
    }
    
    .dark-mode .menu-version {
      color: #e5e7eb;
    }
    
    .dark-mode .version-secondary {
      color: #6b7280;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
      .app-footer {
        margin-bottom: 80px; /* Account for bottom nav */
      }
      
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
      
      .version-info {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add version displays
  addVersionToNav();
  addVersionToFooter();
  
  // Add to console for developers
  console.log(
    `%c🚑 ${VERSION_DISPLAY}%c\n` +
    `Build: ${APP_VERSION.build}\n` +
    `Codename: ${APP_VERSION.codename}\n` +
    `Build Date: ${getVersionInfo().buildDate}`,
    'color: #1976d2; font-weight: bold; font-size: 14px;',
    'color: #666; font-size: 12px;'
  );
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure other scripts have loaded
  setTimeout(initVersionDisplay, 100);
});

// Export for manual use
window.getVersionInfo = getVersionInfo;
window.createVersionBadge = createVersionBadge;
window.APP_VERSION = VERSION_STRING;

// Remove persistent global install banner
// (delete or comment out setupInstallBanner IIFE)

// ... existing code ... 