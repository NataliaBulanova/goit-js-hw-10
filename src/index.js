import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountry } from './api-servise';
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const LIMIT = 10;

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
function onSearch() {
  let filter = searchBox.value.toLowerCase().trim();
  if (!filter) {
    Notify.info('Please? enter a name.');
    clearInnerHTML();
    return;
  }
  fetchCountry(filter)
    .then(country => {
      if (country.length > LIMIT) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      createMarkup(country);
      // console.log(country);
    })
    .catch(catchError);
}
function createMarkup(country) {
  if (country.length === 1) {
    const countryInfoMarkup = country
      .map(({ name, capital, population, flags, languages }) => {
        return `<div>
        <div class="flag-title-section">
          <img src="${flags.svg}" alt="" width="40px" height="40px"/>
          <h2 class="country-info__title">${name}</h2>
        </div>
        <p class="country-info__def">Capital:<span class="country-info__value">${capital}</span></p>
        <p class="country-info__def">
          Population:<span class="country-info__value">${population}</span>
        </p>
        <p class="country-info__def">
          Languages:<span class="country-info__value">${languages.map(({ name }) => name)}</span>
        </p>
      </div>`;
      })
      .join('');
    countryList.innerHTML = '';
    countryInfo.innerHTML = countryInfoMarkup;
    return;
  }
  const countryMarkup = country
    .map(({ name, flags }) => {
      return `<li class="list-item">
<img src="${flags.svg}" alt="" width ="40px" height="40px">
<p class="list-item-text">${name}</p>
</li>
`;
    })
    .join('');
  console.log(countryMarkup);
  countryList.innerHTML = countryMarkup;
  countryInfo.innerHTML = '';
}
function catchError() {
  Notify.failure('Oops, there is no country with that name');
  clearInnerHTML();
}
function clearInnerHTML() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
