window.addEventListener('DOMContentLoaded', async function() {
    try {
        const apiURL = 'http://localhost:8383/recipes/update-recipe';

        const updateRecipeForm = document.getElementById('updateRecipeForm');
        updateRecipeForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const formData = new FormData(updateRecipeForm);
            const id = formData.get('id');

            // Ensure ID is provided before sending the request
            if (!id) {
                alert('Recipe ID is required.');
                return;
            }

            const photoPathInput = document.getElementById('photoPath');
            if (photoPathInput.files.length > 0) {
                formData.append('photoPath', photoPathInput.files[0]); // Append the file if it exists
            }

            const response = await fetch(`${apiURL}/${id}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.text();
                alert(result); // You can handle success response here
            } else {
                alert('Failed to update recipe'); // You can handle error response here
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
