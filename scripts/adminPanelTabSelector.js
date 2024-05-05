window.onload = function() {
    openTab('adminDashboard');
};

function openTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.sidebar ul li').forEach(function(tab) {
        tab.classList.remove('active-tab');
    });

    // Hide all tab content
    document.querySelectorAll('.content').forEach(function(content) {
        content.style.display = 'none';
    });

    // Activate the clicked tab
    console.log(tabName);
    var activeTab = document.querySelector('a[data-tab="' + tabName + '"]').parentElement;
    activeTab.classList.add('active-tab');

    // Show the corresponding tab content
    var tabContent = document.getElementById(tabName);
    tabContent.style.display = 'block';

    // Adjust tabName to match the filenames
    var adjustedTabName;
    if (tabName === 'adminDashboard') {
        adjustedTabName = 'adminPanelDashboardTab';
    } else if (tabName === 'reports') {
        adjustedTabName = 'adminPanelReportsTab';
        openReportsTab('reports');
    } else if (tabName === 'users') {
        adjustedTabName = 'adminPanelUsersTab';
        openUsersTab('users');
    } else if (tabName === 'settings') {
        adjustedTabName = 'adminPanelSettingsTab';
    } else {
        adjustedTabName = tabName; // For other tabs, use the original tabName
    }

    // Load JavaScript file for the tab if it hasn't been loaded yet
    var scriptId = adjustedTabName + '-script';
    var existingScript = document.getElementById(scriptId);
    if (!existingScript) {
        var script = document.createElement('script');
        script.id = scriptId;
        script.src = '../scripts/' + adjustedTabName + '.js';
        console.log(script);
        document.body.appendChild(script);
    }

    // Load CSS file for the tab if it hasn't been loaded yet
    if (!tabContent.dataset.cssLoaded) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../styles/' + adjustedTabName + '.css';
        document.head.appendChild(link);
        tabContent.dataset.cssLoaded = true;
    }
}

function openReportsTab(tabName) {
    var i, tabContent;
    console.log(tabName);


    tabContent = document.getElementsByClassName("content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
    }

    // If the tab being clicked is "reports", call the fetchReports function
    if (tabName === 'reports') {
        fetchReports();
    }

    document.getElementById(tabName).classList.add('show');
}

function openUsersTab(tabName) {
    var i, tabContent;
    console.log(tabName);


    tabContent = document.getElementsByClassName("content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
    }

    // If the tab being clicked is "reports", call the fetchReports function
    if (tabName === 'users') {
        // fetchUsers();
        displayStaticUsers();
    }

    document.getElementById(tabName).classList.add('show');
}