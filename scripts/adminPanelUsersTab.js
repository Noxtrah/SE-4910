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
        image.src = '../Images/pizza.png'; // Replace with actual image URL
        image.alt = 'User Image';
        nameCell.appendChild(image);

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

        // Create cell for title
        var titleCell = document.createElement('td');
        titleCell.classList.add('people-des');
        var titleHeader = document.createElement('h5');
        titleHeader.textContent = user.title;
        var subTitleParagraph = document.createElement('p');
        subTitleParagraph.textContent = user.subTitle;
        titleCell.appendChild(titleHeader);
        titleCell.appendChild(subTitleParagraph);
        userRow.appendChild(titleCell);

        // Create cell for status
        var statusCell = document.createElement('td');
        statusCell.classList.add('active');
        var statusParagraph = document.createElement('p');
        statusParagraph.textContent = user.status;
        statusCell.appendChild(statusParagraph);
        userRow.appendChild(statusCell);

        // Create cell for role
        var roleCell = document.createElement('td');
        roleCell.classList.add('role');
        var roleParagraph = document.createElement('p');
        roleParagraph.textContent = user.role;
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
            deleteRecipe(report);
        });

        actionButtons.appendChild(deleteButton);

        editCell.appendChild(actionButtons);
        userRow.appendChild(editCell);

        // Append the user row to the user list container
        userListContainer.appendChild(userRow);
    });
}

// Example usage
var users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        title: 'Full Stack Developer',
        subTitle: 'Web Developer',
        status: 'Active',
        role: 'Owner'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        title: 'Frontend Developer',
        subTitle: 'UI/UX Designer',
        status: 'Inactive',
        role: 'Admin'
    }
];

async function fetchAllUsers() {
    const apiUrl = "https://run.mocky.io/v3/51147056-22c6-49f7-a26f-2ef61fd95e5a";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        console.log("Data: ", data);
        displayUsers(data);
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

fetchAllUsers();

fetchAllUsers();

function fetchUserDetail(username){
    //apiUrl = "https://recipiebeckend.azurewebsites.net/user/visit-user?username=username";
    const apiUrl = "https://run.mocky.io/v3/7dbf5932-96b9-40b5-92b2-81c65a26c832";

    try {
        const response = fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = response.json();
        console.log("Data: " , data);
        userDetail(data);
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

function userDetail(userData){
    console.log('User:', userData);
    const selectedUser = document.querySelector(`.people-de h5:contains('${userData.username}')`).closest('.people');
    console.log("Selected User:", selectedUser);

    const detailSideBarWrapper = document.createElement('div');
    detailSideBarWrapper.classList.add('detail-sidebar-wrapper');
    document.body.appendChild(detailSideBarWrapper);


    const detailSideBar = document.createElement('div');
    detailSideBar.classList.add('detail-sidebar');
    detailSideBar.style.display = "flex";
    detailSideBarWrapper.appendChild(detailSideBar);

    fillUserDetailSideBar(selectedUser, detailSideBar);
}

function fillUserDetailSideBar(selectedUser, detailSideBar){
}