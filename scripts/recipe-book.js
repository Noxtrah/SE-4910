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
    fetch('https://recipiebeckend.azurewebsites.net/auth/login2', {
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

async function getRecipesFromDatabase(){
    try {
        const response = await fetch('your_api_endpoint_here');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
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
    const recipeForm = document.getElementById("recipe-form");
    recipeForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Sayfanın yeniden yüklenmesini önle
        addRecipe(); // Tarifi ekle
    });
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
