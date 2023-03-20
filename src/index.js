import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import ImagesApiService from './imagesApiService';

const imagesApiService = new ImagesApiService();

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formEl.addEventListener('submit', onImageSearch);
loadMoreBtnEl.addEventListener('click', onLoadMore);

async function onImageSearch(evt) {
  evt.preventDefault();

  galleryEl.innerHTML = '';

  if (loadMoreBtnEl.classList.contains('visible')) {
    loadMoreBtnEl.classList.remove('visible');
  }

  imagesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();

  try {
    const images = await imagesApiService.fetchImages();
    const image = await renderGalleryMarkup(images);
    if (images.hits.length === 0) { 
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
    loadMoreBtnEl.classList.add('visible');
    gallery.refresh();
  } catch (error) {
    console.log(error.message);
  } 
}

async function onLoadMore() {
  try {
    const images = await imagesApiService.fetchImages();
    const image = await (imagesApiService.totalPages += 40);
    if (imagesApiService.totalPages > images.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.classList.remove('visible');
    } else {
      renderGalleryMarkup(images);
      gallery.refresh();
      smoothScroll();
    }
  } catch (error) {
    console.log(error.message);
  }
}

function renderGalleryMarkup(images) {
  if (images.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGallery(images);
}

function renderGallery(images) {
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
        <div class="gallery">
          <a class="gallery__item" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
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

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}