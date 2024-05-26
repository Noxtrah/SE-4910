
async function saveRecipe(recipeData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/edit-recipe'; // ???????
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    const formData = new FormData();
    for (const key in recipeData) {
        formData.append(key, recipeData[key]);
    }

    console.log('formData: ', formData);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': JWTAccessToken
            },
            body: formData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to save recipe. Status: ${response.status}. Message: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error saving recipe:', error.message);
        throw error;
    }
}


const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", function (event) {
            const hours = parseInt(document.getElementById('recipe-prep-hour').value);
            const minutes = parseInt(document.getElementById('recipe-prep-minute').value);
            const totalMinutes = (hours * 60) + minutes;

        const photoInput = document.getElementById('photo').files[0];
        const recipePhoto = photoInput ? photoInput : null;

        const recipeData = {
            title: document.getElementById('recipe-title').value,
            ingredients: document.getElementById('recipe-ingredients').value,
            description: document.getElementById('recipe-description').value,
            cuisine: document.getElementById('recipe-cuisine').value,
            meal: document.getElementById('recipe-meal').value,
            preparationTime:totalMinutes,
            // recipePhoto: document.getElementById('photo').files[0] ? document.getElementById('photo').files[0] : null,
        };

        if (recipePhoto !== null) {
            recipeData.recipePhoto = recipePhoto;
        }

        event.preventDefault();
        console.log("Save button clicked");
        console.log(recipeData);
      
        saveRecipe(recipeData);
    });


  

    function setupBackButton() {
        const backButton = document.getElementById('back-arrow-button');

        backButton.addEventListener('click', () => {
            window.history.back();
            // window.history.go(-1);
        });
      
}