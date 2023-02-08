import * as model from './model.js'; // allows you to use everything within model.js
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { add } from 'lodash-es';

// if (module.hot) {
//   module.hot.accept(); // hot reloading from parcel
// }

const controlRecipes = async function () {
  try {
    // recongnising recipe ID
    const id = window.location.hash.slice(1); // takes the location of the whole app and takes #

    if (!id) return; // no id then return. Known as a guard clause
    recipeView.renderSpinner(); // render the spinner on the recipe section

    // 0. Update results view to mark selected search result and bookmarks
    resultsView.update(model.getSearchResultsPage());

    // 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. loading recipe
    await model.loadRecipe(id); // async function returns promise that we need to handle. Store recipe in state object. calls function on model that retrieves data from the API

    // 3. rendering the recipe

    recipeView.render(model.state.recipe); // data that we receive in step 1. This data is then passed into the render method in recipeView and stores in this.data
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query); // function doesn't return anything but manipulates the state object in model

    // 3. Render results
    resultsView.render(model.getSearchResultsPage()); // gain search results from this.data in render method in model

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search); // accesses data from this._data in View.js. This is the entire search result
  } catch (err) {
    console.log(err);
  }
};

// controller that will be exucted when a click on pagination button happens. This is the handler function which is then passed ontp the addHandlerclick in paginationView
const controlPagination = function (goToPage) {
  // 3. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); // render will overide previous results. The clear method allows for this

  // 4. Render new pagination buttons
  paginationView.render(model.state.search);
};

// this will be executed when a user clicks on one of the servings buttons
const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings); // update data in the model and not controller

  // update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); // only update text and attributes in the DOM and not entire view. Update is created in View.js
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe); //update the whole recipe without rerendering the entire view

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // Success message

    addRecipeView.renderMessage();

    // Render bookmark view

    bookmarksView.render(model.state.bookmarks);

    // change ID in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error();
    addRecipeView.renderError(err.message);
  }
};

// SUBSCRIBER
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination); // calls addHandlerClick function in paginationView which calls ev L to listen
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
