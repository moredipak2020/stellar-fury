import { Explosion } from './Explosion.js';

export class AlienMinion {
  constructor(game, x, y, type = 'alien_creature_1') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    
    // Properties to match original bombs / asteroids
    if (type === 'alien_creature_1') {
      this.width = 30;
      this.height = 30;
      this.hp = 1;
      this.score = 50;
      this.isBullet = true;
    } else if (type === 'alien_creature_2') {
      this.width = 50;
      this.height = 50;
      this.hp = 2;
      this.score = 100;
      this.isBullet = false;
    } else if (type === 'alien_creature_3') {
      this.width = 70;
      this.height = 70;
      this.hp = 3;
      this.score = 200;
      this.isBullet = false;
    }
    
    this.speedX = 0;
    this.speedY = 100;
  }

  update(deltaTime) {
    this.x += this.speedX * (deltaTime / 1000);
    this.y += this.speedY * (deltaTime / 1000);

    if (this.y > this.game.canvas.height + this.height || this.x < -this.width || this.x > this.game.canvas.width + this.width) {
      this.active = false;
    }
    
    if (!this.isBullet && (this.x < this.width/2 || this.x > this.game.canvas.width - this.width/2)) {
      this.speedX *= -1; // Bounce off walls like the original asteroids
    }
  }

  takeDamage(amount) {
    if (this.isBullet) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.active = false;
    this.game.explosions.push(new Explosion(this.game, this.x, this.y, 'small'));
    
    if (this.game.score !== undefined) {
      let multiplier = this.game.scoreMultiplier || 1;
      if (this.game.comboTimer > 0) this.game.comboCount++;
      else this.game.comboCount = 1;
      this.game.comboTimer = 1000;
      let comboMult = Math.pow(1.5, this.game.comboCount - 1);
      this.game.score += Math.floor(this.score * multiplier * comboMult);
      this.game.updateHUD();
    }
  }

  draw(ctx) {
    const img = this.game.assets.getImage(this.type);
    if (img) {
      // Draw spinning for creatures 2 and 3 like asteroids
      if (!this.isBullet) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.game.lastTime / 500); // Simple continuous rotation
        ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
      } else {
        // Point downwards for interceptors
        ctx.drawImage(img, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
      }
    } else {
      ctx.fillStyle = 'lime';
      ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
  }
}
