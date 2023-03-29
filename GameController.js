class GameController {
  constructor(onEndgame) {
    this.player = this.createPlayer();

    this.playerProjectiles = [];
    this.grids = [];
    this.invaderProjectiles = [];
    this.particles = [];
    this.powerups = [];
    this.onEndgame = onEndgame;

    this.BOTTOM_BORDER = canvas.height - 40;
    this.MAX_PLAYER_LVL = 3;
    //Cooldowns:
    this.GRID_COOLDOWN = Math.floor(Math.random() * 3000 + 8000);
    this.POWERUP_COOLDOWN = Math.floor(Math.random() * 3000 + 5000);
    this.INVADER_GRID_SHOOTING_COOLDOWN = Math.floor(
      Math.random() * 3000 + 1500
    );

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
    this.gridsGenerated = 0;

    this.createStars();

    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);

    this.addListeners();
    this.elapsedTimeBeforeCurrentAnimate = 0;
    this.update();
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

    if (key === 'a') {
      this.keys.a.pressed = true;
    } else if (key === 'd') {
      this.keys.d.pressed = true;
    } else if (key === ' ') {
      if (this.player.shootingCooldown <= 0) {
        this.player.shootingCooldown = this.player.COOLDOWN;

        const projectilePositions = {
          1: [
            {
              x: this.player.position.x + this.player.width / 2,
              y: this.player.position.y,
            },
          ],
          2: [
            {
              x: this.player.position.x,
              y: this.player.position.y,
            },
            {
              x: this.player.position.x + this.player.width,
              y: this.player.position.y,
            },
          ],
          3: [
            {
              x: this.player.position.x,
              y: this.player.position.y,
            },
            {
              x: this.player.position.x + this.player.width / 2,
              y: this.player.position.y,
            },
            {
              x: this.player.position.x + this.player.width,
              y: this.player.position.y,
            },
          ],
        };

        //
        for (let i = 0; i < this.player.level; i++) {
          this.playerProjectiles.push(
            new Projectile({
              position: projectilePositions[this.player.level][i],
              velocity: {
                x: 0,
                y: -10,
              },
              color: 'hsl(120, 100%, 50%)',
              radius: 6,
            })
          );
        }
      }
    }
  }

  movePlayer() {
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
  }

  onKeyup({ key }) {
    switch (key) {
      case 'a':
        this.keys.a.pressed = false;
        break;
      case 'd':
        this.keys.d.pressed = false;
        break;
      case ' ':
        break;
    }
  }

  removePowerup(powerup) {
    setTimeout(() => {
      this.powerups = this.powerups.filter((p) => p !== powerup);
    }, 0);
  }

  addListeners() {
    addEventListener('keydown', this.onKeydown);
    addEventListener('keyup', this.onKeyup);
  }

  removeListeners() {
    removeEventListener('keydown', this.onKeydown);
    removeEventListener('keyup', this.onKeyup);
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

  endGame() {
    this.removeListeners();
    this.game.active = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
    bg.draw();
    cancelAnimationFrame(this.frameRequest);
    localStorage.setItem('highScore', this.score);
    this.onEndgame();
  }

  levelUpPlayer() {
    if (this.player.level >= this.MAX_PLAYER_LVL) {
      this.score += 500;
      score.innerText = this.score;
    } else {
      this.player.level++;
    }
  }

  spawnInvaderGrid() {
    const hasBomb = this.gridsGenerated % 3 === 0;
    this.grids.push(new InvaderGrid(hasBomb));
    this.gridsGenerated += 1;
  }

  spawnPowerUp() {
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
  }

  update(timestamp = 0) {
    if (!this.game.active) return;

    //to avoid huge timestamp on start, this runs on the second animate call
    if (this.firstAnimationCycle) {
      this.firstAnimationCycle = false;
      this.elapsedTimeBeforeCurrentAnimate = timestamp;
    }

    if (!this.frameRequest) {
      this.firstAnimationCycle = true;
    }

    this.frameRequest = requestAnimationFrame(this.update.bind(this));

    const frameTime = timestamp - this.elapsedTimeBeforeCurrentAnimate;

    bg.draw();

    this.player.update(frameTime);

    this.updateParticles();

    this.invaderProjectiles.forEach((invaderProjectile, index) => {
      invaderProjectile.update();
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
        canvas.height
      ) {
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
        }, 0);
      }

      if (this.collisionDetected(invaderProjectile, this.player)) {
        //remove player
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
          this.player.opacity = 0;
          this.game.over = true;
        }, 0);

        setTimeout(() => {
          this.endGame();
        }, 2000);
        this.createCollisionParticles({
          object: this.player,
          color: 'white',
          fades: true,
        });
      }
    });

    // Clear projectiles that go off-screen
    this.playerProjectiles = this.playerProjectiles.filter(
      (projectile) => projectile.position.y + projectile.radius > 0
    );

    this.playerProjectiles.forEach((projectile) => {
      projectile.update();
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

    this.grids.forEach((grid) => {
      grid.update(frameTime);
      //spawn projectiles
      if (grid.shootingCooldown <= 0 && grid.invaders.length > 0) {
        const shootingInvaders = grid.invaders.filter(
          (invader) => invader.canShoot
        );

        if (shootingInvaders.length) {
          shootingInvaders[
            Math.floor(Math.random() * shootingInvaders.length)
          ].shoot(this.invaderProjectiles);
          grid.shootingCooldown = this.INVADER_GRID_SHOOTING_COOLDOWN;
        }
      }

      grid.invaders.forEach((invader) => {
        invader.update();
        if (this.invaderReachedBottom(invader)) {
          this.endGame();
        }
        this.playerProjectiles.forEach((projectile, j) => {
          //collision detection
          if (this.collisionDetected(projectile, invader)) {
            this.playerProjectiles = this.playerProjectiles.filter((p) => {
              return p !== projectile;
            });

            projectile.update();

            if (invader.isBomb) {
              const toBeDestroyed = grid.findNeighboringElements(invader);

              toBeDestroyed.forEach((el) => {
                this.destroyInvader(el, grid);
              });
            } else {
              this.destroyInvader(invader, grid);
            }
          }
        });
      });
    });
    this.movePlayer();

    this.gridCooldown -= frameTime;
    this.powerupCooldown -= frameTime;

    //spawning enemies
    if (this.gridCooldown <= 0) {
      this.spawnInvaderGrid();
      this.gridCooldown = this.GRID_COOLDOWN;
    }

    //spawning power-ups
    if (this.powerupCooldown <= 0) {
      this.spawnPowerUp();
      this.powerupCooldown = this.POWERUP_COOLDOWN;
    }

    this.powerups.forEach((powerup) => {
      powerup.update();
      if (this.collisionDetected(powerup, this.player)) {
        this.levelUpPlayer();
        this.removePowerup(powerup);
      }
    });

    this.elapsedTimeBeforeCurrentAnimate = timestamp;
  }

  invaderReachedBottom(invader) {
    if (invader.position.y >= this.BOTTOM_BORDER) {
      return true;
    }
  }

  updateParticles() {
    this.particles.forEach((particle, i) => {
      //If stars go out of the screen, push them back with randomized postion
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
  }

  destroyInvader(invader, grid) {
    this.score += 100;
    score.innerText = this.score;
    this.createCollisionParticles({
      object: invader,
      fades: true,
    });

    grid.removeInvader(invader);

    if (grid.invaders.length > 0) {
      let leftmostInvaderX = canvas.width;
      let rightmostInvaderX = 0;

      let leftmostInvader;

      grid.invaders.forEach((invader) => {
        if (!leftmostInvader) {
          leftmostInvader = invader;
        }
        if (invader.position.x < leftmostInvaderX) {
          leftmostInvaderX = invader.position.x;
          leftmostInvader = invader;
        }
        if (invader.position.x > rightmostInvaderX) {
          rightmostInvaderX = invader.position.x;
        }
      });

      grid.width = rightmostInvaderX + grid.INVADER_WIDTH - leftmostInvaderX;
      grid.leftmostInvader = leftmostInvader;
    } else {
      this.grids = this.grids.filter((g) => g !== grid);
    }
  }
}
