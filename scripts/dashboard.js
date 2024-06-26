// const placeholder = '<span class="searchPlaceholder">Search...</span>'

// //The tags currently displayed
// const currentTags = ["ingredients: apple"];

// //Tags the user can choose from
// const tags = ["ingredients"]

// window.onload = () => {
// 	//Initialization
// 	let input = document.getElementById("searchInput")
// 	input.addEventListener("input", handleChange);
// 	input.addEventListener("keydown", blockEnter);
// 	getRidOfScrollbar()

// 	//Can be used to prefill the search bar with tags in currentTags
// 	updateTags()
// 	input.innerHTML = placeholder;
// 	input.blur()
// 	input.addEventListener("focus", handleFocus);

// }

//The search bar needs to be scrollable, but we don't want to see that ugly scrollbar
// function getRidOfScrollbar() {
// 	var inputWrapper = document.getElementById('inputWrapper');
// 	inputWrapper.style.paddingBottom = inputWrapper.offsetHeight - inputWrapper.clientHeight + "px";
// }

// function handleFocus(event) {
// 	let input = document.getElementById("searchInput")
// 	if (input.children.length > 0) {
// 		input.innerHTML = ''
// 		input.removeEventListener("focus", handleFocus);
// 	}
// }

// //When pressing enter, prevent it from creating a newline, finish tag instead
// function blockEnter(event) {
// 	if (event.key === "Enter") {
// 		event.preventDefault();
// 		if (event.target.classList.contains('tagEditor')) {
// 			saveTag(event);
// 		} else {
// 			handleChange(event);
// 		}
// 	}
// }

//Checks if the user typed a new tag, and if so, adds it to currentTags
// function handleChange(event) {
// 	let str = event.target.innerText;
// 	for (let tag of tags) {
// 		let regexp;
// 		if (event.key === 'Enter') {
// 			//When `Enter` was pressed we do not have to check for a comma or a space
// 			regexp = new RegExp(`@${tag} ([^ ,\u00A0]+)`);
// 		} else {
// 			regexp = new RegExp(`@${tag} ([^ ,\u00A0]+)[ ,\u00A0]`);
// 		}
// 		if (regexp.test(str)) {
// 			//User typed a new tag, add it to currentTags
// 			let selected = str.match(regexp)[1];
// 			currentTags.push(tag + ": " + selected)
// 			event.target.innerText = event.target.innerText.replace(regexp, "");
// 			updateTags()
// 		}
// 	}

// }

// //Renders the tags in currentTags in the search bar
// function updateTags() {
// 	let displayStr = "";
// 	for (let tag of currentTags) {
// 		displayStr += `<div class='tag'><button class="tagText" onclick="editTag(event)">${tag}</button><button class="x-button" onclick="deleteTag(event)">\u2716</button></div>`
// 	}
// 	document.getElementById("tagWrapper").innerHTML = displayStr;

// 	//Focus the input
// 	input = document.getElementById('searchInput')
// 	input.focus();
// 	let range = document.createRange();
// 	range.selectNodeContents(input);
// 	range.collapse(false);
// 	let selection = window.getSelection();
// 	selection.removeAllRanges();
// 	selection.addRange(range);
// }


  // Çağrı yapın ve h1 elementini güncelleyin
  
  
//When user clicked on a tag, make that tag editable
// function editTag(event) {
// 	let text = event.target.innerText
// 	let index = currentTags.indexOf(text)
// 	event.target.parentElement.innerHTML = `<span>${text.substring(0,text.indexOf(':')+1)}&nbsp;</span><span onkeydown="blockEnter(event)" class="tagEditor" id="tag${index}" contenteditable>${text.substring(text.indexOf(':')+1)}</span><button class="x-button" onclick="deleteTag(event)">\u2716</button>`
// 	let newInput = document.getElementById('tag' + index)

// 	newInput.focus()
//   	window.getSelection().collapse(newInput.firstChild, newInput.innerHTML.length);
// }

