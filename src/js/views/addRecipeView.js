import View from './View.js';
import icons from '../../img/icons.svg';

// CHILD class of View

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); // use super as this is a child class. Super allows you to use the this keyword
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // manually set the this keyword to toggle window instead of btnOpen
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // form data is modern browse API. Returns an object. Spread the object to give us an array with all fields
      const data = Object.fromEntries(dataArr); // takes and array of entries and converts to an object
      handler(data); // call controlAddRecipe in the controller.
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
