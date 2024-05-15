document.addEventListener('DOMContentLoaded', function () {
    var allergicFoods = [
        "Egg", "Milk", "Peanut", "Tree nut", "Soy", "Wheat", "Fish", "Shellfish", 
        "Sesame", "Mustard", "Lupin", "Mollusk", "Celery", "Sulfite"
    ];

    var allergicFoodSection = document.querySelector('.allergic-food-section');
    var otherFoodContainer = document.getElementById('other-food-container');

    // Checkboxları oluştur
    allergicFoods.forEach(function(food) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'allergic-food';
        checkbox.value = food;
        allergicFoodSection.appendChild(checkbox);

        var label = document.createElement('label');
        label.textContent = food;
        allergicFoodSection.appendChild(label);

        allergicFoodSection.appendChild(document.createElement('br'));
    });

    // Diğer seçeneği için text kutusu oluştur
    var otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.placeholder = 'Type: Allergy 1, Allergy 2';
    otherInput.id = 'other-food-input';
    otherFoodContainer.appendChild(otherInput);
  
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
    event.preventDefault(); // Sayfanın yeniden yüklenmesini önle

    try {
        // Kullanıcının girdiği bilgileri al
        const bio = document.getElementById('bio').value;

        // Seçilen alerjenleri al
        const selectedFoods = [];
        document.querySelectorAll('input[name="allergic-food"]:checked').forEach(function(checkbox) {
            selectedFoods.push(checkbox.value);
        });

        // Diğer alerjeni al
        let otherFoodInput = document.getElementById('other-food-input');
        if (otherFoodInput) {
            const otherFoodValue = otherFoodInput.value.trim();
            if (otherFoodValue !== '') {
                selectedFoods.push(otherFoodValue);
            }
        }

        // Boşlukları virgülle değiştir
        const finalAllergiesString = selectedFoods.map(food => food.trim()).join(',');

        // Kullanıcının girdiği diğer alanları al
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Kullanıcı fotoğrafını al
        const photoUpload = document.getElementById('photo-upload');
        const photoFile = photoUpload.files[0];

        // Profil verilerini oluştur
        const profileData = {
            password: newPassword,
            bio: bio,
            allergicFoods: finalAllergiesString,
            profilePhoto: photoFile
        };

        console.log(selectedFoods);
        console.log('Final Allergic Foods String:', finalAllergiesString);

        // Profil verilerini kaydetme fonksiyonunu çağır
        await saveProfile(profileData);
    } catch (error) {
        console.error('Error saving profile:', error);
        // Hata durumunda kullanıcıya bildirim gönderilebilir
        // Örn: alert('Error saving profile: ' + error.message);
    }
});


async function saveProfile(profileData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-user-profile';
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': JWTAccessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData),
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
