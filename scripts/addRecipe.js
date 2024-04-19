document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('recipeForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const meal = document.getElementById('meal').value;
        const cuisine = document.getElementById('cuisine').value;
        const description = document.getElementById('description').value;
        const preparationTime = document.getElementById('preparationTime').value;

        // Get the file input element
        const fileInput = document.getElementById('photo');
        // Get the selected file
        const file = fileInput.files[0];

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('title', title);
            formData.append('ingredients', ingredients);
            formData.append('meal', meal);
            formData.append('cuisine', cuisine);
            formData.append('description', description);
            formData.append('preparationTime', preparationTime);
            formData.append('photo', file);

            // Send FormData to the server
            const response = await fetch('https://recipiebeckend.azurewebsites.net/recipes/create-recipe-blob', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Recipe added successfully!');
                // Handle success scenario, if needed
            } else {
                alert('Failed to add recipe!');
                // Handle failure scenario, if needed
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error scenario, if needed
        }
    });
});
