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
    this.gridCooldown = 0;
    this.powerupCooldown = 0;
    this.invaderShootingCooldown = Math.floor(Math.random() * 3000 + 1500);

    this.createStars();

    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);

    this.addListeners();
    this.elapsedTimeBeforeCurrentAnimate = 0;
    this.animate();
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
            radius: 6,
          })
        );

        // console.log(projectiles);
        break;
    }
  }

  onKeyup({ key }) {
    switch (key) {
      case 'a':
        // console.log('left');
        this.keys.a.pressed = false;
        break;
      case 'd':
        // console.log('right');
        this.keys.d.pressed = false;
        break;
      case ' ':
        // console.log('space');
        break;
    }
  }

  removePowerup(powerups, index) {
    setTimeout(() => {
      this.powerups.splice(index, 1);
    }, 0);
  }

  addListeners() {
    addEventListener('keydown', this.onKeydown);

    addEventListener('keyup', this.onKeyup);
  }

  collisionDetected(object, character) {
    if (object.radius) {
      // projectile -> object, invader -> character
      return (
        object.position.y - object.radius <=
          character.position.y + character.height &&
        object.position.x + object.radius >= character.position.x &&
        object.position.x - object.radius <=
          character.position.x + character.width &&
        object.position.y + object.radius >= character.position.y
      );
    } else {
      return (
        object.position.y + object.height >= character.position.y &&
        object.position.x + object.width >= character.position.x &&
        object.position.x <= character.position.x + character.width &&
        object.position.y <= character.position.y + character.height
      );
    }
  }

  animate(timestamp = 0) {
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

      if (this.collisionDetected(invaderProjectile, this.player)) {
        //remove player
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
          this.player.opacity = 0;
          this.game.over = true;
        }, 0);

        setTimeout(() => {
          this.game.active = false;
        }, 2000);
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

    //splice out the power-up once it goes off screen
    this.powerups.forEach((powerup, index) => {
      if (powerup.position.y + powerup.height >= canvas.height) {
        setTimeout(() => {
          this.powerups.splice(index, 1);
        }, 0);
      } else {
        powerup.update();
      }
    });

    this.grids.forEach((grid, gridIndex) => {
      grid.update();
      //spawn projectiles
      if (this.invaderShootingCooldown <= 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
          this.invaderProjectiles
        );
        this.invaderShootingCooldown = Math.floor(Math.random() * 3000 + 1500);
      }
      grid.invaders.forEach((invader, i) => {
        invader.update({ velocity: grid.velocity });
        this.playerProjectiles.forEach((projectile, j) => {
          //collision detection
          if (this.collisionDetected(projectile, invader)) {
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
    if (this.gridCooldown <= 0) {
      this.grids.push(new InvaderGrid());
      this.gridCooldown = Math.floor(Math.random() * 3000 + 8000);

      // this.frames = 0;
    }

    //spawning power-ups
    if (this.powerupCooldown <= 0) {
      this.powerups.push(
        new Powerup({
          imageSrc: './img/ammo-pistol-alt 32px.png',
          position: {
            x: Math.floor(Math.random() * (canvas.width - 32)),
            y: 0,
          },
          velocity: {
            x: 0,
            y: 2,
          },
        })
      );
      this.powerupCooldown = Math.floor(Math.random() * 3000 + 5000);
    }

    this.powerups.forEach((powerup, index) => {
      // console.log(powerup);
      powerup.update();
      if (
        this.collisionDetected(powerup, this.player) &&
        this.player.level > 3
      ) {
        this.removePowerup(this.powerups, index);
        this.player.level++;
        this.score += 500;
        scoreEl.innerHTML = this.score;
        console.log('+500 to score');
      } else if (
        this.collisionDetected(powerup, this.player) &&
        this.player.level === 3
      ) {
        console.log('level 3');
        this.removePowerup(this.powerups, index);
        this.player.level++;
      } else if (
        this.collisionDetected(powerup, this.player) &&
        this.player.level === 2
      ) {
        console.log('level 2');
        this.removePowerup(this.powerups, index);
        this.player.level++;
      } else if (
        this.collisionDetected(powerup, this.player) &&
        this.player.level === 1
      ) {
        console.log('level 1');
        this.removePowerup(this.powerups, index);
        this.player.level++;
      }
    });

    const frameTime = timestamp - this.elapsedTimeBeforeCurrentAnimate;

    this.gridCooldown -= frameTime;
    this.powerupCooldown -= frameTime;
    this.invaderShootingCooldown -= frameTime;

    this.elapsedTimeBeforeCurrentAnimate = timestamp;
    // console.log(this.powerups);
  }
}
