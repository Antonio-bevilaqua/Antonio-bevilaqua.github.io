export default class Tiers {
  constructor(label, value, base_item_level, item_type = "1") {
    this.label = label;
    this.value = value;
    this.base_item_level = base_item_level;
    this.item_type = item_type;
  }

  getOption() {
    return {
      label: this.label,
      value: this.value,
    };
  }

  setItemType(item_type) {
    this.item_type = item_type;
    return this;
  }

  isSelected(value) {
    return parseInt(value) === this.value;
  }

  getBaseItemLevel() {
    return this.base_item_level;
  }

  countItemLevelTo(actual_level, refine_level, item_level) {
    /* Padrão para t1 e t2 */
    if (actual_level > refine_level) return item_level;

    if (actual_level === 1)
      return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 18);

    if (actual_level <= 15)
      return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 20);

    return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 25);
  }

  getItemLevel(refine_level) {
    return this.countItemLevelTo(1, refine_level, this.base_item_level);
  }
}
