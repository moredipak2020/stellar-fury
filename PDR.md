# 🚀 STELLAR FURY — Project Design Review (PDR)
## A Classical 2D Space Shooter, Reimagined
### Publisher: Bharat App Studio 🇮🇳

---

## ⚠️ SECTION 0 — DEVELOPER IMPLEMENTATION DIRECTIVES

> [!CAUTION]
> **READ THIS ENTIRE PDR DOCUMENT BEFORE WRITING ANY CODE.**
> Do not start implementation until you have understood ALL sections. These directives govern every line of code you write.

### 0.1 Golden Rules

1. **Follow the Phase task list in EXACT ORDER** — Do not skip ahead. Complete Task 1.0 before 1.1, complete 1.1 before 1.2, etc.
2. **Read the full PDR at the start of EVERY new conversation/phase** — Context does not carry between sessions.
3. **If something is defined in this PDR, follow it exactly** — Do not invent alternative approaches.
4. **Test in browser after each major task** before moving to the next one.
5. **Ask the user before making any design decisions** not covered in this PDR.

### 0.2 Tech Stack (Non-Negotiable)

| Constraint | Rule |
|-----------|------|
| **Bundler** | Vite (latest) — `npx -y create-vite@latest ./` |
| **Language** | Vanilla JavaScript — ES6 modules (`import`/`export`) |
| **Rendering** | HTML5 Canvas 2D API — NOT DOM elements for game objects |
| **Styling** | Vanilla CSS — NO Tailwind, NO CSS frameworks |
| **Audio** | Web Audio API — synthesized SFX + layered music |
| **State** | Vanilla JS classes — NO React, NO Vue, NO frameworks |
| **Storage** | LocalStorage for saves — Vercel KV for leaderboard (later) |
| **Package Manager** | npm |

### 0.3 Asset Rules

| Rule | Detail |
|------|--------|
| **Location** | All game assets are in `f:\Gamers\Spaces Shooters\` — copy into `public/assets/` |
| **Sprite frames** | Individual PNG files (NOT spritesheets) — e.g., `spr_explosion_large_01.png` to `_24.png` |
| **Animation** | Load frame arrays, cycle through them at defined FPS |
| **NO placeholders** | Use the REAL sprites from the asset folders. Do not use colored rectangles or placeholder shapes |
| **Enemy ships** | Flip player ship sprites vertically (180°) + use different color variants |
| **Backgrounds** | Parallax scroll using the `Backgrounds/` folder images |

### 0.4 Controls (Exact Mapping)

**PC / Keyboard:**
| Key | Action |
|-----|--------|
| ↑ Arrow | Move up |
| ↓ Arrow | Move down |
| ← Arrow | Move left |
| → Arrow | Move right |
| Left Ctrl | Fire / Shoot |
| Left Shift | Deploy bomb |
| P | Pause |
| Esc | Pause / Menu |

**Mobile:** Virtual D-pad (bottom-left) + Fire button (bottom-right) + Bomb button (above fire). See Section 4.3 for full spec.

### 0.5 Responsive Design (From Day 1)

- Canvas must scale to fit viewport on ALL devices — mobile, tablet, PC
- Use logical resolution + CSS `transform: scale()` — see Section 4.2 breakpoint table
- Mobile touch controls must be built in Phase 1 — NOT deferred to a later phase
- Auto-detect device type via `pointer` media query / screen width

### 0.6 Code Architecture

- **Follow the file structure in Section 7 EXACTLY** — same folder names, same file names
- Each entity (Player, Enemy, Bullet, etc.) is its own ES6 class in its own file
- Levels are **data/config objects** in `LevelData.js` — NOT hardcoded logic per level
- Game loop uses `requestAnimationFrame` with delta-time for frame-rate independence
- All magic numbers go in `Constants.js`

### 0.7 Phase Workflow

For each Phase:
1. Read this entire PDR
2. Check which tasks belong to the current phase
3. Implement tasks in order
4. Test each task in the browser
5. Commit to GitHub after phase completion
6. Deploy to Vercel after phase completion
7. Report completion to the user

### 0.8 Quality Bar

- **No console errors** in browser DevTools
- **60 FPS** target on desktop, 30 FPS minimum on mobile
- **All animations smooth** — no flickering, no sprite tearing
- **Collision detection accurate** — no phantom hits, no missed collisions
- **Sound does not overlap harshly** — use gain nodes to manage volume

---

## 1. Game Identity

| Field | Value |
|-------|-------|
| **Title** | Stellar Fury |
| **Publisher** | **Bharat App Studio** 🇮🇳 |
| **Genre** | 2D Vertical-Scroll Space Shooter (Shmup) |
| **Platform** | Web (Vercel) → Microsoft Store + Android |
| **Engine** | HTML5 Canvas + Vanilla JS (Vite bundled) |
| **Target Playtime** | **~2.5 hours** (20 levels, 5 acts) |
| **Controls** | Keyboard + Mouse / Touch (mobile d-pad) |

---

## 1.1 Publisher Branding — Bharat App Studio 🇮🇳

### Splash Screen (App Boot)
On game launch, before the main menu, a **2.5-second splash screen** displays:

```
┌─────────────────────────────────────┐
│                                     │
│     ██████╗  ██╗  ██╗  █████╗      │
│     ██╔══██╗ ██║  ██║ ██╔══██╗     │
│     ██████╦╝ ███████║ ███████║     │
│     ██╔══██╗ ██╔══██║ ██╔══██║     │
│     ██████╦╝ ██║  ██║ ██║  ██║     │
│     ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝   │
│                                     │
│       B H A R A T                   │
│       APP  STUDIO                   │
│     ━━━━━━━━━━━━━━━━━━━             │
│     🟠 broad brush stroke           │
│     ⚪ broad brush stroke           │
│     🟢 broad brush stroke           │
│                                     │
└─────────────────────────────────────┘
```

### Visual Style Specification
| Element | Detail |
|---------|--------|
| **"BHARAT"** | Large, bold display font (e.g., Outfit 800), letter-spaced, top line |
| **"APP STUDIO"** | Slightly smaller, same font, below "BHARAT" |
| **Tricolor Bar** | 3 horizontal **broad brush-stroke** bands beneath the text |
| **Saffron** | Pastel `hsl(28, 85%, 68%)` — `#E8A45C` — top stroke |
| **White** | Soft cream `hsl(40, 30%, 95%)` — `#F5F0E8` — middle stroke |
| **Green** | Pastel `hsl(140, 50%, 55%)` — `#5DBF78` — bottom stroke |
| **Brush Texture** | Rough-edge SVG/Canvas brush strokes (not flat rectangles) |
| **Background** | Deep space black `#0A0A12` with subtle star particles |
| **Animation** | Strokes paint left-to-right (staggered 0.3s each), text fades in |
| **Duration** | 2.5s display → fade to main menu |
| **Sound** | Soft cinematic whoosh on brush strokes |

