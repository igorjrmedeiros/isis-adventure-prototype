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

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

var player;
var fyresA, fyresB;
var babyBottles;
var staticBlock, dinamicBlock;

var objectFixo;
var objectMove;

var score = 0;
var scoreText;

const MAX_MAP_TIME = 500 // quantos minutos / segundos da fase (10 segundos)
var timeText; 
var timeStop = false // verefica se o tempo chegou a 0, true se sim, false se nao 
var timeEvent; //guarda o tempo contando a cada segundo
var timeLeft = MAX_MAP_TIME  //decrementa os minutos definido

var ranking = [] // guarda os pontos do score
var addScore = 0
var rankingText;

var restartImg;
var levelFase;

var wave = 1
var quantityWave = 3
var waveText;


// RODA ANTES DO JOGO COMEÇAR
function preload() {
  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyboardCursor = this.input.keyboard.createCursorKeys();

  this.load.image("isis", "src/assets/isis-48x48.png");
  this.load.image("bottle", "src/assets/baby-bottle.png");

  this.load.image("object", "src/assets/platform.png");

  this.load.image("restart", "src/assets/restart.png")
  this.load.image('game-over', "src/assets/game-over.png")
  this.load.image("vitory", "src/assets/vitory.png")

  this.load.image("objectMove", "src/assets/objMove.png")
}

function create() {
  var camera = this.cameras.main;
  
  if (wave === 1) {
    camera.setBackgroundColor("#ffb969");

      // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group();

    babyBottles.create(200, 200, "bottle");
    babyBottles.create(300, 300, "bottle");
    babyBottles.create(500, 100, "bottle");
    babyBottles.create(700, 500, "bottle");
    babyBottles.create(600, 400, "bottle");
    babyBottles.create(500, 600, "bottle");
    babyBottles.create(100, 700, "bottle");
    babyBottles.create(750, 100, "bottle");

      // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup();

    objectFixo.create(200, 250, "object");
    objectFixo.create(400, 250, "object");
    objectFixo.create(200, 450, "object");
    objectFixo.create(700, 650, "object");
  }

  if (wave === 2) {
    camera.setBackgroundColor("#153a55");

      // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group();

    babyBottles.create(200, 200, "bottle");
    babyBottles.create(300, 300, "bottle");
    babyBottles.create(500, 100, "bottle");
    babyBottles.create(700, 500, "bottle");
    babyBottles.create(600, 400, "bottle");
    babyBottles.create(500, 600, "bottle");
    babyBottles.create(100, 700, "bottle");
    babyBottles.create(750, 100, "bottle");

      // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup();

    objectFixo.create(400, 250, "object");
    objectFixo.create(400, 450, "object");
    objectFixo.create(400, 650, "object");
  }

  if (wave === 3) {
    camera.setBackgroundColor("#3c641b");

      // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group();

    babyBottles.create(200, 200, "bottle");
    babyBottles.create(300, 300, "bottle");
    babyBottles.create(500, 100, "bottle");
    babyBottles.create(700, 500, "bottle");
    babyBottles.create(600, 400, "bottle");
    babyBottles.create(500, 600, "bottle");
    babyBottles.create(100, 700, "bottle");
    babyBottles.create(750, 100, "bottle");

      // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup();

    objectFixo.create(-100, 250, "object");
    objectFixo.create(900, 250, "object");
    objectFixo.create(-100, 450, "object");
    objectFixo.create(900, 450, "object");
    objectFixo.create(900, 650, "object");
    objectFixo.create(-100, 650, "object");
    objectFixo.create(400, 650, "object");
    objectFixo.create(400, 450, "object");
    objectFixo.create(400, 250, "object");
  }

    //WAVE
  waveText = this.add.text(700, 20, 'Wave: ' + wave, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#ff004c",
  })

    //TIMER
  timeText = this.add.text(game.config.width / 2, 20, "Time: " + MAX_MAP_TIME, {
    fontFamily: "Arial",
    fontSize: '20px',
    color: "#ff00fb",
  });
  timeText.setOrigin(0.5, 0);

  
  // SCORE
  scoreText = this.add.text(10, 20, "Score: " + score, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#8000ff",
  });


  objectMove = this.physics.add.sprite(150, 100, 'objectMove')
  objectMove.setCollideWorldBounds(true) //colidir/ nao sair do mapa
  objectMove.setPushable(true) // isso aqui é o segredo, ele que faz empurrar 
  //objectMove.body.setAllowGravity(false)
  objectMove.setDrag(1000) // faz parar de "andar" quando é empurrado
  objectMove.setImmovable(false) // so uma garantia de fazer ele se mover

  
  // ISIS 
  player = this.physics.add.sprite(30, 100, "isis");
  player.setCollideWorldBounds(true);
 

  // COLISÃO E COLETA
  this.physics.add.overlap(player, babyBottles, collectBottle, null, this);
  this.physics.add.collider(player, objectFixo); 
  this.physics.add.collider(objectMove, objectFixo) 
  this.physics.add.collider(player, objectMove); 

  //TIME
  //this.time relogio phaser
  //addEvent: executar algo baseado em tempo
  timeEvent = this.time.addEvent({
    delay: 1000, // esperar 1 segundo para executar o evento
    callback: updateTimer, // função que é chamada, executada
    callbackScope: this, // sem isso no updateTimer, o this vira undefined (this.physics.pause() quebra). this = scene do jogo
    loop: true, //repete infinitamente
  });
}


function update() {
  if (this.keyW.isDown) {
    player.setVelocityY(-200);
  } else if (this.keyA.isDown) {
    player.setVelocityX(-200);
  } else if (this.keyS.isDown) {
    player.setVelocityY(200);
  } else if (this.keyD.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
    player.setVelocityY(0);
  }
}


// coleção com mamadeira
function collectBottle(player, babyBottles) {
  babyBottles.destroy();

  score += 20;
  scoreText.setText("Score: " + score);
}


//CRONOMETRO
function updateTimer() {
  timeLeft--;

  timeText.setText("Time: " + timeLeft);

  if (timeLeft <= 0) {
    timeEvent.remove()
    this.physics.pause();
    timeText.setText("Time: " + timeLeft);

    timeStop = true
  }

  if (timeStop === true) {
    
    if(score === 0) {
      levelFase = this.add.image(400,210, "game-over")

      restartImg = this.physics.add.sprite(400, 420, "restart").setInteractive();
      restartImg.on('pointerdown', () => {
        this.scene.restart();
        timeStop = false
        timeLeft = MAX_MAP_TIME
        score = 0
      });
    } 
    
    if(score > 0) {
      ranking.push(score)
      wave += 1

      if (wave <= quantityWave) {
        this.scene. restart()
        timeStop = false
        timeLeft = MAX_MAP_TIME
        score = 0
      } 
      
      else {
        levelFase = this.add.image(400, 210, "vitory")

        for(let i = 0; i < ranking.length; i++) {
          addScore += ranking[i]
        }

        rankingText = this.add.text(300, 400, "Total: " + addScore, {
          fontSize: '50px', 
          fontFamily: 'Arial',
          color: "#ff7b00",
        })
      }
    }

  }
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
