document.addEventListener("DOMContentLoaded", function () {
    // openReportsTab('reports');
});

function openReportsTab(tabName) {
    var i, tabContent;

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

async function fetchReports() {
    apiUrl = "https://recipiebeckend.azurewebsites.net/admin/reported-recipes";
    // const apiUrl = "https://run.mocky.io/v3/18524b0e-7a6e-434c-b4cf-0b865a896383";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        console.log("Data: " , data);
        displayReports(data);
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

async function displayReports(reports) {
    const reportsGrid = document.getElementById('reports-grid');

    // Clear existing content
    reportsGrid.innerHTML = '';

    // Loop through each report and create a report item
    for (const report of reports) {
        try {
            console.log("Report: ", report);
            const reportItem = await createReportItem(report);
            reportsGrid.appendChild(reportItem);
        } catch (error) {
            console.error("Error creating report item:", error);
        }
    }
}


async function createReportItem(report) {
    try {
        // Create a report item container
        const reportItemContainer = document.createElement('div');

        // Check if the report is an array
        if (Array.isArray(report)) {
            // Iterate over each report in the array
            report.forEach(async (item) => {
                // Create report item for each report
                const reportItem = await createSingleReportItem(item);
                reportItemContainer.appendChild(reportItem);
            });
        } else {
            // If it's a single report, create report item directly
            const reportItem = await createSingleReportItem(report);
            reportItemContainer.appendChild(reportItem);
        }

        return reportItemContainer;
    } catch(error) {
        console.error("Error: ", error);
    }
}

async function createSingleReportItem(report) {
    // Extract data from the report
    const { userRecipeResponse, reportDetail } = report;

    const recipeDetailsContainer = document.createElement('div');
    recipeDetailsContainer.classList.add('recipe-details-container');

    // Create elements for recipe details
    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('recipe-details');

    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = userRecipeResponse.title;
    recipeDetails.appendChild(recipeTitle);

    const reportReason = document.createElement('p');
    reportReason.classList.add('report-reason');
    if (reportDetail && reportDetail.length > 0 && reportDetail[0].length > 1) {
        reportReason.innerHTML = '<b>Report Reason:</b> ' + reportDetail[0][1];
    } else {
        reportReason.textContent = 'No report reason provided';
    }
    recipeDetails.appendChild(reportReason);
    recipeDetailsContainer.appendChild(recipeDetails);

    // Create the report item
    const reportItem = document.createElement('div');
    reportItem.classList.add('report-item');

    // Create recipe image
    const recipeImage = document.createElement('img');
    recipeImage.src = userRecipeResponse.photoPath || ''; // Set a default value for photoPath if it's null
    recipeImage.alt = userRecipeResponse.title;
    reportItem.appendChild(recipeImage);

    // Action buttons
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');

    const discardButton = createButton('Discard');
    discardButton.classList.add('discard-button');
    discardButton.addEventListener('click', () => discardRecipe(report.userRecipeResponse.id));
    discardButton.addEventListener('click', () => discardRecipe(report.userRecipeResponse.id));
    actionButtons.appendChild(discardButton);

    const detailButton = createButton('Detail');
    detailButton.classList.add('detail-button');
    detailButton.addEventListener('click', function() {
        const detailSideBarWrapper = document.querySelector('.detail-sidebar-wrapper');
        if(detailSideBarWrapper) {
            closeDetailSidebar();
        }
        detailRecipe(report);
    });
    actionButtons.appendChild(detailButton);

    const deleteButton = createButton('Delete');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
        createWarningPopup(report);
        createWarningPopup(report);
    });
    actionButtons.appendChild(deleteButton);

    // Append action buttons to report item
    recipeDetailsContainer.appendChild(actionButtons);

    // Append recipe details container to report item
    reportItem.appendChild(recipeDetailsContainer);

    return reportItem;
}


function createButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    return button;
}

