// Geçici veritabanı
let recipes = [
    {
        title: "Spaghetti Bolognese",
        ingredients: "Pasta, Ground Beef, Tomato Sauce, Onion, Garlic, Olive Oil, Salt, Pepper",
        description: "Classic Italian dish with a rich meat sauce."
    },
    {
        title: "Chicken Alfredo",
        ingredients: "Fettuccine, Chicken Breast, Heavy Cream, Parmesan Cheese, Butter, Garlic, Salt, Pepper",
        description: "Creamy pasta dish with grilled chicken."
    },
    {
        title: "Vegetarian Stir-Fry",
        ingredients: "Tofu, Broccoli, Bell Peppers, Carrots, Soy Sauce, Ginger, Garlic, Sesame Oil",
        description: "Healthy and flavorful stir-fried vegetables with tofu."
    }
];
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
            coverImage.src = recipe.photoPath;
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
            publishButton.textContent = "Publish";
            buttonsContainer.appendChild(publishButton);

            // Create Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            buttonsContainer.appendChild(editButton);

            // Create Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            buttonsContainer.appendChild(deleteButton);

            // Append buttons container to recipe item
            recipeItem.appendChild(buttonsContainer);

            // Append recipe item to recipe container
            recipeContainer.appendChild(recipeItem);

            // Set content for each element based on the recipe data
            recipeName.textContent = recipe.title;
            recipeDescription.textContent = "Description: " + recipe.description;
            recipeIngredients.textContent = "Ingredients: " + recipe.ingredients;
            recipeCuisine.textContent = "Cuisine: " + recipe.cuisine;
            recipeMeal.textContent = "Meal: " + recipe.meal;
            recipePrepTime.textContent = "Preparation Time: " + recipe.preparationTime;
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
                publishRecipe(userRecipeId, recipeDetails);
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
            'Authorization': JWTAccessToken
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
