!(function () {
    var OPEN_ATTRIBUTE = 'is-open';
    
    var toggle_element = document.querySelector('toggle-menu'),
        nav_element = document.querySelector('nav');
    
    
    // Toggle navigation menu
    toggle_element.addEventListener('click', toggleMenu);
    function toggleMenu () {
        if ( nav_element.hasAttribute(OPEN_ATTRIBUTE) ) {
            nav_element.removeAttribute(OPEN_ATTRIBUTE);
        } else {
            nav_element.setAttribute(OPEN_ATTRIBUTE, '');
        }
    }
})();