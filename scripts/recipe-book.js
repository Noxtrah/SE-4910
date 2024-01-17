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
            recipes.push({
                title: title,
                ingredients: ingredients,
                description: description
            });

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
function showRecipes() {
    const recipeContainer = document.querySelector(".recipe-book-container");
    recipeContainer.innerHTML = "";

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
}
