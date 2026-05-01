export const LevelData = [
  {
    id: 1,
    title: "First Contact",
    subtitle: "Frontier Belt",
    parTime: 60000,
    waves: [
      { type: 'announce', text: 'WAVE 1: INCOMING', time: 2000 },
      { type: 'spawn', enemy: 'scout', count: 3, interval: 1000, time: 4000 },
      { type: 'spawn', enemy: 'asteroid_small', count: 2, interval: 1500, time: 10000 },
      { type: 'announce', text: 'WAVE 2: SWARM', time: 18000 },
      { type: 'spawn', enemy: 'scout', count: 5, interval: 800, time: 20000 },
      { type: 'spawn', enemy: 'asteroid_small', count: 3, interval: 1000, time: 28000 },
      { type: 'announce', text: 'WAVE 3: FINAL', time: 35000 },
      { type: 'spawn', enemy: 'scout', count: 8, interval: 600, time: 38000 },
    ]
  },
  {
    id: 2,
    title: "Asteroid Alley",
    subtitle: "Frontier Belt",
    parTime: 70000,
    waves: [
      { type: 'announce', text: 'WAVE 1: DUST STORM', time: 2000 },
      { type: 'spawn', enemy: 'asteroid_medium', count: 4, interval: 1200, time: 4000 },
      { type: 'spawn', enemy: 'scout', count: 3, interval: 800, time: 10000 },
      { type: 'announce', text: 'WAVE 2: DRONES AHEAD', time: 20000 },
      { type: 'spawn', enemy: 'drone', count: 3, interval: 1500, time: 22000 },
      { type: 'spawn', enemy: 'asteroid_medium', count: 3, interval: 1000, time: 28000 },
      { type: 'announce', text: 'WAVE 3: SURVIVE', time: 35000 },
      { type: 'spawn', enemy: 'drone', count: 4, interval: 1200, time: 38000 },
      { type: 'spawn', enemy: 'scout', count: 5, interval: 500, time: 45000 },
    ]
  },
  {
    id: 3,
    title: "Ambush Run",
    subtitle: "Frontier Belt",
    parTime: 80000,
    waves: [
      { type: 'announce', text: 'WAVE 1: FLANKERS', time: 2000 },
      { type: 'spawn', enemy: 'scout', count: 6, interval: 500, time: 4000 },
      { type: 'spawn', enemy: 'drone', count: 2, interval: 2000, time: 8000 },
      { type: 'announce', text: 'WAVE 2: HEAVY ROCKS', time: 20000 },
      { type: 'spawn', enemy: 'asteroid_large', count: 3, interval: 2000, time: 22000 },
      { type: 'spawn', enemy: 'scout', count: 5, interval: 600, time: 25000 },
      { type: 'announce', text: 'WAVE 3: ALL OUT', time: 35000 },
      { type: 'spawn', enemy: 'drone', count: 5, interval: 1000, time: 38000 },
      { type: 'spawn', enemy: 'asteroid_medium', count: 5, interval: 1000, time: 45000 },
    ]
  }
];
