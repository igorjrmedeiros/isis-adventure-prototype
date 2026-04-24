const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 768,
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
}

var game = new Phaser.Game(config)

var player
var fyresA, fyresB
var babyBottles
var staticBlock, dinamicBlock

var objectFixo
var objectMove

var score = 0
var scoreText

const MAX_MAP_TIME = 500 // minutos da fase
var timeText
var timeStop = false // false se chegou no tempo 0
var timeEvent //guarda o tempo contando a cada segundo
var timeLeft = MAX_MAP_TIME //decrementa os minutos definido

var ranking = [] // guarda os pontos do score
var addScore = 0
var rankingText

var restartImg
var levelFase

var wave = 1
var quantityWave = 3
var waveText

const pixelSize = 48 // pixels
const totalRows = game.canvas.width / pixelSize
const totalColumns = game.canvas.height / pixelSize

var gridArray = []

var gridNumber = 0 //numero da grade

var gridMap = new Map()

var graphics //graficos

var gridCreated = false //gradeCriada

var path = [] //caminho

var tweenFyre = null

var currentPathIndex = 0 //caminhoAtualIndex

// RODA ANTES DO JOGO COMEÇAR
function preload() {
  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
  this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  this.keyboardCursor = this.input.keyboard.createCursorKeys()

  this.load.image("isis", "src/assets/isis-48x48.png")
  this.load.image("fyres", "src/assets/fyres.png")
  this.load.image("bottle", "src/assets/mamadeira-48x48..png")

  this.load.image("object", "src/assets/platform.png")

  this.load.image("restart", "src/assets/restart.png")
  this.load.image("game-over", "src/assets/game-over.png")
  this.load.image("vitory", "src/assets/vitory.png")

  this.load.image("objectMove", "src/assets/objMove.png")
}

function create() {
  if (gridMap) {
    graphics = this.add.graphics()
  }

  var camera = this.cameras.main

  if (wave === 2) {
    camera.setBackgroundColor("#153a55")

    // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group()

    babyBottles.create(200, 200, "bottle")
    babyBottles.create(300, 300, "bottle")
    babyBottles.create(500, 100, "bottle")
    babyBottles.create(700, 500, "bottle")
    babyBottles.create(600, 400, "bottle")
    babyBottles.create(500, 600, "bottle")
    babyBottles.create(100, 700, "bottle")
    babyBottles.create(750, 100, "bottle")

    // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup()

    objectFixo.create(400, 250, "object")
    objectFixo.create(400, 450, "object")
    objectFixo.create(400, 650, "object")
  }

  if (wave === 3) {
    camera.setBackgroundColor("#3c641b")

    // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group()

    babyBottles.create(200, 200, "bottle")
    babyBottles.create(300, 300, "bottle")
    babyBottles.create(500, 100, "bottle")
    babyBottles.create(700, 500, "bottle")
    babyBottles.create(600, 400, "bottle")
    babyBottles.create(500, 600, "bottle")
    babyBottles.create(100, 700, "bottle")
    babyBottles.create(750, 100, "bottle")

    // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup()

    objectFixo.create(-100, 250, "object")
    objectFixo.create(900, 250, "object")
    objectFixo.create(-100, 450, "object")
    objectFixo.create(900, 450, "object")
    objectFixo.create(900, 650, "object")
    objectFixo.create(-100, 650, "object")
    objectFixo.create(400, 650, "object")
    objectFixo.create(400, 450, "object")
    objectFixo.create(400, 250, "object")
  }

  //WAVE
  waveText = this.add.text(700, 20, "Wave: " + wave, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#ff004c",
  })

  //TIMER
  timeText = this.add.text(game.config.width / 2, 20, "Time: " + MAX_MAP_TIME, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#ff00fb",
  })
  timeText.setOrigin(0.5, 0)

  // SCORE
  scoreText = this.add.text(10, 20, "Score: " + score, {
    fontFamily: "Arial",
    fontSize: "20px",
    color: "#8000ff",
  })

  objectMove = this.physics.add.sprite(150, 100, "objectMove")
  objectMove.setCollideWorldBounds(true) //colidir/ nao sair do mapa
  objectMove.setPushable(true) // Faz empurrar
  //objectMove.body.setAllowGravity(false)
  objectMove.setDrag(1000) //para de "andar" quando é empurrado
  objectMove.setImmovable(false) // garantia de fazer ele se mover

  // ISIS
  player = this.physics.add.sprite(60, 100, "isis")
  player.setCollideWorldBounds(true)

  // FYRES A
  fyresA = this.physics.add.sprite(748, 700, "fyres")
  fyresA.setCollideWorldBounds(true)
  fyresA.isMoving = false
  fyresA.velocityA = 0

  createGrid(this)

  if (wave === 1) {
    camera.setBackgroundColor("#ffb969")

    // GRUPOS DE MAMADEIRAS
    babyBottles = this.physics.add.group()
    const bottlesGrid = [42, 66, 82, 190, 262, 288, 319, 177, 118, 57]

    drawBottlesGrid(bottlesGrid)

    // OBJETOS FIXOS
    objectFixo = this.physics.add.staticGroup()

    const platform1 = [140, 141, 142, 143, 144, 145, 146, 147, 148, 149]
    const platform2 = [269, 270, 271, 272, 273, 274, 275, 276, 277, 278]
    const platform3 = [116, 136, 156, 176, 196, 216, 236, 256, 276]

    drawPlatformGrid(platform1)
    drawPlatformGrid(platform2)
    drawPlatformGrid(platform3)
  }

  // COLISÃO E COLETA
  //this.physics.add.collider(fyresA, objectFixo);
  this.physics.add.overlap(player, babyBottles, collectBottle, null, this)
  this.physics.add.collider(player, objectFixo)
  this.physics.add.collider(objectMove, objectFixo)
  this.physics.add.collider(player, objectMove)

  //TIME
  //this.time relogio phaser
  //addEvent: executar algo baseado em tempo
  timeEvent = this.time.addEvent({
    delay: 1000, // esperar 1 segundo para executar o evento
    callback: updateTimer, // função que é chamada, executada
    callbackScope: this, // sem isso no updateTimer, o this vira undefined (this.physics.pause() quebra). this = scene do jogo
    loop: true, //repete infinitamente
  })
}

