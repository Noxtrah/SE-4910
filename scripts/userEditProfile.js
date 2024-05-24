document.addEventListener('DOMContentLoaded', function () {
    var allergicFoods = [
        "Egg", "Milk", "Peanut", "Tree nut", "Soy", "Wheat", "Fish", "Shellfish", 
        "Sesame", "Mustard", "Lupin", "Mollusk", "Celery", "Sulfite"
    ];

    var allergicFoodSection = document.querySelector('.allergic-food-section');

    allergicFoods.forEach(function(food) {

        var checkboxAndDivLabel = document.createElement('div');
        checkboxAndDivLabel.classList.add('checkbox-and-div-label');

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'allergic-food';
        checkbox.value = food;
        checkboxAndDivLabel.appendChild(checkbox);
        // allergicFoodSection.appendChild(checkbox);

        var label = document.createElement('label');
        label.textContent = food;
        checkboxAndDivLabel.appendChild(label);
        // allergicFoodSection.appendChild(label);

        allergicFoodSection.appendChild(checkboxAndDivLabel);


        allergicFoodSection.appendChild(document.createElement('br'));
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
});

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", async function (event) {
    event.preventDefault();

    try {
        const bio = document.getElementById('bio').value;

        const selectedFoods = [];
        document.querySelectorAll('input[name="allergic-food"]:checked').forEach(function(checkbox) {
            selectedFoods.push(checkbox.value);
        });

        const otherFoodInput = document.getElementById('other-food-input');
        if (otherFoodInput) {
            const otherFoodValue = otherFoodInput.value.trim();
            if (otherFoodValue !== '') {
                selectedFoods.push(otherFoodValue);
            }
        }

        const finalAllergiesString = selectedFoods.map(food => food.trim()).join(',');

        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const photoUpload = document.getElementById('photo-upload');
        const photoFile = photoUpload.files[0];

        const formData = new FormData();
        formData.append('password', newPassword);
        formData.append('bio', bio);
        formData.append('allergicFoods', finalAllergiesString);
        if (photoFile) {
            formData.append('profilePhoto', photoFile);
        }

        console.log('Selected Allergies:', selectedFoods);
        console.log('Final Allergic Foods String:', finalAllergiesString);

        await saveProfile(formData);
    } catch (error) {
        console.error('Error saving profile:', error);
    }
});

async function saveProfile(formData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-user-profile';
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': JWTAccessToken
            },
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update profile. Status: ${response.status}. Message: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Profile update response:', data);
        return data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}
