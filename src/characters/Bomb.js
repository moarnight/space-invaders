class Bomb extends Character {
  constructor(cfg) {
    super(cfg);
    this.isBomb = true;
    this.gridPosition = cfg.gridPosition;
    this.matrixIndex = cfg.matrixIndex;
  }
  createImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const widthScale = 0.625;
      const heightScale = 0.875;
      this.image = image;
      this.width = image.width * widthScale;
      this.height = image.height * heightScale;
    };
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x = this.gridPosition.x + this.matrixIndex.x * this.width;
      this.position.y = this.gridPosition.y + this.matrixIndex.y * this.height;
    }
  }
}
