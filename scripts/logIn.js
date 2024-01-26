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
        return response.json(); // Response'ı JSON formatına çevir
    })
    .then(data => {
        // Başarılı giriş durumunda token'ları sakla
        if (data.accessToken) {
            // Token'ları yerel depolamaya (localStorage) ekleyin
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            // İsteğe bağlı olarak kullanıcı ID'sini de saklayabilirsiniz
            localStorage.setItem('userId', data.userId);
            
            // Başarılı giriş durumunda yönlendirme yapabilirsiniz
            window.location.href = '../templates/dashboard.html';
        }
    })
    .catch(error => {
        console.error('Login failed:', error);
    });
}

document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    loginUser();
});