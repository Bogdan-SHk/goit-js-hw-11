export default function fetchImages(name) {
  
  const searchParams = new URLSearchParams({
    key: '34474738-43a25810011c751716536b8af',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const url = `https://pixabay.com/api/?${searchParams}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