function drawPlatformGrid(gridNumbers) {
  for (let index = 0; index < gridNumbers.length; index++) {
    const element = gridMap.get(gridNumbers[index])
    objectFixo.create(element.x + pixelSize / 2, element.y + pixelSize / 2, "object").setOrigin(0.5, 0.5)
  }
}

function drawBottlesGrid(gridNumbers) {
  for (let index = 0; index < gridNumbers.length; index++) {
    const element = gridMap.get(gridNumbers[index])
    babyBottles.create(element.x + pixelSize / 2, element.y + pixelSize / 2, "bottle").setOrigin(0.5, 0.5)
  }
}

function update() {
  player.setVelocityX(0)
  player.setVelocityY(0)

  if (this.keyW.isDown) {
    player.setVelocityY(-200)
  }
  if (this.keyA.isDown) {
    player.setVelocityX(-200)
  }
  if (this.keyS.isDown) {
    player.setVelocityY(200)
  }
  if (this.keyD.isDown) {
    player.setVelocityX(200)
  }

  fyresA.setVelocityX(0)
  fyresA.setVelocityY(0)

  if (gridCreated) {
    var playerGridPosition = { x: Math.floor(player.y / pixelSize), y: Math.floor(player.x / pixelSize) }
    var playerGridNumber = gridArray[playerGridPosition.x][playerGridPosition.y]

    var fyreAGridPosition = { x: Math.floor(fyresA.y / pixelSize), y: Math.floor(fyresA.x / pixelSize) }
    var fyreAGridNumber = gridArray[fyreAGridPosition.x][fyreAGridPosition.y]

    a_star(fyreAGridNumber, playerGridNumber)
  }
}

// COLEÇAO COM MAMADEIRAS
function collectBottle(player, babyBottles) {
  babyBottles.destroy()

  score += 20
  scoreText.setText("Score: " + score)
}

