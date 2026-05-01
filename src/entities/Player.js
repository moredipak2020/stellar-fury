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
    
    this.bullets = [];
    this.fireTimer = 0;
    this.fireRate = 1000 / 4; // 4 shots per sec

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
    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.hp += this.shield; // carry over negative shield to hp
        this.shield = 0;
      }
    } else {
      this.hp -= amount;
    }
    
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
    // Mercy logic: drop 2 tiers
    this.weaponTier = Math.max(1, this.weaponTier - 2);
    this.hp = this.maxHp;
    this.updateHUD();
    // In phase 2 we do actual game over / last chance
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
  }

  update(deltaTime) {
    // Movement
    if (this.game.input.keys.up) this.y -= this.speed * (deltaTime / 1000);
    if (this.game.input.keys.down) this.y += this.speed * (deltaTime / 1000);
    if (this.game.input.keys.left) this.x -= this.speed * (deltaTime / 1000);
    if (this.game.input.keys.right) this.x += this.speed * (deltaTime / 1000);

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

    // Shooting
    this.fireTimer += deltaTime;
    if (this.game.input.keys.fire && this.fireTimer >= this.fireRate) {
      this.fireTimer = 0;
      
      const fireY = this.y - this.height/2;
      if (this.weaponTier === 1) {
        this.bullets.push(new Bullet(this.game, this.x, fireY, 'blue'));
      } else if (this.weaponTier === 2) {
        this.bullets.push(new Bullet(this.game, this.x - 10, fireY, 'blue'));
        this.bullets.push(new Bullet(this.game, this.x + 10, fireY, 'blue'));
      } else if (this.weaponTier >= 3) {
        this.bullets.push(new Bullet(this.game, this.x, fireY, 'blue'));
        const b1 = new Bullet(this.game, this.x - 15, fireY, 'blue');
        b1.speedX = -100;
        this.bullets.push(b1);
        const b2 = new Bullet(this.game, this.x + 15, fireY, 'blue');
        b2.speedX = 100;
        this.bullets.push(b2);
      }

      this.showMuzzle = true;
      this.muzzleIndex = 0;
      this.muzzleTimer = 0;
      // Play sound
      if (this.game.audio) this.game.audio.playLaserSound();
    }

    this.bullets.forEach(b => b.update(deltaTime));
    this.bullets = this.bullets.filter(b => b.active);
  }

  draw(ctx) {
    const assets = this.game.assets;
    
    // Draw bullets
    this.bullets.forEach(b => b.draw(ctx));

    // Draw thruster
    const isMoving = this.game.input.keys.up || this.game.input.keys.left || this.game.input.keys.right || this.game.input.keys.down;
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

    // Draw ship
    const shipImg = assets.getImage('ship1_gold');
    if (shipImg) {
      ctx.drawImage(shipImg, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
  }
}
