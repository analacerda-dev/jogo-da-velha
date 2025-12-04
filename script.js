const board = document.getElementById("board")
const turno = document.getElementById("turno")
const resetBtn = document.getElementById("reset")
const scoreX = document.getElementById("scoreX")
const scoreO = document.getElementById("scoreO")

const pvpBtn = document.getElementById("pvp")
const botBtn = document.getElementById("bot")

let currentPlayer = "X"
let game = Array(9).fill("")
let active = true
let score = { X: 0, O: 0 }
let vsBot = false

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function createBoard() {
  board.innerHTML = ""
  game.forEach((cell, i) => {
    const div = document.createElement("div")
    div.classList.add("cell")
    div.dataset.index = i
    div.addEventListener("click", play)
    board.appendChild(div)
  })
}

function updateUI() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = game[i]
    cell.classList.remove("X", "O")
    if (game[i]) cell.classList.add(game[i])
  })

  scoreX.textContent = score.X
  scoreO.textContent = score.O
}

function play(e) {
  const i = e.target.dataset.index

  if (game[i] || !active) return

  game[i] = currentPlayer
  updateUI()

  if (checkWin()) return endGame()

  if (!game.includes("")) return draw()

  swapPlayer()

  if (vsBot && currentPlayer === "O") botPlay()
}

function botPlay() {
  setTimeout(() => {
    let empty = game.map((v,i) => v ? null : i).filter(v => v !== null)
    let random = empty[Math.floor(Math.random() * empty.length)]

    game[random] = "O"
    updateUI()

    if (checkWin()) return endGame()
    if (!game.includes("")) return draw()

    swapPlayer()
  }, 500)
}

function swapPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  turno.innerHTML = `Vez de <span class="player">${currentPlayer}</span>`
}

function checkWin() {
  return wins.some(pattern =>
    pattern.every(i => game[i] === currentPlayer)
  )
}

function endGame() {
  active = false
  score[currentPlayer]++
  turno.innerHTML = `Vitória de <span class="player">${currentPlayer}</span>`
  updateUI()
}

function draw() {
  active = false
  turno.textContent = "Empate!"
}

resetBtn.onclick = () => {
  game = Array(9).fill("")
  active = true
  currentPlayer = "X"
  turno.innerHTML = `Vez de <span class="player">X</span>`
  updateUI()
}

pvpBtn.onclick = () => {
  vsBot = false
  resetBtn.click()
}

botBtn.onclick = () => {
  vsBot = true
  resetBtn.click()
}

createBoard()
updateUI()
