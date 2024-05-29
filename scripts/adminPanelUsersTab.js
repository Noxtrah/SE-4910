function displayUsers(users) {
    var userListContainer = document.getElementById('peopleTableBody');
    if (!userListContainer) return; // If userListContainer does not exist, exit the function

    userListContainer.innerHTML = ''; // Clear previous content

    // Loop through each user and create a row in the user list
    users.forEach(function(user) {
        var userRow = document.createElement('tr');

        // Create cell for image, name, and email
        var nameCell = document.createElement('td');
        nameCell.classList.add('people');

        var image = document.createElement('img');
        if (user.profilePhotoPath) {
            var image = document.createElement('img');
            image.src = user.profilePhotoPath;
            nameCell.appendChild(image);
        } else {
            var icon = document.createElement('ion-icon');
            icon.classList.add('person-circle-outline');
            icon.setAttribute('name', 'person-circle-outline');
            nameCell.appendChild(icon);
        }
        image.alt = 'User Image';
        // nameCell.appendChild(image);

        var nameEmailDiv = document.createElement('div');
        nameEmailDiv.classList.add('people-de');

        var nameHeader = document.createElement('h5');
        nameHeader.textContent = user.username;

        var emailParagraph = document.createElement('p');
        emailParagraph.textContent = user.email;

        nameEmailDiv.appendChild(nameHeader);
        nameEmailDiv.appendChild(emailParagraph);
        nameCell.appendChild(nameEmailDiv);

        userRow.appendChild(nameCell);

        var nameLastnameCell = document.createElement('td');
        var nameLastnameHeader = document.createElement('p');
        var nameSpan = document.createElement('span');
        nameSpan.textContent = user.name;
        var lastNameSpan = document.createElement('span');
        lastNameSpan.textContent = ' ' + user.lastName; // Add a space between name and last name
        nameLastnameHeader.appendChild(nameSpan);
        nameLastnameHeader.appendChild(lastNameSpan);
        nameLastnameCell.appendChild(nameLastnameHeader);
        userRow.appendChild(nameLastnameCell);

        // Create cell for status
        var ageCell = document.createElement('td');
        ageCell.classList.add('active');
        const ageParagraph = document.createElement('p');
        const age = calculateAge(user.birthDay);
        ageParagraph.textContent = `${age}`;
        ageCell.appendChild(ageParagraph);
        userRow.appendChild(ageCell);

        // Create cell for role
        var roleCell = document.createElement('td');
        roleCell.classList.add('role');
        var roleParagraph = document.createElement('p');
        roleParagraph.textContent = user.roles.map(role => role.name);
        roleCell.appendChild(roleParagraph);
        userRow.appendChild(roleCell);

        // Create cell for edit link
        var editCell = document.createElement('td');
        editCell.classList.add('edit');

        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        const detailButton = createButton('Detail');
        detailButton.classList.add('detail-button');
        detailButton.addEventListener('click', function() {
            userDetail(user) //Give the selectedUser as parameter
        });

        actionButtons.appendChild(detailButton);

        const deleteButton = createButton('Delete');
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            userDeleteWarnPopup(user);
        });

        actionButtons.appendChild(deleteButton);

        editCell.appendChild(actionButtons);
        userRow.appendChild(editCell);

        // Append the user row to the user list container
        userListContainer.appendChild(userRow);
    });
}

// Function to calculate age from birth date
function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);

    if(birthDateString == undefined){
        return undefined;
    }

    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();
    
    // Adjust age if the current date is before the birth date in the current year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

