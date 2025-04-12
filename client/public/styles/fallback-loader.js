/**
 * Fallback CSS loader for production environment
 * This script checks if the CSS styles are properly loaded,
 * and if not, attempts to reload them with different paths
 */
(function() {
  function checkStylesheetLoaded() {
    // Check if we have any elements with our special classes that should be styled
    const neuBg = document.querySelector('.neu-bg');
    const glassCard = document.querySelector('.glass-card');
    const appCard = document.querySelector('.app-card');
    
    // Get computed styles
    if (neuBg) {
      const style = window.getComputedStyle(neuBg);
      // If styling hasn't been applied, background color would be different
      if (style.backgroundColor !== 'rgb(240, 240, 243)') {
        console.warn('Stylesheet not loaded properly, attempting to reload...');
        loadFallbackStyles();
      }
    } else if (glassCard) {
      const style = window.getComputedStyle(glassCard);
      // If backdrop-filter is not applied, it would be "none"
      if (style.backdropFilter === 'none') {
        console.warn('Stylesheet not loaded properly, attempting to reload...');
        loadFallbackStyles();
      }
    } else if (appCard) {
      const style = window.getComputedStyle(appCard);
      // Check transition property
      if (!style.transition.includes('all')) {
        console.warn('Stylesheet not loaded properly, attempting to reload...');
        loadFallbackStyles();
      }
    }
  }

  function loadFallbackStyles() {
    // Attempt to load styles from different paths
    const styleElement = document.createElement('link');
    styleElement.rel = 'stylesheet';
    styleElement.href = '/styles/production.css?v=' + Date.now(); // Add cache buster
    document.head.appendChild(styleElement);
    
    // Also try inline critical CSS as a last resort
    const criticalStyles = document.createElement('style');
    criticalStyles.textContent = `
      .neu-bg { background-color: #f0f0f3; }
      .glass-bg { 
        background-color: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .app-card { transition: all 0.3s; }
      .app-card:hover { transform: translateY(-8px); }
      .btn-primary {
        background-color: #6366f1;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
      }
    `;
    document.head.appendChild(criticalStyles);
  }

  // Execute after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkStylesheetLoaded);
  } else {
    // DOM is already loaded
    setTimeout(checkStylesheetLoaded, 1000);
  }
})();