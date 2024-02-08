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

        console.log('Request URL:', apiUrl);
        console.log('Request Headers:', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWTAccessToken}`
        });

        console.log('Request Body:', JSON.stringify(recipeData));
        const errorText = await response.text();
        if (!response.ok) {
            console.log('Response Text:', errorText);
            throw new Error(`Failed to save recipe. Status: ${response.status}`);
        }

        let savedRecipe;
        try {
            // Try parsing the response as JSON
            savedRecipe = await response.json();
            console.log('Recipe saved successfully:', savedRecipe);
        } catch (error) {
            // Handle non-JSON response (e.g., success message as plain text)
            console.log('Response is not a valid JSON. Message:', errorText);
            savedRecipe = { message: errorText }; // You can adjust this based on your needs
        }

        return savedRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error.message);
      throw error;
    }
}


document.addEventListener("DOMContentLoaded", function () {
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

const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", function (event) {
        const recipeData = {
            title: document.getElementById('recipe-title').value,
            ingredients: document.getElementById('recipe-ingredients').value,
            description: document.getElementById('recipe-description').value,
            cuisine: document.getElementById('recipe-cuisine').value,
            meal: document.getElementById('recipe-meal').value,
            preparationTime: parseInt(document.getElementById('recipe-prep-time').value) || 0,
            photoPath: document.getElementById('photo').files[0] ? document.getElementById('photo').files[0].name : '',
          };
        event.preventDefault(); // Sayfanın yeniden yüklenmesini önle
        // addRecipe();
        console.log("Save button clicked");
        console.log(recipeData);
        saveRecipe(recipeData);
    });

// Function to display recipes in the recipe container
async function showRecipes() {
    const recipeContainer = document.querySelector(".recipe-book-container");
    recipeContainer.innerHTML = "";

    try {
        // Call the fetchRecipes function
        const recipes = await fetchRecipes();

        recipes.forEach(recipe => {
            const recipeItem = document.createElement("div");
            recipeItem.classList.add("recipe-item");
            recipeItem.innerHTML = `
                <h2>${recipe.title}</h2>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Description:</strong> ${recipe.description}</p>
            `;
            recipeContainer.appendChild(recipeItem);
        });
    } catch (error) {
        console.error('Error showing recipes:', error);
    }
}
