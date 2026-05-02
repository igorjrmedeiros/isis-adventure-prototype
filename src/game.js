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

const MAX_MAP_TIME = 10 // segundos da fase
var timeText
var timeStop = false // false se chegou no tempo 0
var timeEvent //guarda o tempo contando a cada segundo
var timeLeft = MAX_MAP_TIME //decrementa os minutos definido

var ranking = [] // guarda os pontos do score
var lastScore = 0
var rankingText

var restartImg
var levelFase

var wave = 1
var quantityWave = 3
var waveText

const GRID_PIXEL_SIZE = 48 // pixels
const MAX_GRID_ROWS = 20
const MAX_GRID_COLUMNS = 16
const totalRows = game.canvas.width / GRID_PIXEL_SIZE
const totalColumns = game.canvas.height / GRID_PIXEL_SIZE

var gridArray = []
var gridNumber = 0 //numero da grade
var gridMap = new Map()
var graphics //graficos
var gridCreated = false //gradeCriada
var pathA = []
var pathB = []
// var path = [] //caminho

var PLAYER_SPEED = 200
var tweenFyre = null
var currentPathIndex = 0 //caminhoAtualIndex
var debug = false
var fyreBTarget

//carrega imagens, sons, arquivos, antes do jogo começar
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

function waves(scene, colorWave, arrayPlataform, qtdBottles) {
  var camera = scene.cameras.main

  gridArray = []
  gridMap.clear()
  createGrid(scene)

  camera.setBackgroundColor(colorWave)

  // OBJETOS FIXOS
  objectFixo = scene.physics.add.staticGroup()

  drawPlatformGrid(arrayPlataform)

  arrayPlataform.forEach((element) => {
    const gridElement = gridMap.get(element)
    gridElement.type = 1
  })

  // GRUPOS DE MAMADEIRAS
  babyBottles = scene.physics.add.group()

  const bottlesGrid = []

  for (let i = 0; i < qtdBottles; i++) {
      var value = Phaser.Math.Between(0, 319)
      if (bottlesGrid.includes(value) || gridMap.get(value).type != 0){
        i--
        continue
      }

      bottlesGrid.push(value)
    }
   
    drawBottlesGrid(bottlesGrid)
}

