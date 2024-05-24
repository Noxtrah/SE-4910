async function getUserFavRecipes() {
  try {
    const apiURL = 'https://recipiebeckend.azurewebsites.net/user/user-favorites';
    const JWTAccessToken = sessionStorage.getItem('accessToken');
    const headers = {
      'Authorization': JWTAccessToken
    };
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched Data:', data);
    console.log("Response: ", response);
    // Call displayDashboard to render the fetched data
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching or displaying data:', error);
    return [];
  }
}

async function displayFavRecipes() {
  try {
    const data = await getUserFavRecipes();
    const cardsContainer = document.getElementById('cardsContainer');
    data.forEach(item => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      const truncatedDescription = truncateDescription(item.description);
      const cardContent = `
        <img src="${item.photoPath}" alt="${item.title}">
        <div class="info">
          <h1>${item.title}</h1>
          <p>${truncatedDescription}</p>
          <button>Read More</button>
        </div>
      `;
      cardDiv.innerHTML = cardContent;
      cardsContainer.appendChild(cardDiv);
    });
  } catch (error) {
    console.error('Error displaying favorite recipes:', error);
  }
}

function truncateDescription(description) {
  const maxLength = 100; // Maksimum karakter sayısı
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...';
  }
  return description;
}

// Display favorite recipes when the DOM content is loaded
window.addEventListener('DOMContentLoaded', displayFavRecipes);



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