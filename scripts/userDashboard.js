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
    const url = `https://recipiebeckend.azurewebsites.net/recipesUser/give-rate-user-recipe?userRecipeId=${recipeId}&rate=${newRating}`;
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
    link.style.display = 'block';
    link.addEventListener('click', () => openRecipeDetailPage(recipe.id));

    console.log("Recipe ID: " , recipe.id);

    // Image
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    imgDiv.style.cursor = 'pointer';
    
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

    // const getCustomData = await getCustomDataOfUserDashboard(recipeIndex);
    const rate = recipe.rate;
    console.log("Rate: " , rate);

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
    const generalRateOfRecipe = recipe.avgRate;
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
    const heartContainer = document.createElement('span');
    heartContainer.classList.add('heart-border'); 
    heartContainer.textContent = '♥';

    heartContainer.classList.add('favorite-heart');
    if(recipe.isLiked){
        heartContainer.style.color = 'red';
    }

    heartContainer.addEventListener('click', async () => {
        giveLike(recipe.id);
        heartContainer.style.color = heartContainer.style.color === 'red' ? 'black' : 'red';

        if(!recipe.isLiked){
            const numHearts = 5; // Number of hearts to create
            for (let i = 0; i < numHearts; i++) {
                createFlyingHeart(heartContainer);
            }
        }
    });

    function createFlyingHeart(parentElement) {
        const heart = document.createElement('span');
        heart.classList.add('flying-heart');
        heart.textContent = '♥';
        document.body.appendChild(heart);
    
        const rect = parentElement.getBoundingClientRect();
        const startX = rect.left + (rect.width / 2); // X coordinate of parent element
        const startY = rect.top + (rect.height / 2); // Y coordinate of parent element
    
        // Randomize end coordinates within a range around the parent element
        const endX = startX + Math.random() * 100 - 50;
        const endY = startY + Math.random() * 100 - 90;
    
        // Set initial position of heart
        heart.style.left = startX + 'px';
        heart.style.top = startY + 'px';
    
        // Animate heart to fly to the end coordinates
        heart.animate([
            { transform: 'translate(0, 0)' },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)` }
        ], {
            duration: 1000, // Animation duration in milliseconds
            easing: 'ease-out', // Animation easing function
            fill: 'forwards' // Keep heart at its final position after animation
        });
    
        // Remove heart element after animation completes
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    // Create alert
    const alertContainer = document.createElement('ion-icon');
    alertContainer.classList.add('alert');
    alertContainer.classList.add('alert-border');
    alertContainer.setAttribute('name','alert-outline');
    alertContainer.addEventListener('click', function() {
        createPopup(recipe);
    });

    imgDiv.appendChild(alertContainer);

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('titleDiv');
    titleDiv.textContent = recipe.title;

    // Append stars and heart to the recipeDiv
    recipeDiv.appendChild(imgDiv);
    recipeDiv.appendChild(titleDiv);

    return recipeDiv;
};

function createPopup(recipe) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'popup1';
    overlay.classList.add('overlay');

    // Create pop-up element
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const windowHeight = window.innerHeight;
    const popupHeight = popup.offsetHeight;
    const newTop = Math.max((windowHeight - popupHeight) / 2, 0);
    popup.style.top = newTop + 'px';

    // Pop-up title
    const title = document.createElement('h2');
    title.textContent = `Report '${recipe.title}' Recipe`;

    // Close button
    const closeButton = document.createElement('a');
    closeButton.classList.add('close');
    closeButton.href = '#';
    closeButton.textContent = '×'; // Close symbol
    closeButton.addEventListener('click', function() {
        overlay.remove(); // Remove overlay when close button is clicked
    });

    // Checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('report-checkbox');
    
    const labelArray = ['Inappropriate Content', 'Misleading Information', 'Safety Concerns'];
    
    const checkboxes = []; // Array to hold checkbox elements

    for (let i = 0; i < labelArray.length; i++) {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('checkbox-container'); // Add class for positioning

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.classList.add('checkbox');
        checkboxInput.setAttribute('data-index', i); // Set data-index attribute for identifying checkbox
        checkboxDiv.appendChild(checkboxInput);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('checkbox-label');
        checkboxLabel.textContent = labelArray[i];
        checkboxDiv.appendChild(checkboxLabel);

        checkboxContainer.appendChild(checkboxDiv); // Append the container div
        checkboxes.push(checkboxInput); // Push checkbox input to array
    }

    // Add event listener to checkboxes to allow only one selection
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            checkboxes.forEach(function(cb) {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
        });
    });

    // Pop-up content
    const content = document.createElement('div');
    content.classList.add('content');
    content.textContent = "Please write below to provide any additional details or comments regarding your report";

    const textboxContainer = document.createElement('div');
    textboxContainer.classList.add('textbox-container');

    // Create textarea element
    const textarea = document.createElement('textarea');
    textarea.id = 'additional-notes';
    textarea.rows = 4;
    textarea.cols = 50;
    textarea.placeholder = 'Type your additional notes here...';

    // Append textarea to the container
    textboxContainer.appendChild(textarea);

    const sendReportButton = document.createElement('button');
    sendReportButton.textContent = 'Submit';

    // Add classes to button (optional)
    sendReportButton.classList.add('send-report-button');

    // Add click event listener (optional)
    sendReportButton.addEventListener('click', function() {
        let selectedCause = null;
    
        // Find the selected checkbox
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                // Map the selected checkbox label to the corresponding report cause
                switch (checkbox.nextElementSibling.textContent) {
                    case 'Inappropriate Content':
                        selectedCause = 'INAPPROPRIATE_IMAGE';
                        break;
                    case 'Misleading Information':
                        selectedCause = 'WRONG_INGREDIENT';
                        break;
                    case 'Safety Concerns':
                        selectedCause = 'UNHEALTHY_RECIPE';
                        break;
                    default:
                        break;
                }
            }
        });
    
        // Check if a checkbox is selected
        if (selectedCause) {
            // Call reportRecipe function with the selected cause
            reportRecipe(recipe.id, selectedCause);
            let thank_content = document.querySelector('.thank-content');
        
            // If thank_content exists, update its text content
            if (thank_content) {
                thank_content.textContent = "Your report has already been sent.";
            } else {
                // If thank_content doesn't exist, create and append it
                thank_content = document.createElement('div');
                thank_content.classList.add('thank-content');
                thank_content.textContent = "Your report has been sent successfully.";
                popup.appendChild(thank_content);
            }
        } else {
            // If no checkbox is selected, display an error message or handle it accordingly
            console.error('Please select a report cause.');
        }
    });


    // Append elements to pop-up
    popup.appendChild(title);
    popup.appendChild(closeButton);
    popup.appendChild(checkboxContainer);
    popup.appendChild(content);
    popup.appendChild(textboxContainer);
    popup.appendChild(sendReportButton);

    // Append pop-up to overlay
    overlay.appendChild(popup);

    // Append overlay to body
    document.body.appendChild(overlay);
}

function setLike(heartContainer, recipe) {
    if (heartContainer.style.color == 'red') {
        heartContainer.textContent = '♥';
        heartContainer.style.color = 'black';
    }
    else if (heartContainer.style.color == 'black'){
        heartContainer.textContent = '♥';
        heartContainer.style.color = 'red';
    }
}

async function giveLike(recipeId) {
    const url = `https://recipiebeckend.azurewebsites.net/recipesUser/give-like-user-recipes?userRecipeId=${recipeId}`;
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': JWTAccessToken,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }

        // Assuming the response contains plain text
        const responseData = await response.text();

        // Update the UI based on the response
        console.log('Response Data:', responseData);

    } catch (error) {
        console.error('Error updating like:', error);
    }
}



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
    const JWTAccessToken = sessionStorage.getItem('accessToken');
   const apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
