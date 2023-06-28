import Entity from "./Entity.js";

export default class Platform extends Entity {
  constructor(defaults = {}) {
    const actualData = {
      position: {
        x: 200,
        y: 300,
      },
      width: 200,
      height: 20,
      velocity: {
        x: 0,
        y: 0,
      },
    };
    super({ ...actualData, ...defaults });
  }

  hasColision(velocity, entity) {
    let intersections = this.getIntersections(entity, velocity);

    if (intersections === null) return false;

    let retorno = false;
    intersections.forEach((intersect) => {
      if (velocity > 0 && intersect === "left") {
        retorno = true;
      }
      if (velocity < 0 && intersect === "right") {
        retorno = true;
      }
    });
    return retorno;
  }

  scrollTo(velocity) {
    this.position.x += velocity;
  }

  update() {
    super.update();
  }

  draw(context) {
    context.fillStyle = "blue";
    super.draw(context);
  }
}
