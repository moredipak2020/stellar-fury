import { Explosion } from './Explosion.js';

export class Asteroid {
  constructor(game, x, y, size = 'large', speedY = null) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.size = size; // 'large', 'medium', 'small'
    
    // Properties based on size
    if (this.size === 'large') {
      this.radius = 40;
      this.hp = 3;
      this.speedX = (Math.random() - 0.5) * 50;
      this.speedY = speedY || (50 + Math.random() * 50);
      this.score = 200;
    } else if (this.size === 'medium') {
      this.radius = 20;
      this.hp = 2;
      this.speedX = (Math.random() - 0.5) * 100;
      this.speedY = speedY || (80 + Math.random() * 50);
      this.score = 100;
    } else {
      this.radius = 10;
      this.hp = 1;
      this.speedX = (Math.random() - 0.5) * 150;
      this.speedY = speedY || (100 + Math.random() * 80);
      this.score = 50;
    }

    // Animation (30 frames)
    this.frameIndex = 1;
    this.frameTimer = 0;
    this.frameInterval = 1000 / 30; // 30 FPS
    
    this.active = true;
  }

  update(deltaTime) {
    this.x += this.speedX * (deltaTime / 1000);
    this.y += this.speedY * (deltaTime / 1000);

    // Animation loop
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameIndex++;
      this.frameTimer = 0;
      if (this.frameIndex > 30) this.frameIndex = 1;
    }

    // Deactivate if off screen (plus some margin)
    if (this.y > this.game.canvas.height + this.radius) {
      this.active = false;
    }
    
    // Bounce off sides
    if (this.x < this.radius || this.x > this.game.canvas.width - this.radius) {
      this.speedX *= -1;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.active = false;
    
    // Spawn explosion
    this.game.explosions.push(new Explosion(this.game, this.x, this.y, this.size));
    
    // Split into smaller asteroids
    if (this.size === 'large') {
      this.game.asteroids.push(new Asteroid(this.game, this.x - 20, this.y, 'medium', this.speedY + 20));
      this.game.asteroids.push(new Asteroid(this.game, this.x + 20, this.y, 'medium', this.speedY + 20));
    } else if (this.size === 'medium') {
      this.game.asteroids.push(new Asteroid(this.game, this.x - 10, this.y, 'small', this.speedY + 20));
      this.game.asteroids.push(new Asteroid(this.game, this.x + 10, this.y, 'small', this.speedY + 20));
    }
    
    // Update score
    if (this.game.score !== undefined) {
      let multiplier = this.game.scoreMultiplier || 1;
      
      // Combo logic
      if (this.game.comboTimer > 0) {
          this.game.comboCount++;
      } else {
          this.game.comboCount = 1;
      }
      this.game.comboTimer = 1000;
      
      let comboMult = Math.pow(1.5, this.game.comboCount - 1);
      
      this.game.score += Math.floor(this.score * multiplier * comboMult);
      this.game.updateHUD();
    }
  }

  draw(ctx) {
    const frameNum = this.frameIndex.toString().padStart(2, '0');
    // We'll use 'large1_gold' frames for all sizes right now, just scaled, to save memory in phase 1
    // Later we can load specific medium/small assets
    const img = this.game.assets.getImage(`asteroid_large1_gold_${frameNum}`);
    
    if (img) {
      const drawSize = this.radius * 2.5; // Sprite is usually bigger than collision radius
      ctx.drawImage(img, this.x - drawSize/2, this.y - drawSize/2, drawSize, drawSize);
    } else {
      // Fallback shape
      ctx.fillStyle = '#E8A45C';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
