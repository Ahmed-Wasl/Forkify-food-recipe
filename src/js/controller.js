import * as model from "./model";
import * as config from "./config";

import recipeView from "./view/recipeView";
import searchView from "./view/searchView";
import resultsView from "./view/resultsView";
import paginationView from "./view/paginationView";
import bookmarksView from "./view/bookmarksView";
import addRecipeView from "./view/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipe = async function () {
  try {
    // 1) get the hashtag to use API
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 2) show spinner
    recipeView.renderSpinner();

    // 3) keep active on selected recipe from searchResult
    resultsView.update(model.getSearchResultsPage());

    // 4) update bookmark to avoid (class active) bug
    bookmarksView.update(model.state.bookmarks);

    // 5) Loading recipe
    await model.loadRecipe(id);

    // 6) Rendering it
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError(error);
  }
};

const controlServings = function (newServings) {
  // 1) update the recipe servings state.recipe.servings
  model.updateServings(newServings);

  // 2) Rendering the update only: update for render the dom and text only, not everything
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    // 1) set new property on recipe (true) + push recipe to state.bookmark
    model.addBookmark(model.state.recipe);
  } else {
    // 2) remove from state.bookmark + recipe.bookmarked = false
    model.deleteBookmark(model.state.recipe.id);
  }

  // 3) update page: if loading recipe is bookmarked show fill icon, else no
  recipeView.update(model.state.recipe);

  // 4) render bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarkRender = function () {
  // 1) render the bookmark on change hashtag or load it
  bookmarksView.render(model.state.bookmarks);
};

const controlSearch = async function () {
  try {
    // 1) show spinner
    resultsView.renderSpinner();

    // 2) get search query
    const query = searchView.getQuerty();
    if (!query) return;

    // 3) Loading search recipe arr
    await model.loadSearchResults(query);

    // 4) Rendering it
    resultsView.render(model.getSearchResultsPage());

    // 5) Render initinal pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError(error);
  }
};

const controlPagination = function (goToPage) {
  // 1) Rendering it: with btn click result
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render initinal pagination buttons
  paginationView.render(model.state.search);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 1) show loading spinner
    addRecipeView.renderSpinner();

    // 2) send data to model.uploadRecipe
    await model.uploadRecipe(newRecipe);

    // 3) render uploaded recipe
    recipeView.render(model.state.recipe);

    // 4) add successfully uploaded message
    addRecipeView.renderMessage();

    // 5) render bookmark view (new element = render)
    bookmarksView.render(model.state.bookmarks);

    // 6) change url
    window.history.pushState(null, "", `${model.state.recipe.id}`);

    // 7) close upload form windo
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, config.MODEL_CLOSE_SEC);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarkRender);
  recipeView.addHandlerAddBookmark(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearch);
  recipeView.addHandlerUpdateServings(controlServings);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
