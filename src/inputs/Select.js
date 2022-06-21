export default class Select {
  constructor(
    id,
    options,
    container,
    value = null,
    classes = "",
    attributes = {},
    callBack = null
  ) {
    this.id = id;
    this.attributes = attributes;
    this.container = container;
    this.classes = classes;
    this.options = options;
    this.callBack = callBack;
    this.value = value;
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

    this.html = `<select id="${this.id}" ${attrstr} class="form-control ${this.classes}">`;
    this.options.forEach((opt) => {
      let selected = this.value == opt.value ? "selected" : "";
      this.html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
    });
    this.html += "</select>";
  }

  __draw() {
    document.querySelector(this.container).innerHTML += this.html;
  }

  __init() {
    this.__setHtml();

    this.__draw();
  }

  call(evt) {
    this.callBack(evt);
  }

  disable() {
    if (this.element.hasAttribute("disabled")) return true;

    this.element.setAttribute("disabled", "disabled");
  }

  enable() {
    if (!this.element.hasAttribute("disabled")) return true;

    this.element.removeAttribute("disabled");
  }

  setup() {
    this.element = document.querySelector(`#${this.id}`);
    if (typeof this.callBack === "function")
      this.element.addEventListener("change", this.call.bind(this));
  }
}
