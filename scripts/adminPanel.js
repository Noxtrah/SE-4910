document.addEventListener("DOMContentLoaded", function () {
    openTab('dashboard');
    // fetchReports();
    displayReports(staticReports);

});

function openTab(tabName) {
    var i, tabContent;

    tabContent = document.getElementsByClassName("content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('show');
    }

    document.getElementById(tabName).classList.add('show');
}

function fetchReports() {
    // Assuming the server endpoint to fetch reports is '/api/reports'
    fetch('/api/reports')
        .then(response => response.json())
        .then(data => {
            displayReports(data);
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
        });
}

const staticReports = [
    {
        recipe: {
            id: 1,
            title: "Delicious Cake",
            image: "../Images/background2.jpg" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Wrong Ingredient"
    },
    {
        recipe: {
            id: 2,
            title: "Delicious Pie",
            image: "../Images/background3.jpg" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Inappropriate content"
    },
    {
        recipe: {
            id: 3,
            title: "Delicious Cake",
            image: "../Images/background2.jpg" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Unhealthy Recipe"
    },
    {
        recipe: {
            id: 4,
            title: "Delicious Pie",
            image: "../Images/background3.jpg" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Safety Concerns"
    },
    {
        recipe: {
            id: 5,
            title: "Delicious Cake",
            image: "../Images/background2.jpg" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Misleading Information"
    },
    {
        recipe: {
            id: 6,
            title: "Delicious Pizza",
            image: "../Images/pizza.png" // Assuming pasta_image.jpg is in the Images folder
        },
        reason: "Inappropriate content"
    },
    // Add more static reports as needed
];

function displayReports(reports) {
    const reportsGrid = document.getElementById('reports-grid');

    // Clear existing content
    reportsGrid.innerHTML = '';

    // Loop through each report and create a report item
    reports.forEach(report => {
        const reportItem = createReportItem(report);
        reportsGrid.appendChild(reportItem);
    });
}

function createReportItem(report) {
    const reportItem = document.createElement('div');
    reportItem.classList.add('report-item');
    reportItem.dataset.recipeId = report.recipe.id;

    // Recipe image
    const recipeImage = document.createElement('img');
    recipeImage.src = report.recipe.image;
    recipeImage.alt = report.recipe.title;
    reportItem.appendChild(recipeImage);

    // Recipe details
    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('recipe-details');

    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = report.recipe.title;
    recipeDetails.appendChild(recipeTitle);

    const reportReason = document.createElement('p');
    reportReason.classList.add('report-reason');
    reportReason.innerHTML = '<b>Report Reason:</b> ' + report.reason;
    recipeDetails.appendChild(reportReason);

    // Action buttons
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');

    const discardButton = createButton('Discard');
    discardButton.classList.add('discard-button');
    discardButton.addEventListener('click', () => discardRecipe(report.recipe.id));
    actionButtons.appendChild(discardButton);

    const detailButton = createButton('Detail');
    detailButton.classList.add('detail-button');
    detailButton.addEventListener('click', function() {
        detailRecipe(report);
    });

    actionButtons.appendChild(detailButton);

    const deleteButton = createButton('Delete');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
        deleteRecipe(report);
    });

    actionButtons.appendChild(deleteButton);

    recipeDetails.appendChild(actionButtons);

    reportItem.appendChild(recipeDetails);
    console.log(reportItem);
    return reportItem;
}

function createButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    return button;
}

function discardRecipe(recipeId) {
    // Implement discard logic
    console.log('Discard recipe with ID:', recipeId);
}

function detailRecipe(report) {
    console.log('Report:', report);
    const reportItem = document.querySelector(`.report-item[data-recipe-id="${report.recipe.id}"]`);
    console.log("Report Item:", reportItem);

    const detailSideBarWrapper = document.createElement('div');
    detailSideBarWrapper.classList.add('detail-sidebar-wrapper');
    document.body.appendChild(detailSideBarWrapper);


    const detailSideBar = document.createElement('div');
    detailSideBar.classList.add('detail-sidebar');
    detailSideBar.style.display = "flex";
    detailSideBarWrapper.appendChild(detailSideBar);

    fillDetailSideBar(report, detailSideBar);
    // displayReports(staticReports);

}

function fillDetailSideBar(reportedItem, detailSideBar){
    const closeIcon = document.createElement('span');
    closeIcon.classList.add('close-icon');
    closeIcon.innerHTML = '<ion-icon name="close-outline"></ion-icon>'
    detailSideBar.appendChild(closeIcon);
    closeIcon.addEventListener('click', () => {
        closeDetailSidebar();
    });

    const reportsGrid = document.querySelector('.reports-grid-container');
    if (detailSideBar) {
        reportsGrid.style.width = '75%';
        console.log("Width value: ", reportsGrid.style.width);
    }

    const selectedReportTitle = document.createElement('h2');
    selectedReportTitle.classList.add('selected-report-title');
    selectedReportTitle.textContent = reportedItem.recipe.title;
    detailSideBar.appendChild(selectedReportTitle);

    const selectedReportImage = document.createElement('img');
    selectedReportImage.classList.add('selected-report-image');
    selectedReportImage.src = reportedItem.recipe.image;
    selectedReportImage.alt = 'Selected Report Image';
    detailSideBar.appendChild(selectedReportImage);

    const selectedReportReason = document.createElement('p');
    selectedReportReason.classList.add('selected-report-reason');
    selectedReportReason.innerHTML = '<b>Report Reason: </b>' +reportedItem.reason;
    detailSideBar.appendChild(selectedReportReason);
}

function closeDetailSidebar() {
    const reportsGrid = document.querySelector('.reports-grid-container');
    reportsGrid.style.width = '100%';
    console.log("Width value: ", reportsGrid.style.width);

    const detailSideBarWrapper = document.querySelector('.detail-sidebar-wrapper');
    detailSideBarWrapper.remove();
}

function deleteRecipe(report) {
    createWarningPopup(report);
}

function createWarningPopup(reportedItem) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'popup1';
    overlay.classList.add('overlay');

    // Create pop-up element
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const windowHeight = window.innerHeight;
    const popupHeight = popup.offsetHeight;
    const newTop = Math.max((windowHeight - popupHeight) / 2, 0);
    popup.style.top = newTop + 'px';

    // Pop-up title
    const title = document.createElement('h2');
    title.textContent = `Delete '${reportedItem.recipe.title}' Recipe`;

    // Close button
    const closeButton = document.createElement('a');
    closeButton.classList.add('close');
    closeButton.href = '#';
    closeButton.textContent = '×'; // Close symbol
    closeButton.addEventListener('click', function() {
        overlay.remove(); // Remove overlay when close button is clicked
    });

    // Pop-up content
    const content = document.createElement('div');
    // content.classList.add('content');
    content.textContent = "Are you sure you want to permanently delete the selected recipe from the database? No return!";

    const textboxContainer = document.createElement('div');
    textboxContainer.classList.add('textbox-container');

    const sendReportButton = document.createElement('button');
    sendReportButton.textContent = 'Submit';

    sendReportButton.classList.add('popup-delete-button');

    sendReportButton.addEventListener('click', function() {
        //Delete Fetch
    });


    // Append elements to pop-up
    popup.appendChild(title);
    popup.appendChild(closeButton);
    popup.appendChild(content);
    popup.appendChild(textboxContainer);
    popup.appendChild(sendReportButton);

    // Append pop-up to overlay
    overlay.appendChild(popup);

    // Append overlay to body
    document.body.appendChild(overlay);
}