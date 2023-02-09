// create a class as later we need a parent class called view which will contain methods all the view will inherit
// we also want each view to have private parts which makes this easy to implement

import View from './View.js';

import icons from '../../img/icons.svg';
//import { Fraction } from 'fractional'; // imported package from npm
import fracty from 'fracty';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe'); // private view 1
  _data; // private view 2. All views will have parentElement and data in common. data is what is found in model.state.recipe i.e. all the recipe info
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  // render is called on state object in the controller. Data then becomes properties in state so we can use to update UI

  // PUBLISHER SUBSCRIBER METHOD
  // addHandlerRender will render the recipe at the beginnng. This method is the publisher and needs access to the subscriber which in this case in the handler function
  // listens for events in the view

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(
      ev => window.addEventListener(ev, handler) // create and array of events so that we can use for each to loop over the events and add an event listener on both
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset; // when there is a dash in class name, words become camelcase
      if (+updateTo > 0) handler(+updateTo); // value from date-update-to based on user clicking + or - button
    });
  }

  addHandlerAddBookmark(handler) {
    // pass in a handler function which can be found in controller.js
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler(); // call handler here which is allows you to call controlHandlerAddBookmark in the controller
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
           <svg>
              <use href="${icons}#icon-user"></use>
            </svg>   
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')} 
     
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }

  _generateMarkupIngredient(ing) {
    // map returns new array that we can join. Map loops over the array
    // ing becomes the object
    // array contains markup below - result of map function
    return `
  <li class="recipe__ingredient">
  <svg class="recipe__icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <div class="recipe__quantity">${
    ing.quantity ? fracty(ing.quantity).toString() : ''
  }
    <span class="recipe__unit">${ing.unit}</span>
    ${ing.description}
  </div>
</li>
  `;
  }
}

export default new RecipeView(); // don't pass data so no need for constructor
