class Bomb extends Character {
  constructor(cfg) {
    super(cfg);
    this.isBomb = true;
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
}
