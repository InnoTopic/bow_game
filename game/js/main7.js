const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let seed = 0.1282120759103802 //Math.random();
console.log('seed', seed)

function seededRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Block properties
const blockTemplate = {
  x: 0,
  y: 0,
  size: 50,
  color: "blue"
};

const blocks = [];

// Create blocks at random positions
for (let i = 0; i < 10; i++) {
  const block = { ...blockTemplate };
  block.x = seededRandom() * (canvas.width - 100) + 100;
  block.y = seededRandom() * (canvas.height - 100) + 100;
  blocks.push(block);
}

function drawBlocks() {
  blocks.forEach((block, index) => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.size, block.size);
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isMouseDown) {
    drawBowAndArrow(currentArrow);
  }

  drawBalloons();
  drawBlocks();
  drawArrows();

  // Check for collisions
  arrows.forEach((arrow, arrowIndex) => {
    balloons.forEach((balloon, balloonIndex) => {
      if (checkCollision(arrow, balloon)) {
        balloons.splice(balloonIndex, 1); // Remove the balloon
      }
    });

    blocks.forEach((block, blockIndex) => {
      if (checkBlockCollision(arrow, block)) {
        // Stop the arrow when it hits a block
        arrow.speedX = 0;
        arrow.speedY = 0;
      }
    });

  });

  requestAnimationFrame(gameLoop);
}


const bow = {
  x: 100,
  y: canvas.height / 2,
  width: 50,
  height: 100,
  color: "lime"
};

const bowstringColor = "white";

const arrowTemplate = {
  x: 0,
  y: 0,
  width: 30,
  height: 5,
  speedX: 0,
  speedY: 0,
  color: "white",
  rotation: 0
};

const arrows = [];

function drawBowAndArrow(arrow) {
  ctx.fillStyle = bow.color;
  ctx.fillRect(bow.x, bow.y - bow.height / 2, bow.width, bow.height);

  ctx.beginPath();
  ctx.strokeStyle = bowstringColor;
  ctx.moveTo(bow.x + bow.width, bow.y - bow.height / 2);
  ctx.lineTo(arrow.x, arrow.y);
  ctx.lineTo(bow.x + bow.width, bow.y + bow.height / 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(arrow.x, arrow.y);
  ctx.rotate(arrow.rotation);
  ctx.fillStyle = arrow.color;
  ctx.fillRect(-arrow.width / 2, -arrow.height / 2, arrow.width, arrow.height);
  ctx.restore();
}

let isMouseDown = false;
let initialMouseX = 0;
let initialMouseY = 0;
let currentArrow = { ...arrowTemplate };

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  initialMouseX = e.clientX - canvas.getBoundingClientRect().left;
  initialMouseY = e.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    currentArrow.x = mouseX;
    currentArrow.y = mouseY;

    const dx = mouseX - (bow.x + bow.width);
    const dy = mouseY - bow.y;
    currentArrow.rotation = Math.atan2(dy, dx);
  }
});

canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  const finalMouseX = e.clientX - canvas.getBoundingClientRect().left;
  const finalMouseY = e.clientY - canvas.getBoundingClientRect().top;
  currentArrow.speedX = (initialMouseX - finalMouseX) / 4;
  currentArrow.speedY = (initialMouseY - finalMouseY) / 4;

  arrows.push(currentArrow);
  currentArrow = { ...arrowTemplate };
});

const gravity = 0.2;

function drawArrows() {
  arrows.forEach((arrow, index) => {
    if (arrow.speedX !== 0 || arrow.speedY !== 0) {
      arrow.x += arrow.speedX;
      arrow.y += arrow.speedY;
      arrow.speedX *= 0.99;
      arrow.speedY *= 0.99;

      // Apply gravity
      arrow.speedY += gravity;

      const dx = arrow.speedX;
      const dy = arrow.speedY;
      arrow.rotation = Math.atan2(dy, dx);
    }

    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.rotation);
    ctx.fillStyle = arrow.color;
    ctx.fillRect(-arrow.width / 2, -arrow.height / 2, arrow.width, arrow.height);
    ctx.restore();
  });
}


// Balloon properties
const balloonTemplate = {
  x: 0,
  y: 0,
  width: 50,
  height: 75,
  color: "red"
};

const balloons = [];

// Create balloons at random positions
for (let i = 0; i < 15; i++) {
  const balloon = { ...balloonTemplate };
  balloon.x = seededRandom() * (canvas.width - 100) + 100;
  balloon.y = seededRandom() * (canvas.height - 100) + 100;
  balloons.push(balloon);
}

function drawBalloons() {
  balloons.forEach((balloon, index) => {
    ctx.fillStyle = balloon.color;
    ctx.beginPath();
    ctx.ellipse(balloon.x, balloon.y, balloon.width / 2, balloon.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function checkCollision(arrow, balloon) {
  const dx = arrow.x - balloon.x;
  const dy = arrow.y - balloon.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (balloon.width / 2 + arrow.width / 2);
}

function checkBlockCollision(arrow, block) {
  const arrowHalfWidth = arrow.width / 2;
  const arrowHalfHeight = arrow.height / 2;

  const left = block.x;
  const right = block.x + block.size;
  const top = block.y;
  const bottom = block.y + block.size;

  return (
    arrow.x + arrowHalfWidth > left &&
    arrow.x - arrowHalfWidth < right &&
    arrow.y + arrowHalfHeight > top &&
    arrow.y - arrowHalfHeight < bottom
  );
}

gameLoop();
