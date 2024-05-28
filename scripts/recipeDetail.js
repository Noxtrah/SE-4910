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
        const JWTAccessToken = sessionStorage.getItem('accessToken');


        if (recipeId) {
            fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-by-id?id=${recipeId}`, {
                headers: {
                    'Authorization': JWTAccessToken
                }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.displayRecipeDetails(data);
                    console.log("Recipe Data: ",data)
                    const mealNames = this.getMealNames(data.recipe.meal);
                    setTimeout(() => {
                        this.getRecommendations(data.recipe.ingredients, data.recipe.title, mealNames);
                    }, 2000); // Örneğin, 2 saniye bekleyebiliriz
                })
                .catch(error => {
                    console.error('Error fetching recipe data:', error);
                });
        } else {
            console.error('Recipe ID not provided in the URL.');
        }
    }



    async displayRecipeDetails(data) {
        // const allergies = await fetchAllergies()
        // console.log("Allergies: ", allergies)


        const selectedRecipe = data.recipe;

        // Update recipe title
        document.getElementById('recipe-title').textContent = selectedRecipe.title;

        // function highlightAllergicFoods(ingredientsText, allergicFoodString) {
        //     var allergicFoods = allergicFoodString.split(","); // Split allergic foods by comma
        //     console.log("Allergic Foods: ", allergicFoods);
        //     // Highlight each allergic food
        //     allergicFoods.forEach(function(allergicFood) {
        //         var regex = new RegExp('(' + allergicFood.trim() + ')', 'gi');
        //         ingredientsText = ingredientsText.replace(regex, '<span class="highlight">$1</span>'); // Highlight allergic food
        //     });
        
        //     return ingredientsText;
        // }
        
        // Assuming 'selectedRecipe.ingredients' is a comma-separated string
        const ingredientsList = document.getElementById('recipe-ingredients').getElementsByTagName('ul')[0];
        ingredientsList.innerHTML = ''; // Clear existing list items
        const allergicFoods = data.allergicFoods; // Assuming data.allergicFoods is a comma-separated string of allergens

        const allergens = allergicFoods.split(',')
        .map(allergen => allergen.trim().toLowerCase())
        .filter(allergen => allergen !== "");

        if (selectedRecipe.ingredients) {
            selectedRecipe.ingredients.split(',').forEach(ingredient => {
                const listItem = document.createElement('li');
                const trimmedIngredient = ingredient.trim();
                listItem.textContent = trimmedIngredient;

                // Check if the ingredient contains any of the allergens
                allergens.forEach(allergen => {
                    if (trimmedIngredient.toLowerCase().includes(allergen)) {
                        listItem.style.color = 'red'; // Highlight the ingredient
                        const warningIcon = document.createElement('i');
                        warningIcon.className = 'fa-solid fa-triangle-exclamation fa-fade';
                        warningIcon.style.verticalAlign = '0%';
                        warningIcon.style.marginLeft = '10px';
                        listItem.appendChild(warningIcon);
                    }
                });

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
        const mealNames = this.getMealNames(selectedRecipe.meal);
        mealElement.innerHTML = mealNames.map(meal => `<p>${meal}</p>`).join('');
    
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

    
    getMealNames(meals) {
        if (!meals || meals.length === 0) {
            return ['No meal information available'];
        }
        return meals.map(meal => {
            return meal.mealName.charAt(0).toUpperCase() + meal.mealName.slice(1);
        });

    }
    

    getRecommendations(ingredients, title, mealNames ) {
        fetch(`http://127.0.0.1:5000/get-recommendations?ingredients=${ingredients}&title=${title}&mealNames=${mealNames}`)
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
    
        if (recommendations && recommendations.recommendations) {
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
        } else {
            console.error('Error fetching recommendations: Recommendations object is undefined or empty.');
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

async function fetchAllergies() {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/user-allergies';
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': JWTAccessToken,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: JWTAccessToken ? headers : { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.text();
      console.log("Allergies: " , data);
  
    } catch (error) {
      console.error('Error fetching or displaying data:', error);
    }
}

const recipeDetailPage = new RecipeDetail();