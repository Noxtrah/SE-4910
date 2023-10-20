const registerLink = document.getElementById("registerLink");


registerLink.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".login-box").style.display = "none";
    document.querySelector(".register-box").style.display = "flex";

});

