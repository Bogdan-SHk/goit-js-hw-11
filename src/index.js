import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import ImagesApiService from './imagesApiService';
import { refs } from './refs';
import renderGalleryMarkup from './renderGalleryMarkup';


const imagesApiService = new ImagesApiService();

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', onImageSearch);
// refs.loadMoreBtnEl.addEventListener('click', onLoadMore);


async function onImageSearch(evt) {
  evt.preventDefault();

  refs.galleryEl.innerHTML = '';

  infiniteScroll();

  // if (refs.loadMoreBtnEl.classList.contains('visible')) {
  //   refs.loadMoreBtnEl.classList.remove('visible');
  // }

  imagesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();

  try {
    const images = await imagesApiService.fetchImages();
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const imageMarkup = await renderGalleryMarkup(images);
    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
    // refs.loadMoreBtnEl.classList.add('visible');
    gallery.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  imagesApiService.incrementPage();
  imagesApiService.totalPages += 40;
  try {
    const images = await imagesApiService.fetchImages();
    if (imagesApiService.totalPages > images.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      // refs.loadMoreBtnEl.classList.remove('visible');
    }
    const imageMarkup = await renderGalleryMarkup(images);
    gallery.refresh();
    // smoothScroll();
  } catch (error) {
    console.log(error.message);
  }
}

// Функція для плавного прокручування сторінки
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Функція для нескінченного скролу
function infiniteScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      });
    },
    {
      rootMargin: '300px',
      threshold: 1.0,
    }
  );

  observer.observe(refs.loadMoreBtnEl);
}
