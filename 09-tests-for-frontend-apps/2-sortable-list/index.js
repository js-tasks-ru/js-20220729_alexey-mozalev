export default class SortableList {
  pointerDownHandler = (event) => {
    if (event.target.dataset['deleteHandle'] !== undefined) {
      const image = event.target.closest('li');
      image.remove();
    }
    if (event.target.dataset['grabHandle'] === undefined) {
      return;
    }

    const image = event.target.closest('li');

    let shiftX = event.clientX - image.getBoundingClientRect().left;
    let shiftY = event.clientY - image.getBoundingClientRect().top;

    let placeholder = getPlaceholderElement(image);
    image.before(placeholder);
    image.classList.add('sortable-list__item_dragging');
    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      image.style.left = pageX - shiftX + 'px';
      image.style.top = pageY - shiftY - window.scrollY + 'px';
    }

    function onPointerMove(event) {
      moveAt(event.pageX, event.pageY);

      image.style.visibility = 'hidden';
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      image.style.visibility = 'visible';

      if (!elemBelow) {
        return;
      }

      let droppableBelow = elemBelow.closest("li");
      if (this.currentDroppable !== droppableBelow) {

        if (this.currentDroppable) {
          // leaveDroppable(this.currentDroppable);
          if (placeholder) {
            placeholder.remove();
          }
        }

        this.currentDroppable = droppableBelow;

        if (this.currentDroppable) {
          // enterDroppable(this.currentDroppable);
          if (placeholder) {
            this.currentDroppable.before(placeholder);
          }
        }
      }
    }

    function getPlaceholderElement(elem) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<div class="sortable-list__placeholder" style="width: ${elem.offsetWidth}px; height: ${elem.offsetHeight}px;"></div>`;
      return wrapper.firstElementChild;
    }

    document.addEventListener('pointermove', onPointerMove);

    image.onpointerup = function () {
      document.removeEventListener('pointermove', onPointerMove);
      image.onpointerup = null;


      placeholder.after(image);
      image.classList.remove('sortable-list__item_dragging');
      image.style.position = null;
      image.style.zIndex = null;
      image.style.top = null;
      image.style.left = null;
      image.style.visibility = null;
      placeholder.remove();
    };

    // function enterDroppable(elem) {
    //   elem.style.background = 'pink';
    // }
    //
    // function leaveDroppable(elem) {
    //   elem.style.background = '';
    // }

    image.ondragstart = function () {
      return false;
    };
  };

  constructor({ items }) {
    this.items = items;

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', this.pointerDownHandler);
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<ul class="sortable-list"></ul>';
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
  }
}