//Monta a cena do jogo depois de tudo carregado
function create() {
  if (gridMap) {
    graphics = this.add.graphics()
  }

  if (wave === 1) {
    const platform = [
      76, 96, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 116,
      136, 156, 176, 196, 216, 236, 256, 276
    ]    

    let numberBottles = 20

    waves(this, "#ffb969", platform, numberBottles)
  }

  if (wave === 2) {
    const platform = [
      76, 96, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 116,
      136, 156, 176, 196, 216, 236, 256, 276
    ]

    let numberBottles = 20

    waves(this, "#2d4758", platform, numberBottles)
  }

  if (wave === 3) {
    const platform = [
      76, 96, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 116,
      136, 156, 176, 196, 216, 236, 256, 276
    ]

    let numberBottles = 20

    waves(this, "#5a3764", platform, numberBottles)
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
  player = this.physics.add.sprite(0, 0, "isis")
  player.setCollideWorldBounds(true)
  positionAtGrid(player, 21) //posicionar no grid

  // FYRES A
  fyresA = this.physics.add.sprite(0, 0, "fyres")
  fyresA.setCollideWorldBounds(true)
  fyresA.isMoving = false
  fyresA.velocity = 0
  positionAtGrid(fyresA, 281) //posicionar no grid

  // FYRES B
  fyresB = this.physics.add.sprite(0, 0, "fyres")
  fyresB.setCollideWorldBounds(true)
  fyresB.isMoving = false
  fyresB.velocity = 0
  positionAtGrid(fyresB, 238) //posicionar no grid

  // COLISÃO E COLETA
  colliderAndCollection(this)

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

function colliderAndCollection(scene) {
  scene.physics.add.collider(fyresB, objectFixo)
  scene.physics.add.overlap(player, babyBottles, collectBottle, null, scene)
  scene.physics.add.overlap(player, fyresA, gameOver, null, scene)
  scene.physics.add.overlap(player, fyresB, gameOver, null, scene)
  scene.physics.add.collider(player, objectFixo)
  scene.physics.add.collider(objectMove, objectFixo)
  scene.physics.add.collider(player, objectMove)
}

function randomNumber(maxNumber){
  return Math.floor(maxNumber * Math.random())
}

function drawPlatformGrid(gridNumbers) {
  for (let index = 0; index < gridNumbers.length; index++) {
    const element = gridMap.get(gridNumbers[index])
    objectFixo.create(element.x + GRID_PIXEL_SIZE / 2, element.y + GRID_PIXEL_SIZE / 2, "object").setOrigin(0.5, 0.5)
  }
}

function drawBottlesGrid(gridNumbers) {
  for (let index = 0; index < gridNumbers.length; index++) {
    const element = gridMap.get(gridNumbers[index])
    babyBottles.create(element.x + GRID_PIXEL_SIZE / 2, element.y + GRID_PIXEL_SIZE / 2, "bottle").setOrigin(0.5, 0.5)
  }
}

function positionAtGrid(object, gridNumber) {
  const gridElement = gridMap.get(gridNumber) // X: Y:
  object.x = gridElement.x + GRID_PIXEL_SIZE / 2 //posicionar no centro da celula
  object.y = gridElement.y + GRID_PIXEL_SIZE / 2 //posicionar no centro da celula
}

function getDirection() {
  const direction = new Phaser.Math.Vector2(0, 0) // crio um objeto para armazenar a direção que será retornada
  if (this.keyW.isDown) {
    direction.y = -1
  }
  if (this.keyA.isDown) {
    direction.x = -1
  }
  if (this.keyS.isDown) {
    direction.y = 1
  }
  if (this.keyD.isDown) {
    direction.x = 1
  }

  return direction
}

//executa continuamente durante o jogo
function update() {
  player.setVelocity(0, 0)
  fyresA.setVelocity(0, 0)
  fyresB.setVelocity(0, 0)

  const direction = getDirection.call(this)
  direction.normalize() // normaliza a direção para que a velocidade seja constante em todas as direções (diagonal, horizontal, vertical)

  player.setVelocity(direction.x * PLAYER_SPEED, direction.y * PLAYER_SPEED)

  if (gridCreated) {
    const playerGrid = worldToGrid(player.x, player.y)
    const fyresAGrid = worldToGrid(fyresA.x, fyresA.y)
    const fyresBGrid = worldToGrid(fyresB.x, fyresB.y)

    if (playerGrid && fyresAGrid && fyresBGrid) {
      pathA = a_star(fyresAGrid, playerGrid)
    
      if(pathB.length == 0) {
        fyreBTarget = gridMap.get(randomNumber(319))
      }
      pathB = a_star(fyresBGrid, fyreBTarget, 1.3)
    }

    if (pathA.length > 1) {
      const targetX = pathA[1].x + GRID_PIXEL_SIZE / 2
      const targetY = pathA[1].y + GRID_PIXEL_SIZE / 2
      const target = new Phaser.Math.Vector2(targetX, targetY)
      this.physics.moveToObject(fyresA, target, 150)
    }

    if (pathB.length > 1) {
      const targetX = pathB[1].x + GRID_PIXEL_SIZE / 2
      const targetY = pathB[1].y + GRID_PIXEL_SIZE / 2
      const target = new Phaser.Math.Vector2(targetX, targetY)
      this.physics.moveToObject(fyresB, target, 130)
    } else {
      fyreBTarget = gridMap.get(randomNumber(319))
    }
  }

  createGrid(this)
}

// COLEÇAO COM MAMADEIRAS
function collectBottle(player, babyBottles) {
  babyBottles.destroy()
  addScore(20)
}

/**
 * Adiciona pontos ao score atual e atualiza a exibição do texto de pontuação
 * @param {number} newScore - A quantidade de pontos a ser adicionada ao score
 * @returns {void}
 * @description Incrementa a variável global 'score' com o valor fornecido e
 * atualiza o texto de score exibido na tela através do objeto 'scoreText'.
 * Esta função é chamada quando o jogador coleta itens como mamadeiras.
 */
function addScore(newScore) {
  score += newScore
  scoreText.setText("Score: " + score)
}

/**
 * Subtrai pontos do score atual e atualiza a exibição do texto de pontuação
 * @param {number} newScore - A quantidade de pontos a ser subtraída do score
 * @returns {void}
 * @description Decrementa a variável global 'score' com o valor fornecido e
 * atualiza o texto de score exibido na tela através do objeto 'scoreText'.
 * Esta função é chamada quando o jogador perde pontos.
 */
function subScore(newScore) {
  score -= newScore
  scoreText.setText("Score: " + score)
}

/**
 * Reseta o score para zero e atualiza a exibição do texto de pontuação
 * @returns {void}
 * @description Define a variável global 'score' para zero e atualiza o texto de score exibido na tela através do objeto 'scoreText'.
 * Esta função pode ser chamada quando o jogador perde ou quando inicia uma nova fase.
 */
function resetScore() {
  score = 0
  scoreText.setText("Score: " + score)
}

function gameOver() {
  const x = config.width / 2
  const y = config.height / 2
  
  levelFase = this.add.image(x, y - 100, "game-over")

  restartImg = this.physics.add.sprite(x, y + 100, "restart").setInteractive()
  restartImg.on("pointerdown", () => {
    this.scene.restart()
    timeStop = false
    timeLeft = MAX_MAP_TIME
  })

  timeEvent.remove()
  resetScore()
  this.physics.pause()
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
      gameOver.call(this)
    }

    if (score > 0) {
      ranking.push(score)
      wave += 1

      if (wave <= quantityWave) {
        this.scene.restart()
        timeStop = false
        timeLeft = MAX_MAP_TIME
        resetScore()
      } else {
        levelFase = this.add.image(400, 210, "vitory")

        for (let i = 0; i < ranking.length; i++) {
          lastScore += ranking[i]
        }

        rankingText = this.add.text(300, 400, "Total: " + lastScore, {
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
  graphics.clear()
  gridNumber = 0

  for (let column = 0; column < MAX_GRID_COLUMNS; column++) {
    if (!gridArray[column]) {
      gridArray[column] = []
    }

    for (let row = 0; row < MAX_GRID_ROWS; row++) {
      const x = row * GRID_PIXEL_SIZE
      const y = column * GRID_PIXEL_SIZE

      if (debug) {
        graphics.lineStyle(2, 0xff0000, 1)
        graphics.strokeRect(x, y, GRID_PIXEL_SIZE, GRID_PIXEL_SIZE)
      }

      if (!gridArray[column][row]) {
        if (debug) {
          scene.add
            .text(x + GRID_PIXEL_SIZE / 2, y + GRID_PIXEL_SIZE / 2, gridNumber, {
              color: "black",
              align: "center",
            })
            .setOrigin(0.5, 0.5).depth = -1
        }

        gridArray[column][row] = {
          position: gridNumber,
          type: 0,
          g: 0,
          h: 0,
          f: 0,
          parent: null,
          x: x,
          y: y,
          indexX: column,
          indexY: row,
        }
      }

      gridMap.set(gridNumber, gridArray[column][row])
      gridNumber++
    }

    gridCreated = true
  }

  if (debug) {
    // desenha contorno do grid com a posição do player
    if (player) {
      const playerGrid = worldToGrid(player.x, player.y)
      graphics.lineStyle(5, 0x0000ff, 1)
      graphics.strokeRect(playerGrid.x, playerGrid.y, GRID_PIXEL_SIZE, GRID_PIXEL_SIZE)
    }

    // desenha o caminho
    if (pathA.length > 0) {
      pathA.forEach((value) => {
        graphics.fillStyle(0x00ff00, 0.5)
        graphics.fillRect(value.x, value.y, 48, 48)
      })
    }

    if (pathB.length > 0) {
      pathB.forEach((value) => {
        graphics.fillStyle(0xffff00, 0.5)
        graphics.fillRect(value.x, value.y, 48, 48)
      })
    }
  }

  // gridArray[linhas][colunas]
}

/**
 * Converte uma coordenada do mundo (pixels) para a célula correspondente no grid
 * @param {number} x - Coordenada x em espaço do mundo (pixels)
 * @param {number} y - Coordenada y em espaço do mundo (pixels)
 * @returns {*} A célula do grid na posição calculada
 * @description Divide as coordenadas do mundo por GRID_PIXEL_SIZE para determinar
 * os índices correspondentes do array do grid. Nota: o array é acessado como [y][x]
 * para mapear corretamente linhas e colunas.
 */
function worldToGrid(x, y) {
  var gridPosition = { x: Math.floor(x / GRID_PIXEL_SIZE), y: Math.floor(y / GRID_PIXEL_SIZE) }
  return gridArray[gridPosition.y][gridPosition.x]
}

/**
 * Implementação do algoritmo A*
 * @param {*} start - Célula de início
 * @param {*} end - Célula de fim
 * @returns {Array} O caminho encontrado do início ao fim, ou um array vazio se nenhum caminho for encontrado
 * @description O algoritmo A* é um algoritmo de busca heurística que encontra o caminho mais curto entre um ponto inicial e um ponto final em um grid. Ele utiliza uma função de custo (f) que é a soma do custo do caminho até o ponto atual (g) e uma estimativa do custo restante até o destino (h). O algoritmo mantém uma lista aberta de células a serem avaliados e uma lista fechada de células já avaliadas, expandindo as células com o menor valor de f ou h até encontrar o destino ou esgotar as opções.
 */
function a_star(start, end, complexity = 1) {
  let listaAberta = []
  let listaFechada = []
  let celulaAtual = listaAberta[0]

  listaAberta.push(start)

  start.g = 0
  start.h = distancia(start, end)
  start.f = start.g + start.h
  start.parent = null

  while (listaAberta.length > 0) {
    let melhorIndex = 0
    for (let index = 0; index < listaAberta.length; index++) {
      const itemA = listaAberta[index]
      const itemB = listaAberta[melhorIndex]
      if (itemB.f > itemA.f || (itemB.f === itemA.f && itemB.h > itemA.h)) {
        // menor f e h
        melhorIndex = index
      }
    }

    celulaAtual = listaAberta[melhorIndex]

    if (celulaAtual === end) {
      //console.log("Chegamos... Sucesso!")
      break
    }

    listaFechada.push(celulaAtual)
    listaAberta.splice(melhorIndex, 1)

    let directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1], // w e d
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]

    // logica da vizinhaça
    let vizinhos = new Array(8)

    for (let index = 0; index < vizinhos.length; index++) {
      let rowDirection = directions[index][0]
      let columnDirection = directions[index][1]

      let nextRowIndex = celulaAtual.indexX + rowDirection
      let nextColumnIndex = celulaAtual.indexY + columnDirection

      if (
        nextRowIndex >= MAX_GRID_COLUMNS ||
        nextColumnIndex >= MAX_GRID_ROWS ||
        nextRowIndex < 0 ||
        nextColumnIndex < 0
      )
        continue

      const isDiagonal = rowDirection !== 0 && columnDirection !== 0

      if (isDiagonal) {
        const cell1 = gridArray[celulaAtual.indexX][celulaAtual.indexY + columnDirection]
        const cell2 = gridArray[celulaAtual.indexX + rowDirection][celulaAtual.indexY]

        if (cell1.type === 1 || cell2.type === 1) {
          continue
        }
      }

      vizinhos[index] = gridArray[nextRowIndex][nextColumnIndex]

      if (vizinhos[index].type === 1) {
        vizinhos[index] = null
        continue
      }
    }

    for (let index = 0; index < vizinhos.length; index++) {
      const element = vizinhos[index]

      if (!element) continue

      if (listaFechada.includes(element)) continue

      let custoG = celulaAtual.g + distancia(celulaAtual, element) * complexity

      if (!listaAberta.includes(element)) {
        listaAberta.push(element)

        vizinhos[index].parent = celulaAtual
        vizinhos[index].g = custoG
        vizinhos[index].h = distancia(vizinhos[index], end)
        vizinhos[index].f = vizinhos[index].g + vizinhos[index].h
      } else if (custoG < element.g) {
        vizinhos[index].parent = celulaAtual
        vizinhos[index].g = custoG
        vizinhos[index].f = vizinhos[index].g + vizinhos[index].h
      }
    }
  }

  const path = []

  if (celulaAtual !== end) {
    return path
  }

  while (celulaAtual != null) {
    path.push(celulaAtual)
    celulaAtual = celulaAtual.parent
  }

  path.reverse()

  return path
}

function distancia(start, end, complexity = 1) {
  let deltaX = Math.abs(start.indexX - end.indexX)
  let deltaY = Math.abs(start.indexY - end.indexY)

  var distancia = Math.max(deltaX, deltaY) + (complexity * Math.SQRT2 - 1) * Math.min(deltaX, deltaY)

  return distancia
}
