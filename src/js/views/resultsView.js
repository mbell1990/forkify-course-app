import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

// CHILD class of View

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => previewView.render(result, false)) // loop over array and return string so we can insert markup into the DOM. Set to false to trigger ' if (!render) return markup' in View.js. This results in an array of strings
      .join(''); // this will join all arrays together so we have one big array
  }
}

export default new ResultsView(); // allows us to export one resultsView that can be used in the controller
