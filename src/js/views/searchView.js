// this view is for access input from user in search bar
// put in view as it's about DOM manipulation
// don't want any DOM related stuff in controller

class SearchView {
  _parentEl = document.querySelector('.search');

  // method to be called from controller.
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; // get query, clear field, then return query
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // PUBLISHER. Listen for search event here in the view. Then pass handler into the controller
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    }); // add event listener to entire search form. Will work if user clicks submit button or types enter. Can't submit form straight await as need to prevent default action or page will reload
  }
}

export default new SearchView();
