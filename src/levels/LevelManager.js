import { LevelData } from './LevelData.js';
import { Enemy } from '../entities/Enemy.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Boss } from '../entities/Boss.js';

export class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevelIndex = 0;
    this.levelTimer = 0;
    this.activeSpawns = [];
    this.waveQueue = [];
    this.state = 'idle'; // 'idle', 'playing', 'transition'
    this.stats = {
      enemiesSpawned: 0,
      enemiesKilled: 0,
      deaths: 0,
    };
    this.continueTimer = 0;
  }

  startLevel(index) {
    if (index >= LevelData.length) {
      console.log("Game Complete!");
      // Loop back to level 1 for now if we finish all levels
      index = 0;
    }
    this.currentLevelIndex = index;
    this.levelData = LevelData[index];
    this.levelTimer = 0;
    this.activeSpawns = [];
    this.waveQueue = [...this.levelData.waves];
    this.stats = { enemiesSpawned: 0, enemiesKilled: 0, deaths: 0 };
    
    this.game.background.setTheme(this.levelData.bg, this.levelData.stars);
    this.game.background.props = []; // Clear old props
    
    // Reset player HP each level
    if (this.game.player) {
      this.game.player.hp = this.game.player.maxHp || 100;
      this.game.player.state = 'entering';
      this.game.player.x = this.game.canvas.width / 2;
      this.game.player.y = this.game.canvas.height + 100;
      this.game.updateHUD();
    }
    
    this.state = 'playing';
    
    this.showAnnouncement(`LEVEL ${this.levelData.id}`, this.levelData.title, 4000);
    const lc = document.getElementById('level-complete');
    if (lc) lc.classList.add('hidden');
  }

  update(deltaTime) {
    if (this.state === 'transition') {
      if (this.game.player && this.game.player.y > -100) {
        this.game.player.y -= 800 * (deltaTime / 1000);
      }
      this.continueTimer -= deltaTime;
      const sec = Math.ceil(this.continueTimer / 1000);
      const countdownEl = document.getElementById('next-level-countdown');
      if (countdownEl) countdownEl.innerText = `Starting in ${sec}s`;
      
      if (this.continueTimer <= 0) {
        this.startLevel(this.currentLevelIndex + 1);
      }
      return;
    }

    if (this.state === 'playing') {
      this.levelTimer += deltaTime;

      // Process waveQueue
      while (this.waveQueue.length > 0 && this.waveQueue[0].time <= this.levelTimer) {
        const wave = this.waveQueue.shift();
        if (wave.type === 'announce') {
          this.showAnnouncement('WAVE INCOMING', wave.text, 3000);
        } else if (wave.type === 'spawn') {
          this.activeSpawns.push({ ...wave, spawned: 0, lastSpawnTime: 0 });
        } else if (wave.type === 'prop') {
          this.game.background.addProp(wave.img, wave.x, wave.y, wave.speed, wave.scale, wave.blend);
        }
      }

      // Process active spawns
      for (let i = this.activeSpawns.length - 1; i >= 0; i--) {
        const spawner = this.activeSpawns[i];
        if (spawner.spawned === 0 || this.levelTimer - spawner.lastSpawnTime >= spawner.interval) {
          this.spawnEntity(spawner.enemy);
          spawner.spawned++;
          spawner.lastSpawnTime = this.levelTimer;
          
          if (spawner.enemy === 'scout' || spawner.enemy === 'drone') {
            this.stats.enemiesSpawned++;
          }

          if (spawner.spawned >= spawner.count) {
            this.activeSpawns.splice(i, 1);
          }
        }
      }

      // Check level complete
      if (this.waveQueue.length === 0 && this.activeSpawns.length === 0 && this.game.enemies.length === 0 && this.game.bosses.length === 0) {
        this.completeLevel();
      }
    }
  }

  spawnEntity(type) {
    const x = Math.random() * (this.game.canvas.width - 100) + 50;
    if (type.startsWith('boss_')) {
      const bossType = type.replace('boss_', '');
      this.game.bosses.push(new Boss(this.game, bossType));
    } else if (type.startsWith('asteroid')) {
      const size = type.split('_')[1] || 'large';
      this.game.asteroids.push(new Asteroid(this.game, x, -50, size));
    } else {
      this.game.enemies.push(new Enemy(this.game, x, -50, type));
    }
  }

  showAnnouncement(title, subtitle, duration) {
    const ann = document.getElementById('level-announcement');
    if (!ann) return;
    const titleEl = ann.querySelector('.ann-title');
    const subEl = ann.querySelector('.ann-subtitle');
    if (titleEl) titleEl.innerText = title;
    if (subEl) subEl.innerText = subtitle;
    ann.classList.remove('hidden');
    setTimeout(() => {
      ann.classList.add('hidden');
    }, duration);
  }

  completeLevel() {
    this.state = 'transition';
    this.continueTimer = 5000;
    
    // Calculate stars
    let stars = 1;
    if (this.stats.deaths === 0) {
      stars = 2;
      const killRatio = this.stats.enemiesSpawned > 0 ? (this.stats.enemiesKilled / this.stats.enemiesSpawned) : 1;
      if (killRatio >= 0.8 && this.levelTimer <= this.levelData.parTime) {
        stars = 3;
      }
    }
    
    const panel = document.getElementById('level-complete');
    if (panel) {
      const title = panel.querySelector('.lc-title');
      const starsEl = panel.querySelector('.lc-stars');
      if (title) title.innerText = `LEVEL ${this.levelData.id} CLEARED`;
      if (starsEl) starsEl.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      panel.classList.remove('hidden');
    }
  }
}
