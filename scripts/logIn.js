function loginUser() {
    const userName = document.querySelector('#loginUsername').value;
    const password = document.querySelector('#loginPassword').value;

    const user = {
        username: userName,
        password: password
    };

    // Make the POST request to your Java backend
    fetch('https://recipiebeckend.azurewebsites.net/auth/login2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // handle success, e.g., redirect to another page
        // document.cookie = `accessToken=${data.accessToken}; path=/`;
        // document.cookie = `refreshToken=${data.refreshToken}; path=/`;
        window.location.href = "https://noxtrah.github.io/SE-4910/dashboard.html"
        console.log(data);
    })
    .catch(error => {
        // handle error
        console.error('Error:', error);
    });
}

document.getElementById('login-button').addEventListener('click', loginUser);