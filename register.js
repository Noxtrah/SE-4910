const registerLink = document.getElementById("registerLink");
const backButton = document.getElementById("back-arrow-button");


registerLink.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".login-box").style.display = "none";
    document.querySelector(".register-box").style.display = "flex";

});

document.addEventListener("DOMContentLoaded", function() {
    const registerButton = document.getElementById("register-button");

    // Add a click event listener to the "Register" button
    registerButton.addEventListener("click", function() {
        // Perform any necessary form validation here
        // If the form is valid, you can redirect the user to the login form
        // Here, we simply hide the registration box and show the login box

        const loginBox = document.querySelector(".login-box");
        const registerBox = document.querySelector(".register-box");

        loginBox.style.display = "flex";
        registerBox.style.display = "none";
    });
});

backButton.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".login-box").style.display = "flex";
    document.querySelector(".register-box").style.display = "none";

});

function registerUser() {
    const userName = document.querySelector('#registerUserName').value;
    const name = document.querySelector('input[type="name"]').value;
    const lastName = document.querySelector('input[type="last-name"]').value;
    const email = document.querySelector('#registerMail').value;
    const password = document.querySelector('#registerPassword').value;
    const confirmPassword = document.querySelector('input[type="password-confirm"]').value;
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;

    const birthday = `${year}-${month}-${day}`;

    const termsAndConditions = document.querySelector('#Terms').checked;
    console.log(termsAndConditions)

    if (!termsAndConditions) {
        alert("Please agree to the Terms & Conditions and Privacy Policy.");
        return;
    }

    const user = {
        name: name,
        lastName: lastName,
        username: userName,
        email: email,
        birthday: birthday,
        password: password
        // add other fields as needed
    };

    // Make the POST request to your Java backend
    fetch('http://recipiebeckend.azurewebsites.net/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    })
    .then(data => {
        // handle success, e.g., redirect to another page
        console.log(data);
    })
    .catch(error => {
        // handle error
        console.error('Error:', error);
    });
}

document.getElementById('register-button').addEventListener('click', registerUser);

