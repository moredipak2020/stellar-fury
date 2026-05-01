export class PowerUp {
  constructor(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type; // 'weapon', 'shield', 'health'
    this.active = true;
    this.speed = 100;
    this.radius = 15;
    
    // Slight oscillation
    this.oscillationTime = Math.random() * 100;
  }

  update(deltaTime) {
    this.y += this.speed * (deltaTime / 1000);
    this.oscillationTime += deltaTime;
    this.x += Math.sin(this.oscillationTime / 500) * 0.5;

    if (this.y > this.game.canvas.height + this.radius) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Background glow
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.type === 'weapon') ctx.fillStyle = 'orange';
    if (this.type === 'shield') ctx.fillStyle = 'cyan';
    if (this.type === 'health') ctx.fillStyle = 'red';
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (this.type === 'weapon') ctx.fillText('🔫', 0, 0);
    if (this.type === 'shield') ctx.fillText('🛡️', 0, 0);
    if (this.type === 'health') ctx.fillText('❤️', 0, 0);
    
    ctx.restore();
  }
}
