import Select from "../inputs/Select.js";
import T1 from "../Tiers/T1.js";
import T2 from "../Tiers/T2.js";
import T3 from "../Tiers/T3.js";

export default class TierSelector {
  constructor(container, val, callBack) {
    this.val = val;
    this.callBack = callBack;
    this.container = container;
    this.__setId();
    this.__setTiers();
    this.__setSelect();
  }

  __setId() {
    const elements = [...document.querySelectorAll(".tiers")];
    let lastCount = elements.length > 0 ? elements[elements.length - 1].getAttribute("data-counter") : -1;
    this.counter = parseInt(lastCount) + 1;
    this.id = `tier-${this.counter}`;
  }

  __updateTierVal() {
    this.tiers.forEach((tier, index) => {
      if (!tier.isSelected(this.val)) return;

      this.selected = index;
    });
  }

  __setTiers() {
    this.tiers = [new T1(), new T2(), new T3()];
    //indice do tier selecionado
    this.__updateTierVal();
  }

  __setSelect() {
    let options = [];
    this.tiers.forEach((tier) => {
      options.push(tier.getOption());
    });

    this.select = new Select(
      `sel_tier_${this.id}`,
      options,
      this.container,
      this.val,
      "tiers",
      { "data-counter": this.counter },
      this.__onTierChange.bind(this)
    );
  }

  __onTierChange(event) {
    this.tiers.forEach((tier, index) => {
      if (tier.isSelected(event.target.value)) {
        this.selected = index;
        this.val = event.target.value;
      }
    });

    if (typeof this.callBack === "function") this.callBack(this.val);
  }

  setup() {
    this.select.setup();
  }

  getItemLevel(refine_level, item_type) {
    return this.tiers[this.selected]
      .setItemType(item_type)
      .getItemLevel(refine_level);
  }

  setValue(value) {
    this.select.setValue(value);
    this.val = value;
    this.__updateTierVal();
  }
}
