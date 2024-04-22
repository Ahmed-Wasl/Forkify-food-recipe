import { async } from "regenerator-runtime";
import * as config from "./config";
import * as helper from "./helper";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: config.RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {  
  const { recipe } = data.data;
  // 1) convert data with new name stracutre
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // if there's data (recipe.key), return key Separated by ...
  };
}

export const loadRecipe = async function (id) {
  try {
    // 1) get data from API
    const data = await helper.AJAX(`${config.API_URL}${id}?key=${config.API_KEY}`);

    // 2) store data, func for change varble name
    state.recipe = createRecipeObject(data);

    // 3) loop over state.bookmark
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      // if bookmark element same as id = set property to true
      state.recipe.bookmarked = true;
    } else {
      // if bookmark element not same as id = set property to false
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
};

export const updateServings = function (newServings) {
  // 1) loop over state.recipe.ing and update the value
  state.recipe.ingredients.forEach((ing) => {
    // newQt = oldQt * newServings / oldServings //
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // 2) update the value in state.recipe.serv
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // 1) push recipe to state.bookmark, to save it for now
  state.bookmarks.push(recipe);

  // 2) set new property on state.recipe to update page
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // 3) update data at localStorage
  persistBookmark();
};
export const deleteBookmark = function (id) {
  // 1) get the index and use splice to remove from state.bookmark
  const indexBookmark = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(indexBookmark, 1);

  // 2) update state.recipe.bookmarked: for update view
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  // 3) update data at localStorage
  persistBookmark();
};
export const persistBookmark = function () {
  // 1) store data into localStorage
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const loadSearchResults = async function (query) {
  try {
    // 1) update state.search.query
    state.search.query = query;
    // 2) get data from API using query
    const data = await helper.AJAX(`${config.API_URL}?search=${query}&?key=${config.API_KEY}`); // query: the stuff you searched about

    // 3) loop over data from API to get good name strcture + update state.search.results
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }), // it's for showing user icon, if u own this recipe
      };
    });
    // 4) after new API request update state.search.page for pagination
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  // 1) update state.search.page for btn click
  state.search.page = page;

  // 2) cut the arr
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  // 3) cut the arr of search result to show the user some of it
  return state.search.results.slice(start, end);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // 1) (turn obj to arr) (use filter, to remove unwanted data)
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        // 2) loop over data (remove all space) (split data)
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        // 3) descrabe all data
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : "", unit, description };
      });

    // 4) create a good stracture for sending it to API
    const newRecipeAPI = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // 5) use (helper.AJAX()), to send data
    await helper.AJAX(`${config.API_URL}?key=${config.API_KEY}`, newRecipeAPI);

    // 6) store data, func for change varble name
    state.recipe = createRecipeObject(data);

    // 7) add to bookmark
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  // 1) if there's localStorage turn it into JSON code
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  // 1) clear localStoreage
  localStorage.clear("bookmarks");
};
// clearBookmarks();
