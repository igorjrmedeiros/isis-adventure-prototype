const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 768,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  parent: "gameHtml",
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

