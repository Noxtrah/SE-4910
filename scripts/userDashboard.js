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


let recipeIndex = 0;

const createRecipeElement = async (recipe) => {
    // Create a new column for each recipe
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-item');
    recipeDiv.style.display = 'flex';
    recipeDiv.style.flexDirection = 'column';

    // Image
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    imgDiv.style.cursor = 'pointer';
    imgDiv.style.position = 'relative';
    const link = document.createElement('a');
    link.addEventListener('click', () => openRecipeDetailPage(recipe.id));

    const img = document.createElement('img');
    img.src = recipe.photoPath ? recipe.photoPath : '../Images/RecipeIcon4.png';
    img.alt = 'Recipe Photo';
    img.style.maxWidth = '100%'; // Adjust this value as needed
    img.style.maxHeight = '100%'; // Maintain aspect ratio
    img.style.objectFit = 'cover';
    link.appendChild(img);
    imgDiv.appendChild(link);
    recipeDiv.appendChild(imgDiv);


    // Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('titleDiv');
    titleDiv.textContent = recipe.title;
    recipeDiv.appendChild(titleDiv);

    // Create rating div
    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating-div');

    // Create star rating
    const starContainer = document.createElement('div');
    starContainer.classList.add('rating');

    const rate = recipe.rate;
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
    ratingDiv.appendChild(starContainer);

    // Create average rating span
    const generalRateOfRecipe = recipe.avgRate;
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
    ratingDiv.appendChild(averageRatingSpan);

    recipeDiv.appendChild(ratingDiv);

    // User Information
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-info');

    // User Image
    // const userImgDiv = document.createElement('ion-icon');
    // userImgDiv.classList.add('user-img');
    // userImgDiv.setAttribute('name', 'person-circle-outline');
    // userDiv.appendChild(userImgDiv);

    // // Username
    // const usernameSpan = document.createElement('span');
    // usernameSpan.textContent = recipe.username;
    // usernameSpan.classList.add('username');
    // userDiv.appendChild(usernameSpan);

    // recipeDiv.appendChild(userDiv);
// Create a container for user information
const userInfoDiv = document.createElement('div');
userInfoDiv.classList.add('user-info');

// User Image
const userImgDiv = document.createElement('ion-icon');
userImgDiv.classList.add('user-img');
if(recipe.userPhotoPath == null){
    userImgDiv.setAttribute('name', 'person-circle-outline');
}else{
    userImgDiv.setAttribute('name', recipe.userPhotoPath);
}
// userInfoDiv.appendChild(userImgDiv)
// userImgDiv.setAttribute('name', 'person-circle-outline');
userInfoDiv.appendChild(userImgDiv);

// Username with link
const usernameLink = document.createElement('a');
usernameLink.href = `userViewProfile.html?username=${recipe.username}`;
usernameLink.classList.add('username-link'); // İsteğe bağlı: Bağlantıya stil vermek için sınıf ekleyin

const usernameSpan = document.createElement('span');
usernameSpan.textContent = recipe.username;
usernameSpan.classList.add('username');
usernameLink.appendChild(usernameSpan);

// Kullanıcı adına tıklanıldığında userViewProfile.html sayfasına yönlendirme ve openRecipeDetailPage fonksiyonunu çağırma
usernameLink.addEventListener('click', () => {
    // userViewProfile.html sayfasına yönlendirme
    window.location.href = `userViewProfile.html?username=${recipe.username}`;
    // openRecipeDetailPage fonksiyonunu çağırma
    openRecipeDetailPage(recipe.id);
});

// Append usernameLink to userInfoDiv
userInfoDiv.appendChild(usernameLink);

// Append userInfoDiv to recipeDiv
recipeDiv.appendChild(userInfoDiv);


    // Create heart
    const heartContainer = document.createElement('span');
    heartContainer.classList.add('heart-border');
    heartContainer.textContent = '♥';

    heartContainer.classList.add('favorite-heart');
    if (recipe.isLiked) {
        heartContainer.style.color = 'red';
    }

    heartContainer.addEventListener('click', async () => {
        giveLike(recipe.id);
        heartContainer.style.color = heartContainer.style.color === 'red' ? 'black' : 'red';

        if (!recipe.isLiked) {
            const numHearts = 5; // Number of hearts to create
            for (let i = 0; i < numHearts; i++) {
                createFlyingHeart(heartContainer);
            }
        }
    });

    imgDiv.appendChild(heartContainer);

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
    alertContainer.setAttribute('name', 'alert-outline');
    alertContainer.addEventListener('click', function () {
        createPopup(recipe);
    });

    imgDiv.appendChild(alertContainer);

    const adjustSize = () => {
        const recipeHeight = recipeDiv.offsetHeight;
        const contentHeight = userDiv.offsetHeight;
        if (contentHeight > recipeHeight) {
            userDiv.style.height = '130%';
            userDiv.style.backgroundColor = 'red';

        }
    };

    // Execute adjustment on load and resize
    adjustSize();
    window.addEventListener('resize', adjustSize);

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
            reportRecipe(recipe.id, selectedCause, textarea.value);
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
// const fetchData = async () => {
//     const JWTAccessToken = sessionStorage.getItem('accessToken');
//    const apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
// //    const apiUrl = 'https://run.mocky.io/v3/f162c031-dcc1-4794-bd22-e0b52a55a61d';

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': JWTAccessToken,
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: JWTAccessToken ? headers : {'Content-Type': 'application/json'},
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data);
//         displayDashboard(data);
//     } catch (error) {
//         console.error('Error fetching or displaying data:', error);
//     }
// };

