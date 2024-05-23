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
            fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-by-id?id=${recipeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.displayRecipeDetails(data);
                    this.getRecommendations(data.recipe.ingredients,data.recipe.title)
                })
                .catch(error => {
                    console.error('Error fetching recipe data:', error);
                });
        } else {
            console.error('Recipe ID not provided in the URL.');
        }
    }
    displayRecipeDetails(data) {
        const selectedRecipe = data.recipe;
    
        // Update recipe title
        document.getElementById('recipe-title').textContent = selectedRecipe.title;
    
        // Update ingredients list
        const ingredientsList = document.getElementById('recipe-ingredients').getElementsByTagName('ul')[0];
        ingredientsList.innerHTML = ''; // Clear existing list items
        if (selectedRecipe.ingredients) {
            selectedRecipe.ingredients.split(',').forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient.trim();
                ingredientsList.appendChild(listItem);
            });
        } else {
            ingredientsList.innerHTML = '<p>No ingredient information available</p>';
        }
    
        // Update description
        const descriptionElement = document.getElementById('recipe-description');
        if (selectedRecipe.description) {
            descriptionElement.innerHTML = `<p>${selectedRecipe.description}</p>`;
        } else {
            descriptionElement.innerHTML = '<p>No recipe description available</p>';
        }
    
        // Update cuisine
        const cuisineElement = document.getElementById('recipe-cuisine');
        if (selectedRecipe.cuisine) {
            cuisineElement.innerHTML = `<p>${selectedRecipe.cuisine}</p>`;
        } else {
            cuisineElement.innerHTML = '<p>No cuisine information available</p>';
        }
    
        // Update meal information
        const mealElement = document.getElementById('recipe-meal');
        if (selectedRecipe.meal && selectedRecipe.meal.length > 0) {
            const mealName = selectedRecipe.meal[0].mealName;
            const capitalizedMealName = mealName.charAt(0).toUpperCase() + mealName.slice(1);
            mealElement.innerHTML = `<p>${capitalizedMealName}</p>`;
        } else {
            mealElement.innerHTML = '<p>No meal information available</p>';
        }
    
        // Update photo
        const recipeImage = document.querySelector('.recipe-image');
        if (selectedRecipe.photoPath) {
            recipeImage.src = selectedRecipe.photoPath;
        } else {
            recipeImage.alt = 'No recipe photo available';
        }
    
        // Update preparation time
        const prepTimeElement = document.getElementById('recipe-prep-time');
        prepTimeElement.innerHTML = ''; // Clear existing content
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
            timeText.textContent = `${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : ''} ${minutes > 0 ? minutes + ' minute' + (minutes > 1 ? 's' : '') : ''}`;
    
            prepTimeContainer.appendChild(gifImg);
            prepTimeContainer.appendChild(timeText);
            prepTimeElement.appendChild(prepTimeContainer);
        } else {
            prepTimeElement.innerHTML = '<p>No preparation time information available</p>';
        }
    }
    

    
    getRecommendations(ingredients, title) {
        fetch(`http://127.0.0.1:5000/get-recommendations?ingredients=${ingredients}&title=${title}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(recommendations => {
                // Önerileri kullanıcı arayüzüne göster
                this.displayRecommendations(recommendations);
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
    }

    displayRecommendations(recommendations) {
        const slidesContainer = document.getElementById('slides');
        slidesContainer.innerHTML = ''; // Slider içeriğini temizle
    
        recommendations.recommendations.forEach((recommendation, index) => {
            if (index % 3 === 0) {
                // Her üç öneriden sonra yeni bir slide oluştur
                const slide = document.createElement('div');
                slide.className = 'slide';
                slidesContainer.appendChild(slide);
            }
    
            // Resmi oluştur
            const img = document.createElement('img');
            img.src = recommendation.photoPathURL;
            img.alt = recommendation.title;
    
            // Başlığı oluştur
            const title = document.createElement('div');
            title.className = 'recommendation-title';
            title.textContent = recommendation.title;
    
            // Resmi ve başlığı slide içeriğine ekle
            const currentSlide = slidesContainer.lastElementChild;
            const slideContent = document.createElement('div');
            slideContent.appendChild(img);
            slideContent.appendChild(title);
            currentSlide.appendChild(slideContent);
        });
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
