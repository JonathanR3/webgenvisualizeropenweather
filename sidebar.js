const toggleButton = document.getElementById('toggle-button');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
    closeDropDowns();
}

function toggleDropDown(button) {

    if (!button.nextElementSibling.classList.contains('show')) {
        closeDropDowns();
    }

    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');
    if (sidebar.classList.contains('close')) {
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle('rotate');
    }
}

function closeDropDowns() {
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show');
        ul.previousElementSibling.classList.remove('rotate');
    })
}