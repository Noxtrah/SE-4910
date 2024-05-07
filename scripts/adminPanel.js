let sidebarOpenCloseButton = document.querySelector('#sidebarOpenCloseButton');
let sidebar = document.querySelector('.sidebar');

sidebarOpenCloseButton.onclick = function () {
    sidebar.classList.toggle('active');
}