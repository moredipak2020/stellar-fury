# Level Testing Option

## What We Did
We added a temporary developer cheat/testing option that allows the player to instantly jump to any of the first 8 levels during gameplay.

## Why We Did It
To facilitate rapid testing of all the levels completed up through Act II (Levels 1-8). This ensures we can quickly verify that boss encounters, enemy waves, mechanics, and bug fixes are working as intended without having to play through the entire game sequentially.

## How to Use
While playing the game, simply press the number keys `1` through `8` on your keyboard to instantly transition to that respective level.
* Example: Press `4` to jump to the Level 4 Boss (Alien Mothership).
* Example: Press `8` to jump to the Level 8 Boss (Nebula Wraith).

---

## How to Reverse These Changes

Once the testing phase is complete, you can safely remove these debug options before releasing the game by reverting the following code blocks:

### 1. Revert `src/engine/Input.js`
Open `src/engine/Input.js` and make the following changes:

**Remove from the constructor:**
```javascript
      bomb: false,
      pause: false,
      debugLevel: null // <-- REMOVE THIS LINE
```

**Remove from `handleKey()`:**
```javascript
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
        if (isPressed) {
          this.keys.debugLevel = parseInt(e.key, 10);
        }
        e.preventDefault();
        break;
```

### 2. Revert `src/engine/Game.js`
Open `src/engine/Game.js` and make the following change:

**Remove from the `update(deltaTime)` method:**
```javascript
    if (this.input.keys.debugLevel !== null) {
        const targetLevel = this.input.keys.debugLevel - 1;
        this.levelManager.startLevel(targetLevel);
        this.input.keys.debugLevel = null;
    }
```

Once you're done testing, you can ask me to "remove the changes from `level_testing_option.md`" and I will automatically revert them for you!
