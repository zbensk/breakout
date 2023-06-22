var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/4;
var y = canvas.height-130;
var dx = 3;
var dy = 3;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var gameOver = false;
var score = 0;
var lives = 3;
var level = 1;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// These event listeners check for an event, and will call the function when triggered
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) { // e is the argument for an event
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "r" && gameOver){
      document.location.reload();
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// Function for movement based on mouse position
// function mouseMoveHandler(e) {
//   var relativeX = e.clientX - canvas.offsetLeft;
//   if(relativeX > 0 && relativeX < canvas.width) {
//     paddleX = relativeX - paddleWidth/2;
//   }
// }
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            drawMsg("You win, congrats!");
            level++;
            setLevel();
            stopGame();
            // document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#a65137";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#43eb34";
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      // Brick is only drawn if status is equal to 1
      // Status becomes 0 when ball hits brick
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#3749a6";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawLevel() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("Level: "+level, 8, canvas.height - 15);
}

function setLevel() {
  brickRowCount = level + 4;
  brickWidth = (75*5)/brickRowCount;
}

function drawMsg(msg) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.textAlign = "center";
  ctx.fillText(msg, 240, 15);
}

function restartText() {
  var text = document.getElementById("restart");
  text.style.display = "block";
}

// Once game is over, ball shouldn't move and a message should appear
// Message should allow user to restart (probably by reloading the page)
function stopGame() {
  dx = 0;
  dy = 0;
  gameOver = true;
  restartText();
  removeEventListener("keydown");
  removeEventListener("keyup");
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setLevel();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawLevel();
  collisionDetection();

  // Changing directions
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  // Ball goes below paddle (loses a life)
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
        drawMsg("Game Over");
        stopGame();
        // document.location.reload();
      }
      else {
        x = canvas.width/4;
        y = canvas.height-130;
        dx = 3;
        dy = 3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  // If a key is pressed and the paddle isn't on the side, move the paddle
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();