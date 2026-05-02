function buildWaves(levelConfig) {
  const waves = [];
  const { duration, baseEnemyInterval, baseAsteroidInterval, asteroidSizes, hasDrones } = levelConfig;
  
  // Galaxies (Nebulas and large clusters)
  for (let t = 5000; t < duration; t += 45000) {
    const galaxies = ['bg_nebula1', 'bg_nebula2', 'cluster1', 'cluster2'];
    const galaxy = galaxies[Math.floor(Math.random() * galaxies.length)];
    // Randomize X to be somewhat centered or off-center
    const x = Math.random() * 1200; 
    const speed = 10 + Math.random() * 15; // Slow moving
    const scale = 1.0 + Math.random() * 0.5; // Large scale
    // Randomize rotation/flip if possible? We can add alpha or rotation later, but blend: 'screen' helps
    waves.push({ type: 'prop', time: t, img: galaxy, x, y: -800, speed, scale, blend: 'screen' });
  }

  // Background props (planets, suns)
  for (let t = 20000; t < duration; t += 35000) {
    const props = ['planet_blue', 'planet_pink', 'planet_black', 'star_red', 'star_green'];
    const prop = props[Math.floor(Math.random() * props.length)];
    const x = Math.random() * 1000 + 100;
    const speed = 20 + Math.random() * 30;
    const scale = 0.5 + Math.random() * 1.5;
    waves.push({ type: 'prop', time: t, img: prop, x, y: -400, speed, scale, blend: 'normal' });
  }

  // Announcements
  waves.push({ type: 'announce', text: 'WAVE 1: INCOMING', time: 2000 });
  waves.push({ type: 'announce', text: 'WAVE 2: ESCALATION', time: Math.floor(duration * 0.3) });
  waves.push({ type: 'announce', text: 'WAVE 3: SURVIVE', time: Math.floor(duration * 0.6) });
  waves.push({ type: 'announce', text: 'FINAL WAVE', time: Math.floor(duration * 0.85) });

  // Enemies and Asteroids
  let currentTime = 4000;
  while (currentTime < duration) {
    const isAsteroid = Math.random() > 0.6;
    
    if (isAsteroid) {
      const size = asteroidSizes[Math.floor(Math.random() * asteroidSizes.length)];
      const count = Math.floor(Math.random() * 3) + 1;
      waves.push({ type: 'spawn', enemy: `asteroid_${size}`, count, interval: 1000, time: currentTime });
      currentTime += baseAsteroidInterval + Math.random() * 3000;
    } else {
      let eType = 'scout';
      if (hasDrones && Math.random() > 0.6) eType = 'drone';
      
      const count = Math.floor(Math.random() * 4) + 2;
      waves.push({ type: 'spawn', enemy: eType, count, interval: 800, time: currentTime });
      currentTime += baseEnemyInterval + Math.random() * 4000;
    }
  }

  waves.sort((a, b) => a.time - b.time);
  return waves;
}

export const LevelData = [
  {
    id: 1,
    title: "First Contact",
    subtitle: "Frontier Belt",
    parTime: 300000, // 5 minutes
    bg: null,
    stars: 'bg_stars1',
    waves: buildWaves({
      duration: 300000,
      baseEnemyInterval: 8000,
      baseAsteroidInterval: 10000,
      asteroidSizes: ['small', 'medium'],
      hasDrones: false
    })
  },
  {
    id: 2,
    title: "Asteroid Alley",
    subtitle: "Frontier Belt",
    parTime: 360000, // 6 minutes
    bg: null,
    stars: 'bg_stars_blue',
    waves: buildWaves({
      duration: 360000,
      baseEnemyInterval: 7000,
      baseAsteroidInterval: 6000,
      asteroidSizes: ['small', 'medium', 'large'],
      hasDrones: true
    })
  },
  {
    id: 3,
    title: "Ambush Run",
    subtitle: "Frontier Belt",
    parTime: 360000, // 6 minutes
    bg: null,
    stars: 'bg_stars_red',
    waves: buildWaves({
      duration: 360000,
      baseEnemyInterval: 5000,
      baseAsteroidInterval: 8000,
      asteroidSizes: ['medium', 'large'],
      hasDrones: true
    })
  }
];