// //User is done with editing tag, so save it and re-render the tags.
// function saveTag(event) {
// 	let index = parseInt(event.target.id.substring(3),10);
// 	currentTags[index] = event.target.previousSibling.innerText + event.target.innerText;
// 	updateTags();
// }

// //Deletes a tag
// function deleteTag(event) {
// 	currentTags.splice(currentTags.indexOf(event.target.previousSibling.innerText),1);
// 	updateTags();
// }

function toggleFavorite(element) {
    if (element.classList.contains('favorited')) {
      element.classList.remove('favorited');
    } else {
      element.classList.add('favorited');
    }
  }
  //aaaaaaaaaaaa

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
	if (recipe && recipe.recipe.id) {
    	giveRating(rating, recipe.recipe.id);
    } else {
        console.error('Recipe ID not found for the given recipe:', recipe);
        // Handle the case where the recipe ID is not available
    }
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


  function giveRating(newRating, recipeId) {
    const url = `https://recipiebeckend.azurewebsites.net/user/give-rate?recipeId=${recipeId}&rate=${newRating}`;
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

async function giveLike(recipeId) {
    const url = `https://recipiebeckend.azurewebsites.net/user/give-like?recipeId=${recipeId}`;
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


	  

  //Call jQuery before below code
//   $('.search-description').hide();
//   $('.main-btn').click(function() {
// 	$('.search-description').slideToggle(300);
//   });
//   $('.search-description li').click(function() {
// 	var target = $(this).html();
// 	console.log("Target = " + target);
// 	var toRemove = 'By ';
// 	var newTarget = target.replace(toRemove, '');
// 	console.log("new Taget = ", newTarget);
// 	//remove spaces
// 	newTarget = newTarget.replace(/\s/g, '');
// 	console.log("new Taget after = ", newTarget);
// 	$(".search-large").html(newTarget);
// 	$('.search-description').hide();
// 	$('.main-input').hide();
// 	newTarget = newTarget.toLowerCase();
// 	console.log("lower new Taget = ", newTarget);
// 	$('.main-' + newTarget).show();
//   });
//   $('#main-submit-mobile').click(function() {
// 	$('#main-submit').trigger('click');
//   });
//   $(window).resize(function() {
// 	replaceMatches();
//   });

//   function replaceMatches() {
// 	var width = $(window).width();
// 	if (width < 516) {
// 	  $('.main-ingredients').attr('value', 'Ingredients');
// 	} else {
// 	  $('.main-ingredients').attr('value', 'Search by ingredients');
// 	}
//   };
//   replaceMatches();

//   function clearText(thefield) {
// 	if (thefield.defaultValue == thefield.value) {
// 	  thefield.value = ""
// 	}
//   }

//   function replaceText(thefield) {
// 	if (thefield.value == "") {
// 	  thefield.value = thefield.defaultValue
// 	}
//   }

let recipeIndex = 0;

  // Function to create a recipe element based on the provided recipe data
const createRecipeElement = async (recipe) => {
    // Create a new column for each recipe
    // console.log("recipe: " , recipe.recipe.id);
    // const recipeDiv = document.createElement('div');
    // recipeDiv.classList.add('recipe-item');
    const recipeDiv = document.createElement('div');
    const recipeId = `recipe-${recipe.recipe.id}`; // Unique ID for the recipe element
    recipeDiv.id = recipeId; // Assign the ID to the recipeDiv
    recipeDiv.classList.add('recipe-item');
    const link = document.createElement('a');

    link.addEventListener('click', () => openRecipeDetailPage(recipe.recipe.id));

    // Image
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    imgDiv.style.cursor = 'pointer';
    const img = document.createElement('img');
    img.src = recipe.recipe.photoPath;
    img.alt = 'Recipe Photo';

    // Apply CSS to constrain image size
    img.style.maxWidth = '100%'; // Adjust this value as needed
    img.style.height = '100%'; // Maintain aspect ratio

    link.appendChild(img);
    imgDiv.appendChild(link);

    const starContainer = document.createElement('div');
    starContainer.classList.add('rating');

    //const getCustomData = await getSelectedCustomDataOfDashboard(recipeIndex);
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

    // document.body.appendChild(heartContainer);

    heartContainer.classList.add('favorite-heart');
    if(recipe.isLiked){
        heartContainer.style.color = 'red';
    }

    heartContainer.addEventListener('click', async () => {
        giveLike(recipe.recipe.id);
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


    // Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('titleDiv');
    titleDiv.textContent = recipe.recipe.title;

    // Append stars and heart to the recipeDiv
    recipeDiv.appendChild(imgDiv);
    recipeDiv.appendChild(titleDiv);
    recipeDiv.appendChild(starContainer);
    // recipeDiv.appendChild(heartContainer);

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
async function fetchData(key = 0) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
   let apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/home';
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
            const selectedValue = sessionStorage.getItem('selectedOption');
            sessionStorage.setItem('key', page - 1);
            if(selectedValue !== null){
                console.log("Girdi    " , page)
                fetchSortOperations(selectedValue, page - 1);
            }
            else{
                fetchData(page - 1);
            }
          }
        });
        isPaginationInitialized = true; // Set flag to prevent re-initialization
      } else {
        console.error('Failed to get the maximum number of pages.');
      }
    }
  }

