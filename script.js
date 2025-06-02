const fruits = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍑', '🍒'];

const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timer');
const matchesDisplay = document.getElementById('matches');
const bestDisplay = document.getElementById('best');

let cards = [];
let firstCard = null;
let lock = false;
let matches = 0;
let timer;
let startTime;
let gameStarted = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const pairs = [...fruits, ...fruits];
  cards = shuffle(pairs);
  gameBoard.innerHTML = '';
  matches = 0;
  matchesDisplay.textContent = `Matches: ${matches}`;
  cards.forEach(fruit => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = '?';
    card.dataset.fruit = fruit;
    card.style.pointerEvents = 'none'; 
    gameBoard.appendChild(card);
  });
  timerDisplay.textContent = 'Time: 0s';
  resetBtn.disabled = true;
  startBtn.disabled = false;
  gameStarted = false;
  clearInterval(timer);
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function checkBestTime(time) {
  const best = localStorage.getItem('bestTime');
  if (!best || time < best) {
    localStorage.setItem('bestTime', time);
    bestDisplay.textContent = `Best: ${time}s`;
  } else {
    bestDisplay.textContent = `Best: ${best}s`;
  }
}

function flipBack(card1, card2) {
  setTimeout(() => {
    card1.textContent = '?';
    card2.textContent = '?';
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    lock = false;
  }, 800);
}

gameBoard.addEventListener('click', e => {
  if (!gameStarted) return;
  const clicked = e.target;
  if (!clicked.classList.contains('card') || lock || clicked.classList.contains('flipped')) return;

  clicked.classList.add('flipped');
  clicked.textContent = clicked.dataset.fruit;

  if (!firstCard) {
    firstCard = clicked;
  } else {
    lock = true;
    if (firstCard.dataset.fruit === clicked.dataset.fruit) {
      matches++;
      matchesDisplay.textContent = `Matches: ${matches}`;
      lock = false;
      firstCard = null;

      if (matches === fruits.length) {
        stopTimer();
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        checkBestTime(totalTime);
        gameStarted = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
        disableCards(true);
      }
    } else {
      flipBack(firstCard, clicked);
      firstCard = null;
    }
  }
});

function disableCards(disable) {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.style.pointerEvents = disable ? 'none' : 'auto';
  });
}

startBtn.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    disableCards(false);
    startBtn.disabled = true;
    resetBtn.disabled = false;
    startTimer();
  }
});

resetBtn.addEventListener('click', () => {
  createBoard();
});

window.onload = () => {
  createBoard();
  const best = localStorage.getItem('bestTime');
  bestDisplay.textContent = best ? `Best: ${best}s` : 'Best: --';
};
