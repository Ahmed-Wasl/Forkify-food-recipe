import icons from "./../../img/icons.svg";
import View from "./view";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  };

  _generateMarkUp() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    const btnPrev = `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
    const btnNext = `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    if (curPage === 1 && numPages > 1) {
      // page 1 and there's other pages
      return btnNext;
    } else if (curPage === numPages && numPages > 1) {
      // on last page
      return btnPrev;
    } else if (curPage < numPages) {
      // between the pages
      return `${btnPrev} ${btnNext}`;
    } else {
      // page 1 and there's no other pages
      return ``; // no btn
    }
  };
}
export default new PaginationView();
