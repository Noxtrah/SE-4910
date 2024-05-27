let title;
let ingredients;
let description;

function sendRecipesToDatabase(){
    fetch('https://recipiebeckend.azurewebsites.net/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            ingredients: ingredients,
            description: description
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        else{
            console.log("Response is OK");
        }

    })
    .catch(error => {
        // handle error
        console.error('Error:', error);
    });

}

function setupBackButton() {
        const backButton = document.getElementById('back-arrow-button');

        backButton.addEventListener('click', () => {
            window.history.back();
            // window.history.go(-1);
        });
}

setupBackButton();

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('my-recipe-book-title').textContent = "My Recipe Book";
    const recipeContainer = document.querySelector(".recipe-book-container");

    // Show recipes when the page is loaded
    showRecipes();

    // Add New Recipe sayfasından gelen verileri al ve veritabanına ekle
    function addRecipe() {
        const title = document.getElementById("recipe-title").value;
        const ingredients = document.getElementById("recipe-ingredients").value;
        const description = document.getElementById("recipe-description").value;

        if (title && ingredients && description) {

            // Yeni tarifi veritabanına ekle
            sendRecipesToDatabase();
            // recipes.push({
            //     title: title,
            //     ingredients: ingredients,
            //     description: description
            // });

            // Tarif eklendikten sonra tarifleri göster
            showRecipes();

            // Add New Recipe sayfasını temizle
            document.getElementById("recipe-form").reset();
        } else {
            alert("Please fill in all fields.");
        }
    }

    // Sayfa yüklendiğinde formun submit işlemini dinle
});

