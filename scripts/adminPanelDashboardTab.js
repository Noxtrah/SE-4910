document.addEventListener("DOMContentLoaded", function () {

});

function openDashboardTab(tabName) {
    var i, tabContent;

    tabContent = document.getElementsByClassName("content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
    }

    // If the tab being clicked is "reports", call the fetchReports function
    if (tabName === 'users') {
        // fetchUsers();
    }

    document.getElementById(tabName).classList.add('show');
}