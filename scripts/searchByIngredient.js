const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const tagsArray = []; // Array to store entered values

searchInput.addEventListener('keydown', function (event) {
    if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        const inputValue = searchInput.value.trim();

        if (inputValue !== '') {
            tagsArray.push(inputValue); // Add value to the array

            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = inputValue;

            const removeButton = document.createElement('span');
            removeButton.className = 'remove';
            removeButton.textContent = '×';
            removeButton.addEventListener('click', function () {
                searchBar.removeChild(tag);
                const index = tagsArray.indexOf(inputValue);
                if (index !== -1) {
                    tagsArray.splice(index, 1); // Remove value from the array
                }
            });

            tag.appendChild(removeButton);
            searchBar.insertBefore(tag, searchInput);

            searchInput.value = ''; // Clear the input field
        }
    }
});

function openNewTab() {
    const baseURL = 'http://127.0.0.1:5500/templates/searchByIngredientTab.html';
    const urlToOpen = baseURL + '?query=' + encodeURIComponent(JSON.stringify(tagsArray));

    // Open a new tab with the constructed URL
    window.open(urlToOpen, '_blank');
}


function setupBackButton() {
    const backButton = document.getElementById('back-arrow-button');

    backButton.addEventListener('click', () => {
        window.history.back();
    });
}
// Call the function to generate user recipe boxes when the page loads
window.onload = function () {
    setupBackButton();
};