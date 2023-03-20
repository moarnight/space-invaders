class InvaderGrid {
  constructor(hasBomb) {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.INVADER_WIDTH = 20;
    this.INVADER_HEIGHT = 28;

    this.invaders = [];

    this.shootingCooldown = Math.floor(Math.random() * 3000 + 1500);

    const columns = Math.floor(Math.random() * 6 + 4);
    const rows = Math.floor(Math.random() * 4 + 2);
    this.width = columns * this.INVADER_WIDTH;
    const desiredIndexForBomb = Math.floor(Math.random() * (columns * rows));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let invader;
        // if desiredIndexForBomb === this.invaders.length create bomb, if not, create invader
        if (hasBomb && desiredIndexForBomb === this.invaders.length) {
          invader = new Bomb({
            position: {
              x: x * this.INVADER_WIDTH,
              y: y * this.INVADER_HEIGHT,
            },
            matrixIndex: {
              x,
              y,
            },
            gridPosition: this.position,
            imageSrc: './img/gift_01c.png',
          });
        } else {
          invader = new Invader({
            position: {
              x: x * this.INVADER_WIDTH,
              y: y * this.INVADER_HEIGHT,
            },
            matrixIndex: {
              x,
              y,
            },
            gridPosition: this.position,
            imageSrc: './img/SkeletonFlamingSkull.png',
          });
        }

        this.invaders.push(invader);

        if (!this.leftmostInvader) {
          this.leftmostInvader = invader;
        }
      }
    }
  }

  update(frameTime) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const padding = 10;
    this.velocity.y = 0;

    if (!this.invaders.length) {
      return;
    }

    if (
      this.leftmostInvader.position.x + this.width > canvas.width ||
      this.leftmostInvader.position.x < 0
    ) {
      this.velocity.x = -this.velocity.x;

      //prevents grid from being stuck in the periphery of the screen
      this.position.x +=
        this.velocity.x * 2 + padding * Math.sign(this.velocity.x);

      this.velocity.y = this.INVADER_HEIGHT;
    }
    if (this.shootingCooldown > 0) {
      this.shootingCooldown -= frameTime;
    }
  }

  findNeighboringElements(bomb) {
    const toBeDestroyed = [];

    const bombY = bomb.matrixIndex.y;
    const bombX = bomb.matrixIndex.x;

    this.invaders.forEach((invader) => {
      if (
        invader.matrixIndex.y >= bombY - 1 &&
        invader.matrixIndex.y <= bombY + 1 &&
        invader.matrixIndex.x >= bombX - 1 &&
        invader.matrixIndex.x <= bombX + 1
      ) {
        toBeDestroyed.push(invader);
      }
    });

    return toBeDestroyed;
  }

  removeInvader(invader) {
    this.invaders = this.invaders.filter((i) => i !== invader);
  }
}
