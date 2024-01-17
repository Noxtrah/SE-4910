// Dummy database of recipes
const recipes = [
    { id: 1, title: "Spaghetti Bolognese", img: "https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg" },
    { id: 2, title: "Chicken Alfredo", img: "https://kwokspots.com/wp-content/uploads/2023/07/chicken-alfredo.png" },
    { id: 3, title: "Vegetarian Stir Fry", img: "https://food-images.files.bbci.co.uk/food/recipes/sachas_stir-fry_17077_16x9.jpg" },
    // Add more recipes as needed
];

// Function to generate user recipe boxes
function generateUserRecipeBoxes() {
    const gridContainer = document.querySelector('.grid-container');

    recipes.forEach(recipe => {
        const userRecipeBox = document.createElement('div');
        userRecipeBox.classList.add('user-recipe-box');

        const recipeTitle = document.createElement('div');
        recipeTitle.classList.add('recipe-title');
        recipeTitle.textContent = recipe.title;

        const recipeImage = document.createElement('img');
        recipeImage.classList.add('recipe-image');
        recipeImage.src = recipe.img; // Set the image source from the 'img' property
        recipeImage.alt = `${recipe.title} Image`; // Set alt attribute for accessibility

        userRecipeBox.appendChild(recipeImage); // Append the image to the userRecipeBox
        userRecipeBox.appendChild(recipeTitle);
        gridContainer.appendChild(userRecipeBox);
    });
}

// Call the function to generate user recipe boxes when the page loads
window.onload = generateUserRecipeBoxes;
