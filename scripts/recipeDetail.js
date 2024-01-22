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
                if(selectedRecipe.ingredients){
                    selectedRecipe.ingredients.split(',').forEach(ingredient => {
                        const listItem = document.createElement('li');
                        listItem.textContent = ingredient.trim();
                        ingredientsList.appendChild(listItem);
                    });
                } else {
                    ingredientsList.innerHTML = '<p>No ingredient information available</p>';
                }


                // Update recipe description
                const descriptionElement = document.getElementById('recipe-description');
                if (selectedRecipe.description) {
                    descriptionElement.innerHTML = `<p>${selectedRecipe.description}</p>`;
                } else {
                    descriptionElement.innerHTML = '<p>No recipe description available</p>';
                }

                const cuisineElement = document.getElementById('recipe-cuisine');
                if (selectedRecipe.cuisine) {
                    cuisineElement.innerHTML = `<p>${selectedRecipe.cuisine}</p>`;
                } else {
                    cuisineElement.innerHTML = '<p>No cuisine information available</p>';
                }

                const mealElement = document.getElementById('recipe-meal');
                if (selectedRecipe.meal.length > 0) {
                    const mealName = selectedRecipe.meal[0].mealName;
                    const capitalizedMealName = mealName.charAt(0).toUpperCase() + mealName.slice(1);

                    mealElement.innerHTML = `<p>${capitalizedMealName}</p>`;
                } else {
                    mealElement.innerHTML = '<p>No meal information available</p>';
                }
                // Update the recipe image

                if(selectedRecipe.photoPath){
                    document.querySelector('.recipe-image').src = selectedRecipe.photoPath;
                } else {
                    '<p>No recipe photo available</p>'
                }

                const prepTimeElement = document.getElementById('recipe-prep-time');
                if (selectedRecipe.preparationTime) {
                    // Calculate hours and minutes
                    const hours = Math.floor(selectedRecipe.preparationTime / 60);
                    const minutes = selectedRecipe.preparationTime % 60;

                    const prepTimeContainer = document.createElement('div');
                    prepTimeContainer.style.display = 'flex'; // Use flexbox for alignment
                    prepTimeContainer.style.alignItems = 'center'; // Center vertically

                    // Create a new img element for the GIF
                    const gifImg = document.createElement('img');
                    gifImg.src = '../Gifs/prep-time.gif';  // Replace with the actual path to your GIF
                    gifImg.alt = 'Preparation Time Icon';
                    gifImg.width = 20;  // Set the desired width
                    gifImg.height = 20; // Set the desired height

                    gifImg.style.verticalAlign = 'top';

                    // Create a new span element for the text
                    const timeText = document.createElement('span');
                    timeText.textContent = `${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : ''} ${minutes > 0 ? minutes + ' minute' + (minutes > 1 ? 's' : '') : ''}`;

                    // Append both the GIF and text to prepTimeElement
                    prepTimeElement.appendChild(gifImg);
                    prepTimeElement.appendChild(timeText);
                } else {
                    prepTimeElement.innerHTML = '<p>No preparation time information available</p>';
                }

            } else {
                console.error('Recipe not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe data:', error);
        });
});
