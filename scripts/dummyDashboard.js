// const fetchData = async () => {
//     try {
//       const response = await fetch('https://recipiebeckend.azurewebsites.net/recipes/all-recipes');
//       const data = await response.json();

//       const recipeContainer = document.getElementById('recipeContainer');

//       data.forEach(recipe => {
//         const recipeDiv = document.createElement('div');
//         recipeDiv.classList.add('recipe-item');

//         const imgDiv = document.createElement('div');
//         imgDiv.classList.add('imgDiv');
//         const img = document.createElement('img');
//         img.src = recipe.photoPath;
//         img.alt = 'Recipe Photo';

//          // Apply CSS to constrain image size
//          img.style.maxWidth = '33%'; // Adjust this value as needed
//          img.style.height = '10%'; // Maintain aspect ratio


//         imgDiv.appendChild(img);
//         recipeDiv.appendChild(imgDiv);


//         const titleDiv = document.createElement('div');
//         titleDiv.classList.add('titleDiv');
//         titleDiv.textContent = recipe.title;
//         recipeDiv.appendChild(titleDiv);

//         recipeContainer.appendChild(recipeDiv);
//       });
//     } catch (error) {
//       console.error('Error fetching or displaying data:', error);
//     }
//   };

//   // fetchData fonksiyonunu çağırarak dataları al ve içeriği doldur
//   fetchData();