const fetchDataByMealType = async (mealType, key) => {
    key = sessionStorage.getItem('key');
    sessionStorage.setItem('selectedOption', mealType);

    try {
        // Modify the endpoint based on the mealType parameter
        const apiUrl = `https://recipiebeckend.azurewebsites.net/recipes/getRecipesByMeal?mealType=${mealType}&key=${key}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

const fetchDataByCuisine = async (cuisine, key) => {
    key = sessionStorage.getItem('key');
    sessionStorage.setItem('selectedOption', cuisine);

    try {
        const apiUrl = `https://recipiebeckend.azurewebsites.net/recipes/getRecipesByCuisine?cuisine=${cuisine}&key=${key}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

async function updateSelectedValue(newValue) {
    const selectedValue = document.getElementById('selected-value');
    const optionsViewButton = document.getElementById('options-view-button');
    const options = document.querySelectorAll('.option');
    console.log("New value: " , newValue);
    selectedValue.textContent = newValue;
    console.log("Selected value: " , selectedValue);

    selectedValue.style.display = 'block';
    // sessionStorage.setItem('selectedOption', newValue);

    // Ensure the dropdown is closed
    optionsViewButton.checked = false;

    // Update the display style for options
    options.forEach(option => {
        const optionText = option.querySelector('.opt-val').textContent;
        option.style.display = optionText === newValue ? 'block' : 'none';
    });
}

function initializeDropdown() {
    //DROPDOWN BOX (SORTING)
    const optionsViewButton = document.getElementById('options-view-button');
    const selectedValue = document.getElementById('selected-value');
    const optionValues = document.querySelectorAll('.opt-val');
    const options = document.querySelectorAll('.option');
    const inputs = document.querySelectorAll('input[type="radio"]');
    let isOptionSelected = false;

    // Initialize radio buttons to unchecked state
    inputs.forEach(input => {
        input.checked = false;
    });

    // Check if there is a stored option in sessionStorage
    const storedOption = sessionStorage.getItem('selectedOption');
    if (storedOption) {
        // selectedValue.textContent = storedOption;
        selectedValue.style.display = 'block';
        isOptionSelected = true;
    } else {
        selectedValue.textContent = 'Sort by:';
    }

    // Event listener for radio button change
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.checked) {
                optionValues.forEach(val => {
                    val.style.display = 'block';
                });
            }
        });
    });

    // Close the dropdown and reset the selected value to "Sort by:" when clicking outside the dropdown
    document.addEventListener('click', function (event) {
        if (event.target !== optionsViewButton && isOptionSelected) {
            optionsViewButton.checked = false;

            selectedValue.style.display = 'none';
            options.forEach(option => {
                option.style.display = 'block';
            });
        }
    });

    // Add event listeners to each option to update the selected value and close the dropdown
    options.forEach(option => {
        option.addEventListener('click', function () {
            const selectedOptionText = option.querySelector('.opt-val').textContent;
            selectedValue.textContent = selectedOptionText;
            // updateSelectedValue(selectedValue);
            selectedValue.style.display = 'block';
            optionsViewButton.checked = false; // Close the dropdown when an option is selected
            isOptionSelected = true;

            // Store the selected option in sessionStorage
            sessionStorage.setItem('selectedOption', selectedOptionText);
        });
    });
}

