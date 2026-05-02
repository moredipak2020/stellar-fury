export class Background {
  constructor(game) {
    this.game = game;
    this.bgY1 = 0;
    this.bgY2 = -game.canvas.height;
    this.starY1 = 0;
    this.starY2 = -game.canvas.height;
    this.bgSpeed = 50; // pixels per sec
    this.starSpeed = 150; // pixels per sec
    
    this.bgName = 'bg_standard';
    this.starName = 'bg_stars1';
    
    // Props are objects: { imgName, x, y, speed, scale, width, height }
    this.props = [];
  }

  setTheme(bgName, starName) {
    this.bgName = bgName;
    this.starName = starName;
  }

  addProp(imgName, x, y, speed, scale, blend = 'normal') {
    const img = this.game.assets.getImage(imgName);
    if (!img) return;
    let cachedCanvas = null;
    
    if (imgName.startsWith('bg_nebula')) {
      cachedCanvas = document.createElement('canvas');
      cachedCanvas.width = img.width * scale;
      cachedCanvas.height = img.height * scale;
      const tempCtx = cachedCanvas.getContext('2d');
      tempCtx.drawImage(img, 0, 0, cachedCanvas.width, cachedCanvas.height);
      
      const gradient = tempCtx.createRadialGradient(
        cachedCanvas.width/2, cachedCanvas.height/2, 0, 
        cachedCanvas.width/2, cachedCanvas.height/2, cachedCanvas.width/2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.5, 'rgba(0,0,0,0.8)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, cachedCanvas.width, cachedCanvas.height);
    }

    this.props.push({
      imgName,
      x,
      y,
      speed,
      scale,
      blend,
      width: img.width * scale,
      height: img.height * scale,
      cachedCanvas
    });
  }

  update(deltaTime) {
    this.bgY1 += this.bgSpeed * (deltaTime / 1000);
    this.bgY2 += this.bgSpeed * (deltaTime / 1000);
    
    if (this.bgY1 >= this.game.canvas.height) this.bgY1 = -this.game.canvas.height + this.bgY2;
    if (this.bgY2 >= this.game.canvas.height) this.bgY2 = -this.game.canvas.height + this.bgY1;

    this.starY1 += this.starSpeed * (deltaTime / 1000);
    this.starY2 += this.starSpeed * (deltaTime / 1000);

    if (this.starY1 >= this.game.canvas.height) this.starY1 = -this.game.canvas.height + this.starY2;
    if (this.starY2 >= this.game.canvas.height) this.starY2 = -this.game.canvas.height + this.starY1;

    // Update props
    this.props.forEach(p => {
      p.y += p.speed * (deltaTime / 1000);
    });
    
    // Remove off-screen props
    this.props = this.props.filter(p => p.y < this.game.canvas.height + p.height);
  }

  draw(ctx) {
    const bgImg = this.game.assets.getImage(this.bgName);
    const starImg = this.game.assets.getImage(this.starName);

    if (bgImg) {
      ctx.drawImage(bgImg, 0, Math.floor(this.bgY1), this.game.canvas.width, this.game.canvas.height);
      ctx.drawImage(bgImg, 0, Math.floor(this.bgY2), this.game.canvas.width, this.game.canvas.height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.game.canvas.height);
      gradient.addColorStop(0, '#040508');
      gradient.addColorStop(1, '#0c0f1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    // Draw props (behind stars, over background)
    this.props.forEach(p => {
      const img = this.game.assets.getImage(p.imgName);
      if (img) {
        if (p.blend !== 'normal') {
          ctx.globalCompositeOperation = p.blend;
        }
        
        if (p.cachedCanvas) {
          ctx.drawImage(p.cachedCanvas, p.x - p.width/2, p.y - p.height/2);
        } else {
          ctx.drawImage(img, p.x - p.width/2, p.y - p.height/2, p.width, p.height);
        }
        
        if (p.blend !== 'normal') {
          ctx.globalCompositeOperation = 'source-over'; // reset
        }
      }
    });

    if (starImg) {
      ctx.drawImage(starImg, 0, Math.floor(this.starY1), this.game.canvas.width, this.game.canvas.height);
      ctx.drawImage(starImg, 0, Math.floor(this.starY2), this.game.canvas.width, this.game.canvas.height);
    }
  }
}
