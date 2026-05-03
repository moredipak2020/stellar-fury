export class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5; // Master volume
    this.masterGain.connect(this.ctx.destination);
    
    // Music layers
    this.musicLayers = [];
    this.musicGainNodes = [];
    this.isMusicPlaying = false;
  }

  resume() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSound(name) {
    if (name === 'explosion') this.playExplosionSound();
    else if (name === 'laser') this.playLaserSound();
    else if (name === 'powerup') this.playPowerupSound();
    else if (name === 'hit') this.playExplosionSound(); // Fallback for 'hit'
  }

  playLaserSound(color = 'blue') {
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    if (color === 'blue') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
    } else if (color === 'green') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);
    } else if (color === 'yellow') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
    }
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playExplosionSound() {
    this.resume();
    // Simulate white noise with a buffer
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Lowpass filter for explosion thud
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
  }

  playPowerupSound() {
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Very simple adaptive music placeholder
  startMusic() {
    if (this.isMusicPlaying) return;
    this.resume();
    
    // Layer 1: Ambient pad
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 110;
    gain1.gain.value = 0.2;
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start();
    
    this.musicLayers.push(osc1);
    this.musicGainNodes.push(gain1);
    this.isMusicPlaying = true;
  }
}
