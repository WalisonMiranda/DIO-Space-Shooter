const player = document.querySelector('.player');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['assets/images/alien1.png', 'assets/images/alien2.png', 'assets/images/alien3.png', 'assets/images/asteroid.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

function playerMovements(e) {
  e.preventDefault();
  
  if (e.key === 'ArrowUp') {
    moveUp();
  } else if (e.key === 'ArrowDown') {
    moveDown();
  } else if (e.key === ' ') {
    fireLaser();
  }
};

function moveUp() {
  let topPosition = getComputedStyle(player).getPropertyValue('top');
  
  if (topPosition === '0px') {
    return;
  } else {
    let position = parseInt(topPosition);
    
    position -= 50;
    
    player.style.top = `${position}px`;
  }
};

function moveDown() {
  let topPosition = getComputedStyle(player).getPropertyValue('top');
  
  if (topPosition === '510px') {
    return;
  } else {
    let position = parseInt(topPosition);
    
    position += 50;
    
    player.style.top = `${position}px`;
  }
};

function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
};

function createLaserElement() {
  let positionX = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
  let positionY = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
  let newLaser = document.createElement('img');

  newLaser.src = 'assets/images/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${positionX}px`;
  newLaser.style.top = `${positionY - 20}px`;

  return newLaser;
};

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let positionX = parseInt(laser.style.left);
    let aliens = document.querySelectorAll('.alien');

    aliens.forEach(alien => {
      if (collision(laser, alien)) {
        alien.src = 'assets/images/explosion.png';
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');
      }
    });

    if (positionX === 340) {
      laser.remove();
    } else {
      laser.style.left = `${positionX + 8}px`;
    }
  }, 10);

  return laserInterval;
};

function createAliens() {
  let newAlien = document.createElement('img');
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];

  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transition');
  newAlien.style.left = '370px';
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;

  playArea.appendChild(newAlien);
  moveAlien(newAlien);
};

function moveAlien(alien) {
  let alienInterval = setInterval(() => {
    let positionX = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

    if (positionX === -20) {
      if (Array.from(alien.classList).includes('dead-alien')) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${positionX - 2}px`;
    }
  }, 10);

  return alienInterval;
};

function collision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;

  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;

  if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if (laserTop <= alienTop && laserTop >= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

startButton.addEventListener('click', () => {
  start();
});

function start() {
  instructionsText.style.display = 'none';
  startButton.style.display = 'none';

  document.addEventListener('keydown', playerMovements);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);
};

function gameOver() {
  document.removeEventListener('keydown', playerMovements);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll('.alien');
  aliens.forEach(alien => alien.remove());
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach(laser => laser.remove());

  setTimeout(() => {
    instructionsText.innerText = 'Game Over';
    instructionsText.style.display = 'block';
    startButton.style.display = 'block';
    player.style.top = '250px';
  });
};
