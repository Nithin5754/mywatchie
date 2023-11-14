// app.js
const { getRandomImages } = require('./unsplash_api');

const query = 'watches-love'; // i want all the random watches
const numberOfImages = 5; 


async function getRandomMultipleImages() {
  try {
    const photos = await getRandomImages(query);

    // Ensure we have enough images available
    if (photos.length < numberOfImages) {
      console.warn('Not enough images available. Returning all available images.');
    }

    // Select random photos from the array
    const randomIndexes = [];
    while (randomIndexes.length < numberOfImages && randomIndexes.length < photos.length) {
      const randomIndex = Math.floor(Math.random() * photos.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const randomPhotos = randomIndexes.map((index) => photos[index]);

    // Display the URLs of the random images
    const randomImageURLs = randomPhotos.map((photo) => photo.urls.regular);
    console.log('Random Banner Images:', randomImageURLs);

    return randomImageURLs;
  } catch (error) {
    console.error('Error fetching images:', error.message);
  }
}

module.exports = getRandomMultipleImages;
