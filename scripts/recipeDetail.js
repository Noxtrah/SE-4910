document.addEventListener('DOMContentLoaded', function () {
    // Extracting the recipe id from the URL (you can use a different method)
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'), 10); // Assuming the parameter name is 'id'

    // Fetch data from the API endpoint (replace with your actual API endpoint)
    fetch('https://recipiebeckend.azurewebsites.net/recipes/all-recipes')
        .then(response => response.json())
        .then(data => {
            // Find the recipe with the specified id
            const selectedRecipe = data.find(recipe => recipe.id === recipeId);

            // Check if the recipe is found
            if (selectedRecipe) {
                // Update recipe title
                document.getElementById('recipe-title').textContent = selectedRecipe.title;

                // Update ingredients list
                const ingredientsList = document.getElementById('recipe-ingredients').getElementsByTagName('ul')[0];
                selectedRecipe.ingredients.split(',').forEach(ingredient => {
                    const listItem = document.createElement('li');
                    listItem.textContent = ingredient.trim();
                    ingredientsList.appendChild(listItem);
                });

                // Update recipe description
                const descriptionElement = document.getElementById('recipe-description');
                descriptionElement.innerHTML = `<p>${selectedRecipe.description}</p>`;
                
                // Update the recipe image
                document.querySelector('.recipe-image').src = selectedRecipe.photoPath;
            } else {
                console.error('Recipe not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe data:', error);
        });
});
