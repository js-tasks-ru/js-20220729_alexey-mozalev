import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  subElements = {};
  product = null;
  categories = [];
  productsUrl = `${BACKEND_URL}/api/rest/products`;
  categoriesUrl = `${BACKEND_URL}/api/rest/categories`;
  imgurUrl = 'https://api.imgur.com/3/image';

  constructor(productId = '') {
    this.productId = productId;
  }

  initEventListeners() {
    this.subElements.productForm.elements.uploadImage.addEventListener('pointerdown', this.openFileUploadDialog);
  }

  saveEventHandler = (e) => {
    e.preventDefault();
    this.save();
  }

  openFileUploadDialog = (e) => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    //TODO
  }

  loadData = async () => {
    const categoriesUrl = new URL(this.categoriesUrl);
    Object.entries({
      _sort: 'id',
      _refs: 'subcategory'
    }).forEach(([key, val]) => categoriesUrl.searchParams.append(key, val));
    const urls = [categoriesUrl];

    if (this.productId) {
      const productUrl = new URL(this.productsUrl);
      Object.entries({
        id: this.productId
      }).forEach(([key, val]) => productUrl.searchParams.append(key, val));
      urls.push(productUrl);
    }

    let data = [];
    try {
      data = await Promise.all(urls.map(url => fetchJson(url)));
      this.categories = data?.[0] || [];
      this.product = data?.[1][0];
    } catch (e) {
      console.error('loadData Error:', e);
    }

    return data;
  };

  save = async () => {
    const url = new URL(this.productsUrl);

    let data = {};
    try {
      data = await fetchJson(url, {
        method: 'PATCH',
        body: new FormData(this.subElements.productForm)
      });

    } catch (e) {
      console.error('save Error:', e);
    }

    let saveEvent = new Event("product-updated");
    this.element.dispatchEvent(saveEvent);

    return data;
  }

  uploadImage = (e) => {
    const url = new URL(this.imgurUrl);
    let formData = new FormData();
    //TODO
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

  updateFormElements() {
    this.subElements.productForm.elements['subcategory'].innerHTML = this.getCategoryElements();
    this.subElements.imageListContainer.firstElementChild.innerHTML = this.getImageElements();

    for (const elem of this.subElements.productForm.elements) {
      const name = elem.getAttribute('name');
      if (this.product[name]) {
        elem.value = this.product[name];
      }
    }
  }

  getCategoryElements() {
    const options = [];
    for (const category of this.categories) {
      for (const subcategory of category.subcategories) {
        options.push(`<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`);
      }
    }

    return options.join('');
  }

  getImageElements() {
    const images = this.product.images.map(image => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${image.url}">
          <input type="hidden" name="source" value="${image.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `;
    });

    return images.join('');
  }

  get template() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
                <ul class="sortable-list"></ul>
            </div>
            <input id="fileInput" type="file" accept="image/png, image/jpeg" hidden/>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
    this.subElements.productForm.onsubmit = this.saveEventHandler;

    this.initEventListeners();

    await this.loadData();
    this.updateFormElements();
    return this.element;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
