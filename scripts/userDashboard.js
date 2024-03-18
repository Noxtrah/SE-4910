function toggleFavorite(element) {
    if (element.classList.contains('favorited')) {
      element.classList.remove('favorited');
    } else {
      element.classList.add('favorited');
    }
  }

  function hoverStar(element) {
    // Mouse üzerine gelindiğinde işaret değiştirme
    element.style.cursor = 'pointer';
  }

  
function setRating(rating, starContainer, recipe) {
	const stars = starContainer.querySelectorAll('.star');
  
	for (let i = 0; i < stars.length; i++) {
	  if (i < rating) {
		stars[i].innerHTML = '★';
		stars[i].style.color = 'gold';
	  } else {
		stars[i].innerHTML = '☆';
		stars[i].style.color = 'black';
	  }
	}
	if (recipe && recipe.id) {
    	giveRating(rating, recipe.id);
    } else {
        console.error('Recipe ID not found for the given recipe:', recipe);
        // Handle the case where the recipe ID is not available
    }
  }

  function giveRating(newRating, recipeId) {
    const url = `https://recipiebeckend.azurewebsites.net/user/give-rate-user-recipe?userRecipeId=${recipeId}&rate=${newRating}`;
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': JWTAccessToken,
    };

    fetch(url, {
        method: 'POST',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        return response.text(); // or response.blob(), response.json(), depending on the expected response type
    })
    .then(data => {
        console.log('Response Data:', data);
        // Continue handling the response as needed
    })
    .catch(error => console.error('Error updating rating:', error));
}

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let selectedDay = null;
  
  function selectDay(day) {
	  selectedDay = day;
	  const dayDivs = document.querySelectorAll('.day');
	  dayDivs.forEach(div => {
		  div.classList.remove('selected');
	  });
	  document.getElementById(day).classList.add('selected');
  }
  
  function addMeal() {
	  const input = document.getElementById('searchMeal');
	  const inputValue = input.value.trim();
  
	  if (inputValue !== '' && selectedDay !== null) {
		  const dayList = document.getElementById(`${selectedDay}List`);
  
		  const listItem = document.createElement('li');
		  listItem.textContent = inputValue;
  
		  // Create a span to hold the delete button
		  const deleteSpan = document.createElement('span');
		  deleteSpan.classList.add('delete-button');
  
		  // Create the delete button
		  const deleteButton = document.createElement('button1');
		  deleteButton.textContent = ' ✖'; // You can use any text or icon for delete
		  deleteButton.onclick = function() {
			  dayList.removeChild(listItem);
		  };
  
		  // Append the delete button to the span
		  deleteSpan.appendChild(deleteButton);
  
		  // Append the meal and delete button to the list item
		  listItem.appendChild(deleteSpan);
		  dayList.appendChild(listItem);
		  input.value = '';
	  }

	  
  }
  
  function saveMealPlan() {
	const allDays = days.map(day => ({
		day: day,
		meals: Array.from(document.getElementById(`${day}List`).children).map(item => item.textContent)
	}));

	// Here you can perform actions with the 'allDays' array like saving it to a database or using it elsewhere
	console.log(allDays); // For demonstration, it logs the meal plan to the console
}


  function clearText(thefield) {
	if (thefield.defaultValue == thefield.value) {
	  thefield.value = ""
	}
  }

  function replaceText(thefield) {
	if (thefield.value == "") {
	  thefield.value = thefield.defaultValue
	}
  }

let recipeIndex = 0;

  // Function to create a recipe element based on the provided recipe data
