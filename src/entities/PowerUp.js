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
    // Emoji icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (this.type === 'weapon') { ctx.fillStyle = 'orange'; ctx.fill(); ctx.stroke(); ctx.fillText('🔫', 0, 0); }
    else if (this.type === 'shield') { ctx.fillStyle = 'cyan'; ctx.fill(); ctx.stroke(); ctx.fillText('🛡️', 0, 0); }
    else if (this.type === 'health') { ctx.fillStyle = 'red'; ctx.fill(); ctx.stroke(); ctx.fillText('❤️', 0, 0); }
    else if (this.type === 'speed') { ctx.fillStyle = 'yellow'; ctx.fill(); ctx.stroke(); ctx.fillText('⚡', 0, 0); }
    else if (this.type === 'bomb') { ctx.fillStyle = 'white'; ctx.fill(); ctx.stroke(); ctx.fillText('💣', 0, 0); }
    else if (this.type === 'score') { ctx.fillStyle = 'gold'; ctx.fill(); ctx.stroke(); ctx.fillText('⭐', 0, 0); }
    else if (this.type === 'magnet') { ctx.fillStyle = 'purple'; ctx.fill(); ctx.stroke(); ctx.fillText('🧲', 0, 0); }
    
    ctx.restore();
  }
}
