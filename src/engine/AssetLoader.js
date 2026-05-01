export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.promises = [];
  }

  loadImage(name, src) {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
    this.promises.push(promise);
    return promise;
  }

  getImage(name) {
    return this.images.get(name);
  }

  async loadAll() {
    return Promise.all(this.promises);
  }
}
