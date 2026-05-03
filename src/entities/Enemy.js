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
    } else if (this.type === 'fighter') {
      this.width = 64;
      this.height = 64;
      this.hp = 3;
      this.speed = 100;
      this.sprite = 'ship2_red';
      this.score = 350;

      this.fireTimer = 0;
      this.fireRate = 1500;
    } else if (this.type === 'bomber') {
      this.width = 96;
      this.height = 96;
      this.hp = 5;
      this.speed = 50;
      this.sprite = 'ship3_red';
      this.score = 500;

      this.fireTimer = 0;
      this.fireRate = 2500;
    }
  }

  update(deltaTime) {
    this.y += this.speed * (deltaTime / 1000);

    if (this.type === 'drone' || this.type === 'fighter' || this.type === 'bomber') {
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
    if (this.type === 'drone') {
      const bullet = new Bullet(this.game, this.x, this.y + this.height/2, 'yellow');
      bullet.speed = -400;
      this.game.enemyBullets.push(bullet);
    } else if (this.type === 'fighter') {
      // Aimed shot towards player
      if (this.game.player) {
        let dx = this.game.player.x - this.x;
        let dy = this.game.player.y - this.y;
        let mag = Math.sqrt(dx*dx + dy*dy);
        const bullet = new Bullet(this.game, this.x, this.y + this.height/2, 'yellow');
        bullet.speedX = (dx/mag) * 400;
        bullet.speed = -(dy/mag) * 400; // y axis is inverted in Bullet
        this.game.enemyBullets.push(bullet);
      }
    } else if (this.type === 'bomber') {
      // Spread shot (3 bullets)
      const angles = [-15, 0, 15]; // degrees
      for (let angle of angles) {
        let rad = angle * Math.PI / 180;
        const bullet = new Bullet(this.game, this.x, this.y + this.height/2, 'yellow');
        bullet.speedX = Math.sin(rad) * 300;
        bullet.speed = -Math.cos(rad) * 300;
        this.game.enemyBullets.push(bullet);
      }
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
    this.game.explosions.push(new Explosion(this.game, this.x, this.y, 'medium'));
    
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
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
  }
}
