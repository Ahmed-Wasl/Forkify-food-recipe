import View from "./view";
import previewView from "./previewView";

class bookmarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkUp() {
    // 1) loop over data than send it to render method (arr, boolean)
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}
export default new bookmarkView();
