export default class SortableTable {
  subElements = [];

  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];

    this.getTableRow = this.getTableRow.bind(this);

    this.render();
  }

  sort(fieldValue, orderValue) {
    const ORDER = {
      'asc': 1,
      'desc': -1
    };

    const CASE = {
      'asc': 'upper',
      'desc': 'lower'
    };

    const compareFn = (obj1, obj2) => {
      return ORDER[orderValue] * obj1[fieldValue].localeCompare(obj2[fieldValue], ['ru', 'en'],
        {caseFirst: CASE[orderValue]}
      );
    };

    this.data.sort(compareFn);
    this.updateBody();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.body;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const element of elements) {
      const name = element.dataset.element;
      result[name] = element;
    }

    return result;
  }

  get header() {
    const items = this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
        </div>
      `;
    }).join('');

    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${items}
      </div>
    `;
  }

  getTableRow(product) {
    const rowData = this.headerConfig.map(config => {
      switch (config.id) {
      case 'images':
        return config.template(product?.images);
      default:
        return `<div class="sortable-table__cell">${product[config.id]}</div>`;
      }
    }).join('');

    return `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${rowData}
      </a>
    `;
  }

  get body() {
    const products = this.data.map(this.getTableRow).join('');

    return `
      <div data-element="body" class="sortable-table__body">
        ${products}
      </div>
    `;
  }

  get template() {
    return `
        <div class="sortable-table">
          ${this.header}
          ${this.body}
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

