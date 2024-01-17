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
        const photoPath = document.getElementById('photoPath').value;

        const recipe = {
            title,
            ingredients,
            meal,
            cuisine,
            description,
            preparationTime,
            photoPath
        };

        try {
             const response = await fetch('https://recipiebeckend.azurewebsites.net/recipes/create-recipe', {
            //const response = await fetch('localhost:8383/recipes/create-recipe', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipe)
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