const openRecipeDetailPage = (id) => {
    const recipeDetailURL = `recipeDetail.html?id=${id}`;
    // Perform any additional actions before navigating, if needed
    // For example, you might want to validate the id or perform some asynchronous tasks
    window.location.href = recipeDetailURL;
};

document.addEventListener('DOMContentLoaded', function () {
    //DROPDOWN BOX (SORTING)
    initializeDropdown();
    // const optionsViewButton = document.getElementById('options-view-button');
    // const selectedValue = document.getElementById('selected-value');
    // const optionValues = document.querySelectorAll('.opt-val');
    // const options = document.querySelectorAll('.option');
    // const inputs = document.querySelectorAll('input[type="radio"]');
    // let isOptionSelected = false;

    // // Initialize radio buttons to unchecked state
    // inputs.forEach(input => {
    //     input.checked = false;
    // });

    // // Check if there is a stored option in sessionStorage
    // const storedOption = sessionStorage.getItem('selectedOption');
    // if (storedOption) {
    //     selectedValue.textContent = storedOption;
    //     selectedValue.style.display = 'block';
    //     isOptionSelected = true;
    // } else {
    //     selectedValue.textContent = 'Sort by:';
    // }

    // // Event listener for radio button change
    // inputs.forEach(input => {
    //     input.addEventListener('change', function () {
    //         if (this.checked) {
    //             optionValues.forEach(val => {
    //                 val.style.display = 'block';
    //             });
    //         }
    //     });
    // });

    // // Close the dropdown and reset the selected value to "Sort by:" when clicking outside the dropdown
    // document.addEventListener('click', function (event) {
    //     if (event.target !== optionsViewButton && isOptionSelected) {
    //         optionsViewButton.checked = false;

    //         selectedValue.style.display = 'none';
    //         options.forEach(option => {
    //             option.style.display = 'block';
    //         });
    //     }
    // });

    // // Add event listeners to each option to update the selected value and close the dropdown
    // options.forEach(option => {
    //     option.addEventListener('click', function () {
    //         const selectedOptionText = option.querySelector('.opt-val').textContent;
    //         selectedValue.textContent = selectedOptionText;
    //         selectedValue.style.display = 'block';
    //         optionsViewButton.checked = false; // Close the dropdown when an option is selected
    //         isOptionSelected = true;

    //         // Store the selected option in sessionStorage
    //         sessionStorage.setItem('selectedOption', selectedOptionText);
    //     });
    // });

    const homeLink = document.getElementById('home-link');

    homeLink.addEventListener('click', function() {
        // Remove the selectedOption from sessionStorage
        sessionStorage.removeItem('selectedOption');
    });

    //LOG-IN, LOG-OUT
    var logInLink = document.querySelector('a[href="logIn.html"]');
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    // Check if the anchor element exists
    if (JWTAccessToken != null) {
        // Change the text of the anchor element
        logInLink.textContent = "Log-Out";
        logInLink.addEventListener('click', function(event) {
            // Prevent default action
            event.preventDefault();
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            window.location.href = 'logIn.html';
        });
    }

    fetchData(0)
});

