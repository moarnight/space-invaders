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

    // flat array of matrix to avoid triple loop for collision detection
    this.invaders = [];

    this.shootingCooldown = Math.floor(Math.random() * 3000 + 1500);

    const columns = Math.floor(Math.random() * 6 + 4);
    const rows = Math.floor(Math.random() * 4 + 2);
    this.width = columns * this.INVADER_WIDTH;
    const desiredIndexForBomb = Math.floor(Math.random() * (columns * rows));

    this.matrix = [];

    for (let y = 0; y < rows; y++) {
      const tempArr = [];
      this.matrix.push(tempArr);
      for (let x = 0; x < columns; x++) {
        // if desiredIndexForBomb === this.invaders.length create bomb, if not, create invader
        if (hasBomb && desiredIndexForBomb === this.invaders.length) {
          const invader = new Bomb({
            position: {
              x: x * this.INVADER_WIDTH,
              y: y * this.INVADER_HEIGHT,
            },
            // velocity: this.velocity,
            matrixIndex: {
              x,
              y,
            },
            gridPosition: this.position,
            imageSrc: './img/gift_01c.png',
          });
          tempArr.push(invader);
          this.invaders.push(invader);
        } else {
          const invader = new Invader({
            position: {
              x: x * this.INVADER_WIDTH,
              y: y * this.INVADER_HEIGHT,
            },
            // velocity: this.velocity,
            matrixIndex: {
              x,
              y,
            },
            gridPosition: this.position,
            imageSrc: './img/SkeletonFlamingSkull.png',
          });
          tempArr.push(invader);
          this.invaders.push(invader);
        }
      }
    }

    // console.log(this.matrix);

    // for (let x = 0; x < columns; x++) {
    //   for (let y = 0; y < rows; y++) {
    //     this.invaders.push(
    //       new Invader({
    //         position: {
    //           x: x * 28,
    //           y: y * 28,
    //         },
    //         velocity: this.velocity,
    //         imageSrc: './img/SkeletonFlamingSkull.png',
    //       })
    //     );
    //   }
    // }
  }

  update(frameTime) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    const padding = 10;

    this.velocity.y = 0;

    const leftmostInvaderX = this.matrix[0][0].position.x;

    if (leftmostInvaderX + this.width > canvas.width || leftmostInvaderX < 0) {
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

  getInvaderRowInMatrix(invader) {
    return this.matrix.find((row) => row.includes(invader));
  }

  findNeighboringElements(bomb) {
    const toBeDestroyed = [];
    const bombRow = this.getInvaderRowInMatrix(bomb);
    const bombY = this.matrix.indexOf(bombRow);
    const bombX = bombRow.indexOf(bomb);

    for (let y = bombY - 1; y <= bombY + 1; y++) {
      for (let x = bombX - 1; x <= bombX + 1; x++) {
        const invaderFromMatrix = this.getInvaderFromMatrix(y, x);
        if (invaderFromMatrix) {
          toBeDestroyed.push(invaderFromMatrix);
        }
      }
    }

    // console.log(toBeDestroyed);
    return toBeDestroyed;

    //if nearby el exists, add it to neighboringElementsAndBombArr
    // if (this.matrix[y - 1] && this.matrix[y - 1][x + 1]) {
    //   neighboringElementsAndBombArr.push(this.matrix[y - 1][x + 1]);
    // }
  }

  getInvaderFromMatrix(y, x) {
    if (this.matrix[y] && this.matrix[y][x]) {
      return this.matrix[y][x];
    }
  }

  removeInvader(invader) {
    this.invaders = this.invaders.filter((i) => i !== invader);
    const row = this.getInvaderRowInMatrix(invader);

    this.matrix[this.matrix.indexOf(row)] = row.filter((i) => i !== invader);
  }
}