const createRecipeElement = async (recipe) => {
    // Create a new column for each recipe
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-item');

    const link = document.createElement('a');
    //link.addEventListener('click', () => openRecipeDetailPage(recipe.id));

    link.addEventListener('click', () => openRecipeDetailPage(recipe.id));
    console.log("Recipe ID: " , recipe.id);


    // Image
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    const img = document.createElement('img');
    img.src = recipe.photoPath;
    img.alt = 'Recipe Photo';

    // Apply CSS to constrain image size
    img.style.maxWidth = '100%'; // Adjust this value as needed
    img.style.height = '100%'; // Maintain aspect ratio

    link.appendChild(img);
    imgDiv.appendChild(link);

    const starContainer = document.createElement('div');
    starContainer.classList.add('rating');

    const getCustomData = await getCustomDataOfUserDashboard(recipeIndex);
    const rate = getCustomData.rate;

    console.log("Star Info: " , rate);

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        if (i <= rate) {
            star.textContent = '★';
        } else {
            star.textContent = '☆';
        }
        star.onmouseover = () => hoverStar(star);
        const clickHandler = () => setRating(i, starContainer, recipe);
        star.onclick = clickHandler;
        starContainer.appendChild(star);
    }
    // Create average star
    const generalRateOfRecipe = getCustomData.avgRate;
    recipeIndex++;

    const averageRatingSpan = document.createElement('span');
    averageRatingSpan.classList.add('average-rating');
    const starSpan = document.createElement('span');
    starSpan.classList.add('star-span');
    starSpan.textContent = '★';
    starSpan.style.color = 'gold'; // You can use any color value

    const rateSpan = document.createElement('span');
    rateSpan.classList.add('average-rate-span');
    rateSpan.textContent = generalRateOfRecipe;

    averageRatingSpan.appendChild(starSpan);
    averageRatingSpan.appendChild(rateSpan);

    recipeDiv.appendChild(averageRatingSpan);
    recipeDiv.appendChild(starContainer);

    // Create heart
    const heart = document.createElement('span');
    heart.classList.add('favorite-heart');
    heart.src = 'Gifs/heart.gif'; // Replace with the actual path to your animated GIF
    heart.alt = 'Animated Heart';
    heart.onclick = () => toggleFavorite(heart);
    heart.textContent = '♥';
    heart.onclick = () => toggleFavorite(heart);

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('titleDiv');
    titleDiv.textContent = recipe.title;

    // Append stars and heart to the recipeDiv
    recipeDiv.appendChild(imgDiv);
    recipeDiv.appendChild(titleDiv);
    recipeDiv.appendChild(starContainer);
    recipeDiv.appendChild(heart);

    return recipeDiv;
};

// Function to display recipes in the dashboard
const displayDashboard = async (recipes) => {
    const recipesList = document.getElementById('recipesList');

    // Clear the existing content before adding new recipes
    recipesList.innerHTML = '';

    for (const recipe of recipes) {
        const recipeElement = await createRecipeElement(recipe);
        recipesList.appendChild(recipeElement);
    }
};

// Function to fetch data from the API
// This fetch method closed in order to reduce usage of database. Open before starting development
const fetchData = async () => {
    try {
        const response = await fetch('https:recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard');
        const data = await response.json();

		console.log('Fetched Data:', data);
        // Call displayDashboard to render the fetched data
        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

// Call fetchData to initiate the process
fetchData();

const fetchDataByMealType = async (mealType) => {
    try {
        // Modify the endpoint based on the mealType parameter
        const apiUrl = `https://recipiebeckend.azurewebsites.net/recipes/getRecipesByMeal?mealType=${mealType}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

const fetchDataByCuisine = async (cuisine) => {
    try {
        const apiUrl = `https://recipiebeckend.azurewebsites.net/recipes/getRecipesByCuisine?cuisine=${cuisine}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

const openRecipeDetailPage = (id) => {
    const recipeDetailURL = `recipeDetail.html?id=${id}`;
    // Perform any additional actions before navigating, if needed
    // For example, you might want to validate the id or perform some asynchronous tasks
    window.location.href = recipeDetailURL;
};

document.addEventListener('DOMContentLoaded', function () {
    const optionsViewButton = document.getElementById('options-view-button');
    const selectedValue = document.getElementById('selected-value');
    const optionValue = document.querySelectorAll('.opt-val');
    const options = document.querySelectorAll('.option');
    const inputs = document.querySelectorAll('input[type="radio"]');
	let isOptionSelected = false;

    inputs.forEach(input => {
        input.checked = false;
    });

    inputs.forEach(input => {
        input.addEventListener('change', function () {
            // Check if the radio button is checked
            if (this.checked) {
                // Apply styles to .opt-val when a radio button is checked
                optionValue.forEach(val => {
                    val.style.display = 'block';
                });
            }
        });
    });
    // Close the dropdown and reset the selected value to "Sort by:" when clicking anywhere outside the dropdown
    document.addEventListener('click', function (event) {
        if (event.target !== optionsViewButton && isOptionSelected) {
            optionsViewButton.checked = false;

			selectedValue.style.display = 'none';
            // Show the options when closing the dropdown
            options.forEach(function (option) {
                option.style.display = 'block';
            });
        }
    });

    // Add event listeners to each option to update the selected value and close the dropdown
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            selectedValue.textContent = optionValue;
            optionsViewButton.checked = false; // Close the dropdown when an option is selected
			isOptionSelected = true;
        });
    });
});