### Placement Across the Game
| Location | How it appears |
|----------|----------------|
| **Splash Screen** | Full branded splash on game boot (described above) |
| **Main Menu** | Small "A Bharat App Studio Game" tagline below title, tricolor underline |
| **Credits Screen** | Full studio logo + "Made with ❤️ in India" |
| **Loading Screens** | Subtle tricolor progress bar |
| **Store Listings** | Publisher name in all store metadata |
| **Favicon / App Icon** | Small "BAS" monogram with tricolor accent |

> [!TIP]
> The pastel tricolor brush strokes give a **premium, artistic feel** — not garish flag colors, but elegant pastel versions that feel classy against the dark space theme.

---

## 2. Narrative Arc — "The Stellar Fury Campaign"

> **Setting:** Year 2847. The Zyphos Armada has shattered Earth's outer colonies. You are Commander Vex, pilot of the last prototype starfighter — *The Fury*. Fight through 5 galactic sectors to reach the Zyphos Homeworld and end the war.

| Act | Sector | Theme | Levels | Backdrop |
|-----|--------|-------|--------|----------|
| **I** | Frontier Belt | Asteroid mining zone, tutorial | 1–4 | `spr_sky_standard` + stars overlay |
| **II** | Nebula Expanse | Dense nebula, reduced visibility | 5–8 | `spr_sky_nebula1` + purple stars |
| **III** | Dead Zone | Derelict ships, mines, traps | 9–12 | `spr_sky_nebula2` + red stars |
| **IV** | Core Worlds | Heavy military resistance | 13–16 | `spr_sky_standard` + blue stars |
| **V** | Zyphos Throne | Final assault, boss gauntlet | 17–20 | `spr_sky_nebula2` + custom overlays |

---

## 3. Asset Inventory (Already Available)

### Ships (Player + can repurpose for enemies)
- **Hero Ships**: 5 custom modern designs (`hero_1` to `hero_5`) used by the player.
- **Ship 1** (Fighter): Gold / Purple / Red — *Enemy scout / unlockable*
- **Ship 2** (Interceptor): Gold / Purple / Red — *Elite enemy / unlockable*
- **Ship 3** (Heavy): Gold / Purple / Red — *Boss escort / unlockable*

### Weapons
- **Bullets**: Blue / Green / Yellow (2 styles each)
- **Lasers**: Blue / Green / Yellow (12-frame animated beams)
- **Muzzle Flashes**: Bullet + Laser variants (3 colors × 2 types)

### Environment
- **Asteroids**: Large (2 types) / Medium (2 types) / Small (2 types) × 3 materials (Gold, Ice, Rock) — 30-frame rotation
- **Backgrounds**: 3 sky bases + 5 star overlays + 3 planets + 2 clusters + 2 stars

### Effects
- **Explosions**: Large (24f) / Medium / Small
- **Thrusters**: Start / Loop (16f) / End sequences

### Assets We Need to Generate
- **Bharat App Studio splash screen** (tricolor brush-stroke branding)
- Power-up icons (shield, speed, weapon, health, bomb)
- Enemy ship variants (flip/recolor existing ships)
- Boss sprites (composite from existing ships)
- UI elements (HUD, menus, buttons)
- Sound effects (Web Audio API synthesized)

---

## 4. Core Mechanics

