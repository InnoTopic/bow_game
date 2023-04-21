const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
  color: "white"
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

  ctx.fillStyle = arrow.color;
  ctx.fillRect(arrow.x, arrow.y - arrow.height / 2, arrow.width, arrow.height);
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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isMouseDown) {
    drawBowAndArrow(currentArrow);
  }

  arrows.forEach((arrow, index) => {
    if (arrow.speedX !== 0 || arrow.speedY !== 0) {
      arrow.x += arrow.speedX;
      arrow.y += arrow.speedY;
      arrow.speedX *= 0.99;
      arrow.speedY *= 0.99;
    }

    ctx.fillStyle = arrow.color;
    ctx.fillRect(arrow.x, arrow.y - arrow.height / 2, arrow.width, arrow.height);
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
