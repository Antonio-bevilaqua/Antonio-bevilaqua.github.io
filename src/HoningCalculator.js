import Item from "./core/Item.js";

export default class HoningCalculator {
  constructor() {
    this.container = "#conteudo";
    this.masterContainer = "#geral";
    this.labels = ["Capacete", "Ombreira", "Armadura", "Calça", "Luva", "Arma"];
    this.items = [];
    this.item_level = 1370;
    this.__setItems();
    this.__setItemLevelContainer();
    this.__setGeral();
    this.__update();
  }

  __setItems() {
    this.labels.forEach((label) => {
      this.items.push(
        new Item(this.container, label, this.__resolveIlvl.bind(this))
      );
    });
  }

  __setGeral() {
    this.geral = new Item(
      this.masterContainer,
      "",
      this.__generalChange.bind(this)
    );
    document.querySelector(this.masterContainer).innerHTML += `
      <div class="alert alert-info mt-3 pt-1 pb-1">  
      <small>Mudanças aqui alteram todos os valores dos equipamentos abaixo</small>
    </div>
    `;
  }

  __setItemLevelContainer() {
    document.querySelector(this.container).innerHTML += `<div class="result">
      <label>Item Level:</label>
      <b id="ilvl"></b>
    </div>`;
  }

  __update() {
    let str = this.item_level.toString();
    if (!str.includes('.')) return document.getElementById("ilvl").innerText = this.item_level;
    
    let parts = str.split('.');
    let writter = this.item_level;
    if (parts[1].length > 2) writter = writter.toFixed(2);
    
    return document.getElementById("ilvl").innerText = writter;
  }

  __resolveIlvl() {
    let sum = 0;
    this.items.forEach((item) => {
      sum += item.getItemLevel();
    });

    this.item_level = sum > 0 ? sum / this.items.length : 0;
    this.__update();
  }

  __generalChange(value, change_type, val_changed) {
    this.items.forEach((item) => {
      if (change_type === "tier") {
        item.setTier(val_changed);
      }

      if (change_type === "type") {
        item.setType(val_changed);
      }

      if (change_type === "refine") {
        item.setHoning(val_changed);
      }
    });
  }

  setup() {
    this.items.forEach((item) => {
      item.setup();
    });
    this.geral.setup();
  }
}

window.onload = () => {
  const calculator = new HoningCalculator();
  calculator.setup();
};
