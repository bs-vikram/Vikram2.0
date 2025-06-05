const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreSpan = document.getElementById('score');
const missedSpan = document.getElementById('missed');
const messageDiv = document.getElementById('message');
const startBtn = document.getElementById('start-btn');

const gameWidth = 400;
const basketWidth = 60;
let basketX = 170;
let score = 0;
let missed = 0;
let gameInterval;
let emojiInterval;
let emojis = [];
let gameRunning = false;

const goodEmojis = ['😀', '😎', '😍', '😊', '😄'];
const badEmojis = ['💣', '🔥', '☠️'];

function createEmoji() {
  const emojiDiv = document.createElement('div');
  emojiDiv.classList.add('falling-emoji');

 
  const isGood = Math.random() < 0.7;
  const emoji = isGood
    ? goodEmojis[Math.floor(Math.random() * goodEmojis.length)]
    : badEmojis[Math.floor(Math.random() * badEmojis.length)];

  emojiDiv.textContent = emoji;
  emojiDiv.dataset.isGood = isGood;

  
  emojiDiv.style.left = Math.floor(Math.random() * (gameWidth - 30)) + 'px';
  emojiDiv.style.top = '0px';

  gameContainer.appendChild(emojiDiv);
  emojis.push(emojiDiv);
}

function moveEmojis() {
  for (let i = emojis.length - 1; i >= 0; i--) {
    const emoji = emojis[i];
    let top = parseInt(emoji.style.top);

    top += 5; 
    emoji.style.top = top + 'px';

    if (top + 30 >= 470) { 
      
      const emojiLeft = parseInt(emoji.style.left);
      if (
        emojiLeft + 30 > basketX && 
        emojiLeft < basketX + basketWidth 
      ) {
        
        if (emoji.dataset.isGood === 'true') {
          score += 1;
          scoreSpan.textContent = score;
        } else {
          missed += 1;
          missedSpan.textContent = missed;
        }
        gameContainer.removeChild(emoji);
        emojis.splice(i, 1);
      } else if (top + 30 > 500) {
       
        if (emoji.dataset.isGood === 'true') {
          missed += 1;
          missedSpan.textContent = missed;
        }
        gameContainer.removeChild(emoji);
        emojis.splice(i, 1);
      }
    }
  }

  if (missed >= 3) {
    endGame();
  }
}

function moveBasket(e) {
  if (!gameRunning) return;
  const step = 20;
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
    basketX = Math.max(0, basketX - step);
  } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
    basketX = Math.min(gameWidth - basketWidth, basketX + step);
  }
  basket.style.left = basketX + 'px';
}

function startGame() {
  if (gameRunning) return;
  score = 0;
  missed = 0;
  scoreSpan.textContent = score;
  missedSpan.textContent = missed;
  messageDiv.textContent = '';
  emojis.forEach(e => gameContainer.removeChild(e));
  emojis = [];
  basketX = 170;
  basket.style.left = basketX + 'px';

  gameRunning = true;
  gameInterval = setInterval(moveEmojis, 50);
  emojiInterval = setInterval(createEmoji, 800);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(emojiInterval);
  messageDiv.textContent = `Game Over! Your score: ${score}`;
}

document.addEventListener('keydown', moveBasket);
startBtn.addEventListener('click', startGame);
