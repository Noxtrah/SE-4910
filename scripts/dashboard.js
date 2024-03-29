
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

  function setLike(isClicked, heartContainer, recipe) {
    if (isClicked) {
        heartContainer.textContent = '♥';
        heartContainer.style.color = 'red';
    } else {
        heartContainer.textContent = '♥';
        heartContainer.style.color = 'black';
    }

    if (recipe && recipe.recipe.id) {
        giveLike(recipe.recipe.id);
    } else {
        console.error('Recipe ID not found for the given recipe:', recipe);
        // Handle the case where the recipe ID is not available
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

function giveLike(recipeId) {
    const url = `https://recipiebeckend.azurewebsites.net/user/give-like?recipeId=${recipeId}`;
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

//   const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//   let selectedDay = null;
  
//   function selectDay(day) {
// 	  selectedDay = day;
// 	  const dayDivs = document.querySelectorAll('.day');
// 	  dayDivs.forEach(div => {
// 		  div.classList.remove('selected');
// 	  });
// 	  document.getElementById(day).classList.add('selected');
//   }
  
//   function addMeal() {
// 	  const input = document.getElementById('searchMeal');
// 	  const inputValue = input.value.trim();
  
// 	  if (inputValue !== '' && selectedDay !== null) {
// 		  const dayList = document.getElementById(`${selectedDay}List`);
  
// 		  const listItem = document.createElement('li');
// 		  listItem.textContent = inputValue;
  
// 		  // Create a span to hold the delete button
// 		  const deleteSpan = document.createElement('span');
// 		  deleteSpan.classList.add('delete-button');
  
// 		  // Create the delete button
// 		  const deleteButton = document.createElement('button1');
// 		  deleteButton.textContent = ' ✖'; // You can use any text or icon for delete
// 		  deleteButton.onclick = function() {
// 			  dayList.removeChild(listItem);
// 		  };
  
// 		  // Append the delete button to the span
// 		  deleteSpan.appendChild(deleteButton);
  
// 		  // Append the meal and delete button to the list item
// 		  listItem.appendChild(deleteSpan);
// 		  dayList.appendChild(listItem);
// 		  input.value = '';
// 	  }}

	  
  
  
function saveMealPlan() {
    // Her gün için ayrı bir dizi oluştur
   
    var mondayMeals = getMealList("monday");
    var tuesdayMeals = getMealList("tuesday");
    var wednesdayMeals = getMealList("wednesday");
    var thursdayMeals = getMealList("thursday");
    var fridayMeals = getMealList("friday");
    var saturdayMeals = getMealList("saturday");
    var sundayMeals = getMealList("sunday");

    // Tüm öğünleri birleştir
    var allDaysMeals = [].concat(mondayMeals, tuesdayMeals, wednesdayMeals, thursdayMeals, fridayMeals, saturdayMeals, sundayMeals);
    var jsonAllDaysMeals = JSON.stringify(allDaysMeals);

    console.log("Meal plan allDays", jsonAllDaysMeals);

//      const daysArray = [];

// ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach(day => {
//     const mealList = getMealList(day);
//     const stringMealList = mealList.join(","); // Convert array to comma-separated string
//     daysArray.push(stringMealList); // Store the string in daysArray
//   });
  
//   console.log(daysArray);

    // POST isteği yapmak için fetch kullanarak sunucuya gönder
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    fetch('https://recipiebeckend.azurewebsites.net/planner/save-planner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JWTAccessToken,

            // Eğer sunucu yetkilendirme gerektiriyorsa, bu kısıma token vb. ekleyebilirsin
        },
        body: JSON.stringify({
           
            plannerData: allDaysMeals
            // Diğer günlerin dizilerini de ekleyebilirsin
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Meal plan saved:', data);
        console.log('Meal plan body', body);

        // Başarılı bir şekilde kaydedildiğine dair kullanıcıya geri bildirim verebilirsin
    })
    .catch(error => {
        console.error('There was a problem saving the meal plan:', error);
        // Hata durumunda kullanıcıya bir hata mesajı gösterebilirsin
    });
}

// function getMealList(day) {
//     // Verilen günün öğün listesini al
//     var dayList = document.getElementById(day + "List");
//     var meals = [];
//     // Tüm öğünleri al
//     dayList.querySelectorAll("li").forEach(function(mealItem) {
//         meals.push(mealItem.textContent.trim());
//     });
//     console.log('meals',meals);
//     return meals;
// }
function getMealList(day) {
    // Verilen günün öğün listesini al
    var dayList = document.getElementById(day + "List");
    var meals = [];

    // Tüm öğünleri al
    dayList.querySelectorAll("li").forEach(function(mealItem) {
        var mealText = mealItem.textContent.trim();

        // "X" işaretini listeden çıkar
        mealText = mealText.replace(/\u2715/, '').trim(); // Unicode karakteri olan "✕" işaretini kaldırır

        // Öğünler virgülle ayrılmış bir dize olarak girildiğinden, virgülle bölelim
        var mealItems = mealText.split(",");

        // Öğünleri meals dizisine ekleyelim
        meals = meals.concat(mealItems.map(item => item.trim()));
    });

    console.log('meals',meals);

    return meals;
}


// Sayfa yüklendiğinde önceden kaydedilmiş verileri getir
window.addEventListener('DOMContentLoaded', function() {
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    var headers = new Headers();
    headers.append('Authorization', JWTAccessToken ); // Auth token burada belirtilmelidir

    fetch('https://recipiebeckend.azurewebsites.net/planner/get-current-data', {
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Gelen verileri uygun şekilde işleyerek öğün listesine ekleyin
        populateMealList(data);
    })
    .catch(error => {
        console.error('There was a problem loading the meal plan:', error);
        // Hata durumunda kullanıcıya bir hata mesajı gösterebilirsin
    });
});

// Önceden kaydedilmiş verileri kullanarak öğün listesini doldur
function populateMealList(mealPlan) {
    for (var day in mealPlan) {
        if (mealPlan.hasOwnProperty(day)) {
            var dayList = document.getElementById(day + "List");
            mealPlan[day].forEach(function(meal) {
                var listItem = document.createElement("li");
                listItem.textContent = meal;
                // Silme düğmesi ekleyebilirsiniz, ancak gerekirse ekleyin
                dayList.appendChild(listItem);
            });
        }
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
    const recipeDiv = document.createElement('div');
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
    console.log("Rate değeri: " , rate)

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

    document.body.appendChild(heartContainer);

    heartContainer.classList.add('favorite-heart');
    if(recipe.isLiked){
        heartContainer.style.color = 'red';
    }
    // heart.onclick = () => toggleFavorite(heart);

    const clickHandler = () => setLike(true, heartContainer, recipe);
    heartContainer.onclick = clickHandler;


    // Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('titleDiv');
    titleDiv.textContent = recipe.recipe.title;

    // Append stars and heart to the recipeDiv
    recipeDiv.appendChild(imgDiv);
    recipeDiv.appendChild(titleDiv);
    recipeDiv.appendChild(starContainer);
    recipeDiv.appendChild(heartContainer);

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
        const response = await fetch('https://recipiebeckend.azurewebsites.net/recipes/home');
        const data = await response.json();

		console.log('Fetched Data:', data);

        displayDashboard(data);
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

// Call fetchData to initiate the process
fetchData();
// let i = 1;
// console.log("Fetch çalıştı " + i)
// i+1;

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
            console.log("data ne: " , data);
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
async function getSelectedCustomDataOfDashboard(index) {
    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/home';
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
        return data[index];
    } else {
        // Handle non-JSON response or empty response
        console.error('Invalid or empty JSON response');
        return null; // or handle it according to your application's logic
    }
}

function openNewTab() {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const host = url.hostname;
    const port = url.port || '80'; // Default to port 80 if no port is specified

    const baseURL = `http://${host}:${port}/templates/searchByIngredientTab.html`;
    window.open(baseURL, '_blank');
}

// $(document).ready(function() {
//     $('#pagination li a').on('click', function(e) {
//         e.preventDefault();
//     $('#next').on('click', function(e) {
//         e.preventDefault();
//         var currentPage = $('#pagination li.active').index() + 1;
//         console.log("Current page: " , currentPage);
//         var key = currentPage - 1;
//         paging(key);
//     });
//     $('#prev').on('click', function(e) {
//         e.preventDefault();
//         var currentPage = $('#pagination li.active').index() + 1;
//         var key = currentPage - 2;
//         paging(key);
//     });
//         if (!$(this).is('#next, #prev')) {
//             $('#pagination li').removeClass('active');
//             $(this).parent().addClass('active');
//             var key = parseInt($(this).text().trim()) - 1;
//             paging(key);
//         }
//     });
// });

// $(document).ready(function() {
//     var key;

//     $('#pagination li a').on('click', function(e) {
//         e.preventDefault();

//         if (!$(this).is('#next, #prev')) {
//             $('#pagination li').removeClass('active');

//             $(this).parent().addClass('active');

//             key = parseInt($(this).text().trim()) - 1;

//             paging(key);
//         }
//     });

//     $(document).ready(function() {
//         var key = 0;

//         $('#pagination li a').on('click', function(e) {
//             e.preventDefault();
    
//             if (!$(this).is('#next, #prev')) {
//                 $('#pagination li').removeClass('active');
    
//                 $(this).parent().addClass('active');
    
//                 key = parseInt($(this).text().trim()) - 1;
//                 console.log("Key: " , key);
//                 paging(key);
//             }
//         });
    
//         $('#next').on('click', function(e) {
//             e.preventDefault();
        
//             var currentPage = $('#pagination li.active').index() + 1;
        
//             if (currentPage === 0) {
//                 currentPage = 1;
//             }

//             var nextPageKey = currentPage % ($('#pagination li').length - 1);
//             if (nextPageKey === 0) {
//                 nextPageKey = ($('#pagination li').length - 1);
//             } else {
//                 nextPageKey -= 1;
//             }

//             $('#pagination li').removeClass('active');

//             $('#pagination li:eq(' + nextPageKey + ')').addClass('active');

//             paging(nextPageKey);
//         });
//         $('#prev').on('click', function(e) {
//             e.preventDefault();

//             var currentPage = $('#pagination li.active').index() + 1;

//             var key = (currentPage - 2 + ($('#pagination li').length - 1)) % ($('#pagination li').length - 1);
//             console.log("Key: " , key);
//             paging(key);
//         });
//     });
// });

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
    console.log("Key: " , key);
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