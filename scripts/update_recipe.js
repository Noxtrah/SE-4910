// window.addEventListener('DOMContentLoaded', async function() {
//     try {
//         const apiURL = 'http://localhost:5500/recipes/update-recipe';

//         const updateRecipeForm = document.getElementById('updateRecipeForm');
//         updateRecipeForm.addEventListener('submit', async function(event) {
//             event.preventDefault();
            
//             const formData = new FormData(updateRecipeForm);
//             const id = formData.get('id');

//             // Ensure ID is provided before sending the request
//             if (!id) {
//                 alert('Recipe ID is required.');
//                 return;
//             }

            

//             const response = await fetch(`${apiURL}/${id}`, {
//                 method: 'POST',
//                 body: formData
//             });

//             if (response.ok) {
//                 const result = await response.text();
//                 alert(result); // You can handle success response here
//             } else {
//                 alert('Failed to update recipe'); // You can handle error response here
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });

// function fetchUpdateRecipe(){
//     fetch('http://localhost:5500/recipes/update-recipe', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Registration failed');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // handle success, e.g., redirect to another page
//         console.log(data);
//     })
//     .catch(error => {
//         // handle error
//         console.error('Error:', error);
//     });
// }

// window.addEventListener('DOMContentLoaded', async function() {
//     try {
//         const apiURL = 'https://recipiebeckend.azurewebsites.net/recipes/update-recipe';

//         updateRecipeForm.addEventListener('submit', async function(event) {
//             event.preventDefault();
            
//             const formData = document.getElementById("updateRecipeForm");
//             console.log(formData);
//             // const id = formData.get('id');
        
//             // // Ensure ID is provided before sending the request
//             // if (!id) {
//             //     alert('Recipe ID is required.');
//             //     return;
//             // }
        
//             fetchUpdateRecipe(apiURL, formData);
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });

// function fetchUpdateRecipe(apiURL, formData) {
//     fetch(apiURL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to update recipe');
//         }
//         return response.text(); // Assuming you're expecting text response
//     })
//     .then(data => {
//         // handle success, e.g., redirect to another page
//         alert('Recipe updated successfully');
//         console.log(data);
//     })
//     .catch(error => {
//         // handle error
//         console.error('Error:', error);
//         alert('Failed to update recipe');
//     });
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

// Get the form element
const updateRecipeForm = document.getElementById("updateRecipeForm");

// Add event listener to the form submission
updateRecipeForm.addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault(); 

    // Get the value of the id field
    const id = document.getElementById('id').value;

    // Get the file input element
    const photoFile = document.getElementById('photoPath').files[0];

    // Create a new FormData object to send data to the server
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photoPath', photoFile);

    console.log("Form submitted");

    try {
        await saveRecipe(formData); // Call the saveRecipe function with the formData
        // Optional: Perform any actions after the recipe is updated successfully
        console.log('Recipe updated successfully');
    } catch (error) {
        console.error('Failed to update recipe:', error.message);
        // Optional: Handle error (e.g., display error message to the user)
        alert('Failed to update recipe. Please try again later.');
    }
});

async function saveRecipe(formData) {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/update-recipe';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}