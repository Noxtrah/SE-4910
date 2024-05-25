document.addEventListener("DOMContentLoaded", function () {
    // Sayfa yüklendiğinde çalışacak fonksiyon
    CreateUserInfoPage();
});

async function CreateUserInfoPage() {
    try {
        // Kullanıcı bilgilerini al
        const userInfo = await getUserInfo();

        // Kullanıcı bilgilerini yerleştir
        document.getElementById('userName').textContent = userInfo.name + ' ' + userInfo.lastName;
        document.getElementById('userEmail').textContent = userInfo.email;
        document.getElementById('userBio').textContent = userInfo.bio || "Type about yourself"; // Bio alanı boşsa "Type about yourself" yazısı
        document.getElementById('userPhoto').src = userInfo.userPhoto; // Kullanıcı fotoğrafı

        // Kullanıcının yayınladığı tarifleri listele
        const userPublishedRecipesContainer = document.getElementById('userPublishedRecipes');
        userInfo.userPublishedRecipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            const recipeLeft = document.createElement('div');
            recipeLeft.classList.add('recipe-left');

            // Div to contain photo and title
            const photoTitleContainer = document.createElement('div');
            photoTitleContainer.classList.add('photo-title-container');

            // Recipe Fotoğrafı
            const recipePhoto = document.createElement('img');
            recipePhoto.classList.add('recipe-photo');
            recipePhoto.src = recipe.photoPath || '../Images/RecipeIcon4.png';
            photoTitleContainer.appendChild(recipePhoto);

            // Başlık
            const title = document.createElement('h2'); // Büyük başlık
            title.textContent = recipe.title;
            photoTitleContainer.appendChild(title);

            recipeLeft.appendChild(photoTitleContainer);

            // Diğer alanlar
            const recipeDetails = document.createElement('div');
            recipeDetails.classList.add('recipe-details');

            if (recipe.cuisine) {
                const cuisine = document.createElement('p');
                cuisine.textContent = 'Cuisine: ' + recipe.cuisine;
                recipeDetails.appendChild(cuisine);
            }

            if (recipe.meal) {
                const meal = document.createElement('p');
                meal.textContent = 'Meal: ' + recipe.meal;
                recipeDetails.appendChild(meal);
            }

            function convertToHourMinuteFormat(totalMinutes) {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const hoursText = hours === 1 ? 'hour' : 'hours';
                const minutesText = minutes === 1 ? 'minute' : 'minutes';
                return `${hours} ${hoursText} ${minutes} ${minutesText}`;
            }

            if (recipe.preparationTime !== undefined && recipe.preparationTime !== null) {
                const preparationTime = document.createElement('p');
                preparationTime.textContent = 'Preparation Time: ' + convertToHourMinuteFormat(recipe.preparationTime);
                recipeDetails.appendChild(preparationTime);
            }

            if (recipe.ingredients) {
                const ingredients = document.createElement('p');
                ingredients.textContent = 'Ingredients: ' + recipe.ingredients;
                recipeDetails.appendChild(ingredients);
            }

            if (recipe.description) {
                const description = document.createElement('p');
                description.textContent = 'Description: ' + recipe.description;
                recipeDetails.appendChild(description);
            }

            recipeElement.appendChild(recipeLeft);
            recipeElement.appendChild(recipeDetails);

            userPublishedRecipesContainer.appendChild(recipeElement);
        });
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
}

async function getUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    try {
        // const apiURL = `https://recipiebeckend.azurewebsites.net/user/visit-profile?username=$(username)}`;
        const apiURL = `https://recipiebeckend.azurewebsites.net/user/visit-profile?username=${username}`;
        const JWTAccessToken = sessionStorage.getItem('accessToken');
        const headers = {
            'Authorization': JWTAccessToken
        };
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
        return {};
    }
}

function setupBackButton() {
    const backButton = document.getElementById('back-arrow-button');
  
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Call the function to generate user recipe boxes when the page loads
window.onload = function () {
    setupBackButton(); // Call setupBackButton after generateUserRecipeBoxes
};

document.addEventListener("DOMContentLoaded", function () {
    var editProfileButton = document.getElementById("editProfileButton");
    
    if (editProfileButton) {
        editProfileButton.addEventListener("click", function () {
            window.location.href = "userEditProfile.html";
        });
    }
});
