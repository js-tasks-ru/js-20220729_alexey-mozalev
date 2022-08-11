export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data,
    label,
    link,
    value,
    formatHeading
  } = {data: [], label: '', link: '', value: null}) {
    this.data = [...(data || [])];
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.render();
  }

  getLink() {
    return this.link || '';
  }

  getHeading() {
    return this.formatHeading ?
      this.formatHeading(this.value) :
      this.value;
  }

  update(data) {
    this.data = [...(data || [])];
    this.destroy();
    this.render();
  }

  destroy() {
    this.remove();
  }

  getChartItems() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
    return this.data.map(num => `<div style="--value: ${String(Math.floor(num * scale))}" data-tooltip="${(num / maxValue * 100).toFixed(0)}%"></div>`).join('');
  }

  remove() {
    this.element.remove();
  }

  render() {
    const div = document.createElement('div');

    div.className = this.data.length ? `dashboard__chart_${this.label}` : 'column-chart_loading';
    div.innerHTML = `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          <a href="${this.getLink()}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.getHeading()}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getChartItems()}
          </div>
        </div>
      </div>
    `;

    this.element = div;
    document.body.append(div);
  }
}
