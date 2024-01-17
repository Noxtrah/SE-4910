// Function to handle the intersection of the target element
const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const imageId = img.getAttribute('data-image-id');
            // Request the image from the server using the image ID
            fetch(`/api/getImage?id=${imageId}`)
                .then((response) => response.blob())
                .then((imageBlob) => {
                    const imageURL = URL.createObjectURL(imageBlob);
                    img.setAttribute('src', imageURL);
                    observer.unobserve(img);
                })
                .catch((error) => {
                    console.error('Error loading image:', error);
                });
        }
    });
 };
 
 // Create an Intersection Observer
 const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
 });
 
 // Load images from the database based on the current page or scroll position
 const imageGrid = document.getElementById('image-grid');
 
 function loadMoreImages() {
    // Fetch more image IDs from the server based on your pagination or infinite scroll logic
    fetch(`/api/getMoreImageIDs?page=${currentPage}`)
        .then((response) => response.json())
        .then((imageIds) => {
            imageIds.forEach((imageId) => {
                const newImage = document.createElement('img');
                newImage.setAttribute('data-image-id', imageId);
                newImage.alt = 'Image Description'; // Add alt text for accessibility
                newImage.classList.add('image-border'); // Add the image-border class
                imageGrid.appendChild(newImage);
 
                // Observe each image for intersection
                observer.observe(newImage);
            });
            currentPage++;
        })
        .catch((error) => {
            console.error('Error fetching more image IDs:', error);
        });
 }
 
 // Initialize and load the first set of images
 let currentPage = 1;
 loadMoreImages();
 
 // Implement infinite scrolling - load more images as the user scrolls down
 window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreImages();
    }
 });
 
 
