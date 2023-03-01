class Projectile {
  constructor({ position, velocity, color, width, height, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.draw = radius ? this.drawCircle : this.drawRectangle;
  }

  drawCircle() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  drawRectangle() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