// Function to display recipes in the recipe container
async function showRecipes() {
    const recipeContainer = document.querySelector(".grid-container");
    recipeContainer.innerHTML = "";

    try {
        // Call the fetchRecipes function
        const recipes = await getSavedRecipes();

        recipes.forEach(recipe => {
            // Create recipe item container
            const recipeItem = document.createElement("div");
            recipeItem.classList.add("recipe-item");

            // Create book container
            const bookContainer = document.createElement("div");
            bookContainer.classList.add("book");

            // Create gloss div
            const glossDiv = document.createElement("div");
            glossDiv.classList.add("gloss");
            bookContainer.appendChild(glossDiv);

            // Create cover image
            const coverImage = document.createElement("img");
            coverImage.classList.add("cover");
            // coverImage.src = "../Images/background.png";
            coverImage.src = recipe.photoPath ? recipe.photoPath : "../Images/RecipeIcon2.webp";
            bookContainer.appendChild(coverImage);

            // Create description container
            const descriptionContainer = document.createElement("div");
            descriptionContainer.classList.add("description");

            // Create recipe name (h1)
            const recipeName = document.createElement("h1");
            recipeName.classList.add("recipe-name");
            descriptionContainer.appendChild(recipeName);

            // Create horizontal line (hr)
            const hrElement = document.createElement("hr");
            descriptionContainer.appendChild(hrElement);

            // Create recipe description (p)
            const recipeDescription = document.createElement("p");
            recipeDescription.classList.add("recipe-description");
            descriptionContainer.appendChild(recipeDescription);

            // Append book container and description container to recipe item
            bookContainer.appendChild(descriptionContainer);
            recipeItem.appendChild(bookContainer);

            // Create recipe ingredients (p)
            const recipeIngredients = document.createElement("p");
            recipeIngredients.classList.add("recipe-ingredients");
            descriptionContainer.appendChild(recipeIngredients);

            bookContainer.appendChild(descriptionContainer);
            recipeItem.appendChild(bookContainer);

            // Create recipe cuisine (p)
            const recipeCuisine = document.createElement("p");
            recipeCuisine.classList.add("recipe-cuisine");
            descriptionContainer.appendChild(recipeCuisine);

            bookContainer.appendChild(descriptionContainer);
            recipeItem.appendChild(bookContainer);

            // Create recipe meal (p)
            const recipeMeal = document.createElement("p");
            recipeMeal.classList.add("recipe-meal");
            descriptionContainer.appendChild(recipeMeal);

            bookContainer.appendChild(descriptionContainer);
            recipeItem.appendChild(bookContainer);

            // Create recipe prep. Time (p)
            const recipePrepTime = document.createElement("p");
            recipePrepTime.classList.add("recipe-prep-time");
            descriptionContainer.appendChild(recipePrepTime);

            bookContainer.appendChild(descriptionContainer);
            recipeItem.appendChild(bookContainer);

            // Create recipe title (h1)
            const recipeTitle = document.createElement("h1");
            recipeTitle.classList.add("recipe-title");
            recipeItem.appendChild(recipeTitle);

            // Create buttons container
            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("buttons");

            // Create Publish button
            const publishButton = document.createElement("button");
            publishButton.classList.add("publish-button");
            publishButton.textContent = "Publish";
            buttonsContainer.appendChild(publishButton);
            if(recipe.isPublish){
                publishButton.textContent = "Unpublish"
            }
            publishButton.onclick = function() {
                publishButton.textContent = publishButton.textContent === "Publish" ? "Unpublish" : "Publish";
            }
            // Create Edit button
            
            const editRecipeBtn = document.createElement("button");
            editRecipeBtn.classList.add("edit-recipe-btn");
            editRecipeBtn.textContent = "Edit Recipe";
            buttonsContainer.appendChild(editRecipeBtn);

            // Create Delete button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";

            buttonsContainer.appendChild(deleteButton);

            // Append buttons container to recipe item
            recipeItem.appendChild(buttonsContainer);

            // Append recipe item to recipe container
            recipeContainer.appendChild(recipeItem);

            function convertToHourMinuteFormat(totalMinutes) {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const hoursText = hours === 1 ? 'hour' : 'hours';
                const minutesText = minutes === 1 ? 'minute' : 'minutes';
                return `${hours} ${hoursText} ${minutes} ${minutesText}`;
            }

            // Set content for each element based on the recipe data
            recipeName.textContent = recipe.title;
            recipeDescription.textContent = "Description: " + recipe.description;
            recipeIngredients.textContent = "Ingredients: " + recipe.ingredients;
            recipeCuisine.textContent = "Cuisine: " + recipe.cuisine;
            recipeMeal.textContent = "Meal: " + recipe.meal;
            recipePrepTime.textContent = "Preparation Time: " + convertToHourMinuteFormat(recipe.preparationTime);
            recipeTitle.textContent = recipe.title;

            // const publishButton = document.getElementById("publishButton");
            publishButton.addEventListener("click", () => {
                const userRecipeId = recipe.id;
                console.log(userRecipeId);
                const recipeDetails = {
                    title: recipe.title,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    cuisine: recipe.cuisine,
                    meal: recipe.meal,
                    preparationTime: recipe.preparationTime,
                    photoData: recipe.coverImage
                };
                console.log(recipeDetails);

                // Call publishRecipe with local variables
                if(publishButton.textContent == "Unpublish"){
                    publishRecipe(userRecipeId, recipeDetails);
                }
                else if(publishButton.textContent == "Publish"){
                    unpublishRecipe(userRecipeId, recipeDetails);
                }
            });

            // ********************EDIT RECIPE************************************
            editRecipeBtn.addEventListener("click", function() {
                const recipeId = recipe.id;
                const urlParams = new URLSearchParams();
                urlParams.append("id", recipeId);
                urlParams.append("title", recipe.title);
                urlParams.append("description", recipe.description);
                urlParams.append("ingredients", recipe.ingredients);
                urlParams.append("cuisine", recipe.cuisine);
                urlParams.append("meal", recipe.meal);
                urlParams.append("preparationTime", recipe.preparationTime);
                // urlParams.append("photoPath", recipe.photoPath);

                const editRecipeUrl = `editUserRecipe.html?${urlParams.toString()}`;
                window.open(editRecipeUrl, "_self");
                console.log('url params', urlParams.toString());

            });

            deleteButton.addEventListener("click", async () => {
                const userRecipeId = recipe.id;
                try {
                    // Call the delete fetch function
                    await deleteRecipe(userRecipeId);

                    // Optionally, remove the recipe element from the UI after deletion
                    // For example, if your recipe element has an ID, you can remove it like this:
                    // const recipeElement = document.getElementById("recipe-" + userRecipeId);
                    // if (recipeElement) {
                    //     recipeElement.remove();
                    // }
                } catch (error) {
                    console.error("Error deleting recipe:", error);
                    // Handle errors if necessary
                }
            });
        });
    } catch (error) {
        console.error('Error showing recipes:', error);
    }
}

