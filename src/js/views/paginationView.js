import View from './View.js';
import icons from '../../img/icons.svg';

// CHILD class of View

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); // event delegation - closest element to button element
      console.log(btn);

      if (!btn) return; // guard clause to test for button

      const goToPage = +btn.dataset.goto;
      handler(goToPage); // called in controller
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    // figure out number of search pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page  ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }"  class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    }
    // Other page
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }"  class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto="${
        curPage + 1
      }"  class="btn--inline pagination__btn--next">
      <span>Page  ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // Page 1, and there are no other pages
    return '';
  }
}

export default new PaginationView();
