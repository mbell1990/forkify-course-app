import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

// CHILD class of View

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) // loop over array and return string so we can insert markup into the DOM. Set to false to trigger ' if (!render) return markup' in View.js. This results in an array of strings
      .join(''); // this will join all arrays together so we have one big array
  }
}

export default new BookmarksView();
