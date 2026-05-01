import { Bullet } from './Bullet.js';
import { Explosion } from './Explosion.js';
import { PowerUp } from './PowerUp.js';

export class Enemy {
  constructor(game, x, y, type = 'scout') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type; // 'scout' or 'drone'
    this.active = true;

    if (this.type === 'scout') {
      this.width = 48;
      this.height = 48;
      this.hp = 1;
      this.speed = 150;
      this.sprite = 'ship1_red';
      this.score = 100;
    } else if (this.type === 'drone') {
      this.width = 64;
      this.height = 64;
      this.hp = 2;
      this.speed = 80;
      this.sprite = 'ship1_purple';
      this.score = 250;
      
      this.fireTimer = 0;
      this.fireRate = 2000; // fire every 2 seconds
    }
  }

  update(deltaTime) {
    this.y += this.speed * (deltaTime / 1000);

    if (this.type === 'drone') {
      this.fireTimer += deltaTime;
      if (this.fireTimer >= this.fireRate) {
        this.fireTimer = 0;
        this.shoot();
      }
    }

    if (this.y > this.game.canvas.height + this.height) {
      this.active = false;
    }
  }

  shoot() {
    const bullet = new Bullet(this.game, this.x, this.y + this.height/2, 'yellow');
    bullet.speed = -400;
    this.game.enemyBullets.push(bullet);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.active = false;
    this.game.explosions.push(new Explosion(this.game, this.x, this.y, 'medium'));
    
    if (this.game.score !== undefined) {
      this.game.score += this.score;
      this.game.updateHUD();
    }
    
    if (this.game.levelManager) {
      this.game.levelManager.stats.enemiesKilled++;
    }

    // Powerup drop chance 15%
    if (Math.random() < 0.15) {
      const types = ['weapon', 'shield', 'health'];
      const type = types[Math.floor(Math.random() * types.length)];
      this.game.powerups.push(new PowerUp(this.game, this.x, this.y, type));
    }
  }

  draw(ctx) {
    const img = this.game.assets.getImage(this.sprite);
    if (img) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // Flip 180 degrees since enemy uses player ship sprites
      ctx.rotate(Math.PI);
      ctx.drawImage(img, -this.width/2, -this.height/2, this.width, this.height);
      ctx.restore();
    } else {
      ctx.fillStyle = this.type === 'scout' ? 'red' : 'purple';
      ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
  }
}