//    const apiUrl = 'https://run.mocky.io/v3/02b4eb52-ad5d-4638-bb35-19a136c1f4f1 ';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': JWTAccessToken,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: JWTAccessToken ? headers : {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
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
    const recipeDetailURL = `userRecipeDetail.html?id=${id}`;
    console.log("Girdi");
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

// async function getCustomDataOfUserDashboard(index) {
//     var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
//     const JWTAccessToken = sessionStorage.getItem('accessToken');
//     const response = await fetch(
//         apiUrl,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': JWTAccessToken,
//             }
//         }
//     );

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const contentType = response.headers.get('Content-Type');

//     if (contentType && contentType.includes('application/json')) {
//         const data = await response.json();
//         console.log("Data: " , data);
//         // Check if the array has elements and if the specified index is valid
//         if (data.length > index) {
//             return data[index];
//         } else {
//             console.error('Index out of bounds or empty array');
//             return null; // or handle it according to your application's logic
//         }
//     } else {
//         // Handle non-JSON response or empty response
//         console.error('Invalid or empty JSON response');
//         return null; // or handle it according to your application's logic
//     }
// }


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
    totalPages: 2,
    visiblePages: 2,
    next: 'Next',
    prev: 'Prev',
    onPageClick: function (event, page) {
        // Call the paging function directly with the clicked page
        paging(page);
    }
});


function paging(key) {
    key -= 1;
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/paging-user-dashboard?key=' + key;
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

function reportRecipe(userRecipeId, reportCause) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    const url = 'https://recipiebeckend.azurewebsites.net/user/report-recipe';
    const requestBody = {
      userRecipeId: userRecipeId,
      reportCause: reportCause
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JWTAccessToken,
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to report recipe');
      }
      console.log("Response", response);
      return response.json();
    })
    .then(data => {
      console.log('Recipe reported successfully:', data);
    })
    .catch(error => {
        console.error('Error reporting recipe:', error);
        console.error('Response status:', error.response.status);
        console.error('Response body:', error.response.body);
    });
  }