import './css/styles.css';
import Notiflix from 'notiflix';
import fetchImages from './fetchImages';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

formEl.addEventListener('submit', onImageSearch);

function onImageSearch(evt) {
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  const searchImage = searchQuery.value;
  galleryEl.innerHTML = ""

    fetchImages(searchImage)
      .then(images => renderGalleryMarkup(images))
      .catch(error => console.log(error))
      .finally(evt.currentTarget.reset());
  
}

function renderGalleryMarkup(images) {
  if (images.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGallery(images);
}

function renderGallery(images) {
  console.log(images);
  const imageArray = images.hits;
  const markup = imageArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
        <div class="photo">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </div>  
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`;
      }
    )
    .join('');

  galleryEl.innerHTML = markup;
}
