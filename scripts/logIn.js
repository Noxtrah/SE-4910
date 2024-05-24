// function loginUser() {
//     const username = document.getElementById('loginUserName').value;
//     const password = document.getElementById('loginPassword').value;

//     console.log("Username: ", username);
//     console.log("Password: ", password);

//     fetch('https://recipiebeckend.azurewebsites.net/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             username: username,
//             password: password,
//         })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Login failed');
//         }
//         return response.json(); // Response'ı JSON formatına çevir
//     })
//     .then(data => {
//         console.log(data.accessToken);
//         // Başarılı giriş durumunda token'ları sakla
//         if (data.accessToken) {
//             // Token'ları yerel depolamaya (localStorage) ekleyin
//             localStorage.setItem('accessToken', data.accessToken);
//             localStorage.setItem('refreshToken', data.refreshToken);
            
//             // İsteğe bağlı olarak kullanıcı ID'sini de saklayabilirsiniz
//             localStorage.setItem('userId', data.userId);
            
//             // Başarılı giriş durumunda yönlendirme yapabilirsiniz
//             window.location.href = '../templates/dashboard.html';
//         }
//     })
//     .catch(error => {
//         console.error('Login failed:', error);
//     });
// }

function loginUser() {
    const username = document.getElementById('loginUserName').value;
    const password = document.getElementById('loginPassword').value;

    console.log("Username: ", username);
    console.log("Password: ", password);

    fetch('https://recipiebeckend.azurewebsites.net/auth/login', {
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
        return response.json();
    })
    .then(data => {
        console.log(data.accessToken);

        // Store tokens in sessionStorage
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);

        // Optionally, store user ID in sessionStorage
        sessionStorage.setItem('userId', data.userId);

        let roles = data.role.split(','); // Split roles into an array

        if (roles.length === 1 && roles[0] === "user") {
            window.location.href = '../templates/dashboard.html';
        } else if (roles.includes("admin")) {
            askLoginType();
        }

    })
    .catch(error => {
        console.error('Login failed:', error);
    });
}

function askLoginType() {
    // Reset the content of the login-box
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = '';
    loginBox.style.minHeight = '20vh';

    // Create two buttons
    const adminButton = document.createElement('button');
    adminButton.textContent = 'Login as Admin';
    adminButton.style.width = '80%';

    const userButton = document.createElement('button');
    userButton.textContent = 'Login as User';
    userButton.style.marginTop = '10px';
    userButton.style.width = '80%';


    // Add event listeners to the buttons
    adminButton.addEventListener('click', function() {
        window.location.href = '../templates/adminPanel.html';
    });

    userButton.addEventListener('click', function() {
        window.location.href = '../templates/dashboard.html';
    });

    // Append buttons to the login-box
    loginBox.appendChild(adminButton);
    loginBox.appendChild(userButton);
}

document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    loginUser();
});