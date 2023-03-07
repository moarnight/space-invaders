class Invader extends Character {
  constructor(cfg) {
    super(cfg);
    this.canShoot = true;
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
}
