function loginUser() {
    const username = document.getElementById('loginUserName').value;
    const password = document.getElementById('loginPassword').value;

    console.log("Username: ", username);
    console.log("Password: ", password);

    fetch('https://recipiebeckend.azurewebsites.net/auth/login2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        else{
            console.log("Girdi");
            window.location.href = '../templates/dashboard.html';
        }

    })
    // .then(data => {
    //     // handle success, e.g., redirect to another page
    //     // document.cookie = accessToken=${data.accessToken}; path=/;
    //     // document.cookie = refreshToken=${data.refreshToken}; path=/;
    //     // window.location.href = "https://noxtrah.github.io/SE-4910/dashboard.html"
    //     console.log("Girdi");
    //     window.location.href = '../templates/dashboard.html';
    //     console.log(data);
    // })
    .catch(error => {
        // handle error
        console.error('Error:', error);
    });

    // try {
    //     const response = fetch('https://recipiebeckend.azurewebsites.net/auth/login2', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ username, password }),
    //     });

    //     if (response.ok) {
    //         // Redirect to the dashboard after successful login
    //         window.location.href = '../templates/dashboard.html';
    //         console.log("Girdi");
    //         return true;
    //     } else if (response.status === 404) {
    //         console.log('User not found');
    //         return false;
    //     } else {
    //         console.log("ASOPDHIUF");
    //         return false;
    //     }
    // } catch (error) {
    //     console.log('Error:', error.message);
    //     return false;
    // }
}
document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    loginUser();
});