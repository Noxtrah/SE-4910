function displayStaticUsers() {
    var userListContainer = document.getElementById('userList');
    // userListContainer.innerHTML = '';
    if (!userListContainer) return; // If userListContainer does not exist, exit the function

    // Static user data (replace with your actual data)
    var users = [
        {
            username: 'john_doe',
            name: 'John',
            lastName: 'Doe',
            age: 30,
            email: 'john@example.com',
            userIcon: 'person-circle-outline'
        },
        {
            username: 'jane_smith',
            name: 'Jane',
            lastName: 'Smith',
            age: 25,
            email: 'jane@example.com',
            userIcon: 'person-circle-outline'
        }
        // Add more users as needed
    ];

    // Get the Handlebars template
    var templateSource = document.getElementById('user-template').innerHTML;

    // Compile the template
    var template = Handlebars.compile(templateSource);

    // Generate HTML from the template and user data
    var html = template({ users: users });

    // Append the generated HTML to the user list container
    userListContainer.innerHTML = html;
}