function fetchSortOperations(selectedValue, key) {
    let selectedCuisines = ['Italian', 'Chinese', 'Mexican', 'French', 'Turkish', 'American'];
    let selectedMealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
    console.log("selectedValue =", selectedValue);
    console.log("Key =", key);

    switch (selectedValue) {
        case 'Prep. Time':
            fetchSortByTime(key);
            break;
        case 'Alphabetical':
            fetchSortByAlphabet(key);
            break;
        case 'Rate':
            fetchSortByRate(key);
            break;
        case 'Ingredient Count':
            fetchSortByIngrCount(key);
            break;
        default:
            if (selectedCuisines.includes(selectedValue)) {
                fetchDataByCuisine(selectedValue, key);
            } else if (selectedMealTypes.includes(selectedValue)) {
                fetchDataByMealType(selectedValue, key);
            } else {
                console.log("Invalid option selected");
            }
    }
}


function fetchSortByTime(key) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-preptime?key=${key}`, {
        headers: {
            'Authorization': JWTAccessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("data:", data);
        displayDashboard(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function fetchSortByAlphabet(key) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-alph?key=${key}`, {
        headers: {
            'Authorization': JWTAccessToken
        }
    })
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

function fetchSortByRate(key) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-rate?key=${key}`, {
        headers: {
            'Authorization': JWTAccessToken
        }
    })
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

function fetchSortByIngrCount(key) {
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    fetch(`https://recipiebeckend.azurewebsites.net/recipes/recipe-sort-ingCount?key=${key}`, {
        headers: {
            'Authorization': JWTAccessToken
        }
    })
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
            // fetchSortOperations();
            const selectedValue = sessionStorage.getItem('selectedOption');
            const key = parseInt(sessionStorage.getItem('key')) || 0;
            fetchSortOperations(selectedValue, key);
            displayPagination();
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


function openNewTab() {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const host = url.hostname;
    const port = url.port || '80'; // Default to port 80 if no port is specified

    const baseURL = `http://${host}:${port}/templates/searchByIngredientTab.html`;
    window.open(baseURL, '_blank');
}

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

// Function to fetch user data
function fetchUserData() {
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/user/user-profile-info'; // Replace this URL with your actual API endpoint

    const JWTAccessToken = sessionStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': JWTAccessToken,
    };

    return fetch(apiUrl, { // Return the fetch promise
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        return response.json(); // Assuming the response is JSON
    });
}


function updateUserProfileLink(userPhotoUrl, userName) {
    const iconElements = document.getElementsByClassName('profile-icon');
    if (iconElements.length > 0) {
        const iconElement = iconElements[0]; // Get the first element in the collection

        // Create a new img element
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', userPhotoUrl);
        imgElement.setAttribute('alt', userName);
        imgElement.classList.add('profile-photo');

        // Replace the ion-icon element with the new img element
        iconElement.replaceWith(imgElement);
    }
}


// function initUserProfileUpdate() {
//     function handleError(error) {
//         console.error('Error fetching user data:', error);
//     }
    
//     fetchUserData()
//         .then(data => {
//             const userPhotoUrl = data.userPhoto;
//             const userName = `${data.name} ${data.lastName}`;
//             updateUserProfileLink(userPhotoUrl, userName);
//         })
//         .catch(handleError);
// }

function insertUsername(username) {
    const h2Element = document.querySelector('article h2');
    if (h2Element) {
        h2Element.textContent = `Hello, ${username}`;
    }
}

function initUserProfileUpdate() {
    function handleError(error) {
        console.error('Error fetching user data:', error);
    }
    fetchUserData()
        .then(data => {
            const userPhotoUrl = data.userPhoto;
            const userName = `${data.name} ${data.lastName}`;
            const username = data.username; // Get the username from the response
            
            updateUserProfileLink(userPhotoUrl, userName);
            insertUsername(username); // Insert the username into the <h2> tag
        })
        .catch(handleError);
}

initUserProfileUpdate();