async function fetchAllUsers() {
    const apiUrl = "https://recipiebeckend.azurewebsites.net/user/all-users"
    // const apiUrl = "https://run.mocky.io/v3/0c51aa1f-9f67-431d-b245-5dcf57b30197";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        console.log("All Data: ", data);
        displayUsers(data);
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

fetchAllUsers();

// function fetchUserDetail(username){
//     apiUrl = `https://recipiebeckend.azurewebsites.net/user/visit-user?username=${username}`;
//     // const apiUrl = "https://run.mocky.io/v3/7dbf5932-96b9-40b5-92b2-81c65a26c832";

//     try {
//         const response = fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         const data = response.json();
//         console.log("Data: " , data);
//         userDetail(data);
//     } catch (error) {
//         console.error('Error fetching reports:', error);
//     }
// }

function userDetail(userData){
    console.log('User:', userData);

    const detailSideBarWrapper = document.createElement('div');
    detailSideBarWrapper.classList.add('detail-sidebar-wrapper');
    document.body.appendChild(detailSideBarWrapper);


    const detailSideBar = document.createElement('div');
    detailSideBar.classList.add('detail-sidebar');
    detailSideBar.style.display = "flex";
    detailSideBarWrapper.appendChild(detailSideBar);

    fillUserDetailSideBar(userData, detailSideBar);
}

function fillUserDetailSideBar(selectedUser, detailSideBar){
    const usersResponse = selectedUser;
    console.log("Users Response: ", usersResponse);


    const closeIcon = document.createElement('span');
    closeIcon.classList.add('close-icon');
    closeIcon.innerHTML = '<ion-icon name="close-outline"></ion-icon>'
    detailSideBar.appendChild(closeIcon);
    closeIcon.addEventListener('click', () => {
        closeDetailSidebar();
    });

    const usersGrid = document.querySelector('.reports-grid-container');
    if (detailSideBar) {
        usersGrid.style.width = '75%';
        console.log("Width value: ", usersGrid.style.width);
    }

    const selectedUserUsername = document.createElement('h2');
    selectedUserUsername.classList.add('selected-report-title');
    selectedUserUsername.textContent = usersResponse.username;
    detailSideBar.appendChild(selectedUserUsername);

    const selectedReportImage = document.createElement('img');
    selectedReportImage.classList.add('selected-report-image');
    selectedReportImage.src = usersResponse.profilePhotoPath;
    selectedReportImage.alt = 'Selected User Image';
    detailSideBar.appendChild(selectedReportImage);

    const selectedUserEmail = document.createElement('p');
    selectedUserEmail.classList.add('selected-recipe-report');
    selectedUserEmail.innerHTML = '<b>E-mail : </b>' + usersResponse.email;
    detailSideBar.appendChild(selectedUserEmail);

    const selectedUserName = document.createElement('p');
    selectedUserName.classList.add('selected-recipe-report');
    selectedUserName.innerHTML = '<b>Name : </b>' + usersResponse.name;
    detailSideBar.appendChild(selectedUserName);

    const selectedUserLastname = document.createElement('p');
    selectedUserLastname.classList.add('selected-recipe-report');
    selectedUserLastname.innerHTML = '<b>Lastname : </b>' + usersResponse.lastName;
    detailSideBar.appendChild(selectedUserLastname);

    const selectedUserBirthday = document.createElement('p');
    selectedUserBirthday.classList.add('selected-recipe-report');
    selectedUserBirthday.innerHTML = '<b>Birthday : </b>' + usersResponse.birthDay;
    detailSideBar.appendChild(selectedUserBirthday);

    const selectedUserAllergicFoods = document.createElement('p');
    selectedUserAllergicFoods.classList.add('selected-recipe-report');
    selectedUserAllergicFoods.innerHTML = '<b>Allergic Foods : </b>' + usersResponse.allergicFoods;
    detailSideBar.appendChild(selectedUserAllergicFoods);

    const selectedUserBio = document.createElement('p');
    selectedUserBio.classList.add('selected-recipe-report');
    selectedUserBio.innerHTML = '<b>Bio : </b>' + usersResponse.bio;
    detailSideBar.appendChild(selectedUserBio);

    const selectedUserRoles = document.createElement('p');
    selectedUserRoles.classList.add('selected-recipe-report');
    selectedUserRoles.innerHTML = '<b>Roles : </b>' + usersResponse.roles.map(role => role.name);
    detailSideBar.appendChild(selectedUserRoles);

    // const selectedCuisine = document.createElement('p');
    // selectedCuisine.classList.add('selected-recipe-report');
    // selectedCuisine.innerHTML = '<b>Cuisine of the Recipe : </b>' + usersResponse.cuisine;
    // detailSideBar.appendChild(selectedCuisine);

    // const selectedPrepTime = document.createElement('p');
    // selectedPrepTime.classList.add('selected-recipe-report');
    // selectedPrepTime.innerHTML = '<b>Preparation Time of the Recipe : </b>' + usersResponse.preparationTime;
    // detailSideBar.appendChild(selectedPrepTime);
}

function userDeleteWarnPopup(user){
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
    title.textContent = `Delete '${user.username}' User`;

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
    content.textContent = "Are you sure you want to permanently delete the selected user from the database? No return!";

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
    deleteUser(user.id);
    overlay.remove();
}

async function deleteUser(userID) {
    const apiUrl = `https://recipiebeckend.azurewebsites.net/auth/delete-user?id=${userID}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        console.log('User deleted successfully:', data);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}