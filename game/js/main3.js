const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bowWidth = 20;
const bowHeight = 100;
const arrowWidth = 20;
const arrowHeight = 5;
let bowAngle = 0;
let arrowX = 0;
let arrowY = 0;
let arrowLaunched = false;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const deltaX = mouseX - bowWidth / 2;
  const deltaY = bowHeight - mouseY;
  bowAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
});

canvas.addEventListener('mousedown', (e) => {
  arrowLaunched = false;
  arrowX = bowWidth / 2;
  arrowY = bowHeight;
  launchArrow();
});

function drawBow() {
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height - bowHeight);
  ctx.rotate(bowAngle * Math.PI / 180);
  ctx.fillStyle = 'silver';
  ctx.fillRect(-bowWidth / 2, 0, bowWidth, bowHeight);
  ctx.fillStyle = 'brown';
  ctx.fillRect(-bowWidth / 2 - bowWidth / 4, bowHeight / 2, bowWidth / 2, bowHeight / 10);
  ctx.fillRect(bowWidth / 2 - bowWidth / 4, bowHeight / 2, bowWidth / 2, bowHeight / 10);
  ctx.beginPath();
  ctx.moveTo(bowWidth / 2, bowHeight / 2);
  ctx.lineTo(bowWidth, bowHeight / 2);
  ctx.strokeStyle = 'brown';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bowWidth, bowHeight / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawArrow() {
  ctx.save();
  ctx.fillStyle = 'brown';
  ctx.translate(canvas.width / 2, canvas.height - bowHeight);
  ctx.rotate(bowAngle * Math.PI / 180);
  ctx.fillRect(arrowX - arrowWidth / 2, arrowY - arrowHeight / 2, arrowWidth, arrowHeight);
  ctx.restore();
}

function launchArrow() {
  if (!arrowLaunched) {
    arrowLaunched = true;
    const launchSpeed = 20;
    const launchAngle = -bowAngle;
    const launchRadians = launchAngle * Math.PI / 180;
    const launchX = launchSpeed * Math.cos(launchRadians);
    const launchY = -launchSpeed * Math.sin(launchRadians);
    const arrowInterval = setInterval(() => {
      arrowX += launchX;
      arrowY += launchSpeed * Math.sin(launchRadians);
      launchRadians += 0.1;
      if (arrowY > canvas.height - bowHeight) {
        clearInterval(arrowInterval);
        arrowLaunched = false;
      }
    }, 10);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBow();
  if (arrowLaunched) {
    drawArrow();
  }
  requestAnimationFrame(draw);
}

draw();
