export default class Keyboard {
  constructor(keyDownMapper, keyUpMapper) {
    addEventListener("keydown", ({ key }) => {
      this.listenDownKeys(key);
    });

    addEventListener("keyup", ({ key }) => {
      this.listenUpKeys(key);
    });

    this.keyDownMapper = keyDownMapper;
    this.keyUpMapper = keyUpMapper;

    this.actions = [];
  }

  listenDownKeys(key) {
    if (typeof this.keyDownMapper[key] !== "undefined") {
      let filtered = this.actions.filter((obj) => {
        if ("id" in obj && obj.id === this.keyDownMapper[key].id) return true;

        return false;
      });

      if (filtered.length > 0) return false;

      this.actions.push(this.keyDownMapper[key]);
    }
  }

  removeDownKey(key) {
    let newActions = [];
    if (typeof this.keyDownMapper[key] !== "undefined") {
      this.actions.forEach((action) => {
        if (action.id !== this.keyDownMapper[key].id) newActions.push(action);
      });

      this.actions = newActions;
    }
  }

  removeUpKey(key) {
    if (typeof this.keyUpMapper[key] !== "undefined") {
      let newActions = [];
      this.actions.forEach((action) => {
        if (action.id !== this.keyUpMapper[key].id) newActions.push(action);
      });

      this.actions = newActions;
    }
  }
  
  listenUpKeys(key) {
    if (typeof this.keyUpMapper[key] !== "undefined") {
      this.removeDownKey(key);

      if (typeof this.keyUpMapper[key].run === 'function') this.keyUpMapper[key].run();
    }
  }

  update(entities) {
    this.actions.forEach((action) => {
      action.run(entities);
    });
  }
}
