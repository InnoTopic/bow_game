// Constants
const canvasWidth = 800;
const canvasHeight = 600;
const balloonRadius = 20;
const arrowWidth = 5;
const arrowHeight = 20;
const arrowSpeed = 15;

// Variables
let canvas;
let ctx;
let arrows = [];
let isTensening = false;
let tenseness = 0;
let score = 0;
let gravity = 0.1;

// Functions
function init() {
  canvas = document.querySelector("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx = canvas.getContext("2d");
  canvas.addEventListener("mousedown", () => (isTensening = true));
  canvas.addEventListener("mouseup", () => {
    if (isTensening) {
      let arrowSpeedX = arrowSpeed * Math.cos(tenseness);
      let arrowSpeedY = arrowSpeed * Math.sin(tenseness);
      arrows.push({
        x: canvasWidth / 2,
        y: canvasHeight - 50,
        vx: arrowSpeedX * tenseness,
        vy: arrowSpeedY * tenseness,
      });
    }
    isTensening = false;
  });
  window.requestAnimationFrame(draw);
}

function drawArrows() {
  arrows.forEach((arrow, i) => {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(Math.atan2(arrow.vy, arrow.vx));
    ctx.fillStyle = "yellow";
    ctx.fillRect(-arrowWidth / 2, -arrowHeight, arrowWidth, arrowHeight);
    ctx.restore();
    arrow.x += arrow.vx;
    arrow.y += arrow.vy;
    arrow.vy += gravity;
    if (
      arrow.x < -arrowWidth ||
      arrow.x > canvasWidth + arrowWidth ||
      arrow.y > canvasHeight + arrowHeight
    ) {
      arrows.splice(i, 1);
    }
  });
}

function checkCollisions() {
  arrows.forEach((arrow, i) => {
    // TODO: Check for collisions with balloons
  });
}

function drawBowstring() {
  const stringX = canvasWidth / 2 + 50 * Math.cos(tenseness * Math.PI - Math.PI / 2);
  const stringY = canvasHeight - 50 - 50 * Math.sin(tenseness * Math.PI - Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, canvasHeight - 50);
  ctx.lineTo(stringX, stringY);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function drawBowmanArm() {
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2 - 20, canvasHeight - 50);
  ctx.lineTo(canvasWidth / 2 + 20, canvasHeight - 100);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (isTensening) {
    tenseness += 0.1;
  } else {
    tenseness = 0;
  }
  drawBowmanArm();
  drawBowstring();
  drawArrows();
  checkCollisions();
  window.requestAnimationFrame(draw);
}

init();
