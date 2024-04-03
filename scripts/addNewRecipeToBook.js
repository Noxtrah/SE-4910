// async function saveRecipe(recipeData) {
//     const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-recipe';
//     const JWTAccessToken = sessionStorage.getItem('accessToken');
//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': JWTAccessToken
//             },
//             body: JSON.stringify(recipeData),
//         });

//         console.log('Request URL:', apiUrl);
//         console.log('Request Headers:', {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${JWTAccessToken}`
//         });

//         console.log('Request Body:', JSON.stringify(recipeData));
//         const errorText = await response.text();
//         if (!response.ok) {
//             console.log('Response Text:', errorText);
//             throw new Error(`Failed to save recipe. Status: ${response.status}`);
//         }

//         let savedRecipe;
//         try {
//             // Try parsing the response as JSON
//             savedRecipe = await response.json();
//             console.log('Recipe saved successfully:', savedRecipe);
//         } catch (error) {
//             // Handle non-JSON response (e.g., success message as plain text)
//             console.log('Response is not a valid JSON. Message:', errorText);
//             savedRecipe = { message: errorText }; // You can adjust this based on your needs
//         }

//         return savedRecipe;
//     } catch (error) {
//       console.error('Error saving recipe:', error.message);
//       throw error;
//     }
// }


//RESİMLİ SAVE İÇİN BUNU KULLAN
// async function saveRecipe(recipeData) {
//     const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-recipe';
//     const JWTAccessToken = sessionStorage.getItem('accessToken');
    
//     try {
//         const formData = new FormData();
//         formData.append('title', recipeData.title);
//         formData.append('ingredients', recipeData.ingredients);
//         formData.append('description', recipeData.description);
//         formData.append('cuisine', recipeData.cuisine);
//         formData.append('meal', recipeData.meal);
//         formData.append('preparationTime', recipeData.preparationTime);
//         formData.append('photo', recipeData.photoPath);

//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Authorization': JWTAccessToken
//             },
//             body: formData,
//         });

//         console.log('Request URL:', apiUrl);
//         console.log('Request Headers:', {
//             'Authorization': `${JWTAccessToken}`
//         });
//         console.log('Request Body:', formData);

//         const errorText = await response.text();
//         if (!response.ok) {
//             console.log('Response Text:', errorText);
//             throw new Error(`Failed to save recipe. Status: ${response.status}`);
//         }

//         let savedRecipe;
//         try {
//             // Try parsing the response as JSON
//             savedRecipe = await response.json();
//             console.log('Recipe saved successfully:', savedRecipe);
//         } catch (error) {
//             // Handle non-JSON response (e.g., success message as plain text)
//             console.log('Response is not a valid JSON. Message:', errorText);
//             savedRecipe = { message: errorText }; // You can adjust this based on your needs
//         }

//         return savedRecipe;
//     } catch (error) {
//         console.error('Error saving recipe:', error.message);
//         throw error;
//     }
// }

async function saveRecipe(recipeData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/save-recipe';
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWTAccessToken
            },
            body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
            // If response status is not OK, throw an error with the status and error message
            const errorMessage = await response.text();
            throw new Error(`Failed to save recipe. Status: ${response.status}. Message: ${errorMessage}`);
        }

        // Read response body as text and store it in a variable
        const responseBody = await response.text();

        // Attempt to parse the response body as JSON
        let responseData;
        try {
            responseData = JSON.parse(responseBody);
            console.log('Recipe saved successfully:', responseData);
        } catch (error) {
            // If parsing fails, log the response text and set responseData to null
            console.error('Failed to parse response as JSON. Response:', responseBody);
            responseData = null;
        }

        // Return the response data, which may be null if parsing failed
        return responseData;
    } catch (error) {
        // Catch any errors that occur during the fetch operation
        console.error('Error saving recipe:', error.message);
        throw error;
    }
}



// const saveButton = document.getElementById("save-button");
// saveButton.addEventListener("click", saveRecipe);

const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", function (event) {
        const recipeData = {
            title: document.getElementById('recipe-title').value,
            ingredients: document.getElementById('recipe-ingredients').value,
            description: document.getElementById('recipe-description').value,
            cuisine: document.getElementById('recipe-cuisine').value,
            meal: document.getElementById('recipe-meal').value,
            preparationTime: document.getElementById('recipe-prep-time').value,
            // photoPath: document.getElementById('photo').files[0] ? document.getElementById('photo').files[0].name : '',
            photoPath: document.getElementById('photo').files[0]
          };
        event.preventDefault(); // Sayfanın yeniden yüklenmesini önle
        // addRecipe();
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