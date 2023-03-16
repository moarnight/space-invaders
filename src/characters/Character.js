class Character {
  constructor(cfg) {
    this.velocity = cfg.velocity;
    this.position = cfg.position;
    this.createImage(cfg.imageSrc);
  }

  createImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
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

  setVelocity({ x, y }) {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  update({ velocity }) {
    if (this.image) {
      this.velocity = velocity;
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}
