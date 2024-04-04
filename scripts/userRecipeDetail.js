class RecipeDetail {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadRecipeDetails();
            this.setupBackButton();
        });
    }

    loadRecipeDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('id'), 10);

        if (recipeId) {
            fetch(`https://recipiebeckend.azurewebsites.net/recipesUser/user-recipe-byID?userRecipeId=${recipeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.displayRecipeDetails(data);
                })
                .catch(error => {
                    console.error('Error fetching recipe data:', error);
                });
        } else {
            console.error('Recipe ID not provided in the URL.');
        }
    }

    displayRecipeDetails(selectedRecipe) {
        // Update recipe details in the UI
        document.getElementById('recipe-title').textContent = selectedRecipe.title;

        const ingredientsList = document.getElementById('recipe-ingredients').getElementsByTagName('ul')[0];
        if (selectedRecipe.ingredients) {
            selectedRecipe.ingredients.split(',').forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient.trim();
                ingredientsList.appendChild(listItem);
            });
        } else {
            ingredientsList.innerHTML = '<p>No ingredient information available</p>';
        }

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

        if (selectedRecipe.photoPath) {
            document.querySelector('.recipe-image').src = selectedRecipe.photoPath;
        } else {
            '<p>No recipe photo available</p>';
        }

        const prepTimeElement = document.getElementById('recipe-prep-time');
        if (selectedRecipe.preparationTime) {
            const hours = Math.floor(selectedRecipe.preparationTime / 60);
            const minutes = selectedRecipe.preparationTime % 60;

            const prepTimeContainer = document.createElement('div');
            prepTimeContainer.style.display = 'flex';
            prepTimeContainer.style.alignItems = 'center';

            const gifImg = document.createElement('img');
            gifImg.src = '../Gifs/prep-time.gif';
            gifImg.alt = 'Preparation Time Icon';
            gifImg.width = 20;
            gifImg.height = 20;
            gifImg.style.verticalAlign = 'top';

            const timeText = document.createElement('span');
            timeText.textContent = `${hours > 0 ? ' ' + hours + ' hour' + (hours > 1 ? 's' : '') : ''} ${minutes > 0 ? minutes + ' minute' + (minutes > 1 ? 's' : '') : ''}`;

            prepTimeElement.appendChild(gifImg);
            prepTimeElement.appendChild(timeText);
        } else {
            prepTimeElement.innerHTML = '<p>No preparation time information available</p>';
        }
    }

    setupBackButton() {
        const backButton = document.getElementById('back-arrow-button');

        backButton.addEventListener('click', () => {
            window.history.back();
            // window.history.go(-1);
        });
    }
}

const recipeDetailPage = new RecipeDetail();
