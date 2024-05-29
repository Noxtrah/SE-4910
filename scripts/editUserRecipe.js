document.addEventListener("DOMContentLoaded", function () {
    const params = getQueryParams()
    autoFillForm(params)
    

});

async function saveRecipe(recipeData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/edit-user-recipe'; // ???????
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    const formData = new FormData();
    for (const key in recipeData) {
        formData.append(key, recipeData[key]);
    }

    console.log('formData: ', formData);

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
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
        const params = getQueryParams()

        const recipeData = {
            id: params.id, // Include the id from the URL parameters
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

 

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get("id"),
            title: params.get("title"),
            description: params.get("description"),
            ingredients: params.get("ingredients"),
            cuisine: params.get("cuisine"),
            meal: params.get("meal"),
            preparationTime: params.get("preparationTime"),
        };
    }
    
    // const params = getQueryParams();
    // console.log('AAAAAAAAAAAAAAAAAAAAAAAA', params);

    // autoFillForm(params);
    


    
    function autoFillForm(params) {
        document.getElementById("recipe-title").value = params.title || '';
        document.getElementById("recipe-description").value = params.description || '';
        document.getElementById("recipe-ingredients").value = params.ingredients ? params.ingredients.split(',').join('\n') : '';
        document.getElementById("recipe-cuisine").value = params.cuisine || '';
        document.getElementById("recipe-meal").value = params.meal || '';

        const prepTime = parseInt(params.preparationTime) || 0;
        const hours = Math.floor(prepTime / 60);
        const minutes = prepTime % 60;
        document.getElementById("recipe-prep-hour").value = hours;
        document.getElementById("recipe-prep-minute").value = minutes;

    }


    function setupBackButton() {
        const backButton = document.getElementById('back-arrow-button');

        backButton.addEventListener('click', () => {
            window.history.back();
            // window.history.go(-1);
        });
}
setupBackButton();
