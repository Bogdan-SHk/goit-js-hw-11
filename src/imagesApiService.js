export default class ImagesApiService {
  constructor() {
    this.searchImage = '';
    this.page = 1;
    this.per_page = 40;
    this.totalPages = this.page * this.per_page;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: '34474738-43a25810011c751716536b8af',
      q: this.searchImage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: this.per_page,
    });

    const url = `https://pixabay.com/api/?${searchParams}`;

    try {
      const response = await fetch(url);
      const image = await response.json();
      this.page += 1;
      console.log(image);
      return image;
    } catch (error) {
      console.error(error);
    }

  }

  resetPage() {
    this.page = 1;
  }

  get searchQuery() {
    return this.searchImage;
  }

  set searchQuery(newSearchImage) {
    this.searchImage = newSearchImage;
  }
}
