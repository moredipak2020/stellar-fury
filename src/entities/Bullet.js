export class Bullet {
  constructor(game, x, y, color = 'blue') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 800; // pixels per second Y
    this.speedX = 0;  // pixels per second X
    this.width = 16;
    this.height = 32;
    this.active = true;
  }

  update(deltaTime) {
    this.y -= this.speed * (deltaTime / 1000);
    this.x += this.speedX * (deltaTime / 1000);
    if (this.y < -this.height || this.y > this.game.canvas.height + this.height || this.x < -this.width || this.x > this.game.canvas.width + this.width) {
      this.active = false;
    }
  }

  draw(ctx) {
    const img = this.game.assets.getImage(`bullet1_${this.color}`);
    if (img) {
      ctx.drawImage(img, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - 2, this.y - 10, 4, 20);
    }
  }
}