### 4.1 Player Ship
| Attribute | Base | Max (Upgraded) |
|-----------|------|----------------|
| Health | 100 HP | 200 HP |
| Speed | 5 px/f | 9 px/f |
| Fire Rate | 4 shots/sec | 12 shots/sec |
| Weapon Slots | 1 | 3 (front + 2 wing) |
| Shield | None | 3-hit absorb |
| Bombs | 1 | 5 |

### 4.2 Responsive Canvas & Device Scaling

The game canvas dynamically adapts to the device screen:

| Device | Screen Width | Canvas Strategy | Game Area |
|--------|-------------|-----------------|-----------|
| **Mobile (Portrait)** | < 600px | Full viewport width, 16:9 ratio | 360×640 logical, scaled up |
| **Mobile (Landscape)** | < 900px | Full viewport, letterboxed | 640×360 logical, scaled up |
| **Tablet** | 600–1024px | Full viewport, maintain aspect | 768×1024 logical |
| **PC / Laptop** | > 1024px | Centered, max 1280×720 | 1280×720 logical |

- **Scaling method:** Logical resolution stays fixed per breakpoint; CSS `transform: scale()` fits to viewport
- **Pixel-perfect:** All sprites render at integer scale factors (2×, 3×, 4×)
- **Orientation lock:** Recommend landscape on mobile, but portrait also supported
- **Safe zone:** HUD elements stay within 90% safe area for notched phones

### 4.3 Controls — Per Device

#### 🖥️ PC / Laptop (Keyboard)
| Key | Action |
|-----|--------|
| **↑ Arrow** | Move up |
| **↓ Arrow** | Move down |
| **← Arrow** | Move left |
| **→ Arrow** | Move right |
| **Ctrl** (Left) | Fire / Shoot primary weapon |
| **Shift** (Left) | Deploy bomb (screen-clear) |
| **S** | Cycle Player Ship (Visual Customization) |
| **L** | Cycle Laser Weapon (Visual Customization) |
| **Space / P / Esc** | Pause / Back to menu |

> Diagonal movement works by holding two arrow keys simultaneously.

#### 📱 Mobile / Tablet (On-Screen Gamepad)
```
┌──────────────────────────────────┐
│                                  │
│         GAME AREA                │
│        (full screen)             │
│                                  │
│                                  │
├──────────────────────────────────┤
│  ┌───────┐            ┌──┐ ┌──┐ │
│  │  ▲    │            │🔥│ │💣│ │
│  │◄ ● ► │            │  │ │  │ │
│  │  ▼    │            └──┘ └──┘ │
│  └───────┘                      │
│   D-PAD              FIRE  BOMB │
└──────────────────────────────────┘
```

| Element | Position | Size | Behavior |
|---------|----------|------|----------|
| **Virtual D-Pad** | Bottom-left, 20px from edge | 120×120px (scales with screen) | 8-directional via touch zones |
| **Fire Button** | Bottom-right | 70×70px circle | Tap = single shot, Hold = auto-fire |
| **Bomb Button** | Above fire button | 50×50px circle | Tap only (with cooldown indicator) |
| **Pause** | Top-right corner | 40×40px icon | Tap to pause |
| **Opacity** | All controls | 40% idle → 80% on touch | Semi-transparent to not block view |

> Gamepad area takes ~20% of screen height. Game area shrinks slightly to accommodate.
> Controls are **hidden on PC** (detected via pointer type / screen size).

- Ship confined to bottom 60% of screen
- Thruster animation plays on movement

### 4.3 Weapon Progression System

| Tier | Name | Visual | Behavior |
|------|------|--------|----------|
| 1 | Pulse Cannon | Blue bullet | Single shot, straight |
| 2 | Twin Blaster | Blue bullets ×2 | Dual parallel shots |
| 3 | Spread Shot | Green bullets ×3 | 15° fan spread |
| 4 | Rapid Fire | Yellow bullets | 3× fire rate |
| 5 | Laser Beam | Blue laser | Continuous beam, pierces |
| 6 | Plasma Storm | Green laser ×2 | Dual beams + bullet combo |
| 7 | FURY MODE | All colors | Triple laser + homing bullets |

> Weapon tier resets to Tier 1 on death. Collecting weapon power-ups advances tier.

### 4.4 Power-Up System

| Icon | Name | Effect | Duration | Color |
|------|------|--------|----------|-------|
| 🔫 | Weapon Up | +1 weapon tier | Permanent (until death) | Orange |
| 🛡️ | Shield | Absorbs 3 hits | Until depleted | Cyan |
| ⚡ | Speed Boost | +50% move speed | 10 seconds | Yellow |
| ❤️ | Health Pack | +25 HP | Instant | Red |
| 💣 | Bomb | +1 bomb charge | Instant | White |
| ⭐ | Score Multiplier | 2× points | 15 seconds | Gold |
| 🧲 | Magnet | Auto-collect pickups | 12 seconds | Purple |

Power-ups drop from destroyed enemies (15% chance) and special crates.

### 4.5 Scoring System
| Action | Points |
|--------|--------|
| Small enemy destroyed | 100 |
| Medium enemy destroyed | 250 |
| Large enemy destroyed | 500 |
| Asteroid destroyed | 50–200 (by size) |
| Boss destroyed | 5,000–25,000 |
| Power-up collected | 50 |
| No-damage level clear | 2,000 bonus |
| Bomb unused bonus | 500 each |
| Combo kills (< 1s apart) | 1.5× multiplier stacking |

