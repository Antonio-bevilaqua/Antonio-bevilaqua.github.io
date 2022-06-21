export default class TextField {
  constructor(
    id,
    type,
    container,
    classes = "",
    attributes = {},
    callBack = null
  ) {
    this.id = id;
    this.attributes = attributes;
    this.container = container;
    this.classes = classes;
    this.type = type;
    this.callBack = callBack;
    this.__init();
  }

  getElement() {
    return this.element;
  }

  setValue(value) {
    this.element.value = value;
    return this.element;
  }

  __setHtml() {
    let attrstr = "";
    for (const key in this.attributes) {
      attrstr += `${key}="${this.attributes[key]}" `;
    }

    this.html = `<input id="${this.id}" type="${this.type}" ${attrstr} class="form-control ${this.classes}" />`;
  }

  __draw() {
    document.querySelector(this.container).innerHTML += this.html;
  }

  call(evt) {
    if (evt.target.value === "") {
      return;
    }

    if (evt.target.value < 0) {
      this.element.value = 0;
      evt.target.value = 0;
    }

    if (evt.target.value > 25) {
      this.element.value = 25;
      evt.target.value = 25;
    }
    this.callBack(evt);
  }

  __init() {
    this.__setHtml();

    this.__draw();
  }

  setup() {
    this.element = document.querySelector(`#${this.id}`);
    if (typeof this.callBack === "function") {
      this.element.addEventListener("keyup", this.call.bind(this));
    }
  }
}
