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
                    setTimeout(() => {
                        this.getRecommendations(data.ingredients,data.title);
                    }, 2000);
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
            const mealName = selectedRecipe.meal;
            console.log("Selected recipe: " , selectedRecipe);
            console.log("Meal name: " , mealName);
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
    
  // Önerileri slider içeriğine ekle
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
let slideIndex = 0;
const slidesContainer = document.getElementById('slides');

// AI'dan gelen verileri burada tanımlayın
const aiData = [
    { img: "image1.jpg", alt: "AI verisi 1" },
    { img: "image2.jpg", alt: "AI verisi 2" },
    { img: "image3.jpg", alt: "AI verisi 3" },
    { img: "image4.jpg", alt: "AI verisi 4" },
    { img: "image5.jpg", alt: "AI verisi 5" },
    { img: "image6.jpg", alt: "AI verisi 6" },
    { img: "image7.jpg", alt: "AI verisi 7" },
    { img: "image8.jpg", alt: "AI verisi 8" },
    { img: "image9.jpg", alt: "AI verisi 9" }
];

// Verileri 3'erli gruplar halinde slider'a eklemek
for (let i = 0; i < aiData.length; i += 3) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    
    for (let j = 0; j < 3; j++) {
        if (aiData[i + j]) {
            const img = document.createElement('img');
            img.src = aiData[i + j].img;
            img.alt = aiData[i + j].alt;
            slide.appendChild(img);
        }
    }

    slidesContainer.appendChild(slide);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    } else {
        slideIndex = index;
    }
    slidesContainer.style.transform = `translateX(${-slideIndex * 100 / 3}%)`; // 3 slide olduğundan dolayı her biri container'ın 1/3'ü genişliğinde
}

function nextSlide() {
    showSlide(slideIndex + 1);
}

function prevSlide() {
    showSlide(slideIndex - 1);
}

// İlk slide'ı göster
showSlide(slideIndex);

const recipeDetailPage = new RecipeDetail();
