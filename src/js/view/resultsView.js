import View from "./view";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = `No recipes found for your search. Please try again!`;

  _generateMarkUp() {
    // 1) loop over data than send it to render method (arr, boolean)
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  };
};
export default new ResultsView();
