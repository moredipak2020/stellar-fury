import { Game } from './engine/Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const rotateOverlay = document.getElementById('rotate-device');
  const splashScreen = document.getElementById('splash-screen');
  const controlsScreen = document.getElementById('controls-screen');
  const mainMenu = document.getElementById('main-menu');
  const btnNext = document.getElementById('btn-next');
  const btnStart = document.getElementById('btn-start');
  const gameCanvas = document.getElementById('game-canvas');
  
  let hasBooted = false;

  function checkOrientation() {
    if (hasBooted) return;
    const isMobile = window.matchMedia("(max-width: 900px)").matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
      rotateOverlay.classList.remove('hidden');
      splashScreen.classList.add('hidden');
    } else {
      rotateOverlay.classList.add('hidden');
      splashScreen.classList.remove('hidden');
      startBootSequence();
    }
  }

  function startBootSequence() {
    if (hasBooted) return;
    hasBooted = true;
    
    // 2.5s splash screen logic
    setTimeout(() => {
      splashScreen.style.opacity = '0';
      setTimeout(() => {
        splashScreen.classList.add('hidden');
        controlsScreen.classList.remove('hidden');
      }, 500); // Wait for fade out transition
    }, 2500);
  }

  window.addEventListener('resize', () => {
    if (!hasBooted) checkOrientation();
  });
  window.addEventListener('orientationchange', () => {
    if (!hasBooted) setTimeout(checkOrientation, 100);
  });

  // Initial check
  checkOrientation();

  btnNext.addEventListener('click', () => {
    controlsScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });

  // Initialize Game engine
  const game = new Game(gameCanvas);

  btnStart.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    game.start();
  });
});
