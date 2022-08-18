class Tooltip {
  element = null;
  prevTarget = null;

  initialize() {
    document.body.addEventListener('pointerover', this.onPointerOverHandler);
    document.body.addEventListener('pointerout', this.onPointerOutHandler);
    document.body.addEventListener('mousemove', this.onMouseMoveHandler);
  }

  onPointerOverHandler = (event) => {
    this.render();

    const target = event.target;
    if (!target.dataset.tooltip) {
      return;
    }

    this.prevTarget = target;
    this.element.innerHTML = target.dataset.tooltip;
  };

  onPointerOutHandler = (event) => {
    const target = event.target;
    if (this.prevTarget === target) {
      this.remove();
    }
  };

  onMouseMoveHandler = (event) => {
    this.element.style.top = `${event.clientY + 10}px`;
    this.element.style.left = `${event.clientX + 10}px`;
  };

  get template() {
    return `
      <div class="tooltip">${this.element?.tooltip}</div>
    `;
  }

  render(parent = document.body) {
    const div = document.createElement('div');
    div.innerHTML = this.template;
    this.element = div.firstElementChild;

    //TODO commented code somehow doesn't work in the 'should be rendered correctly' test
    // if (parent) {
    //   parent.append(this.element);
    // }
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.prevTarget = null;
  }
}

export default Tooltip;