---

## 5. Enemy Taxonomy

### 5.1 Regular Enemies

| Class | Sprite | HP | Speed | Attack | First Appears |
|-------|--------|-----|-------|--------|---------------|
| **Scout** | Ship1 (red, flipped) | 1 hit | Fast | None (kamikaze) | Level 1 |
| **Drone** | Ship1 (purple, flipped) | 2 hits | Medium | Single shot down | Level 2 |
| **Fighter** | Ship2 (red, flipped) | 3 hits | Medium | Aimed shots | Level 4 |
| **Bomber** | Ship3 (red, flipped) | 5 hits | Slow | Spread shot down | Level 6 |
| **Interceptor** | Ship2 (purple, flipped) | 4 hits | Fast | Burst fire | Level 9 |
| **Elite** | Ship3 (purple, flipped) | 8 hits | Medium | Laser beam | Level 13 |
| **Ace** | Ship2 (gold, flipped) | 6 hits | V.Fast | Homing missiles | Level 16 |

### 5.2 Obstacles

| Type | Asset | Behavior |
|------|-------|----------|
| **Asteroid (S)** | Small 1/2 variants | Drifts down, 1 hit to destroy |
| **Asteroid (M)** | Medium 1/2 variants | Drifts + rotates, splits into 2 small |
| **Asteroid (L)** | Large 1/2 variants | Slow drift, splits into 2 medium |
| **Mine** | Generated sprite | Stationary, explodes on proximity |
| **Debris** | Asteroid ice variants | Indestructible, must dodge |

### 5.3 Bosses (Every 4th Level)

| Boss | Level | Name | HP | Mechanics |
|------|-------|------|-----|-----------|
| 1 | 4 | **Alien Mothership** | 500 | Giant alien craft, deploys interceptor streams, bombers, and kamikaze drone swarms |
| 2 | 8 | **Nebula Wraith** | 800 | Cloaking phases, teleports, laser sweeps, fades in/out of nebula |
| 3 | 12 | **Mine Lord** | 1200 | Deploys mine fields, shield phases, must destroy generators |
| 4 | 16 | **Admiral Kron** | 2000 | Battleship, multi-turret, spawns fighters, has 3 phases |
| 5 | 20 | **Zyphos Prime** | 3500 | Final boss: 4 phases, all previous boss attacks combined |

---

## 6. Level-by-Level Design (20 Levels)

> Each level = **5–8 minutes**. Total campaign ≈ **2–2.5 hours**.

### ACT I — FRONTIER BELT (Levels 1–4) ⏱️ ~25 min

**Level 1: "First Contact"** (Tutorial)
- Enemies: Scouts only (waves of 3–5)
- Hazards: Small asteroids (sparse)
- Teaches: Movement, shooting, collecting power-ups
- Power-ups: Weapon Up guaranteed, Health Pack ×2
- Duration: ~2.5 min | Difficulty: ★☆☆☆☆

**Level 2: "Asteroid Alley"**
- Enemies: Scouts + Drones introduced
- Hazards: Medium asteroids that split, denser field
- New mechanic: Asteroid splitting, enemy shooting
- Power-ups: Shield introduced
- Duration: ~2.75 min | Difficulty: ★★☆☆☆

**Level 3: "Ambush Run"**
- Enemies: Scouts + Drones, enemies enter from sides
- Hazards: Mixed asteroid sizes, timed waves
- New mechanic: Side-scrolling enemy entries, combo scoring
- Power-ups: Speed Boost introduced, Bomb introduced
- Duration: ~3 min | Difficulty: ★★☆☆☆

**Level 4: BOSS — "Alien Mothership"**
- Pre-boss: Gauntlet of asteroid waves
- Boss: Giant alien mothership
- Phases: (1) Interceptor streams, (2) Target-lock drones, (3) Final kamikaze swarm
- Reward: Ship upgrade cutscene, unlock Ship 2 color
- Duration: ~4 min | Difficulty: ★★★☆☆

### ACT II — NEBULA EXPANSE (Levels 5–8) ⏱️ ~28 min

**Level 5: "Into the Fog"**
- Enemies: Drones + Fighters introduced
- Hazards: Nebula visibility mechanic (fog overlay restricts global view)
- New mechanic: Dynamic Multi-Lighting. Fog obscures standard enemies, but massive energy sources (like bosses) emit cinematic light auras that burn away the fog.
- Power-ups: Magnet introduced
- Duration: ~3.5 min | Difficulty: ★★★☆☆

**Level 6: "Bomber's Reach"**
- Enemies: Drones + Fighters + Bombers introduced
- Hazards: Bomber spread-shots create bullet curtains
- New mechanic: Bullet patterns to navigate
- Power-ups: Score Multiplier introduced
- Duration: ~3.75 min | Difficulty: ★★★☆☆

**Level 7: "Nebula Storm"**
- Enemies: Mixed waves, increasing speed
- Hazards: Nebula lightning (random screen-area damage zones)
- New mechanic: Environmental hazards (telegraphed danger zones)
- Special: Mid-level power-up crate convoy
- Duration: ~3.75 min | Difficulty: ★★★★☆

