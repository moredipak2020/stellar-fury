import { Explosion } from './Explosion.js';
import { Asteroid } from './Asteroid.js';
import { Bullet } from './Bullet.js';
import { AlienMinion } from './AlienMinion.js';

export class Boss {
  constructor(game, type = 'rock_titan') {
    this.game = game;
    this.type = type;
    this.active = true;
    
    // Start above screen
    this.x = this.game.canvas.width / 2;
    this.y = -200; 
    
    this.state = 'entering';
    this.stateTimer = 0;
    
    if (this.type === 'rock_titan') {
      this.width = 300;
      this.height = 300;
      this.maxHp = 1000; // Increased HP for boss fight
      this.hp = this.maxHp;
      this.phase = 1;
      this.speed = 30;
      
      this.image = this.game.assets.getImage('alien_mothership'); 
    } else if (this.type === 'boss_nebula_wraith') {
      this.width = 150;
      this.height = 150;
      this.maxHp = 800;
      this.hp = this.maxHp;
      this.phase = 1;
      this.speed = 50;
      this.alpha = 1.0;
      this.teleportTimer = 3000;
      this.shootTimer = 0;
      this.image = this.game.assets.images['ship2_purple'];
    }
  }

  takeDamage(amount) {
    if (this.state === 'entering' || this.state === 'dying') return;
    
    this.hp -= amount;
    this.game.audio.playSound('hit');
    
    if (this.type === 'rock_titan') {
      if (this.hp <= this.maxHp / 2 && this.phase === 1) {
        this.phase = 2;
        // Spawn alien interceptors when changing phase
        for(let i=0; i<3; i++) {
           let minion = new AlienMinion(this.game, this.x, this.y, 'alien_creature_2');
           minion.speedX = (Math.random() - 0.5) * 100;
           minion.speedY = Math.random() * 50 + 50;
           this.game.enemies.push(minion);
        }
      }
    } else if (this.type === 'boss_nebula_wraith' && !this.isClone) {
      if (this.hp <= 500 && this.phase === 1) {
        this.phase = 2;
        this.alpha = 1.0; // Stay visible
      } else if (this.hp <= 200 && this.phase === 2) {
        this.phase = 3;
        // Clone split
        let clone = new Boss(this.game, 'boss_nebula_wraith');
        clone.isClone = true;
        clone.mainBoss = this;
        clone.x = this.x - 150;
        this.x += 150;
        clone.y = this.y;
        clone.state = 'fighting';
        clone.phase = 3;
        this.game.bosses.push(clone);
      }
    }

    if (this.hp <= 0 && this.state !== 'dying') {
      this.destroy();
    }
  }

