export class Background {
  constructor(game) {
    this.game = game;
    this.bgY1 = 0;
    this.bgY2 = -game.canvas.height;
    this.starY1 = 0;
    this.starY2 = -game.canvas.height;
    this.bgSpeed = 50; // pixels per sec
    this.starSpeed = 150; // pixels per sec
  }

  update(deltaTime) {
    this.bgY1 += this.bgSpeed * (deltaTime / 1000);
    this.bgY2 += this.bgSpeed * (deltaTime / 1000);
    
    if (this.bgY1 >= this.game.canvas.height) this.bgY1 = -this.game.canvas.height + this.bgY2;
    if (this.bgY2 >= this.game.canvas.height) this.bgY2 = -this.game.canvas.height + this.bgY1;

    this.starY1 += this.starSpeed * (deltaTime / 1000);
    this.starY2 += this.starSpeed * (deltaTime / 1000);

    if (this.starY1 >= this.game.canvas.height) this.starY1 = -this.game.canvas.height + this.starY2;
    if (this.starY2 >= this.game.canvas.height) this.starY2 = -this.game.canvas.height + this.starY1;
  }

  draw(ctx) {
    const bgImg = this.game.assets.getImage('bg_standard');
    const starImg = this.game.assets.getImage('bg_stars');

    if (bgImg) {
      // Background layer
      ctx.drawImage(bgImg, 0, Math.floor(this.bgY1), this.game.canvas.width, this.game.canvas.height);
      ctx.drawImage(bgImg, 0, Math.floor(this.bgY2), this.game.canvas.width, this.game.canvas.height);
    } else {
      ctx.fillStyle = '#0A0A12';
      ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    if (starImg) {
      // Star overlay layer for parallax
      ctx.drawImage(starImg, 0, Math.floor(this.starY1), this.game.canvas.width, this.game.canvas.height);
      ctx.drawImage(starImg, 0, Math.floor(this.starY2), this.game.canvas.width, this.game.canvas.height);
    }
  }
}