async function getSavedRecipes(){
    try {
        const apiURL = 'https://recipiebeckend.azurewebsites.net/user/get-saved-recipes';
        const JWTAccessToken = sessionStorage.getItem('accessToken');
        const headers = {
            'Authorization': JWTAccessToken
        };
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

		console.log('Fetched Data:', data);
        console.log("Response: ", response);
        // Call displayDashboard to render the fetched data
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
        return [];
    }
}

async function publishRecipe(userRecipeId, recipeDetails){
    try {
        const apiURL = `https://recipiebeckend.azurewebsites.net/user/publish-recipe?userRecipeId=${userRecipeId}`;
        const JWTAccessToken = sessionStorage.getItem('accessToken');
        const headers = {
            "Content-type": "application/json",
        };
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: headers,
            // body: JSON.stringify({
            //     recipeDetails: recipeDetails
            //   }),
        });
        if (response.ok) {
            alert('Recipe published successfully!');
            // Handle success scenario, if needed
        } else {
            alert('Failed to publish recipe!');
            // Handle failure scenario, if needed
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function unpublishRecipe(userRecipeId, recipeDetails){
    try {
        const apiURL = `https://recipiebeckend.azurewebsites.net/user/unpublish-recipe?userRecipeId=${userRecipeId}`;
        const JWTAccessToken = sessionStorage.getItem('accessToken');
        const headers = {
            "Content-type": "application/json",
        };
        const response = await fetch(apiURL, {
            method: 'PUT',
            headers: headers,
            // body: JSON.stringify({
            //     recipeDetails: recipeDetails
            //   }),
        });
        if (response.ok) {
            alert('Recipe unpublished successfully!');
            // Handle success scenario, if needed
        } else {
            alert('Failed to unpublish recipe!');
            // Handle failure scenario, if needed
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
// const publishButton = document.getElementById("publishButton");

// // Attach a click event listener
// publishButton.addEventListener("click", () => publishRecipe(userRecipeId, recipeDetails));


// function handlePublishClick(userRecipeId, recipeDetails) {
//     alert('Publish button clicked!');
//     publishRecipe(userRecipeId, recipeDetails);
// }

function handleEditClick() {
    alert('Edit button clicked!');
    // Add your logic for the Edit button here
}

function handleDeleteClick() {
    alert('Delete button clicked!');
    // Add your logic for the Delete button here
}

$('#pagination-demo').twbsPagination({
    totalPages: 16,
    visiblePages: 5,
    next: 'Next',
    prev: 'Prev',
    onPageClick: function (event, page) {
        //fetch content and render here
        console.log("Page: " , page);
        paging(page)
    }
});

  function paging(key) {
    key -= 1;
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/paging?key=' + key;
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayDashboard(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

async function deleteRecipe(userRecipeId) {
    const apiUrl = `https://recipiebeckend.azurewebsites.net/user/delete-user-recipe?userRecipeId=${userRecipeId}`;
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': JWTAccessToken
            }
        });

        if (!response.ok) {
            // If response status is not OK, throw an error with the status and error message
            const errorMessage = await response.text();
            throw new Error(`Failed to delete recipe. Status: ${response.status}. Message: ${errorMessage}`);
        }

        // If deletion is successful, log success message
        console.log('Recipe deleted successfully.');
    } catch (error) {
        // Catch any errors that occur during the fetch operation
        console.error('Error deleting recipe:', error.message);
        throw error;
    }
}