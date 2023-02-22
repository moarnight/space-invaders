class Projectile {
  constructor({ position, velocity, color, shape }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.shape = shape;
    this.width = 3;
    this.height = 10;
    this.radius = 4;
  }

  draw() {
    c.beginPath();
    //since there's no circle method in canvas, arc is the next best thing
    this.shape === 'circle'
      ? c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      : c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
