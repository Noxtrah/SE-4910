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

//         if (!response.ok) {
//             const errorMessage = await response.text();
//             throw new Error(`Failed to save recipe. Status: ${response.status}. Message: ${errorMessage}`);
//         }

//         const responseBody = await response.text();

//         const idMatch = responseBody.match(/id,(\d+),/);
//         const id = idMatch ? idMatch[1] : null;

//         console.log('id:', id);

//         let responseData;
//         try {
//             responseData = JSON.parse(responseBody);
//             console.log('Recipe saved successfully:', responseData);
//         } catch (error) {
//             console.error('Failed to parse response as JSON. Response:', responseBody);
//             responseData = null;
//         }

//         if (id !== null) {
//             await saveRecipetoAIdataSet(recipeData, id);
//         }

//         return responseData;
//     } catch (error) {
//         console.error('Error saving recipe:', error.message);
//         throw error;
//     }
// }

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
            recipePhoto: document.getElementById('photo').files[0]
          };
        event.preventDefault(); // Sayfanın yeniden yüklenmesini önle
        // addRecipe();
        console.log("Save button clicked");
        console.log(recipeData);
      
        saveRecipe(recipeData); // önce bunun çalışıp bittiğinden emin olmalıyız. photo url almak için

        // saveRecipetoAIdataSet(recipeData);
    });


  

    function setupBackButton() {
        const backButton = document.getElementById('back-arrow-button');

        backButton.addEventListener('click', () => {
            window.history.back();
            // window.history.go(-1);
        });
    
  

    
}

setupBackButton();