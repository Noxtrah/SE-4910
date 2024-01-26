document.addEventListener('DOMContentLoaded', function () {
    // Add JavaScript here
    var allergicFoods = [
        "Egg",
        "Milk",
        "Peanut",
        "Tree nut",
        "Soy",
        "Wheat",
        "Fish",
        "Shellfish",
        "Sesame",
        "Mustard",
        "Lupin",
        "Mollusk",
        "Celery",
        "Sulfite",
        "Other"
    ];

    var selectElement = document.getElementById('allergic-food');
    var otherInput = document.querySelector('.other-input');

    allergicFoods.forEach(function (food) {
        var option = document.createElement('option');
        option.value = food.toLowerCase();
        option.textContent = food;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', function () {
        if (this.value === 'other') {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
        }
    });

    var photoUpload = document.getElementById('photo-upload');
    var photoFrame = document.getElementById('photo-frame');

    photoUpload.addEventListener('change', function () {
        var file = this.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                photoFrame.style.backgroundImage = 'url(' + e.target.result + ')';
            };

            reader.readAsDataURL(file);
        }
    });

    var saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', function () {
        // Perform save actions here, such as sending data to the backend
        var newPassword = document.getElementById('new-password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
        var bio = document.getElementById('bio').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please re-enter.');
            return;
        }

        // Perform the fetch POST request to update the password
        fetch('/update-password-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: newPassword }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Password update response:', data);
        })
        .catch(error => {
            console.error('Error updating password:', error);
        });

        // Perform the fetch POST request to update the user profile information
        fetch('/update-profile-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: bio }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Profile update response:', data);
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    });
});
