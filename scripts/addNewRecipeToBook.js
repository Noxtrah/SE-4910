async function saveRecipe(recipeData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-recipe';
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    // Create a FormData object to append all properties of recipeData
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

        const responseBody = await response.text();

        const idMatch = responseBody.match(/id,(\d+),/);
        const id = idMatch ? idMatch[1] : null;

        console.log('id:', id);

        let responseData;
        try {
            responseData = JSON.parse(responseBody);
            console.log('Recipe saved successfully:', responseData);
        } catch (error) {
            console.error('Failed to parse response as JSON. Response:', responseBody);
            responseData = null;
        }

        if (id !== null) {
            await saveRecipetoAIdataSet(recipeData, id);
        }

        return responseData;
    } catch (error) {
        console.error('Error saving recipe:', error.message);
        throw error;
    }
}

async function saveRecipetoAIdataSet(body, id) {
    try {
        const apiUrl = 'https://recipieai.azurewebsites.net/add-recipe-to-dataset';
        const photoPathURL = await getPhotoPathURL(id);
        const new_body = { ...body, photoPathURL };

        console.log('new_body:', new_body);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_body)
        });

        if (!response.ok) {
            throw new Error('Failed to add recipe to AI dataset');
        }

        const data = await response.json();
        console.log('Recipe added to AI dataset:', data);
    } catch (error) {
        console.error('Error adding recipe to AI dataset:', error);
    }
}

async function getPhotoPathURL(id) {
    try {
        const apiUrl = `https://recipiebeckend.azurewebsites.net/recipesUser/user-recipe-photoPath?userRecipeId=${id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch photo path URL');
        }
        console.log('Response: ', response);
        const responseData = await response.text();
        console.log('Response Data:', responseData);


        // Check if response data is empty
        if (!responseData.trim()) {
            console.log('Empty response data');
            return null; // or return a default value
        }

        const data = await response.json();
        console.log('Photo Path URL:', data.photoPathURL);
        return data.photoPathURL;
    } catch (error) {
        console.error('Error fetching photo path URL:', error);
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

setupBackButton();