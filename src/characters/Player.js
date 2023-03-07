class Player extends Character {
  constructor(cfg) {
    super(cfg);

    this.COOLDOWN = 150;

    this.rotation = 0;
    this.opacity = 1;
    this.level = 1;
    this.shootingCooldown = this.COOLDOWN;
  }

  createImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);

    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update(frameTime) {
    if (this.image) {
      this.draw();
      if (this.shootingCooldown > 0) {
        this.shootingCooldown -= frameTime;
      }
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

// const newPlayer = new Player({
//   imageSrc: './img/spaceship.png',
//   position: {
//     x: canvas.width / 2 - this.width / 2,
//     y: canvas.height - this.height - 20,
//   },
