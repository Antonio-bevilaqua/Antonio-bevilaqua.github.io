import Select from "../inputs/Select.js";

export default class ItemTypeSelector {
  constructor(container, val, callBack) {
    this.val = val;
    this.callBack = callBack;
    this.container = container;
    this.__setId();
    this.__setTypes();
    this.__setSelectedType();
    this.__setSelect();
  }

  __setId() {
    const elements = [...document.querySelectorAll(".types")];
    let lastCount = elements.length > 0 ? elements[elements.length - 1].getAttribute("data-counter") : -1;
    this.counter = parseInt(lastCount) + 1;
    this.id = `type-${this.counter}`;
  }

  __setSelectedType() {
    //indice do tipo selecionado
    this.types.forEach((type, index) => {
      if (parseInt(type.value) === parseInt(this.val)) this.selected = index;
    });
  }

  setup() {
    this.select.setup();
  }

  __setTypes() {
    this.types = [
      {
        label: "Raro ou Épico",
        value: "0",
      },
      {
        label: "Lendário +",
        value: "1",
      },
    ];
  }

  __onTypeChange(event) {
    this.types.forEach((type, index) => {
      if (parseInt(type.value) === parseInt(event.target.value)) {
        this.selected = index;
        this.val = event.target.value;
      }
    });

    if (typeof this.callBack === "function") this.callBack(this.val);
  }

  disable() {
    this.select.disable();
  }

  enable() {
    this.select.enable();
  }

  __setSelect() {
    this.select = new Select(
      `sel_type_${this.id}`,
      this.types,
      this.container,
      this.val,
      "types",
      { "data-counter": this.counter },
      this.__onTypeChange.bind(this)
    );
  }

  setValue(value) {
    this.select.setValue(value);
    this.val = value;
    this.__setSelectedType();
  }
}
