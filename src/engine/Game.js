import { Input } from './Input.js';
import { AssetLoader } from './AssetLoader.js';
import { AudioEngine } from './Audio.js';
import { Player } from '../entities/Player.js';
import { Background } from '../entities/Background.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Enemy } from '../entities/Enemy.js';
import { LevelManager } from '../levels/LevelManager.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.lastTime = 0;
    this.input = new Input();
    this.assets = new AssetLoader();
    this.audio = new AudioEngine();
    
    this.player = null;
    this.background = null;
    this.asteroids = [];
    this.explosions = [];
    this.enemies = [];
    this.enemyBullets = [];
    this.powerups = [];
    this.bosses = [];
    this.lightningZones = [];
    
    this.score = 0;
    this.scoreMultiplier = 1;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.levelManager = new LevelManager(this);
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = 1280;
    this.canvas.height = 720;
  }

  async initAssets() {
    this.assets.loadImage('ship1_gold', '/assets/Ships/spr_ship1_gold.png');
    this.assets.loadImage('ship1_red', '/assets/Ships/spr_ship1_red.png');
    this.assets.loadImage('ship1_purple', '/assets/Ships/spr_ship1_purple.png');
    this.assets.loadImage('ship2_red', '/assets/Ships/spr_ship2_red.png');
    this.assets.loadImage('ship3_red', '/assets/Ships/spr_ship3_red.png');
    this.assets.loadImage('ship2_purple', '/assets/Ships/spr_ship2_purple.png');
    
    // New Alien Boss and Minions
    this.assets.loadImage('alien_mothership', '/assets/new_aliens/alien_mothership.png');
    this.assets.loadImage('alien_creature_1', '/assets/new_aliens/alien_creature_1.png');
    this.assets.loadImage('alien_creature_2', '/assets/new_aliens/alien_creature_2.png');
    this.assets.loadImage('alien_creature_3', '/assets/new_aliens/alien_creature_3.png');
    
    this.assets.loadImage('bullet1_blue', '/assets/Projectiles/spr_bullet1_blue.png');
    this.assets.loadImage('bullet1_yellow', '/assets/Projectiles/spr_bullet1_yellow.png');
    
    this.assets.loadImage('bg_standard', '/assets/Backgrounds/spr_sky_standard.png');
    this.assets.loadImage('bg_nebula1', '/assets/Backgrounds/spr_sky_nebula1.png');
    this.assets.loadImage('bg_nebula2', '/assets/Backgrounds/spr_sky_nebula2.png');
    this.assets.loadImage('bg_stars1', '/assets/Backgrounds/spr_overlay_sky_stars1.png');
    this.assets.loadImage('bg_stars_blue', '/assets/Backgrounds/spr_overlay_sky_starsblue.png');
    this.assets.loadImage('bg_stars_red', '/assets/Backgrounds/spr_overlay_sky_starsred.png');
    
    // Planets & Suns
    this.assets.loadImage('planet_blue', '/assets/Backgrounds/spr_planet_blue.png');
    this.assets.loadImage('planet_pink', '/assets/Backgrounds/spr_planet_pink.png');
    this.assets.loadImage('planet_black', '/assets/Backgrounds/spr_planet_black.png');
    this.assets.loadImage('star_red', '/assets/Backgrounds/spr_star_red.png');
    this.assets.loadImage('star_green', '/assets/Backgrounds/spr_star_green.png');
    this.assets.loadImage('cluster1', '/assets/Backgrounds/spr_cluster1.png');
    this.assets.loadImage('cluster2', '/assets/Backgrounds/spr_cluster2.png');
    
    for(let i=1; i<=3; i++) {
      this.assets.loadImage(`spr_muzzle_bullet_blue_0${i}`, `/assets/Muzzle Flashes/Muzzle Bullet Blue/spr_muzzle_bullet_blue_0${i}.png`);
    }

    for(let i=0; i<=15; i++) {
      const num = i.toString().padStart(2, '0');
      this.assets.loadImage(`thruster_loop_${num}`, `/assets/Thrusters/Thruster Loop/spr_thruster_loop_${num}.png`);
    }
    
    for(let i=1; i<=30; i++) {
      const num = i.toString().padStart(2, '0');
      this.assets.loadImage(`asteroid_large1_gold_${num}`, `/assets/Asteroids/Asteroid Large 1/Gold/spr_asteroids_large1_gold_${num}.png`);
    }

    for(let i=1; i<=24; i++) {
      const num = i.toString().padStart(2, '0');
      this.assets.loadImage(`explosion_large_${num}`, `/assets/Explosions/Explosion Large/spr_explosion_large_${num}.png`);
    }
    // Assume explosion_medium has 15 frames for now
    for(let i=1; i<=15; i++) {
      const num = i.toString().padStart(2, '0');
      // For now we reuse large explosion frames but scaled down in Explosion.js to avoid loading errors if medium doesn't exist yet
      this.assets.loadImage(`explosion_medium_${num}`, `/assets/Explosions/Explosion Large/spr_explosion_large_${num}.png`);
    }
    
    await this.assets.loadAll();
  }

  updateHUD() {
    const scoreEl = document.querySelector('.score');
    if (scoreEl) scoreEl.innerText = this.score;
  }

  async start() {
    if (this.isRunning) return;
    
    await this.initAssets();
    this.background = new Background(this);
    this.player = new Player(this);

    this.isRunning = true;
    this.audio.startMusic();
    
    document.getElementById('hud').classList.remove('hidden');
    this.updateHUD();
    
    this.levelManager.startLevel(0);
    
    const isMobile = window.matchMedia("(max-width: 900px)").matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);
    if (isMobile) {
      document.getElementById('mobile-controls').classList.remove('hidden');
    }

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  stop() {
    this.isRunning = false;
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((ts) => this.loop(ts));
  }

  checkCollisions() {
    if (!this.player) return;

    // Bullet vs Asteroid / Enemy
    for (let bullet of this.player.bullets) {
      if (!bullet.active) continue;
      
      // Hit Asteroids
      for (let asteroid of this.asteroids) {
        if (!asteroid.active) continue;
        
        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < asteroid.radius + bullet.width / 2) {
          bullet.active = false;
          asteroid.takeDamage(1);
          break; 
        }
      }
      
      if (!bullet.active) continue;

      // Hit Enemies
      for (let enemy of this.enemies) {
        if (!enemy.active) continue;
        
        // AABB Collision approx
        if (bullet.x > enemy.x - enemy.width/2 && bullet.x < enemy.x + enemy.width/2 &&
            bullet.y > enemy.y - enemy.height/2 && bullet.y < enemy.y + enemy.height/2) {
          bullet.active = false;
          enemy.takeDamage(1);
          break;
        }
      }

      if (!bullet.active) continue;

      // Hit Bosses
      for (let boss of this.bosses) {
        if (!boss.active) continue;
        
        if (bullet.x > boss.x - boss.width/2 && bullet.x < boss.x + boss.width/2 &&
            bullet.y > boss.y - boss.height/2 && bullet.y < boss.y + boss.height/2) {
          bullet.active = false;
          boss.takeDamage(1);
          break;
        }
      }
    }

    // Player vs Powerups
    for (let powerup of this.powerups) {
      if (!powerup.active) continue;
      const dx = this.player.x - powerup.x;
      const dy = this.player.y - powerup.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < powerup.radius + this.player.width / 2) {
        powerup.active = false;
        this.player.applyPowerUp(powerup.type);
        this.score += 50;
        this.updateHUD();
      }
    }

    // Player vs Enemy Bullets
    for (let bullet of this.enemyBullets) {
      if (!bullet.active) continue;
      if (bullet.x > this.player.x - this.player.width/2 && bullet.x < this.player.x + this.player.width/2 &&
          bullet.y > this.player.y - this.player.height/2 && bullet.y < this.player.y + this.player.height/2) {
        if (this.player.invincibleTimer <= 0) {
          bullet.active = false;
          this.player.takeDamage(10);
        }
      }
    }

    // Player vs Asteroids
    for (let asteroid of this.asteroids) {
      if (!asteroid.active) continue;
      const dx = this.player.x - asteroid.x;
      const dy = this.player.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < asteroid.radius + this.player.width / 2) {
        if (this.player.invincibleTimer <= 0) {
          asteroid.destroy();
          this.player.takeDamage(20);
        }
      }
    }

    // Player vs Enemies
    for (let enemy of this.enemies) {
      if (!enemy.active) continue;
      if (this.player.x > enemy.x - enemy.width/2 && this.player.x < enemy.x + enemy.width/2 &&
          this.player.y > enemy.y - enemy.height/2 && this.player.y < enemy.y + enemy.height/2) {
        if (this.player.invincibleTimer <= 0) {
          enemy.destroy();
          this.player.takeDamage(20);
        }
      }
    }

    // Player vs Bosses
    for (let boss of this.bosses) {
      if (!boss.active) continue;
      if (this.player.x > boss.x - boss.width/2 && this.player.x < boss.x + boss.width/2 &&
          this.player.y > boss.y - boss.height/2 && this.player.y < boss.y + boss.height/2) {
        if (this.player.invincibleTimer <= 0) {
          this.player.takeDamage(30);
        }
      }
    }
  }

  update(deltaTime) {
    if (this.background) this.background.update(deltaTime);
    if (this.player) this.player.update(deltaTime);
    
    if (this.levelManager) this.levelManager.update(deltaTime);

    if (this.comboTimer > 0) {
        this.comboTimer -= deltaTime;
        if (this.comboTimer <= 0) {
            this.comboCount = 0;
        }
    }

    // Lightning Hazards
    if (this.levelManager && this.levelManager.levelData && this.levelManager.levelData.lightning) {
       if (Math.random() < 0.005) {
           this.lightningZones.push({
               x: Math.random() * this.canvas.width,
               y: Math.random() * this.canvas.height,
               radius: 100 + Math.random() * 100,
               timer: 2000,
               active: false
           });
       }
    }

    for (let i = this.lightningZones.length - 1; i >= 0; i--) {
        let z = this.lightningZones[i];
        z.timer -= deltaTime;
        if (z.timer <= 0 && !z.active) {
            z.active = true;
            z.timer = 500;
            this.audio.playSound('explosion'); // Play sound when strike hits
        } else if (z.timer <= 0 && z.active) {
            this.lightningZones.splice(i, 1);
        } else if (z.active && this.player) {
            let dx = this.player.x - z.x;
            let dy = this.player.y - z.y;
            if (Math.sqrt(dx*dx + dy*dy) < z.radius) {
                if (this.player.invincibleTimer <= 0) {
                    this.player.takeDamage(10);
                }
            }
        }
    }

    this.asteroids.forEach(a => a.update(deltaTime));
    this.asteroids = this.asteroids.filter(a => a.active);

    this.enemies.forEach(e => e.update(deltaTime));
    this.enemies = this.enemies.filter(e => e.active);

    this.enemyBullets.forEach(b => b.update(deltaTime));
    this.enemyBullets = this.enemyBullets.filter(b => b.active);

    this.bosses.forEach(b => b.update(deltaTime));
    this.bosses = this.bosses.filter(b => b.active);

    this.explosions.forEach(e => e.update(deltaTime));
    this.explosions = this.explosions.filter(e => e.active);

    this.powerups.forEach(p => p.update(deltaTime));
    this.powerups = this.powerups.filter(p => p.active);

    this.checkCollisions();
  }

  draw() {
    if (this.background) {
      this.background.draw(this.ctx);
    } else {
      this.ctx.fillStyle = '#0A0A12';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.asteroids.forEach(a => a.draw(this.ctx));
    this.enemies.forEach(e => e.draw(this.ctx));
    this.bosses.forEach(b => b.draw(this.ctx));
    this.enemyBullets.forEach(b => b.draw(this.ctx));
    this.powerups.forEach(p => p.draw(this.ctx));
    
    if (this.player) this.player.draw(this.ctx);
    
    this.explosions.forEach(e => e.draw(this.ctx));

    // Draw Lightning Hazards
    this.lightningZones.forEach(z => {
        if (!z.active) {
            this.ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + Math.sin(z.timer/50)*0.1})`;
            this.ctx.beginPath();
            this.ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Telegraph border
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    });

    // Draw Fog if active
    if (this.levelManager && this.levelManager.levelData && this.levelManager.levelData.fog) {
      this.drawFog(this.ctx);
    }
    
    // Draw Combo
    if (this.comboCount > 1) {
        this.ctx.font = 'bold 36px "Outfit", sans-serif';
        this.ctx.fillStyle = `rgba(255, 215, 0, ${this.comboTimer/1000})`;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${this.comboCount}x COMBO!`, this.canvas.width - 30, 150);
    }
  }

  drawFog(ctx) {
    if (!this.player) return;
    const cx = this.player.x;
    const cy = this.player.y;
    const r = 250;
    
    const grad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
    grad.addColorStop(0, 'rgba(20, 10, 30, 0)');
    grad.addColorStop(1, 'rgba(20, 10, 30, 0.95)');
    
    ctx.fillStyle = 'rgba(20, 10, 30, 0.95)';
    ctx.beginPath();
    ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
    ctx.fill();
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}