function discardRecipe(recipeId) {
    // Implement discard logic
    apiUrl = `https://recipiebeckend.azurewebsites.net/admin/discard-report?id=${recipeId}`
    try{
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Discard recipe response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    catch(error){
        console.log(error);
    }

    apiUrl = `https://recipiebeckend.azurewebsites.net/admin/discard-report?id=${recipeId}`
    try{
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Discard recipe response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    catch(error){
        console.log(error);
    }

    console.log('Discard recipe with ID:', recipeId);
}  

function detailRecipe(report) {
    console.log('Report:', report);
    const reportRecipeResponse = report.userRecipeResponse;

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
    const reportRecipeResponse = reportedItem.userRecipeResponse;
    const reportDetail = reportedItem.reportDetail;

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
    selectedReportTitle.textContent = reportRecipeResponse.title;
    detailSideBar.appendChild(selectedReportTitle);

    const selectedReportImage = document.createElement('img');
    selectedReportImage.classList.add('selected-report-image');
    selectedReportImage.src = reportRecipeResponse.photoPath;
    selectedReportImage.alt = 'Selected Report Image';
    detailSideBar.appendChild(selectedReportImage);

    const reportInformation = document.createElement('h2');
    reportInformation.classList.add('report-recipe-information');
    reportInformation.textContent = "Report Information";
    detailSideBar.appendChild(reportInformation);

    reportDetail.forEach((report, index) => {
        const selectedReportReason = document.createElement('p');
        selectedReportReason.classList.add('selected-recipe-report');
        selectedReportReason.innerHTML = '<b>Report Reason </b><b>' + (index + 1) + '</b><b> : </b>' + report[0];
        detailSideBar.appendChild(selectedReportReason);

        const selectedAdditionalReportNotes = document.createElement('p');
        selectedAdditionalReportNotes.classList.add('selected-recipe-report');
        selectedAdditionalReportNotes.innerHTML = '<b>Additional Report Notes </b><b>' + (index + 1) + '</b><b> : </b>' + report[1];
        detailSideBar.appendChild(selectedAdditionalReportNotes);

        const selectedReportingUser = document.createElement('p');
        selectedReportingUser.classList.add('selected-recipe-report');
        selectedReportingUser.innerHTML = '<b>Reporting User </b><b>' + (index + 1) + '</b><b> : </b>' + report[2];
        detailSideBar.appendChild(selectedReportingUser);

        if(index !=(reportDetail.length - 1)){
            const seperator = document.createElement('hr');
            seperator.classList.add('seperator');
            detailSideBar.appendChild(seperator);
        }
    });

    const recipeInformation = document.createElement('h2');
    recipeInformation.classList.add('report-recipe-information');
    recipeInformation.textContent = "Recipe Information";
    detailSideBar.appendChild(recipeInformation);

    const selectedPublisher = document.createElement('p');
    selectedPublisher.classList.add('selected-recipe-report');
    selectedPublisher.innerHTML = '<b>Publisher of the Recipe : </b>' + reportRecipeResponse.username;
    detailSideBar.appendChild(selectedPublisher);

    const selectedIngredients = document.createElement('p');
    selectedIngredients.classList.add('selected-recipe-report');
    selectedIngredients.innerHTML = '<b>Ingredientes of the Recipe : </b>' + reportRecipeResponse.ingredients;
    detailSideBar.appendChild(selectedIngredients);

    const selectedDescription = document.createElement('p');
    selectedDescription.classList.add('selected-recipe-report');
    selectedDescription.innerHTML = '<b>Description of the Recipe : </b>' + reportRecipeResponse.description;
    detailSideBar.appendChild(selectedIngredients);

    const selectedMeal = document.createElement('p');
    selectedMeal.classList.add('selected-recipe-report');
    selectedMeal.innerHTML = '<b>Meal of the Recipe : </b>' + reportRecipeResponse.meal;
    detailSideBar.appendChild(selectedMeal);

    const selectedCuisine = document.createElement('p');
    selectedCuisine.classList.add('selected-recipe-report');
    selectedCuisine.innerHTML = '<b>Cuisine of the Recipe : </b>' + reportRecipeResponse.cuisine;
    detailSideBar.appendChild(selectedCuisine);

    function convertToHourMinuteFormat(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const hoursText = hours === 1 ? 'hour' : 'hours';
        const minutesText = minutes === 1 ? 'minute' : 'minutes';
        return `${hours} ${hoursText} ${minutes} ${minutesText}`;
    }

    const selectedPrepTime = document.createElement('p');
    selectedPrepTime.classList.add('selected-recipe-report');
    selectedPrepTime.innerHTML = '<b>Preparation Time of the Recipe : </b>' + convertToHourMinuteFormat(reportRecipeResponse.preparationTime);
    detailSideBar.appendChild(selectedPrepTime);

    // selectedPrepTime.style.marginBottom = '20px';
}

function closeDetailSidebar() {
    const reportsGrid = document.querySelector('.reports-grid-container');
    reportsGrid.style.width = '100%';
    console.log("Width value: ", reportsGrid.style.width);

    const detailSideBarWrapper = document.querySelector('.detail-sidebar-wrapper');
    detailSideBarWrapper.remove();
}

function createWarningPopup(reportedItem) {
    // Create overlay element
    const reportRecipeResponse = reportedItem.userRecipeResponse;
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
    title.textContent = `Delete '${reportRecipeResponse.title}' Recipe`;

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
        deleteRecipe(reportRecipeResponse.id);
        overlay.remove();
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

async function deleteRecipe(recipeID){
    apiUrl = `https://recipiebeckend.azurewebsites.net/admin/delete-userRecipe?id=${recipeID}`
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        console.log('User deleted successfully:', data);
        location.reload();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}