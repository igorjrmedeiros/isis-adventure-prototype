const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  parent: "gameContainer",
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
};

var game = new Phaser.Game(config);

var player;
var fyresA, fyresB;
var staticBlock, dinamicBlock;

function preload() {
  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyboardCursor = this.input.keyboard.createCursorKeys();
}

function create() {
  var camera = this.cameras.main;
  var timeValue = "0:00";
  var scoreValue = 0;

  camera.setBackgroundColor("#ffb969");

  var timeText = this.add.text(
    game.config.width / 2,
    20,
    "Time: " + timeValue,
    { fontFamily: "Arial", fontSize: 20, color: "#ff00fb" },
  );
  timeText.setOrigin(0.5, 0);

  var scoreText = this.add.text(30, 20, "Score: " + scoreValue, {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#8000ff",
  });

  player = this.add.circle(100, 200, 24, 0xe732c8);
  //const playerStyle = this.add.graphics({ fillStyle: { color: 0xe732c8 } });
  //playerStyle.fillCircleShape(player);

  fyresA = this.add.rectangle(100, 300, 48, 48);
  const fyresAStyle = this.add.graphics({ fillStyle: { color: 0x921818 } });
  fyresAStyle.fillRectShape(fyresA);

  fyresB = this.add.rectangle(100, 400, 48, 48);
  const fyresBStyle = this.add.graphics({ fillStyle: { color: 0x1843c4 } });
  fyresBStyle.fillRectShape(fyresB);

  staticBlock = this.add.rectangle(100, 500, 48, 48);
  const staticBlockStyle = this.add.graphics({
    fillStyle: { color: 0xac590b },
    lineStyle: { color: 0x000000 },
  });
  staticBlockStyle.fillRectShape(staticBlock);
  staticBlockStyle.strokeRectShape(staticBlock);

  dinamicBlock = this.add.rectangle(100, 600, 48, 48);
  const dinamicBlockStyle = this.add.graphics({
    fillStyle: { color: 0xac590b },
    lineStyle: { color: 0x00ff00 },
  });
  dinamicBlockStyle.fillRectShape(dinamicBlock);
  dinamicBlockStyle.strokeRectShape(dinamicBlock);
}

function update() {

  if (this.keyW.isDown) {
    player.y -= 2;
  }
  if (this.keyA.isDown) {
    player.x -= 2;
  }
  if (this.keyS.isDown) {
    player.y += 2;
  }
  if (this.keyD.isDown) {
    player.x += 2;
  }

  console.log(player.x, player.y)
}

/*
Mapa:
960 x 960
Fundo bege

Isis: Quadrado   -> Rosa
Fyres: Quadrado 
  Anda aleatorio -> Vermelho
  Persegue       -> Azul
Blocos: Retangulos
  Que movimentam -> Verde
  Estáticos      -> Marrom

Score: texto simples

Tempo: texto simples
*/
