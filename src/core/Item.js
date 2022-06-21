import TextField from "../inputs/TextField.js";
import ItemTypeSelector from "./ItemTypeSelector.js";
import TierSelector from "./TierSelector.js";

export default class Item {
  constructor(container, titulo, callBack) {
    this.item_type = 1; //começa como lendário
    this.tier = 3; //começa no tier 3
    this.refine_level = 6; //começa com refino no 6
    this.item_level = 1370;
    this.titulo = titulo;
    this.container = container;
    this.callBack = callBack;
    this.__setId();
    this.__createContainer();

    this.tierSelector = new TierSelector(
      `#${this.id} .content`,
      this.tier,
      this.__onTierChange.bind(this)
    );

    this.typeSelector = new ItemTypeSelector(
      `#${this.id} .content`,
      this.item_type,
      this.__onTypeChange.bind(this)
    );

    this.refineInput = new TextField(
      `honing_${this.id}`,
      "number",
      `#${this.id} .content`,
      "honing",
      { value: this.refine_level, step: "1" },
      this.__onRefineChange.bind(this)
    );
  }

  __setId() {
    const elements = [...document.querySelectorAll(".item")];
    let lastCount =
      elements.length > 0
        ? elements[elements.length - 1].getAttribute("data-counter")
        : -1;
    this.counter = parseInt(lastCount) + 1;
    this.id = `item-${this.counter}`;
  }

  __createContainer() {
    let label = this.titulo !== "" ? `<label><b>${this.titulo}</b></label>` : '';
    document.querySelector(
      this.container
    ).innerHTML += `<div id="${this.id}" class="form-group item" data-counter="${this.counter}" >
      ${label}
      <div class="content">
      </div>
    </div>`;
  }

  __onTypeChange(val) {
    this.item_type = val;
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "type", this.item_type);
  }

  checkTierTypes() {
    if (parseInt(this.tier) < 3) {
      this.typeSelector.disable();
      return;
    }

    this.typeSelector.enable();
  }

  __onTierChange(val) {
    this.tier = val;
    this.checkTierTypes();
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "tier", this.tier);
  }

  __onRefineChange(evt) {
    this.refine_level = evt.target.value;
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "refine", this.refine_level);
  }

  setup() {
    this.tierSelector.setup();
    this.typeSelector.setup();
    this.refineInput.setup();
  }

  setType(value) {
    this.item_type = value;
    this.typeSelector.setValue(value);
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "type", this.item_type);
  }

  setTier(value) {
    this.tier = value;
    this.tierSelector.setValue(value);
    this.checkTierTypes();
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "tier", this.tier);
  }

  setHoning(value) {
    this.refineInput.setValue(value);
    this.refine_level = value;
    this.item_level = this.tierSelector.getItemLevel(
      this.refine_level,
      this.item_type
    );
    if (typeof this.callBack === "function") this.callBack(this.item_level, "refine", this.refine_level);
  }

  getItemLevel() {
    return this.item_level;
  }
}