**Level 8: BOSS — "Nebula Wraith"**
- Pre-boss: Stealth enemy wave (enemies cloak/decloak)
- Boss: Phases between visible/invisible, sweeping laser arrays, dynamic pulsing plasma core
- Phases: (1) Predictive Peek-a-boo shots (aims at future player pos), (2) Sine-wave sweeping laser grids, (3) Clone split (2 copies)
- Reward: Laser weapon unlock
- Duration: ~4.5 min | Difficulty: ★★★★☆

### ACT III — DEAD ZONE (Levels 9–12) ⏱️ ~30 min

**Level 9: "Ghost Fleet"**
- Enemies: Interceptors introduced, mixed squads
- Hazards: Derelict ship debris (indestructible obstacles)
- New mechanic: Navigation through tight corridors
- Duration: ~7 min | Difficulty: ★★★★☆

**Level 10: "Minefield"**
- Enemies: Interceptors + Drones
- Hazards: Mines everywhere (proximity explosions)
- New mechanic: Mine avoidance, chain-detonation strategy
- Duration: ~7 min | Difficulty: ★★★★☆

**Level 11: "Survival Protocol"**
- Enemies: Endless waves (survive 90 seconds)
- Hazards: Escalating difficulty, no checkpoints
- New mechanic: Survival mode, resource management
- Special: Bonus life awarded for completion
- Duration: ~8 min | Difficulty: ★★★★★

**Level 12: BOSS — "Mine Lord"**
- Pre-boss: Dense minefield navigation
- Boss: Deploys mine patterns, has shield generators on flanks
- Phases: (1) Mine deploy, (2) Shield active, destroy generators, (3) Ramming attack
- Reward: Bomb capacity +2
- Duration: ~8 min | Difficulty: ★★★★★

### ACT IV — CORE WORLDS (Levels 13–16) ⏱️ ~32 min

**Level 13: "Blockade"**
- Enemies: Elites introduced, heavy formations
- Hazards: Shield barriers (must destroy generator to pass)
- New mechanic: Destructible environmental shields
- Duration: ~7 min | Difficulty: ★★★★☆

**Level 14: "Carrier Strike"**
- Enemies: Carrier ships that spawn fighters continuously
- Hazards: Must destroy carriers quickly or get overwhelmed
- New mechanic: Priority targeting strategy
- Duration: ~8 min | Difficulty: ★★★★★

**Level 15: "Fortress Approach"**
- Enemies: All types mixed, dense formations
- Hazards: Turret platforms (stationary but high damage)
- New mechanic: Turret dodging + enemy combat simultaneously
- Duration: ~8 min | Difficulty: ★★★★★

**Level 16: BOSS — "Admiral Kron"**
- Pre-boss: Elite squadron dogfight
- Boss: Massive battleship with multiple turrets
- Phases: (1) Turret barrage, (2) Fighter launch, (3) Core exposed, (4) Desperation laser
- Reward: FURY MODE weapon unlock
- Duration: ~9 min | Difficulty: ★★★★★

### ACT V — ZYPHOS THRONE (Levels 17–20) ⏱️ ~35 min

**Level 17: "The Gauntlet"**
- Enemies: Aces introduced, all enemy types
- Hazards: Homing missiles from Aces
- New mechanic: Homing projectile evasion
- Duration: ~8 min | Difficulty: ★★★★★

**Level 18: "Warp Storm"**
- Enemies: Enemies warp in randomly around player
- Hazards: Warp rifts (teleport player to random position)
- New mechanic: Spatial disorientation, 360° awareness
- Duration: ~8 min | Difficulty: ★★★★★

**Level 19: "Last Stand"**
- Enemies: Massive multi-wave assault, all types
- Hazards: Everything — asteroids + mines + environmental
- Special: All power-ups rain down, ultimate power fantasy
- Duration: ~9 min | Difficulty: ★★★★★

**Level 20: FINAL BOSS — "Zyphos Prime"**
- Pre-boss: Cinematic approach sequence
- Boss: 4-phase ultimate fight
  - Phase 1: Rock Titan's asteroid attacks
  - Phase 2: Nebula Wraith's cloak + lasers
  - Phase 3: Mine Lord's mine patterns + Admiral Kron's turrets
  - Phase 4: True form — bullet-hell finale
- Reward: Victory cutscene, final score, credits
- Duration: ~10 min | Difficulty: ★★★★★+

---

## 7. Tech Architecture

