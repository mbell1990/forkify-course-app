// this view is like a parent view of the bookmarksView and resultsView
// this view will generate only one preview view

import View from './View.js';
import icons from '../../img/icons.svg';

// CHILD class of View

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    //find id of recipe
    const id = window.location.hash.slice(1); // start to read from the first element
    return `
    <li class="preview">
    <a class="preview__link ${
      this._data.id === id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="${this._data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>   
        </div>
      </div>  
    </a>
  </li>
`;
  }
}

export default new PreviewView(); // allows us to export one resultsView that can be used in the controller
