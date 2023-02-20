
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
//! we will need the gamecontainer to make it blurry
//? when we display the end menu  

const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'images/Flappy-dunk-50.png';

//* Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 50;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//* Bird varibles
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.4;

//* Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//* Score and highscore variables
let scoreDvi = document.getElementById('score-display');
let score = 0;
let highScore = 0;

//? we add a bool varible, so we can check when flappy passes we increase
//? the value
let scored = false;

//* lets us control the bird with the space key 
document.body.onkeyup = function (e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;

    }
}

//* lets us restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', () => {
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore() {
    //* increase now our counter when our flapply passes the pipes
    if (birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
        score++;
        scoreDvi.innerHTML = score;
        scored = true;
    }

    //? reset the flag, if bird passes the pipes
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    //? Create bounding Boxes for the bird and the pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const buttomPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
      
    }

    //? Check for collision width uppper pipe box
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
        return true;
    }

    //? Check for collision width lower pipe box
    if (birdBox.x + birdBox.width > buttomPipeBox.x &&
        birdBox.x < buttomPipeBox.x + buttomPipeBox.width &&
        birdBox.y < birdBox.height > buttomPipeBox.y) {
        return true;
    }

    //? check if bird hits boundaries
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;

}

function hideEndMenu() {
    document.getElementById("end-menu").style.display = "none";
    gameContainer.classList.remove("backdrop-bluy");
}

function showEndmenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add("backdrop-bluy");
    document.getElementById('end-score').innerHTML = score;
    //? This way we update always our highscore at the end of our game
    //? if we have a higher hight than the previous
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;

}


//* we reset the values to the beginning so we start
//* width the bird at the beginning

function resetGame() {
  
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.4;

    pipeX = 400;
    pipeY = canvas.height - 200;
    
    score = 0;
}

function endGame() {
    // alert('OH ON we hit something!')

    showEndmenu();

}

function loop() {
    //* Reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //* Darw Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY);

    //* Draw Pipes 
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);


    //* now we would need to add an collision check to display our end-menu
    //* and end the game
    //* the collisionCheck will return us true if we have a collission
    //* otherwise false
    if (collisionCheck()) {
        endGame();
        return;
    }

    //* forgot to mvoe the pipes
    pipeX -= 4.5;

    //* if the pipe moves out of the frame we need to reset the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
        
    }

    //* apply gravity to the bird and let it move 
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    //* alway check if you call the function ...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();