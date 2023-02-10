import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config'; // add API from config file
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// export state so we can use it in the controller
// state contains all the data we need to build the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// create recipe object to allow us to use where we want. For example in the state
const createRecipeObject = function (data) {
  const { recipe } = data.data; // use destructuring on recipe to create an object for recipe data. Allows you to use data object from the API data.
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // add key if it exists. && short circuits. If recipe.key doesn't exist then nothing happens. If it is a value the the second part is returned and the whole expression will be the object and then we can spread the object. If key exists key: recipe.key would be returned
  };
};

// function to load recipe from Forkify API. Function will not return anything. It will change the state object above to contain recipe and then controller will take the recipe from the state object. This is ahcieved through import and export
// controller will get the id from the hash, slice method
// calls loadRecipe and passes id into function

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // wait resposine from getJSON which gets data from API
    state.recipe = createRecipeObject(data);

    // check if recipe is bookmarked
    //if the id's matched mark as bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // loop over an array and return any results that are true
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`); // error thrown from getJSON in helper.js
    throw err;
  }
};

// this function will be exported to be used by the controller.
// Controller will tell function what to search for through the query.
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query; // set here to apply to state object
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    }); // returns new array with new object
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`); // error thrown from getJSON in helper.js
    throw err;
  }
};

// Pagination - show only 10 search results on the page
// default page set to 1 with state.search.page

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start);
};

// reach into recipe ingredients in state and amend quantity
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

// Storing bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked anymore
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Taking the bookmarks from local storage and inserting in app

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // convert back to an object
};

init();
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();

// make a request to API

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') // create array of ingredients
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe); // store created recipe as bookmark
  } catch (err) {
    throw err;
  }
};
