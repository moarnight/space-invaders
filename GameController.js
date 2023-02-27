class GameController {
  constructor() {
    this.player = this.createPlayer();

    this.playerProjectiles = [];
    this.grids = [];
    this.invaderProjectiles = [];
    this.particles = [];
    this.powerups = [];

    this.keys = {
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      space: {
        pressed: false,
      },
    };
    this.game = {
      over: false,
      active: true,
    };
    this.score = 0;
    this.frames = 0;
    this.randomInterval = Math.floor(Math.random() * 500 + 500);

    this.createStars();

    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);

    this.addListeners();

    this.animate();

    const powerup = new Powerup({
      imageSrc: './img/ammo-pistol-alt 32px.png',
      position: {
        x: 0,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    });

    this.powerups.push(powerup);
  }

  createStars() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(
        new Particle({
          position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
          },
          velocity: {
            x: 0,
            y: 0.3,
          },
          radius: Math.random() * 2,
          color: 'white',
        })
      );
    }
  }

  createPlayer() {
    return new Player({
      imageSrc: './img/spaceship.png',
      position: {
        x: 0,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    });
  }

  createCollisionParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
      this.particles.push(
        new Particle({
          position: {
            x: object.position.x + object.width / 2,
            y: object.position.y + object.height / 2,
          },
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
          radius: Math.random() * 3,
          color: color || 'rgb(188,68,239)',
          fades,
        })
      );
    }
  }

  onKeydown({ key }) {
    if (this.game.over) return;
    switch (key) {
      case 'a':
        // console.log('left');
        this.keys.a.pressed = true;
        break;
      case 'd':
        // console.log('right');
        this.keys.d.pressed = true;
        break;
      case ' ':
        // console.log('space');
        this.playerProjectiles.push(
          new Projectile({
            position: {
              x: this.player.position.x + this.player.width / 2,
              y: this.player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
            color: 'hsl(120, 100%, 50%)',
            shape: 'circle',
          })
        );

        // console.log(projectiles);
        break;
    }
  }

  onKeyup({ key }) {
    switch (key) {
      case 'a':
        console.log('left');
        this.keys.a.pressed = false;
        break;
      case 'd':
        console.log('right');
        this.keys.d.pressed = false;
        break;
      case ' ':
        console.log('space');
        break;
    }
  }

  addListeners() {
    addEventListener('keydown', this.onKeydown);

    addEventListener('keyup', this.onKeyup);
  }

  animate() {
    if (!this.game.active) return;

    requestAnimationFrame(this.animate.bind(this));
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    this.player.update();
    this.particles.forEach((particle, i) => {
      if (particle.position.y - particle.radius >= canvas.height) {
        particle.position.x = Math.random() * canvas.width;
        particle.position.y = -particle.radius;
      }

      if (particle.opacity <= 0) {
        setTimeout(() => {
          this.particles.splice(i, 1);
        }, 0);
      } else {
        particle.update();
      }
    });
    this.invaderProjectiles.forEach((invaderProjectile, index) => {
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
        canvas.height
      ) {
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
        }, 0);
      } else {
        invaderProjectile.update();
      }

      if (
        invaderProjectile.position.y + invaderProjectile.height >=
          this.player.position.y &&
        invaderProjectile.position.x + invaderProjectile.width >=
          this.player.position.x &&
        invaderProjectile.position.x <=
          this.player.position.x + this.player.width
      ) {
        //remove player
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
          this.player.opacity = 0;
          this.game.over = true;
        }, 0);

        setTimeout(() => {
          this.game.active = false;
        }, 2000);
        console.log('u lose');
        this.createCollisionParticles({
          object: this.player,
          color: 'white',
          fades: true,
        });
      }
    });
    this.playerProjectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => {
          this.playerProjectiles.splice(index, 1);
        }, 0);
      } else {
        projectile.update();
      }
    });

    this.powerups.forEach((powerup, index) => {
      powerup.update();
    });

    this.grids.forEach((grid, gridIndex) => {
      grid.update();
      //spawn projectiles
      if (this.frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
          this.invaderProjectiles
        );
      }
      grid.invaders.forEach((invader, i) => {
        invader.update({ velocity: grid.velocity });
        this.playerProjectiles.forEach((projectile, j) => {
          //collision detection
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (targetInvader) => targetInvader === invader
              );
              const projectileFound = this.playerProjectiles.find(
                (targetProjectile) => targetProjectile === projectile
              );

              //remove invader and projectile
              if (invaderFound && projectileFound) {
                this.score += 100;
                scoreEl.innerHTML = this.score;
                this.createCollisionParticles({
                  object: invader,
                  fades: true,
                });
                grid.invaders.splice(i, 1);
                this.playerProjectiles.splice(j, 1);

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0];
                  const lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                } else {
                  this.grids.splice(gridIndex, 1);
                }
              }
            }, 0);
          }
        });
      });
    });

    if (this.keys.a.pressed && this.player.position.x >= 0) {
      this.player.velocity.x = -5;
      this.player.rotation = -0.15;
    } else if (
      this.keys.d.pressed &&
      this.player.position.x + this.player.width <= canvas.width
    ) {
      this.player.velocity.x = 5;
      this.player.rotation = 0.15;
    } else {
      this.player.velocity.x = 0;
      this.player.rotation = 0;
    }

    //spawning enemies
    if (this.frames % this.randomInterval === 0) {
      this.grids.push(new InvaderGrid());
      this.randomInterval = Math.floor(Math.random() * 500 + 500);
      this.frames = 0;
    }
    this.frames += 1;
  }
}
