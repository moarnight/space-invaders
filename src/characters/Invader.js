class Invader extends Character {
  constructor(cfg) {
    super(cfg);
    this.canShoot = true;
    this.gridPosition = cfg.gridPosition;
    this.matrixIndex = cfg.matrixIndex;
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new Projectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
        color: 'purple',
        width: 3,
        height: 10,
      })
    );
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x = this.gridPosition.x + this.matrixIndex.x * this.width;
      this.position.y = this.gridPosition.y + this.matrixIndex.y * this.height;
    }
  }
}
