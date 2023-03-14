class Background {
  constructor() {
    this.createImage();
  }

  createImage() {
    const image = new Image();
    image.src = './img/SpaceBackgroundNoStars.png';
    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.draw();
    };
  }

  draw() {
    if (!this.image) return;
    c.drawImage(this.image, 0, 0, this.width, this.height);
  }
}
