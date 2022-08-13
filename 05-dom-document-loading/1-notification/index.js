export default class NotificationMessage {
  static existingElement = null;

  constructor(message = '', {duration = 3000, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();

    this.remove = this.remove.bind(this);
  }

  get durationInSeconds() {
    return this.duration / 1000;
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.durationInSeconds}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.template;

    this.element = div.firstElementChild;

    if (NotificationMessage.existingElement) {
      NotificationMessage.existingElement.remove();
    }
    NotificationMessage.existingElement = this.element;
  }

  show(outerElement) {
    if (outerElement) {
      outerElement.append(this.element);
    }
    setTimeout(this.remove, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.existingElement = null;
  }
}