function fetchSortOperations(selectedValue) {
    switch (selectedValue) {
        case 'time':
            fetchSortByTime();
            break;
        case 'alphabet':
            fetchSortByAlphabet();
            break;
        case 'rate':
            fetchSortByRate();
            break;
        case 'ingrCount':
            fetchSortByIngrCount();
            break;
        default:
            console.log("Invalid option selected");
    }
}

function fetchSortByTime() {
    fetch('https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-preptime')
        .then(response => response.json())
        .then(data => {
            displayDashboard(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to fetch and display recipes sorted alphabetically
function fetchSortByAlphabet() {
    fetch('https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-alph')
        .then(response => {
            if (!response.ok) {
                console.log('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                displayDashboard(data);
            } else {
                console.error('Invalid data format:', data);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Function to fetch and display recipes sorted by rate
function fetchSortByRate() {
    fetch('https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-rate')
        .then(response => {
            if (!response.ok) {
                console.log('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                displayDashboard(data);
            } else {
                console.error('Invalid data format:', data);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to fetch and display recipes sorted by ingredient count
function fetchSortByIngrCount() {
    fetch('https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-ingCount')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayDashboard(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        if (this.checked) {
            console.log("Selected value:", this.value);
            fetchSortOperations(this.value);
        }
    });
});

function toggleAndCloseDropdown(dropdown) {
    const dropdownContent = dropdown.querySelector('.nav-cuisines-dropdown-content, .nav-dropdown-content');
    
    if (dropdownContent.classList.contains('show-dropdown')) {
        // If the dropdown is already open, close it
        dropdownContent.classList.remove('show-dropdown');
        console.log("toggle remove");
    } else {
        // If the dropdown is closed, open it
        dropdownContent.classList.add('show-dropdown');
        console.log("toggle add");
    }
}

function basicSearch() {
    var targetWord = document.querySelector('.main-name').value;
    //var targetWord = document.getElementById('.main-submit').value;
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/basic-search?targetWord=' + encodeURIComponent(targetWord);
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(targetWord);
        console.log(data);
        displayDashboard(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}
//https://recipiebeckend.azurewebsites.net/recipes/all-recipes-info
// async function getStarsAndHeart(index) {
//     var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/all-recipes-info';
//     const JWTAccessToken = sessionStorage.getItem('accessToken');

//     // const headers = {
//     //     'Content-Type': 'application/json',
//     //     'Authorization': JWTAccessToken,
//     // };
//     const response = await fetch(
// 		apiUrl,
// 		{
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
//                 'Authorization': JWTAccessToken,
// 			}
// 		}
// 	);
// 	if (!response.ok) {
// 		throw new Error(`HTTP error! status: ${response.status}`);
// 	}
// 	const data = await response.json();
//     console.log(data);
//     var starAndHeartInfoArray = []
//     starAndHeartInfoArray.push(data);
//     return starAndHeartInfoArray;
// }
async function getCustomDataOfUserDashboard(index) {
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    const response = await fetch(
        apiUrl,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWTAccessToken,
            }
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log("Data: " , data);
        // Check if the array has elements and if the specified index is valid
        if (data.length > index) {
            return data[index];
        } else {
            console.error('Index out of bounds or empty array');
            return null; // or handle it according to your application's logic
        }
    } else {
        // Handle non-JSON response or empty response
        console.error('Invalid or empty JSON response');
        return null; // or handle it according to your application's logic
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

$('#pagination-demo').twbsPagination({
    totalPages: 16,
    visiblePages: 5,
    next: 'Next',
    prev: 'Prev',
    onPageClick: function (event, page) {
        //fetch content and render here
        console.log("Page: " , page);
        paging(page)
    }
});

  function paging(key) {
    key -= 1;
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/paging?key=' + key;
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayDashboard(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}
