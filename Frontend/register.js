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
