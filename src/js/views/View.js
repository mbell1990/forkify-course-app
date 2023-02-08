// Parent class for all other child views

import icons from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data  The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, creat markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View nstance
   * @author Matthew Bell
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // check if data exists with guard clause. If undefined or empty array

    this._data = data; // contains all recipe data from state
    const markup = this._generateMarkup();

    if (!render) return markup; // if render is false, return markup that is generated above

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // insert updated html into the UI
  }

  // update DOM attributes and elements only

  update(data) {
    this._data = data; // contains all recipe data from state
    const newmarkup = this._generateMarkup(); // new markup for updated data

    const newDOM = document.createRange().createContextualFragment(newmarkup); // convert string into virtual DOM object. Allows you to use this DOM as if it was the real DOM on the page.
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      // updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // select firstchild as child node contains text
        console.log(newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // updates changed ATTRIBUTES
      // replace attributes in current elements with the new attributes i.e. update servings from 5 to 6 if clicked
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; // clear html on page to allow update
  }

  // public method so that the controller can call this method as it starts fetching the data
  renderSpinner = function () {
    const markup = ` <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // ERROR HANDLING

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
          </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // DISPLAY MESSAGE

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
          </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
