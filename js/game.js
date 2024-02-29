const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// IMAGES DECLARATION
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeBottom = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeUp.src = "images/pipeUp.png";
pipeBottom.src = "images/pipeBottom.png";

// AUDIO DECLARATION
const fly = new Audio();
const score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

// LOGIC
const gap = 90;
let animationID; // animation ID
let animationActive = true; // Flag to track animation activity

document.addEventListener("keydown", moveUp);

let pipe = [];
pipe[0] = {
  x: cvs.width,
  y: 0,
};

let score = 0;
let xPos = 10;
let yPos = 150;
let grav = 1.7;

function moveUp() {
  yPos -= 30;
  fly.play();
}

function resetGame() {
  xPos = 10;
  yPos = 150;
  score = 0;
  pipe = [];
  pipe[0] = { x: cvs.width, y: 0 };
  grav = 1.7;
  startAnimation(); // Starting the animation again after resetting the game
}

function startAnimation() {
  animationActive = true;
  animationID = requestAnimationFrame(draw); // Starting the animation
}

function stopAnimation() {
  cancelAnimationFrame(animationID); // Stopping the animation
}

function draw() {
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    pipe[i].x--;

    if (pipe[i].x == 125) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
      });
    }

    if (
      (xPos + bird.width >= pipe[i].x &&
        xPos <= pipe[i].x + pipeUp.width &&
        (yPos <= pipe[i].y + pipeUp.height ||
          yPos + bird.height >= pipe[i].y + pipeUp.height + gap)) ||
      yPos + bird.height >= cvs.height - fg.height
    ) {
      animationActive = false; // Stopping the animation when losing
      stopAnimation();
      resetGame(); // Resetting the game
      return; // Exiting the function
    }

    if (pipe[i].x == 5) {
      score++;
      score_audio.play();
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);

  yPos += grav;

  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 10, cvs.height - 20);

  if (animationActive) {
    animationID = requestAnimationFrame(draw); // Continuing the animation
  }
}

pipeBottom.onload = startAnimation; // Starting the animation after loading