  destroy() {
    this.state = 'dying';
    this.stateTimer = 0;
    this.game.audio.playSound('explosion');
    
    // Initial big explosions
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (!this.game.isRunning) return;
        const exX = this.x + (Math.random() - 0.5) * this.width;
        const exY = this.y + (Math.random() - 0.5) * this.height;
        this.game.explosions.push(new Explosion(this.game, exX, exY, 'large'));
      }, i * 200);
    }
  }

  update(deltaTime) {
    this.stateTimer += deltaTime;
    
    if (this.state === 'entering') {
      this.y += this.speed * (deltaTime / 1000);
      if (this.y >= 150) {
        this.y = 150;
        this.state = 'fighting';
        this.stateTimer = 0;
      }
    } else if (this.state === 'fighting') {
      if (this.type === 'rock_titan') {
        // Hover left and right
        this.x += Math.sin(this.stateTimer / 1000) * 100 * (deltaTime / 1000);
        
        // Attack pattern
        if (this.phase === 1) {
          if (Math.random() < 0.02) {
            // Deploy drone ring
            for (let i = 0; i < 8; i++) {
              let angle = (i / 8) * Math.PI * 2;
              let vx = Math.cos(angle) * 150;
              let vy = Math.sin(angle) * 150;
              let b = new AlienMinion(this.game, this.x, this.y + this.height/2, 'alien_creature_1');
              b.speedX = vx; b.speedY = vy; // moving outwards
              this.game.enemyBullets.push(b);
            }
          }
        } else if (this.phase === 2) {
          if (Math.random() < 0.03) {
            // Deploy targeted drone stream
            if (this.game.player) {
              let dx = this.game.player.x - this.x;
              let dy = this.game.player.y - this.y;
              let mag = Math.sqrt(dx*dx + dy*dy);
              let b = new AlienMinion(this.game, this.x, this.y + this.height/2, 'alien_creature_1');
              b.speedX = (dx/mag) * 250;
              b.speedY = (dy/mag) * 250;
              this.game.enemyBullets.push(b);
            }
          }
          if (Math.random() < 0.01) {
             // Deploy interceptor
             let minion = new AlienMinion(this.game, this.x, this.y + this.height/2, 'alien_creature_2');
             minion.speedY = 150;
             this.game.enemies.push(minion);
          }
        }
      } else if (this.type === 'boss_nebula_wraith') {
        if (this.isClone && this.mainBoss.hp <= 0) {
           this.destroy();
        }

        if (this.phase === 1) {
           this.teleportTimer -= deltaTime;
           if (this.teleportTimer > 1500) {
               this.alpha = Math.min(1.0, this.alpha + deltaTime / 500); // fade in
           } else if (this.teleportTimer > 0) {
               this.alpha = Math.max(0.0, this.alpha - deltaTime / 500); // fade out
           } else {
               this.x = Math.random() * (this.game.canvas.width - 200) + 100;
               this.y = 100 + Math.random() * 200;
               this.teleportTimer = 3000;
               // Shoot peek-a-boo
               if (this.game.player) {
                   for (let i=-1; i<=1; i++) {
                       let dx = this.game.player.x - this.x;
                       let dy = this.game.player.y - this.y;
                       let mag = Math.sqrt(dx*dx + dy*dy);
                       let rad = Math.atan2(dy, dx) + i * 0.2;
                       let b = new Bullet(this.game, this.x, this.y + this.height/2, 'blue');
                       b.speedX = Math.cos(rad) * 300;
                       b.speed = -Math.sin(rad) * 300;
                       this.game.enemyBullets.push(b);
                   }
               }
           }
        } else if (this.phase === 2 || this.phase === 3) {
           // Move back and forth
           this.x += Math.sin(this.stateTimer / 1000) * 150 * (deltaTime / 1000);
           this.shootTimer -= deltaTime;
           if (this.shootTimer <= 0) {
               this.shootTimer = this.phase === 3 ? 1000 : 1500;
               // Laser grid
               for (let i = 0; i < 5; i++) {
                   let b = new Bullet(this.game, this.x - 100 + i * 50, this.y + this.height/2, 'yellow');
                   b.speedX = 0;
                   b.speed = -200;
                   this.game.enemyBullets.push(b);
               }
           }
        }
      }
    } else if (this.state === 'dying') {
      if (this.stateTimer > 1500) {
        this.active = false;
        this.game.score += 5000;
        this.game.updateHUD();
        
        // Final burst of alien bombers
        if (this.type === 'rock_titan') {
          for (let i = 0; i < 6; i++) {
             let minion = new AlienMinion(this.game, this.x, this.y, 'alien_creature_3');
             minion.speedX = (Math.random() - 0.5) * 200;
             minion.speedY = (Math.random() - 0.5) * 200;
             this.game.enemies.push(minion);
          }
        }
        // Reward unlock
        if (this.type === 'boss_nebula_wraith') {
            // Drop guaranteed weapon upgrades
            this.game.powerups.push(new PowerUp(this.game, this.x, this.y, 'weapon'));
            this.game.powerups.push(new PowerUp(this.game, this.x + 50, this.y, 'weapon'));
        }
      }
    }
  }

  draw(ctx) {
    if (this.state === 'dying' && this.stateTimer % 200 > 100) {
       // flicker
       return;
    }

    if (this.image) {
      ctx.save();
      ctx.translate(this.x, this.y);
      if (this.type === 'rock_titan') {
         // slowly rotate
         ctx.rotate(this.stateTimer / 2000);
      } else if (this.type === 'boss_nebula_wraith') {
         ctx.globalAlpha = this.alpha;
         ctx.rotate(Math.PI); // flip 180
      }
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.globalAlpha = 1.0;
      ctx.restore();
    } else {
      ctx.fillStyle = 'brown';
      ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
    
    // Draw Health Bar
    if (this.state === 'fighting') {
      const barWidth = 200;
      const barHeight = 10;
      const hpPercent = Math.max(0, this.hp / this.maxHp);
      
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 30, barWidth, barHeight);
      
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 30, barWidth * hpPercent, barHeight);
      
      ctx.strokeStyle = 'white';
      ctx.strokeRect(this.x - barWidth/2, this.y - this.height/2 - 30, barWidth, barHeight);
    }
  }
}
