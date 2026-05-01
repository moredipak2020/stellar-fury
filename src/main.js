import { Game } from './engine/Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const mainMenu = document.getElementById('main-menu');
  const btnStart = document.getElementById('btn-start');
  const gameCanvas = document.getElementById('game-canvas');
  
  // 2.5s splash screen logic
  setTimeout(() => {
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      mainMenu.classList.remove('hidden');
    }, 500); // Wait for fade out transition
  }, 2500);

  // Initialize Game engine
  const game = new Game(gameCanvas);

  btnStart.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    game.start();
  });
});
