const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');

        searchInput.addEventListener('keydown', function(event) {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.textContent = searchInput.value.trim();

                const removeButton = document.createElement('span');
                removeButton.className = 'remove';
                removeButton.textContent = '×';
                removeButton.addEventListener('click', function() {
                    searchBar.removeChild(tag);
                });

                tag.appendChild(removeButton);
                searchBar.insertBefore(tag, searchInput);

                searchInput.value = '';
            }
        });

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