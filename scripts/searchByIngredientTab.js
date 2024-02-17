const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        event.preventDefault();
        addIngredientTag(searchInput.value.trim());
        searchInput.value = '';
    }
});

function addIngredientTag(ingredient) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = ingredient;

    const removeButton = document.createElement('span');
    removeButton.className = 'remove';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', function() {
        searchBar.removeChild(tag);
    });

    tag.appendChild(removeButton);
    searchBar.insertBefore(tag, searchInput);
}

        // searchInput.addEventListener('keydown', function(event) {
        //     if (event.key === ' ' || event.key === 'Enter') {
        //         event.preventDefault();
        //         const tag = document.createElement('div');
        //         tag.className = 'tag';
        //         tag.textContent = searchInput.value.trim();

        //         const removeButton = document.createElement('span');
        //         removeButton.className = 'remove';
        //         removeButton.textContent = '×';
        //         removeButton.addEventListener('click', function() {
        //             searchBar.removeChild(tag);
        //         });

        //         tag.appendChild(removeButton);
        //         searchBar.insertBefore(tag, searchInput);

        //         searchInput.value = '';
        //     }
        // });

function setupBackButton() {
    const backButton = document.getElementById('back-arrow-button');

    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Function to display the input value in the display area
function displayInputValue() {
    // Retrieve the query parameter from the URL
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var inputValue = urlParams.get('query');

    // Display the input value in the display area
    var displayArea = document.getElementById('displayArea');
    if (displayArea) {
        displayArea.innerHTML = '<p>Input Value: ' + inputValue + '</p>';
    }
}
displayInputValue();
window.onload = function () {
    setupBackButton();
    displayInputValue();
};

function ingredientBasedSearch() {
    console.log('Search button clicked');

    // Add a space at the end of the input
    searchInput.value += ' ';

    // Trigger the keydown event to ensure the last ingredient is processed
    var event = new KeyboardEvent('keydown', { key: ' ' });
    searchInput.dispatchEvent(event);

    const ingredientsTags = document.querySelectorAll('.tag');
    const ingredients = Array.from(ingredientsTags).map(tag => tag.textContent.replace('×', '').trim());

    // Remove any empty strings from the array
    const filteredIngredients = ingredients.filter(ingredient => ingredient !== '');

    const targetWords = filteredIngredients.join(',');

    var apiUrl = 'https://recipiebeckend.azurewebsites.net/recipes/ingredient-based-search?TargetIngredients=' + encodeURIComponent(targetWords);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(targetWords);
            console.log(data);
            displayRecipes(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}




function displayRecipes(recipeDataArray) {
    var recipesContainer = document.querySelector('.recipes'); // select the container for recipe items

    // Clear existing content in the recipes container
    recipesContainer.innerHTML = '';

    // Loop through the data and create recipe items
    recipeDataArray.forEach(function (recipeData) {
        var recipeItem = createRecipeItem(recipeData);
        recipesContainer.appendChild(recipeItem);
    });
}

function createRecipeItem(recipeData) {
    // Create the main container
    var recipeItem = document.createElement('div');
    recipeItem.className = 'recipe-item';

    // Create the recipe name element
    var recipeNameElement = document.createElement('h3');
    recipeNameElement.className = 'recipe-name';
    recipeNameElement.textContent = recipeData.title;

    // Create the horizontal line element
    var hrElement = document.createElement('hr');
    hrElement.className = 'border';

    // Create the content container
    var contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';

    // Create the image container
    var imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    // Create the image element
    var imgElement = document.createElement('img');
    imgElement.src = recipeData.photoPath;
    imgElement.alt = 'Recipe Image';

    // Append the image element to the image container
    imageContainer.appendChild(imgElement);

    // Create the info container
    var infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    // Create the recipe tags container
    var recipeTagsContainer = document.createElement('div');
    recipeTagsContainer.className = 'recipe-tags';

    // Split ingredients string into an array
    var ingredients = recipeData.ingredients.split(',');

    // Loop through the ingredients and create tag elements
    for (var i = 0; i < ingredients.length; i++) {
        var ingredientTag = document.createElement('span');
        ingredientTag.className = 'recipe-tag';
        ingredientTag.textContent = ingredients[i];
        recipeTagsContainer.appendChild(ingredientTag);
    }

    // Append the recipe name, horizontal line, image container, and recipe tags to the respective containers
    recipeItem.appendChild(recipeNameElement);
    recipeItem.appendChild(hrElement);
    imageContainer.appendChild(imgElement);
    infoContainer.appendChild(recipeTagsContainer);
    contentContainer.appendChild(imageContainer);
    contentContainer.appendChild(infoContainer);
    recipeItem.appendChild(contentContainer);

    // Return the created recipe item
    return recipeItem;
}