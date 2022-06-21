import Tiers from "./Tiers.js";

export default class T3 extends Tiers {
  constructor() {
    super("T3", 3, 1340);
  }

  setItemType(item_type) {
    this.item_type = item_type;
    this.base_item_level = item_type === "0" ? 1302 : 1340;
    return this;
  }

  countLegendaryItemLevelTo(actual_level, refine_level, item_level) {
    if (actual_level > refine_level) return item_level;

    if (actual_level <= 15)
      return this.countLegendaryItemLevelTo(
        actual_level + 1,
        refine_level,
        item_level + 5
      );

    return this.countLegendaryItemLevelTo(
      actual_level + 1,
      refine_level,
      item_level + 15
    );
  }

  countItemLevelTo(actual_level, refine_level, item_level) {
    // Equipamento lendário
    if (this.item_type == 1)
      return this.countLegendaryItemLevelTo(actual_level, refine_level, item_level);

    /* Equipamento raro / épico */
    if (actual_level > refine_level) return item_level;

    if (actual_level === 1)
      return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 2);

    if (actual_level <= 3)
      return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 3);

    return this.countItemLevelTo(actual_level + 1, refine_level, item_level + 5);
  }
}
