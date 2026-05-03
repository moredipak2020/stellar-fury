import { Bullet } from './Bullet.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.x = game.canvas.width / 2;
    this.y = game.canvas.height - 100;
    this.width = 64; 
    this.height = 64;
    this.speed = 300; 
    
    // Stats
    this.hp = 100;
    this.maxHp = 100;
    this.shield = 0; // 0 to 100
    this.weaponTier = 1;
    this.maxWeaponTier = 7;
    this.lives = 3;
    this.invincibleTimer = 0;
    this.state = 'entering';
    this.y = game.canvas.height + 100;
    
    this.bullets = [];
    this.fireTimer = 0;
    this.fireRate = 1000 / 4; // 4 shots per sec
    
    // Customization options
    this.ships = ['ship1_gold', 'hero_1', 'hero_2', 'hero_3', 'hero_4', 'hero_5'];
    this.currentShipIndex = 0;
    this.lasers = ['blue', 'green', 'yellow'];
    this.currentLaserIndex = 0;

    this.speedBoostTimer = 0;
    this.magnetTimer = 0;
    this.scoreMultTimer = 0;
    this.bombs = 1;
    this.maxBombs = 5;
    this.bombCooldown = 0;

    this.thrusterFrames = [];
    for(let i=0; i<=15; i++) {
      this.thrusterFrames.push(`thruster_loop_${i.toString().padStart(2, '0')}`);
    }
    this.thrusterFrameIndex = 0;
    this.thrusterTimer = 0;
    this.thrusterInterval = 1000 / 30;

    // Muzzle flash
    this.muzzleFrames = ['spr_muzzle_bullet_blue_01', 'spr_muzzle_bullet_blue_02', 'spr_muzzle_bullet_blue_03'];
    this.muzzleTimer = 0;
    this.muzzleIndex = 0;
    this.showMuzzle = false;
    
    this.updateHUD();
  }

  takeDamage(amount) {
    if (this.invincibleTimer > 0) return; // iFrames

    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.hp += this.shield; // carry over negative shield to hp
        this.shield = 0;
      }
    } else {
      this.hp -= amount;
    }
    
    // Trigger iFrames (0.5s for normal hit)
    this.invincibleTimer = 500;
    
    // Play hit sound (todo)
    this.updateHUD();
    
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    if (this.game.levelManager) {
      this.game.levelManager.stats.deaths++;
    }
    
    this.lives--;
    this.updateHUD();
    
    if (this.lives <= 0) {
      // Game Over
      if (this.game.gameOver) {
        this.game.gameOver();
      } else {
        this.game.stop();
        const go = document.getElementById('game-over');
        if (go) go.classList.remove('hidden');
      }
      return;
    }

    // Mercy logic: drop 2 tiers
    this.weaponTier = Math.max(1, this.weaponTier - 2);
    this.hp = this.maxHp;
    this.invincibleTimer = 3000; // 3 seconds invincibility on respawn
    this.updateHUD();
  }

  applyPowerUp(type) {
    if (this.game.audio) this.game.audio.playPowerupSound();
    
    if (type === 'health') {
      this.hp = Math.min(this.maxHp, this.hp + 25);
    } else if (type === 'shield') {
      this.shield = Math.min(100, this.shield + 50);
    } else if (type === 'weapon') {
      this.weaponTier = Math.min(this.maxWeaponTier, this.weaponTier + 1);
      // Increase fire rate or change bullet pattern based on tier
      this.fireRate = Math.max(1000 / 15, 1000 / (4 + this.weaponTier));
    } else if (type === 'speed') {
      this.speedBoostTimer = 10000;
    } else if (type === 'bomb') {
      this.bombs = Math.min(this.maxBombs, this.bombs + 1);
    } else if (type === 'score') {
      this.scoreMultTimer = 15000;
      this.game.scoreMultiplier = 2;
    } else if (type === 'magnet') {
      this.magnetTimer = 12000;
    }
    this.updateHUD();
  }

  updateHUD() {
    const hpFill = document.querySelector('.hp-fill');
    if (hpFill) {
      const percentage = (this.hp / this.maxHp) * 100;
      hpFill.style.width = `${percentage}%`;
      hpFill.style.backgroundColor = this.shield > 0 ? '#5DBF78' : '#E8A45C'; // Green if shielded, Orange if not
    }
    const weaponEl = document.querySelector('.weapon-tier');
    if (weaponEl) weaponEl.innerText = `Weapon: Tier ${this.weaponTier}`;
    
    const livesEl = document.querySelector('.lives');
    if (livesEl) livesEl.innerText = `Lives: ${this.lives}`;
  }

  update(deltaTime) {
    if (this.state === 'entering') {
       this.y -= 400 * (deltaTime / 1000);
       if (this.y <= this.game.canvas.height - 100) {
           this.y = this.game.canvas.height - 100;
           this.state = 'playing';
       }
       // Animation for thrusters
       this.thrusterTimer += deltaTime;
       if (this.thrusterTimer > this.thrusterInterval) {
         this.thrusterFrameIndex = (this.thrusterFrameIndex + 1) % this.thrusterFrames.length;
         this.thrusterTimer = 0;
       }
       return;
    }

    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= deltaTime;
    }

    // Powerup Timers
    if (this.speedBoostTimer > 0) this.speedBoostTimer -= deltaTime;
    if (this.scoreMultTimer > 0) {
      this.scoreMultTimer -= deltaTime;
      if (this.scoreMultTimer <= 0) this.game.scoreMultiplier = 1;
    }
    
    // Customization cycling
    if (this.game.input.keys.triggerShipCycle) {
      this.game.input.keys.triggerShipCycle = false;
      this.currentShipIndex = (this.currentShipIndex + 1) % this.ships.length;
    }
    if (this.game.input.keys.triggerLaserCycle) {
      this.game.input.keys.triggerLaserCycle = false;
      this.currentLaserIndex = (this.currentLaserIndex + 1) % this.lasers.length;
    }
    if (this.magnetTimer > 0) {
      this.magnetTimer -= deltaTime;
      this.game.powerups.forEach(p => {
         let dx = this.x - p.x;
         let dy = this.y - p.y;
         let dist = Math.sqrt(dx*dx + dy*dy);
         if (dist < 300) {
            p.x += (dx / dist) * 400 * (deltaTime/1000);
            p.y += (dy / dist) * 400 * (deltaTime/1000);
         }
      });
    }

    // Movement
    let currentSpeed = this.speedBoostTimer > 0 ? this.speed * 1.5 : this.speed;
    if (this.game.input.keys.up) this.y -= currentSpeed * (deltaTime / 1000);
    if (this.game.input.keys.down) this.y += currentSpeed * (deltaTime / 1000);
    if (this.game.input.keys.left) this.x -= currentSpeed * (deltaTime / 1000);
    if (this.game.input.keys.right) this.x += currentSpeed * (deltaTime / 1000);

    const minHeight = this.game.canvas.height * 0.4;
    if (this.y < minHeight) this.y = minHeight;
    if (this.y > this.game.canvas.height - this.height / 2) this.y = this.game.canvas.height - this.height / 2;
    if (this.x < this.width / 2) this.x = this.width / 2;
    if (this.x > this.game.canvas.width - this.width / 2) this.x = this.game.canvas.width - this.width / 2;

    // Animation
    this.thrusterTimer += deltaTime;
    if (this.thrusterTimer > this.thrusterInterval) {
      this.thrusterFrameIndex = (this.thrusterFrameIndex + 1) % this.thrusterFrames.length;
      this.thrusterTimer = 0;
    }

    if (this.showMuzzle) {
      this.muzzleTimer += deltaTime;
      if (this.muzzleTimer > 30) { // 30ms per frame
        this.muzzleIndex++;
        this.muzzleTimer = 0;
        if (this.muzzleIndex >= this.muzzleFrames.length) {
          this.showMuzzle = false;
          this.muzzleIndex = 0;
        }
      }
    }
    // Bomb
    if (this.bombCooldown > 0) this.bombCooldown -= deltaTime;
    if (this.game.input.keys.bomb && this.bombs > 0 && this.bombCooldown <= 0) {
       this.bombs--;
       this.bombCooldown = 1000;
       if (this.game.audio) this.game.audio.playSound('explosion');
       // Wipe small/medium enemies and bullets
       this.game.enemies.forEach(e => {
           if (e.hp <= 10) e.takeDamage(10); // deal 10 dmg to everything
       });
       this.game.enemyBullets = [];
       // Add huge explosion effect over the screen
       for (let i = 0; i < 10; i++) {
           let ex = this.game.canvas.width * Math.random();
           let ey = this.game.canvas.height * Math.random();
           // import { Explosion } from './Explosion.js' should be done if we create Explosion
           // Since Explosion is not imported in Player.js, we just let Game.js handle it by pushing to an array if needed,
           // or we can just import it. Let's just do screen flash.
       }
       // Screen flash
       const flash = document.createElement('div');
       flash.style.position = 'absolute';
       flash.style.top = '0'; flash.style.left = '0';
       flash.style.width = '100%'; flash.style.height = '100%';
       flash.style.backgroundColor = 'white';
       flash.style.zIndex = '9999';
       flash.style.pointerEvents = 'none';
       flash.style.animation = 'fadeOut 1s ease-out forwards';
       document.body.appendChild(flash);
       setTimeout(() => document.body.removeChild(flash), 1000);
       this.updateHUD();
    }

    // Shooting
    this.fireTimer += deltaTime;
    if (this.game.input.keys.fire && this.fireTimer >= this.fireRate) {
      this.fireTimer = 0;
      
      const fireY = this.y - this.height/2;
      const laserColor = this.lasers[this.currentLaserIndex];
      
      if (this.weaponTier === 1) {
        this.bullets.push(new Bullet(this.game, this.x, fireY, laserColor));
      } else if (this.weaponTier === 2) {
        this.bullets.push(new Bullet(this.game, this.x - 10, fireY, laserColor));
        this.bullets.push(new Bullet(this.game, this.x + 10, fireY, laserColor));
      } else if (this.weaponTier >= 3) {
        this.bullets.push(new Bullet(this.game, this.x, fireY, laserColor));
        const b1 = new Bullet(this.game, this.x - 15, fireY, laserColor);
        b1.speedX = -100;
        this.bullets.push(b1);
        const b2 = new Bullet(this.game, this.x + 15, fireY, laserColor);
        b2.speedX = 100;
        this.bullets.push(b2);
      }

      this.showMuzzle = true;
      this.muzzleIndex = 0;
      this.muzzleTimer = 0;
      // Play sound
      if (this.game.audio) this.game.audio.playLaserSound(laserColor);
    }

    this.bullets.forEach(b => b.update(deltaTime));
    this.bullets = this.bullets.filter(b => b.active);
  }

  draw(ctx) {
    const assets = this.game.assets;
    
    // Draw bullets
    this.bullets.forEach(b => b.draw(ctx));

    // Draw thruster
    const isMoving = this.state === 'entering' || this.game.input.keys.up || this.game.input.keys.left || this.game.input.keys.right || this.game.input.keys.down;
    if (isMoving) {
      const thrusterName = this.thrusterFrames[this.thrusterFrameIndex];
      const thrusterImg = assets.getImage(thrusterName);
      if (thrusterImg) {
        ctx.drawImage(thrusterImg, this.x - 20, this.y + 20, 40, 60);
      }
    }

    // Draw muzzle flash
    if (this.showMuzzle) {
      const muzzleImg = assets.getImage(this.muzzleFrames[this.muzzleIndex]);
      if (muzzleImg) {
        ctx.drawImage(muzzleImg, this.x - 16, this.y - this.height/2 - 32, 32, 32);
      }
    }

    // Blink if invincible
    if (this.invincibleTimer > 0) {
      if (Math.floor(this.invincibleTimer / 100) % 2 === 0) {
        return; // skip drawing ship to blink
      }
    }

    // Draw ship
    const shipName = this.ships[this.currentShipIndex];
    const shipImg = assets.getImage(shipName);
    if (shipImg) {
      // For the generated hero ships, they might be tightly cropped and larger. The logic works fine using this.width.
      ctx.drawImage(shipImg, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
  }
}
