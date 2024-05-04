document.addEventListener("DOMContentLoaded", function () {

});

function openUsersTab(tabName) {
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

function displayStaticUsers() {
    var userListContainer = document.getElementById('userList');

    // Static user data (replace with your actual data)
    var users = [
        {
            username: 'john_doe',
            name: 'John',
            lastName: 'Doe',
            age: 30,
            email: 'john@example.com',
            userPhoto: 'john.jpg' // Replace with the path to the user's photo
        },
        {
            username: 'jane_smith',
            name: 'Jane',
            lastName: 'Smith',
            age: 25,
            email: 'jane@example.com',
            userPhoto: 'jane.jpg' // Replace with the path to the user's photo
        }
        // Add more users as needed
    ];

    // Loop through each user and create a row in the user list
    users.forEach(function (user) {
        var userRow = document.createElement('div');
        userRow.classList.add('user-row');

        // Create user photo element
        var userPhoto = document.createElement('img');
        userPhoto.src = user.userPhoto;
        userPhoto.alt = user.username + "'s photo";
        userPhoto.classList.add('user-photo');

        // Create user info elements
        var userInfo = document.createElement('div');
        userInfo.textContent = `Username: ${user.username}, Name: ${user.name}, Last Name: ${user.lastName}, Age: ${user.age}, Email: ${user.email}`;

        // Append user photo and info to the user row
        userRow.appendChild(userPhoto);
        userRow.appendChild(userInfo);

        // Append the user row to the user list container
        userListContainer.appendChild(userRow);
    });
}