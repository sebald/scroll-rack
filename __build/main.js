(function () {
    // Toggle navigation menu
    var toggle_element = document.querySelector('toggle-menu');
    toggle_element.addEventListener('click', toggleMenu);
    
    function toggleMenu () {
        console.log('clicked');
    }
})();