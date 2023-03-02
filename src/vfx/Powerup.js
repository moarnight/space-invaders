class Powerup {
  constructor(cfg) {
    this.velocity = cfg.velocity;
    this.position = cfg.position;
    this.level = 1;
    this.createImage(cfg.imageSrc);
  }

  createImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.position.y -= this.height;
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}
