const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

let isMouseDown = false;

canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
});

canvas.addEventListener('mouseup', (event) => {
  isMouseDown = false;
});

let bowStringAngle = 0.5 * Math.PI;

class Arrow {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.size = 10;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y -= Math.sin(this.angle) * this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size * 2, 0);
    ctx.lineTo(this.size * 2, this.size);
    ctx.lineTo(this.size * 3, this.size / 2);
    ctx.lineTo(this.size * 2, -this.size);
    ctx.lineTo(this.size * 2, 0);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
  }
}

let arrows = [];

canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
});

canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    const dx = 100 - mouseX;
    const dy = 200 - mouseY;
    bowStringAngle = Math.atan2(dy, dx);
  }
});

canvas.addEventListener('mouseup', (event) => {
  isMouseDown = false;
  const arrowSpeed = (bowStringAngle - 0.5 * Math.PI) * 100;
  arrows.push(new Arrow(120, 200, bowStringAngle, arrowSpeed));
});

function updateArrows() {
  arrows.forEach((arrow) => {
    arrow.update();
  });
}

function drawArrows() {
  arrows.forEach((arrow) => {
    arrow.draw();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBow();
  drawArrows();
}

function gameLoop() {
  updateArrows();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
