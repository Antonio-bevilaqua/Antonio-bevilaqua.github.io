import Entity from "./Entity.js";
import Keyboard from "./Keyboard.js";

export default class Player extends Entity {
  constructor(defaults = {}, scroll) {
    const actualData = {
      position: {
        x: 100,
        y: 440,
      },
      width: 50,
      height: 180,
      velocity: {
        x: 0,
        y: 0,
      },
    };
    super({ ...actualData, ...defaults });
    this.setupKeyboard();
    this.scroll = scroll;
  }

  keyPressActions() {
    return {
      a: {
        id: 1,
        run: this.moveLeft.bind(this),
      },
      d: {
        id: 2,
        run: this.moveRight.bind(this),
      },
      w: {
        id: 3,
        run: this.jump.bind(this),
      },
      s: {
        id: 4,
        run: this.crawl.bind(this),
      },
    };
  }

  keyUpActions() {
    return {
      a: {
        id: 5,
        run: this.stopMoveHorizontal.bind(this),
      },
      d: {
        id: 6,
        run: this.stopMoveHorizontal.bind(this),
      },
      w: {
        id: 7,
        run: null,
      },
      s: {
        id: 8,
        run: this.stopCrawl.bind(this),
      },
    };
  }
  setupKeyboard() {
    this.keyboard = new Keyboard(this.keyPressActions(), this.keyUpActions());
  }

  moveLeft() {
    if (this.position.x > 100) {
      this.velocity.x = -10;
      return;
    }

    this.scroll(-10);
    this.velocity.x = 0;
  }

  moveRight() {
    if (this.position.x < 400) {
      this.velocity.x = 10;
      return;
    }

    this.scroll(10);
    this.velocity.x = 0;
  }

  jump() {
    if (!this.jumping) {
      this.velocity.y = -21;
      this.jumping = true;
    }
  }
  crawl() {
    console.log("crawl");
  }

  stopMoveHorizontal() {
    this.velocity.x = 0;
  }
  stopJump() {
    console.log("");
  }

  stopCrawl() {
    console.log("crawl");
  }

  update(gravity, bounds, platforms) {
    this.bounds = bounds;
    this.keyboard.update(platforms);
    super.update(gravity, bounds, platforms);
  }

  draw(context) {
    context.fillStyle = "red";
    super.draw(context);
  }
}