// CRONOMETRO
function updateTimer() {
  timeLeft--

  timeText.setText("Time: " + timeLeft)

  if (timeLeft <= 0) {
    timeEvent.remove()
    this.physics.pause()
    timeText.setText("Time: " + timeLeft)

    timeStop = true
  }

  if (timeStop === true) {
    if (score === 0) {
      levelFase = this.add.image(400, 210, "game-over")

      restartImg = this.physics.add.sprite(400, 420, "restart").setInteractive()
      restartImg.on("pointerdown", () => {
        this.scene.restart()
        timeStop = false
        timeLeft = MAX_MAP_TIME
        score = 0
      })
    }

    if (score > 0) {
      ranking.push(score)
      wave += 1

      if (wave <= quantityWave) {
        this.scene.restart()
        timeStop = false
        timeLeft = MAX_MAP_TIME
        score = 0
      } else {
        levelFase = this.add.image(400, 210, "vitory")

        for (let i = 0; i < ranking.length; i++) {
          addScore += ranking[i]
        }

        rankingText = this.add.text(300, 400, "Total: " + addScore, {
          fontSize: "50px",
          fontFamily: "Arial",
          color: "#ff7b00",
        })
      }
    }
  }
}

// criarGrade
function createGrid(scene) {
  for (let rowNumber = 0; rowNumber < totalColumns; rowNumber++) {
    gridArray[rowNumber] = []
    for (let columnNumber = 0; columnNumber < totalRows; columnNumber++) {
      const x = columnNumber * pixelSize
      const y = rowNumber * pixelSize

      graphics.lineStyle(2, "black", 1)
      graphics.strokeRect(x, y, pixelSize, pixelSize)

      scene.add
        .text(x + pixelSize / 2, y + pixelSize / 2, gridNumber, { color: "black", align: "center" })
        .setOrigin(0.5, 0.5).depth = -1

      gridArray[rowNumber][columnNumber] = { position: gridNumber, type: 0, g: 0, h: 0, f: 0, parent: null, x: x, y: y }
      gridMap.set(gridNumber, gridArray[rowNumber][columnNumber])

      gridNumber++
    }
  }

  gridCreated = true
}

// Algoritmo. Caminho de menor custo
function a_star(start, end) {
  let listaAberta = [start]
  let listaFechada = []
  let celulaAtual = listaAberta[0]

  start.g = 0
  start.h = distancia(start, end)
  start.f = start.g + start.h
  start.parent = null

  while (listaAberta.length > 0) {
    let melhorIndex = 0
    for (let index = 0; index < listaAberta.length; index++) {
      if (listaAberta[melhorIndex].f > listaAberta[index].f) {
        // menor f
        melhorIndex = index
        celulaAtual = listaAberta[melhorIndex]
      }
    }

    if (celulaAtual === end) {
      // console.log("Chegamos... Sucesso!")
      break
    }

    listaFechada.push(listaAberta[melhorIndex])
    listaAberta.splice(melhorIndex, 1)

    // logica da vizinhaça

    let vizinhos = new Array(8)
    vizinhos[0] = gridMap.get(celulaAtual.position + 1)
    vizinhos[1] = gridMap.get(celulaAtual.position - 1)
    vizinhos[2] = gridMap.get(celulaAtual.position - 20)
    vizinhos[3] = gridMap.get(celulaAtual.position + 20)
    vizinhos[4] = gridMap.get(celulaAtual.position - 19)
    vizinhos[5] = gridMap.get(celulaAtual.position + 21)
    vizinhos[6] = gridMap.get(celulaAtual.position - 21)
    vizinhos[7] = gridMap.get(celulaAtual.position + 19)

    for (let index = 0; index < vizinhos.length; index++) {
      const element = vizinhos[index]

      if (listaFechada.includes(element)) continue

      let custoG = celulaAtual.g + distancia(celulaAtual, vizinhos[index])

      if (!listaAberta.includes(element)) {
        listaAberta.push(element)
      } else if (custoG >= element.g) {
        continue
      }

      vizinhos[index].parent = celulaAtual
      vizinhos[index].g = custoG
      vizinhos[index].h = distancia(vizinhos[index], end)
      vizinhos[index].f = vizinhos[index].g + vizinhos[index].h
    }

    // direita = atual + 1
    // esquerda = atual - 1
    // cima = atual - 20
    // baixo = atual + 20
    // direita-cima = atual - 19
    // direita-baixo = atual + 21
    // esquerda-cima = atual - 21
    // esquerda-baixa = atual + 19
  }

  path = []
  while (celulaAtual != null) {
    path.push(celulaAtual)
    celulaAtual = celulaAtual.parent
  }

  path.reverse()
}

function distancia(start, end) {
  let deltaX = Math.abs(start.x - end.x)
  let deltaY = Math.abs(start.y - end.y)

  var distancia = Math.max(deltaX, deltaY) + (Math.SQRT2 - 1) * Math.min(deltaX, deltaY)

  return distancia
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
