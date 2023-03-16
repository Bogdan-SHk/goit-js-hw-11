export default function fetchCountries(name) {
  const countryValue = 'name,capital,population,flags,languages';
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${countryValue}`;
 
    return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
