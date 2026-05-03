export class Input {
  constructor() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      fire: false,
      bomb: false,
      pause: false
    };

    this.initKeyboard();
    this.initMobileControls();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => this.handleKey(e, true));
    window.addEventListener('keyup', (e) => this.handleKey(e, false));
  }

  handleKey(e, isPressed) {
    switch(e.code) {
      case 'ArrowUp':
        this.keys.up = isPressed;
        e.preventDefault();
        break;
      case 'ArrowDown':
        this.keys.down = isPressed;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        this.keys.left = isPressed;
        e.preventDefault();
        break;
      case 'ArrowRight':
        this.keys.right = isPressed;
        e.preventDefault();
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.keys.fire = isPressed;
        e.preventDefault();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.bomb = isPressed;
        e.preventDefault();
        break;
      case 'KeyP':
      case 'Escape':
      case 'Space':
        if (isPressed) {
          this.keys.pause = true; // We'll handle resetting this in Game.js
        }
        e.preventDefault();
        break;
      case 'KeyS':
        if (isPressed && !this.keys.shipCycle) {
          this.keys.shipCycle = true;
          this.keys.triggerShipCycle = true;
        } else if (!isPressed) {
          this.keys.shipCycle = false;
        }
        e.preventDefault();
        break;
      case 'KeyL':
        if (isPressed && !this.keys.laserCycle) {
          this.keys.laserCycle = true;
          this.keys.triggerLaserCycle = true;
        } else if (!isPressed) {
          this.keys.laserCycle = false;
        }
        e.preventDefault();
        break;
    }
  }

  initMobileControls() {
    // Virtual D-pad
    const dpad = document.getElementById('d-pad');
    if (!dpad) return;

    // A simple way to handle touch D-pad based on touch coordinates relative to dpad center
    dpad.addEventListener('touchstart', (e) => this.handleDpadTouch(e), {passive: false});
    dpad.addEventListener('touchmove', (e) => this.handleDpadTouch(e), {passive: false});
    dpad.addEventListener('touchend', (e) => this.resetMovement(), {passive: false});
    dpad.addEventListener('touchcancel', (e) => this.resetMovement(), {passive: false});

    // Action buttons
    const btnFire = document.getElementById('btn-fire');
    const btnBomb = document.getElementById('btn-bomb');

    if (btnFire) {
      btnFire.addEventListener('touchstart', (e) => { this.keys.fire = true; e.preventDefault(); }, {passive: false});
      btnFire.addEventListener('touchend', (e) => { this.keys.fire = false; e.preventDefault(); }, {passive: false});
      btnFire.addEventListener('touchcancel', (e) => { this.keys.fire = false; e.preventDefault(); }, {passive: false});
    }

    if (btnBomb) {
      btnBomb.addEventListener('touchstart', (e) => { this.keys.bomb = true; e.preventDefault(); }, {passive: false});
      btnBomb.addEventListener('touchend', (e) => { this.keys.bomb = false; e.preventDefault(); }, {passive: false});
      btnBomb.addEventListener('touchcancel', (e) => { this.keys.bomb = false; e.preventDefault(); }, {passive: false});
    }
  }

  handleDpadTouch(e) {
    e.preventDefault();
    if (e.targetTouches.length === 0) return;

    const touch = e.targetTouches[0];
    const dpad = document.getElementById('d-pad');
    const rect = dpad.getBoundingClientRect();
    
    // Center of the D-pad
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Relative coordinates
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;

    // Threshold to prevent ultra-sensitive switching in the middle
    const threshold = 20;

    this.keys.left = dx < -threshold;
    this.keys.right = dx > threshold;
    this.keys.up = dy < -threshold;
    this.keys.down = dy > threshold;
  }

  resetMovement() {
    this.keys.up = false;
    this.keys.down = false;
    this.keys.left = false;
    this.keys.right = false;
  }
}
