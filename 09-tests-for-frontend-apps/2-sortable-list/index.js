export default class SortableList {
  subElements = {};

  constructor({ items }) {
    this.items = items;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<ul></ul>';
    this.element = wrapper.firstElementChild;
    this.items.map(item => this.element.append(item));
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
