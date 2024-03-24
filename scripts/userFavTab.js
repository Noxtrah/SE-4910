fetch('https://run.mocky.io/v3/9541e80b-6e59-4092-8d9c-009857420d4e')
  .then(response => response.json())
  .then(data => {
    const cardsContainer = document.getElementById('cardsContainer');

    data.forEach(item => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');

      const cardContent = `
        <img src="${item.photoPath}" alt="${item.title}">
        <div class="info">
          <h1>${item.title}</h1>
          <p>${truncateDescription(item.description)}</p>
          <button>Read More</button>
        </div>
      `;

      cardDiv.innerHTML = cardContent;
      cardsContainer.appendChild(cardDiv);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function truncateDescription(description) {
  const maxLength = 100; // Maksimum karakter sayısı
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...';
  }
  return description;
}