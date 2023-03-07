class InvaderGrid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    // flat array of matrix to avoid triple loop for collision detection
    this.invaders = [];

    const columns = Math.floor(Math.random() * 6 + 4);
    const rows = Math.floor(Math.random() * 4 + 2);
    this.width = columns * 28;

    this.matrix = [];

    for (let y = 0; y < rows; y++) {
      const tempArr = [];
      this.matrix.push(tempArr);
      for (let x = 0; x < columns; x++) {
        // if desiredIndexForBomb === this.invaders.length create bomb, if not, create invader
        const invader = new Invader({
          position: {
            x: x * 28,
            y: y * 28,
          },
          velocity: this.velocity,
          imageSrc: './img/SkeletonFlamingSkull.png',
        });
        tempArr.push(invader);
        this.invaders.push(invader);
      }
    }

    console.log(this.matrix);

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

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 28;
    }
  }

  getInvaderRowInMatrix(invader) {
    return this.matrix.find((row) => row.includes(invader));
  }

  removeInvader(invader) {
    this.invaders.splice(this.invaders.indexOf(invader), 1);
    console.log(invader);
    const row = this.getInvaderRowInMatrix(invader);
    console.log(row);

    row.splice(row.indexOf(invader), 1);

    // console.log(this.matrix);
  }
}
