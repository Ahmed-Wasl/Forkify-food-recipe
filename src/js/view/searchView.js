import View from "./view";

class SearchRecipe extends View {
  _parentElement = document.querySelector(".search");
  _errorMessage = `No recipes found for your query. Please try again!`;
  _data;

  getQuerty() {
    // get the value of input search
    const query = this._parentElement.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    // clear input field
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {

      handler(); // call parameter
      e.preventDefault();
    });
  }
}
export default new SearchRecipe();
