/**
 * Fallback CSS loader for production environment
 * This script checks if stylesheets are properly loaded and adds them if necessary
 */
(function() {
  function createStylesheetLink(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    console.log('Fallback: Added stylesheet: ' + href);
  }

  function checkStylesheetsLoaded() {
    // Define critical stylesheets that must be loaded
    var criticalStylesheets = [
      '/styles/production.css',
      '/styles/shadcn-components.css'
    ];

    // Get all loaded stylesheets
    var loadedSheets = Array.from(document.styleSheets).map(function(sheet) {
      return sheet.href;
    });

    // Check if each critical stylesheet is loaded
    criticalStylesheets.forEach(function(sheetPath) {
      var fullPath = new URL(sheetPath, window.location.origin).href;
      var isLoaded = loadedSheets.some(function(href) {
        return href === fullPath;
      });

      if (!isLoaded) {
        createStylesheetLink(sheetPath);
      }
    });

    // Check if theme styles are properly applied
    setTimeout(function() {
      var body = document.body;
      var computedStyle = window.getComputedStyle(body);
      var hasStyles = computedStyle.fontFamily.includes('Inter') || 
                       computedStyle.fontFamily.includes('Poppins');
      
      if (!hasStyles) {
        console.warn('Fallback: Critical styles not properly applied, forcing reload...');
        createStylesheetLink('/styles/production.css?t=' + Date.now());
        createStylesheetLink('/styles/shadcn-components.css?t=' + Date.now());
      }
    }, 500);
  }

  // Run the check when the page is fully loaded
  window.addEventListener('load', checkStylesheetsLoaded);
})();