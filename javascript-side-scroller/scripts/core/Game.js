import Platform from "./Platform.js";
import Player from "./Player.js";
import { random } from "./Helpers.js";

class Game {
  constructor(element) {
    this.gravity = 0.5;
    this.canvas = element;
    this.background = document.getElementById('background');
    this.bgWidth = this.background.naturalWidth;
    this.bgHeight = this.background.naturalHeight;
    this.bgPosition = {
      x: 0,
      y: 800 - this.bgHeight
    }
    this.canvas.width = innerWidth; //tamanho X total da tela
    this.canvas.height = 800; //tamanho Y total da tela
    this.rootBounds = {
      x: {
        left: 0,
        right: null,
      },
      y: {
        top: null,
        bottom: 700,
      },
    };

    this.bounds = { ...this.rootBounds };

    this.context = this.canvas.getContext("2d");
    this.player = new Player(this.gravity, this.scroll.bind(this));

    this.generatePlatforms();
  }

  generatePlatforms() {
    let totalPlatforms = random(300, 500);
    let lastX = 100;
    this.platforms = [];
    for (let i = 0; i < totalPlatforms; i++) {
      let id = `casa${random(1, 13)}`;
      let img = document.getElementById(id);
      let imgWidth = img.naturalWidth;
      let imgHeight = img.naturalHeight;
      let posY = 700 - imgHeight;
      let posX = random(lastX + 0, lastX + 900);
      let position = { x: posX, y: posY };
      lastX = imgWidth + posX;

      this.platforms.push(
        new Platform({
          position: position,
          width: imgWidth,
          height: imgHeight,
          sprite: img
        })
      );
    }
  }

  checkGreaterBound(axis, type, value) {
    if (this.bounds[axis][type] === null) {
      this.bounds[axis][type] = value;
      return true;
    }

    if (this.bounds[axis][type] < value) {
      this.bounds[axis][type] = value;
    }
  }

  checkLowerBound(axis, type, value) {
    if (this.bounds[axis][type] === null) {
      this.bounds[axis][type] = value;
      return true;
    }

    if (this.bounds[axis][type] > value) {
      this.bounds[axis][type] = value;
    }
  }

  platformColision(platform) {
    this.bounds = { ...this.rootBounds };
    //plataforma abaixo do jogador
    if (
      this.player.position.x + this.player.width >= platform.position.x &&
      this.player.position.x <= platform.position.x + platform.width &&
      this.player.position.y <= platform.position.y
    ) {
      this.checkLowerBound("y", "bottom", platform.position.y);
    }

    //plataforma acima do jogador
    if (
      this.player.position.x + this.player.width >= platform.position.x &&
      this.player.position.x <= platform.position.x + platform.width &&
      this.player.position.y >= platform.position.y + platform.height
    ) {
      this.checkGreaterBound("y", "top", platform.position.y + platform.height);
    }
  }

  //===================================================================================================
  //UPDATE DE POSIÇÕES
  //POSIÇÃO X
  updateX() {
    this.position.x += this.velocity.x;
  }

  updatePositionXPositive(bounds) {
    if (bounds.x.right === null) return this.updateX();

    if (this.position.x + this.width + this.velocity.x >= bounds.x.right) {
      this.velocity.x = 0;
      this.position.x = bounds.x.right - this.width;
      return true;
    }

    return this.updateX();
  }

  updatePositionXNegative(bounds) {
    if (bounds.x.left === null) return this.updateX();

    if (this.position.x + this.velocity.x <= bounds.x.left) {
      this.velocity.x = 0;
      this.position.x = bounds.x.left;
      return true;
    }

    return this.updateX();
  }

  updatePositionX(bounds) {
    if (this.velocity.x === 0) return;

    if (this.velocity.x > 0) return this.updatePositionXPositive(bounds);

    return this.updatePositionXNegative(bounds);
  }

  //FIM DO UPDATE DE POSIÇÕES
  //===================================================================================================

  scroll(velocity) {
    let hasColision = false;
    this.platforms.forEach((platform, index) => {
      if (platform.hasColision(-velocity, this.player)) hasColision = true;
    });

    if (hasColision) return true;

    this.platforms.forEach((platform, index) => {
      this.platforms[index].scrollTo(-velocity);
    });
  }

  update() {
    //limpa o quadro anterior
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //chama o update do jogador
    this.player.update(this.gravity, this.rootBounds, this.platforms);

    //chama a função de desenho
    this.draw();
  }

  draw() {
    this.context.drawImage(this.background, this.bgPosition.x, this.bgPosition.y);
    this.player.draw(this.context);
    this.platforms.forEach((platform) => {
      platform.draw(this.context);
    });
  }
}

export default Game;
