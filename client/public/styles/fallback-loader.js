/**
 * Production-optimized CSS fallback loader
 * Checks if stylesheets are properly loaded and adds them if necessary
 * Handles common edge cases that can cause style loading failures
 */
(function() {
  // Production mode - minimize console output
  var isProduction = window.location.hostname === 'alassiri.nl' || 
                    window.location.hostname.includes('replit.app');
  
  function log(message, type) {
    if (!isProduction || type === 'error') {
      if (type === 'warn') console.warn(message);
      else if (type === 'error') console.error(message);
      else console.log(message);
    }
  }

  function createStylesheetLink(href, priority) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (priority) {
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('importance', 'high');
    }
    document.head.appendChild(link);
    log('Fallback: Added stylesheet: ' + href);
  }

  function checkStylesheetsLoaded() {
    // Track performance
    var startTime = performance.now();
    
    // Define critical stylesheets that must be loaded
    var criticalStylesheets = [
      '/styles/production.css',
      '/styles/shadcn-components.css'
    ];

    // Get all loaded stylesheets
    var loadedSheets = [];
    try {
      loadedSheets = Array.from(document.styleSheets).map(function(sheet) {
        return sheet.href;
      });
    } catch (e) {
      log('Error accessing document.styleSheets: ' + e.message, 'error');
    }

    // Check if each critical stylesheet is loaded
    criticalStylesheets.forEach(function(sheetPath) {
      try {
        var fullPath = new URL(sheetPath, window.location.origin).href;
        var isLoaded = loadedSheets.some(function(href) {
          return href === fullPath;
        });

        if (!isLoaded) {
          createStylesheetLink(sheetPath, true);
        }
      } catch (e) {
        log('Error checking stylesheet ' + sheetPath + ': ' + e.message, 'error');
        // Fallback: load it anyway if there's an error checking
        createStylesheetLink(sheetPath, true);
      }
    });

    // Check if theme styles are properly applied with additional checks
    setTimeout(function() {
      try {
        var body = document.body;
        var computedStyle = window.getComputedStyle(body);
        var hasStyles = computedStyle.fontFamily.includes('Inter') || 
                         computedStyle.fontFamily.includes('Poppins') ||
                         document.querySelector('.shadcn-loaded'); // Custom marker added in production.css
        
        if (!hasStyles) {
          log('Fallback: Critical styles not properly applied, forcing reload...', 'warn');
          // Use cache-busting parameters for forced reload
          createStylesheetLink('/styles/production.css?v=' + Date.now(), true);
          createStylesheetLink('/styles/shadcn-components.css?v=' + Date.now(), true);
          
          // Add styles directly as a last resort
          var inlineStyle = document.createElement('style');
          inlineStyle.textContent = 'body{font-family:"Inter",sans-serif;color:#333}';
          document.head.appendChild(inlineStyle);
        }
        
        // Report performance
        var duration = Math.round(performance.now() - startTime);
        log('Style fallback check completed in ' + duration + 'ms');
      } catch (e) {
        log('Error in style verification: ' + e.message, 'error');
      }
    }, 800); // Slightly longer timeout for more reliable checking
  }

  // Run the check when the page is fully loaded
  if (document.readyState === 'complete') {
    checkStylesheetsLoaded();
  } else {
    window.addEventListener('load', checkStylesheetsLoaded);
  }
  
  // Additional check after short delay - handles early load cases
  setTimeout(checkStylesheetsLoaded, 2000);
})();