```
stellar-fury/
├── public/
│   └── assets/          ← All sprite folders copied here
│       ├── ships/
│       ├── backgrounds/
│       ├── asteroids/
│       ├── explosions/
│       ├── lasers/
│       ├── projectiles/
│       ├── thrusters/
│       ├── muzzle-flashes/
│       ├── powerups/     ← Generated icons
│       ├── ui/           ← Generated UI elements
│       └── audio/        ← Generated SFX
├── src/
│   ├── main.js           ← Entry point, game loop
│   ├── engine/
│   │   ├── Game.js       ← Core game class
│   │   ├── Renderer.js   ← Canvas rendering
│   │   ├── Input.js      ← Keyboard/Touch handler
│   │   ├── Audio.js      ← Web Audio SFX engine
│   │   ├── AssetLoader.js← Sprite/animation loader
│   │   ├── Collision.js  ← AABB + circle collision
│   │   ├── Particles.js  ← Particle system
│   │   └── Camera.js     ← Scroll + shake effects
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   ├── Bullet.js
│   │   ├── Asteroid.js
│   │   ├── PowerUp.js
│   │   └── Explosion.js
│   ├── levels/
│   │   ├── LevelManager.js  ← Wave spawning, progression
│   │   ├── LevelData.js     ← All 20 level configs
│   │   └── WavePatterns.js   ← Enemy formation patterns
│   ├── ui/
│   │   ├── HUD.js         ← Health, score, weapon display
│   │   ├── MainMenu.js    ← Title screen
│   │   ├── PauseMenu.js
│   │   ├── GameOver.js
│   │   ├── LevelSelect.js
│   │   └── Leaderboard.js
│   └── utils/
│       ├── Constants.js
│       ├── MathUtils.js
│       └── Storage.js    ← LocalStorage save/load
├── index.html
├── style.css
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

### Tech Stack
| Component | Technology |
|-----------|-----------|
| Bundler | Vite |
| Rendering | HTML5 Canvas 2D |
| Audio | Web Audio API (synthesized SFX) |
| State | Vanilla JS classes |
| Storage | LocalStorage (saves) + Vercel KV (leaderboard) |
| Hosting | Vercel (free tier) |
| VCS | GitHub |
| Future: Desktop | Electron → Microsoft Store |
| Future: Mobile | Capacitor → Android APK |

---

## 8. Implementation Phases

### 🟢 PHASE 1 — Engine + Levels 1–3 (LIVE PLAYABLE)
> **Goal:** Playable demo with 3 levels, deployed to Vercel

| Task | Description | Est. |
|------|-------------|------|
| 1.0 | **Bharat App Studio splash screen** (tricolor brush animation) | 20 min |
| 1.1 | Vite project setup, asset pipeline | 20 min |
| 1.2 | Game loop, Canvas renderer, input system | 30 min |
| 1.3 | Player ship (movement, shooting, thruster anim) | 30 min |
| 1.4 | Bullet system + muzzle flash animations | 20 min |
| 1.5 | Asteroid system (spawn, rotate, split, collide) | 30 min |
| 1.6 | Enemy: Scout + Drone (AI, shooting, death) | 30 min |
| 1.7 | Explosion animations | 15 min |
| 1.8 | Power-up system (Weapon Up, Shield, Health) | 25 min |
| 1.9 | HUD (HP bar, score, weapon tier, lives) | 20 min |
| 1.10 | Background parallax scrolling | 15 min |
| 1.11 | Level 1, 2, 3 wave data + transitions | 30 min |
| 1.12 | Main menu (with BAS tagline) + Game Over screen | 20 min |
| 1.13 | Web Audio SFX (shoot, explode, pickup, music) | 25 min |
| 1.14 | GitHub repo + Vercel deploy | 15 min |
| **Total** | | **~6 hrs** |

### 🟡 PHASE 2 — Boss 1 + Levels 4–8
| Task | Description |
|------|-------------|
| 2.1 | Boss system architecture (phases, HP bars, patterns) |
| 2.2 | Boss 1: Rock Titan implementation |
| 2.3 | Fighter + Bomber enemy types |
| 2.4 | Nebula fog visibility mechanic |
| 2.5 | Environmental hazards (lightning zones) |
| 2.6 | Levels 5–7 wave data |
| 2.7 | Boss 2: Nebula Wraith implementation |
| 2.8 | Speed Boost, Bomb, Magnet, Score Multiplier power-ups |
| 2.9 | Combo scoring system |
| 2.10 | Level transition cinematics |

### 🟠 PHASE 3 — Levels 9–12 + Polish
| Task | Description |
|------|-------------|
| 3.1 | Interceptor enemy type |
| 3.2 | Mine system (proximity, chain detonation) |
| 3.3 | Indestructible debris obstacles |
| 3.4 | Survival mode mechanics (Level 11) |
| 3.5 | Boss 3: Mine Lord implementation |
| 3.6 | Levels 9–12 wave data |
| 3.7 | Particle system enhancements |
| 3.8 | Screen shake + juice effects |

### 🔴 PHASE 4 — Levels 13–16 + Advanced
| Task | Description |
|------|-------------|
| 4.1 | Elite + Ace enemy types |
| 4.2 | Shield barrier / generator mechanics |
| 4.3 | Carrier ship spawner enemies |
| 4.4 | Turret platform obstacles |
| 4.5 | Boss 4: Admiral Kron (multi-phase battleship) |
| 4.6 | Homing missile system |
| 4.7 | FURY MODE weapon implementation |
| 4.8 | Levels 13–16 wave data |

### 🟣 PHASE 5 — Levels 17–20 + Final Boss
| Task | Description |
|------|-------------|
| 5.1 | Warp rift mechanic |
| 5.2 | Bullet-hell pattern system |
| 5.3 | Final Boss: Zyphos Prime (4 phases) |
| 5.4 | Levels 17–20 wave data |
| 5.5 | Victory sequence + credits |
| 5.6 | Difficulty balancing pass |

### ⚪ PHASE 6 — Cross-Platform + Store
| Task | Description |
|------|-------------|
| 6.1 | Mobile touch controls (virtual d-pad) |
| 6.2 | Responsive canvas scaling |
| 6.3 | Vercel KV global leaderboard |
| 6.4 | Electron wrapper → Microsoft Store |
| 6.5 | Capacitor wrapper → Android APK |
| 6.6 | Store listing assets (screenshots, description) |

---

## 9. Deployment Strategy

### Vercel + GitHub Flow
```
Local Dev → GitHub Push → Vercel Auto-Deploy
                ↓
        vercel.com/stellar-fury
