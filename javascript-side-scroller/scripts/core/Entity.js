import defaultEntityProperties from "./utils/DefaultEntityProperties.js";

export default class Entity {
  constructor(properties = {}) {
    this.jumping = false;
    let defaultProps = defaultEntityProperties();
    let values = { ...defaultProps, ...properties };
    for (let key in values) {
      this[key] = values[key];
    }
  }

  //===================================================================================================
  //UPDATE DE POSIÇÕES
  //POSIÇÃO X
  updateX() {
    this.position.x += this.velocity.x;
  }

  horizontalColision(direction, entity) {
    if (direction === "left") {
      if (this.velocity.x <= 0) return true;
      this.velocity.x = 0;
      this.position.x = entity.position.x - this.width;
      return true;
    }

    if (this.velocity.x >= 0) return true;
    this.velocity.x = 0;
    this.position.x = entity.position.x + entity.width;
  }

  verticalColision(direction, entity) {
    if (direction === "top") {
      if (this.velocity.y <= 0) return true;
      this.jumping = false;
      this.velocity.y = 0;
      this.position.y = entity.position.y - this.height;
      return true;
    }

    if (this.velocity.y >= 0) return true;
    this.velocity.y = 0;
    this.position.y = entity.position.y + entity.height;
  }

  colision(entities, direction) {
    let hasColision = false;
    entities.forEach((entity, index) => {
      let intersections =
        direction === "horizontal"
          ? this.getIntersections(entity, this.velocity.x)
          : this.getIntersections(entity, 0, this.velocity.y);

      if (intersections === null) return false;

      intersections.forEach((intersect) => {
        if (direction === "horizontal") {
          if (intersect !== "left" && intersect !== "right") return;
          this.horizontalColision(intersect, entity);
          hasColision = true;
        } else {
          if (intersect !== "top" && intersect !== "bottom") return;
          this.verticalColision(intersect, entity);
          hasColision = true;
        }
      });
    });
    return hasColision;
  }

  updatePositionXPositive(bounds, entities) {
    if (this.colision(entities, "horizontal")) return true;
    if (bounds.x.right === null) return this.updateX();

    if (this.position.x + this.width + this.velocity.x >= bounds.x.right) {
      this.velocity.x = 0;
      this.position.x = bounds.x.right - this.width;
      return true;
    }

    return this.updateX();
  }

  updatePositionXNegative(bounds, entities) {
    if (this.colision(entities, "horizontal")) return true;

    if (bounds.x.left === null) return this.updateX();

    if (this.position.x + this.velocity.x <= bounds.x.left) {
      this.velocity.x = 0;
      this.position.x = bounds.x.left;
      return true;
    }

    return this.updateX();
  }

  updatePositionX(bounds, entities) {
    if (this.velocity.x > 0)
      return this.updatePositionXPositive(bounds, entities);

    return this.updatePositionXNegative(bounds, entities);
  }

  //POSIÇÃO Y
  updateY() {
    this.position.y += this.velocity.y;
  }

  updatePositionYPositive(bounds, entities) {
    if (this.colision(entities, "vertical")) return true;

    if (bounds.y.bottom === null) return this.updateY();

    if (this.position.y + this.height + this.velocity.y >= bounds.y.bottom) {
      this.velocity.y = 0;
      this.jumping = false;
      this.position.y = bounds.y.bottom - this.height;
      return true;
    }

    return this.updateY();
  }

  updatePositionYNegative(bounds, entities) {
    if (this.colision(entities, "vertical")) return true;

    if (bounds.y.top === null) return this.updateY();

    if (this.position.y + this.velocity.y <= bounds.y.top) {
      this.velocity.y = 0;
      this.jumping = false;
      this.position.y = bounds.y.top;
      return true;
    }

    return this.updateY();
  }

  updatePositionY(bounds, entities) {
    if (this.velocity.y > 0)
      return this.updatePositionYPositive(bounds, entities);

    return this.updatePositionYNegative(bounds, entities);
  }
  //FIM DO UPDATE DE POSIÇÕES
  //===================================================================================================

  //intersecção de entidades
  intersects(entity, velX = 0, velY = 0) {
    return (
      this.position.y + velY < entity.position.y + entity.height &&
      this.position.y + this.height + velY > entity.position.y &&
      this.position.x + velX < entity.position.x + entity.width &&
      this.position.x + this.width + velX > entity.position.x
    );
  }

  //intersecção de entidades
  intersectsLeft(entity, velX = 0) {
    return (
      this.position.x + this.width + velX > entity.position.x &&
      this.position.x < entity.position.x
    );
  }

  //intersecção de entidades
  intersectsRight(entity, velX = 0) {
    return (
      this.position.x + velX < entity.position.x + entity.width &&
      this.position.x + this.width > entity.position.x + entity.width
    );
  }

  //intersecção de entidades
  intersectsTop(entity, velY = 0) {
    return (
      this.position.y + this.height + velY > entity.position.y &&
      this.position.y < entity.position.y
    );
  }

  //intersecção de entidades
  intersectsBottom(entity, velY = 0) {
    return (
      this.position.y + velY < entity.position.y + entity.height &&
      this.position.y + this.height > entity.position.y
    );
  }

  getIntersections(entity, velX = 0, velY = 0) {
    if (!this.intersects(entity, velX, velY)) return null;

    let intersections = [];
    if (this.intersectsLeft(entity, velX)) intersections.push("left");
    if (this.intersectsRight(entity, velX)) intersections.push("right");
    if (this.intersectsBottom(entity, velY)) intersections.push("bottom");
    if (this.intersectsTop(entity, velY)) intersections.push("top");
    

    return intersections.length > 0 ? intersections : null;
  }

  update(gravity = 0, bounds = null, platforms) {
    this.velocity.y += gravity;
    if (bounds === null) return true;

    if (this.velocity.x === 0 && this.velocity.y === 0) return true;

    if (this.velocity.x !== 0) this.updatePositionX(bounds, platforms);
    if (this.velocity.y !== 0) this.updatePositionY(bounds, platforms);
  }

  draw(context) {
    if (this.sprite !== null) {
      context.drawImage(this.sprite, this.position.x, this.position.y);
      return;
    }
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
