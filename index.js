const bg = new Background();
const scoreEl = document.querySelector('.scoreEl');
const startBtn = document.querySelector('.start-btn');
const menu = document.querySelector('.menu');
const canvas = document.querySelector('canvas');
const score = document.querySelector('#score');
const previousScore = document.querySelector('.prevScore');
const c = canvas.getContext('2d');

bg.draw();

canvas.width = 1024;
canvas.height = 576;

scoreEl.classList.add('hidden');
startBtn.addEventListener('click', startGame);
const highScore = localStorage.getItem('highScore');
previousScore.innerText = highScore ? highScore : '0';

let game;

function startGame() {
  game = new GameController();
  menu.classList.add('hidden');
  scoreEl.classList.remove('hidden');
}

function onEndGame() {}