```

- **Branch strategy**: `main` (production) / `dev` (active work)
- **CI/CD**: Vercel auto-builds on push to `main`
- **Assets**: Served from `/public/assets/` (Vite static)
- **API Routes**: `/api/leaderboard` (Vercel serverless for scores)

### Microsoft Store Path
1. Wrap final build in Electron
2. Package with `electron-builder` → `.appx`
3. Submit to Microsoft Partner Center

### Android Path
1. Wrap with Capacitor
2. Build → `.apk` / `.aab`
3. Submit to Google Play Console

---

## 10. Pro Game Design Features

### 10.1 🔫 Auto-Fire Toggle
- **Setting:** Toggle in options menu (default OFF on PC, ON on mobile)
- Player ship fires continuously when enabled — player focuses purely on movement/dodging
- Visual indicator on HUD when active: small `[AUTO]` badge near weapon tier
- Can still tap/hold fire button to override with burst patterns

### 10.2 🎵 Dynamic Adaptive Music System
Instead of a static loop, music responds to gameplay intensity:

| Game State | Music Layer | Instruments |
|------------|------------|-------------|
| **Cruising** (no enemies) | Ambient pad only | Soft synth, reverb |
| **Light combat** (< 5 enemies) | + Rhythmic pulse | Bass drum, hi-hat |
| **Heavy combat** (5+ enemies) | + Full beat + melody | Full drums, lead synth |
| **Boss intro** | Dramatic stinger | Crash cymbal, brass hit |
| **Boss fight** | Unique boss theme | Intense, fast tempo |
| **Victory** | Triumphant sting | Major chord fanfare |
| **Death** | Somber drone | Low reverb fade |

> All generated via Web Audio API oscillators + filters. Layers crossfade over 0.5 seconds.

### 10.3 💀 Mercy Mechanics (Softer Death)
Instead of full reset on death:

| Mechanic | Classic (Harsh) | Stellar Fury (Merciful) |
|----------|----------------|------------------------|
| Weapon tier on death | Reset to 1 | Drop **2 tiers** (min tier 1) |
| Respawn protection | None | **3 seconds invincibility** (ship blinks) |
| Last Chance | None | Once per level: at 0 HP, **2-second slow-mo** — kill an enemy to survive at 10 HP |

- Last Chance triggers dramatic visual: screen edges go red, heartbeat SFX, everything slows to 30%
- If player gets the kill → triumphant flash + "SAVED!" text
- If timer expires → normal death

### 10.4 🏆 Star Rating Per Level (⭐⭐⭐)
After each level, award stars based on performance:

| Stars | Requirement |
|-------|------------|
| ⭐ | Level completed |
| ⭐⭐ | Completed with **zero deaths** |
| ⭐⭐⭐ | Zero deaths + **80% enemies killed** + **under par time** |

- Stars displayed on Level Select screen (total: 60 stars across 20 levels)
- Star milestones unlock rewards:
  - 10 stars → Unlock Ship 2
  - 25 stars → Unlock Ship 3
  - 40 stars → Unlock gold color variants
  - 55 stars → Unlock "FURY" skin (special visual effect on ship)
  - 60 stars → "Perfect Pilot" achievement badge

### 10.5 🎨 Ship Customization Screen
Pre-mission screen where player selects:

```
┌─────────────────────────────────────────┐
│       SELECT YOUR SHIP                  │
│                                         │
│   [Ship 1]    [Ship 2🔒]   [Ship 3🔒]  │
│    Fighter     Interceptor    Heavy     │
│                                         │
│   COLOR:  🟠Gold  🟣Purple  🔴Red      │
│                                         │
│   STATS:                                │
│   Speed:   ████████░░  8/10             │
│   Armor:   ████░░░░░░  4/10             │
│   Firepower:██████░░░░ 6/10             │
│                                         │
│        [ LAUNCH MISSION → ]             │
└─────────────────────────────────────────┘
```

| Ship | Speed | Armor | Firepower | Unlock |
|------|-------|-------|-----------|--------|
| **Fighter** (Ship 1) | 8/10 | 4/10 | 6/10 | Default |
| **Interceptor** (Ship 2) | 10/10 | 3/10 | 7/10 | 10 stars |
| **Heavy** (Ship 3) | 5/10 | 9/10 | 8/10 | 25 stars |

### 10.6 📊 Between-Level Upgrade Shop
After completing a level, before auto-continue, player can spend **credits** earned from score:

| Upgrade | Cost | Effect | Max Level |
|---------|------|--------|-----------|
| Hull Plating | 500 | +10 max HP | 5 (= +50 HP) |
| Starter Weapon | 1000 | Begin level at weapon tier +1 | 3 (start at tier 4) |
| Bomb Bay | 750 | +1 starting bomb | 3 (= 4 bombs) |
| Magnet Range | 400 | +20% pickup collection radius | 5 |
| Lucky Drops | 600 | +5% power-up drop chance | 3 |
| Thicker Shield | 800 | Shield absorbs +1 hit | 2 (= 5-hit shield) |

- **Credits earned:** Score ÷ 10 (so 50,000 points = 5,000 credits)
- Upgrades persist across sessions (saved to LocalStorage)
- Visual: sleek upgrade cards with level indicators

### 10.7 🌊 Cinematic Wave Announcements
Between enemy waves, display dramatic on-screen text:

| Event | Visual | Duration |
|-------|--------|----------|
| **Wave start** | `⚠️ WAVE 3 INCOMING` slides from left | 1.5s |
| **Mini-boss** | `ELITE SQUADRON DETECTED` + warning siren | 2s |
| **Boss intro** | Screen darkens, `⚠️ WARNING ⚠️` flashes red 3×, boss name reveals | 3s |
| **Wave clear** | `WAVE CLEAR ✓` + brief 2-second breather | 2s |
| **Level clear** | `MISSION COMPLETE` + star rating reveal | 3s |

- Text uses glow effect matching the current weapon color
- Brief 1–2 second breathing room between waves (no enemies, collect floating power-ups)

### 10.8 📳 Haptic Feedback (Mobile)
Using `navigator.vibrate()` for tactile game feel:

| Event | Vibration Pattern | Intensity |
|-------|------------------|-----------|
| Shooting | `[10]` (10ms pulse) | Light tap |
| Getting hit | `[50, 30, 50]` | Medium double-buzz |
| Bomb detonation | `[100, 50, 100, 50, 200]` | Heavy rumble |
| Boss defeated | `[50, 30, 50, 30, 50, 30, 300]` | Celebration pattern |
| Death | `[200, 100, 400]` | Long sad rumble |
| Power-up collected | `[15, 15, 15]` | Quick triple-tap |

> Haptics can be toggled off in settings. PC is unaffected.

### 10.9 🔄 Daily Challenge Mode (Post-Launch)
- Unlocks after completing Level 5
- **One procedurally-generated level per day** — same seed worldwide
- Combines random enemy waves + random hazards + random power-ups
- **Global leaderboard** (Vercel KV) — compete for daily #1
- Resets at midnight UTC
- Reward: bonus credits for top 10% daily finishers

### 10.10 ▶️ Auto-Continue System ("Just One More Level")
After level completion and star reveal, the game shows a **Netflix-style countdown**:

```
┌─────────────────────────────────────────┐
│                                         │
│   ⭐⭐⭐ MISSION COMPLETE!              │
│   Score: 45,200  |  Credits: +4,520     │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  NEXT: Level 4 — "Rock Titan"  │   │
│   │  [backdrop preview + enemy      │   │
│   │   silhouettes slowly moving]    │   │
│   └─────────────────────────────────┘   │
│                                         │
│   Auto-launching in... ④               │
│   ━━━━━━━━━━━━━━━━━░░░░  (progress bar) │
│                                         │
│   [ ⏸ PAUSE ]        [ UPGRADE SHOP ]  │
│                                         │
└─────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **Countdown** | 5-second timer with animated circular countdown + progress bar |
| **Preview** | Next level's backdrop scrolls slowly, enemy silhouettes drift across |
| **Auto-launch** | After 5 seconds, seamlessly transitions into next level |
| **⏸ PAUSE button** | Stops the countdown, stays on this screen indefinitely |
| **UPGRADE SHOP** | Opens shop (pauses countdown), returns here after |
| **On resume** | Countdown resets to 5 seconds from pause |

> This keeps players in the **flow state** — they never have to navigate a menu to continue. But the pause button respects their agency if they need a break.

---

## 11. Key Design Principles

1. **Progressive Difficulty** — Each level introduces exactly ONE new mechanic
2. **Fair Death** — Every death should feel avoidable in hindsight
3. **Mercy Over Punishment** — Last Chance + soft tier drops keep frustration low
4. **Rewarding Power Fantasy** — Max weapon tier should feel INCREDIBLE
5. **Visual Juice** — Screen shake, particles, flash on every impact
6. **Respect Player Time** — Checkpoints at act boundaries, quick restart
7. **Flow State** — Auto-continue + wave pacing keeps the player in the zone
8. **Mobile-First Touch** — Controls, auto-fire, haptics designed for mobile
9. **Progression Hooks** — Stars + shop upgrades + ship unlocks = "one more level"
10. **Modular Levels** — Each level is a JSON config, easy to add/modify

---

> [!IMPORTANT]
> **Immediate Action:** Approve this plan, and we start PHASE 1 — building the engine + Levels 1–3 to get a playable demo live on Vercel ASAP.
