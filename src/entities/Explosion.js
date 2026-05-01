export class Explosion {
  constructor(game, x, y, type = 'large') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    
    // For large explosions we have 24 frames
    this.totalFrames = type === 'large' ? 24 : 15; // Assume 15 for medium/small later
    this.frameIndex = 1;
    this.frameTimer = 0;
    this.frameInterval = 1000 / 30; // 30 FPS
    
    // Random rotation for variety
    this.rotation = Math.random() * Math.PI * 2;
    this.active = true;

    // Play sound
    if (this.game.audio) this.game.audio.playExplosionSound();
  }

  update(deltaTime) {
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameIndex++;
      this.frameTimer = 0;
      if (this.frameIndex > this.totalFrames) {
        this.active = false;
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;
    
    const frameNum = this.frameIndex.toString().padStart(2, '0');
    const img = this.game.assets.getImage(`explosion_${this.type}_${frameNum}`);
    
    if (img) {
      // Adjust size based on type
      let size = 128;
      if (this.type === 'medium') size = 64;
      if (this.type === 'small') size = 32;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.drawImage(img, -size/2, -size/2, size, size);
      ctx.restore();
    }
  }
}
