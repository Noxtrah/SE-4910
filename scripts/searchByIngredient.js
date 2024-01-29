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
// Call the function to generate user recipe boxes when the page loads
window.onload = function () {
    setupBackButton();
};