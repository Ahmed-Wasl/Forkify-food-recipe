import icons from "./../../img/icons.svg";

export default class View {
  _data;

  /**
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] if false, create markup string insted of rendering to the DOM
   * @returns {undefined | string} a markup string is returend if render = false
   * @this {Object} View instance
   * @author Ahmed al-arwai
   * @todo Finish implementation
   */
  render(data, render = true) {
    // 1) make sure there's data
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // 2) store data to
    this._data = data;

    // 3) set value of method to varible to use it once
    const markUp = this._generateMarkUp();

    // 4) if render true = already have, else countinue code line
    if (!render) return markUp;

    // 5) clear() interface, than paste markUp on interface
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp); // paste the data on html
  }

  addHandlerRender(handler) {
    // 1) when change url or load website call API
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  update(data) {
    // 1) store data
    this._data = data;

    // 2) store markup, than create to real code, than selectAll to both dom (old & new)
    const newMarkUp = this._generateMarkUp();
    const newDom = document.createRange().createContextualFragment(newMarkUp);
    const newElments = newDom.querySelectorAll("*");
    const curElements = this._parentElement.querySelectorAll("*");

    // 3) loop over arr of element
    newElments.forEach((newEl, i) => {
      // 3.1) store curEl & use i loop over curElement to loop
      const curEl = curElements[i];

      
      // 3.2) if not equal element && first value (text) not empty = change the text inside to new one (text only)
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
        curEl.textContent = newEl.textContent;
      }

      // 3.3) if not equal elements = change to new attr for data
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    // 1) clear interface to make it ready to paste new data
    this._parentElement.innerHTML = ""; 
  }

  renderSpinner() {
    // 1) store into markUp, than clear() interface, than paste on interface
    const markUp = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  renderError(errorMessage = this._errorMessage) {
    // 1) store into markUp, than clear() interface, than paste on interface
    const markUp = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${errorMessage}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  renderMessage(message = this._message) {
    // 1) store into markUp, than clear() interface, than paste on interface
    const markUp = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
}
