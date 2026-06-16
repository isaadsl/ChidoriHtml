const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];
    const palm = hand[9]; // ponto central da mão
    const x = palm.x * canvas.width;
    const y = palm.y * canvas.height;
    drawChidori(ctx, x, y);
    playChidoriSound();
  } else {
    stopChidoriSound();
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();

//chidori

let lightnings = [];

class Lightning {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1;
    this.angle = Math.random() * Math.PI * 2;
    this.length = 40 + Math.random() * 40;
  }

  update() {
    this.life -= 0.05;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.strokeStyle = "rgba(0,170,255," + this.life + ")";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00aaff";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.length,
      this.y + Math.sin(this.angle) * this.length
    );
    ctx.stroke();
  }
}

function drawChidori(ctx, x, y) {
  // adicionar novos raios
  for (let i = 0; i < 8; i++) {
    lightnings.push(new Lightning(x, y));
  }

  // desenhar raios
  lightnings = lightnings.filter(l => {
    const alive = l.update();
    if (alive) l.draw(ctx);
    return alive;
  });

  // círculo central brilhante
  const gradient = ctx.createRadialGradient(x, y, 20, x, y, 100);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(0,170,255,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, 100, 0, Math.PI * 2);
  ctx.fill();
}

// som do chidori

const chidoriSound = document.getElementById("chidoriSound");
let soundPlaying = false;

function playChidoriSound() {
  if (!soundPlaying) {
    chidoriSound.currentTime = 0;
    chidoriSound.play();
    soundPlaying = true;
  }
}

function stopChidoriSound() {
  chidoriSound.pause();
  soundPlaying = false;
}
