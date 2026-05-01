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
    
    this.score = 0;
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
    
    this.assets.loadImage('bullet1_blue', '/assets/Projectiles/spr_bullet1_blue.png');
    this.assets.loadImage('bullet1_yellow', '/assets/Projectiles/spr_bullet1_yellow.png');
    
    this.assets.loadImage('bg_standard', '/assets/Backgrounds/spr_sky_standard.png');
    this.assets.loadImage('bg_stars', '/assets/Backgrounds/spr_overlay_sky_stars1.png');
    
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
        bullet.active = false;
        this.player.takeDamage(10);
      }
    }

    // Player vs Asteroids
    for (let asteroid of this.asteroids) {
      if (!asteroid.active) continue;
      const dx = this.player.x - asteroid.x;
      const dy = this.player.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < asteroid.radius + this.player.width / 2) {
        asteroid.destroy();
        this.player.takeDamage(20);
      }
    }

    // Player vs Enemies
    for (let enemy of this.enemies) {
      if (!enemy.active) continue;
      if (this.player.x > enemy.x - enemy.width/2 && this.player.x < enemy.x + enemy.width/2 &&
          this.player.y > enemy.y - enemy.height/2 && this.player.y < enemy.y + enemy.height/2) {
        enemy.destroy();
        this.player.takeDamage(20);
      }
    }
  }

  update(deltaTime) {
    if (this.background) this.background.update(deltaTime);
    if (this.player) this.player.update(deltaTime);
    
    if (this.levelManager) this.levelManager.update(deltaTime);

    this.asteroids.forEach(a => a.update(deltaTime));
    this.asteroids = this.asteroids.filter(a => a.active);

    this.enemies.forEach(e => e.update(deltaTime));
    this.enemies = this.enemies.filter(e => e.active);

    this.enemyBullets.forEach(b => b.update(deltaTime));
    this.enemyBullets = this.enemyBullets.filter(b => b.active);

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
    this.enemyBullets.forEach(b => b.draw(this.ctx));
    this.powerups.forEach(p => p.draw(this.ctx));
    
    if (this.player) this.player.draw(this.ctx);
    
    this.explosions.forEach(e => e.draw(this.ctx));
  }
}