// async function fetchData(key = 0) {
//     const JWTAccessToken = sessionStorage.getItem('accessToken');
//     // let apiUrl = 'https://run.mocky.io/v3/f162c031-dcc1-4794-bd22-e0b52a55a61d';
//     let apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
//     if (key !== undefined) {
//         apiUrl += `?key=${key}`;
//     }

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': JWTAccessToken,
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: JWTAccessToken ? headers : { 'Content-Type': 'application/json' },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data);

//         const maxPage = await getMaxPage();
//         if (maxPage !== null) {
//             displayPage(key, maxPage);
//         } else {
//             console.error('Failed to get the maximum number of pages.');
//         }

//         displayDashboard(data);
//     } catch (error) {
//         console.error('Error fetching or displaying data:', error);
//     }
// }

async function fetchData(key = 0) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    let apiUrl = 'https://recipiebeckend.azurewebsites.net/recipesUser/home-user-dashboard';
    // const apiUrl = 'https://run.mocky.io/v3/f162c031-dcc1-4794-bd22-e0b52a55a61d';
    if (key !== undefined) {
      apiUrl += `?key=${key}`;
    }
  
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
  
      const data = await response.json();
      console.log(data);
  
      displayDashboard(data);
      displayPagination(data);
    } catch (error) {
      console.error('Error fetching or displaying data:', error);
    }
  }

  let isPaginationInitialized = false; // Flag to track pagination initialization

  async function displayPagination(data) {
    if (!isPaginationInitialized) { // Check if pagination is already initialized
      const maxPage = await getMaxPage(data);
      if (maxPage !== null) {
        $('#pagination-demo').twbsPagination('destroy'); // Clear previous pagination
        $('#pagination-demo').twbsPagination({
          startPage: 1, // Assuming page starts from 1 (adjust if needed)
          totalPages: maxPage,
          visiblePages: 5,
          next: 'Next',
          prev: 'Prev',
          onPageClick: function (event, page) {
            fetchData(page - 1); // Call fetchData with the selected page number
          }
        });
        isPaginationInitialized = true; // Set flag to prevent re-initialization
      } else {
        console.error('Failed to get the maximum number of pages.');
      }
    }
  }

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
    fetchData(0);
});

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

async function getMaxPage() {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/get-max-page'; // Replace this URL with your actual API endpoint

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch maximum page.');
        }

        const data = await response.json();
        console.log(data);
        const maxPage = data; // Assuming your API response contains a property named 'maxPage' with the total number of pages
        console.log('Maximum Page:', maxPage);
        return maxPage;
    } catch (error) {
        console.error('Error fetching maximum page:', error);
        return null; // Return null in case of error
    }
}

function reportRecipe(userRecipeId, reportCause, extraNotes) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    const url = 'https://recipiebeckend.azurewebsites.net/user/report-recipe';
    const requestBody = {
      userRecipeId: userRecipeId,
      reportCause: reportCause,
      extraNotes, extraNotes
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

//   function fetchUserProfileData() {
//     const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/user-profile-info'; // Replace this URL with your actual API endpoint

//     const JWTAccessToken = sessionStorage.getItem('accessToken');

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': JWTAccessToken,
//     };

//     return fetch(apiUrl, { // Return the fetch promise
//         method: 'GET',
//         headers: headers,
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         return response.json(); // Assuming the response is JSON
//     });
// }

// function updateUserIcon(userPhotoUrl) {
//     const userImgElements = document.getElementsByClassName('user-img');
//     if (userImgElements.length > 0) {
//         const userImgDiv = userImgElements[0]; // Access the first element with the class 'user-img'
        
//         // Create a new img element
//         const imgElement = document.createElement('img');
//         imgElement.setAttribute('src', userPhotoUrl);
//         imgElement.classList.add('profile-photo');

//         // Replace the ion-icon element with the new img element
//         userImgDiv.replaceWith(imgElement);
//     }
// }

// // Fetch user data
// function fetchUserData() {
//     const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/user-profile-info'; // Replace this URL with your actual API endpoint

//     const JWTAccessToken = sessionStorage.getItem('accessToken');

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': JWTAccessToken,
//     };

//     return fetch(apiUrl, { // Return the fetch promise
//         method: 'GET',
//         headers: headers,
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         return response.json(); // Assuming the response is JSON
//     });
// }

// // Handle errors
// function handleError(error) {
//     console.error('Error fetching user data:', error);
// }

// // Initialize the user icon update process
// function initUserIconUpdate() {
//     fetchUserData()
//         .then(data => {
//             const userPhotoUrl = data.userPhoto;
//             console.log('User Photo URL:', userPhotoUrl);
//             updateUserIcon(userPhotoUrl);
//         })
//         .catch(handleError);
// }

// // Start the process
// initUserIconUpdate();