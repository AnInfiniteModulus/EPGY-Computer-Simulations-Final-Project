/*
TODO TODO TODO TODO TODO TODO
List of things that need to be done:
-  DONE 7/6/2015 1:59 PM: Link sprites and hook that stuff up
- Automatic wall placement and replication. Look at background code for help
-  DONE 7/6/2015 1:59 PM: Player on the damn screen.
- Find those parameters for the sprite function. It's really annoying.
-  THE FIGHT NEVER ENDS: Insert witty puns as comments wherever possible
- Reorganize code
- MAKE THE BOX GLOW.
- Obstacles need to actually push player around
TODO TODO TODO TODO TODO TODO
*/

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


//Creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d"); //2d canvas
canvas.width = 1024; //Width of canvas in pixels, should be edited later
canvas.height = 512; // Height of canvas in pixels, should be edited later
document.body.appendChild(canvas);
//Canvas creation finished

function glow(pos1, pos2){
  var canvas=document.getElementById('canvas');
  //if (canvas.getContext) {
    //var canvas = document.getElementById('canvas');
    //var context = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pos1, pos2, 64, 21.3);
  //}
  console.log('RAINBOWWWSSSS');
}

//The main game loop
var lastTime;
function main() {
  var now = Date.now(); //sets now to the current time
  var dt = (now - lastTime) / 1000.0; //sets dt (difference in time) to now - the previous time

  update(dt); //Updates scene with time since last frame
  render(); //renders the scene

  lastTime = now; //sets last time to the last current time
  requestAnimFrame(main); //queues the next game loop
  score++;
};


function init() {
  mapPattern = ctx.createPattern(resources.get('./sprites/background/background.png'), 'repeat'); //DONE: make a background image and link it. Literally a black rectangle the size of canvas


  document.getElementById('play-again').addEventListener('click', function(){ //TODO: Edit this so it links to the main menu, a bit confusing right now
    reset();
  });

  reset();
  lastTime = Date.now();
  main();
}

//Variables with obstacle sprites WARNING. MUST LOAD IMAGES FIRST. DONE: ACTUALLY LINK THEM TO sprites

resources.load([
  './sprites/obstacles/squareObstacle.png', //square
  './sprites/obstacles/rectangleObstacle.png', //rectangle
  './sprites/obstacles/triangleObstacle.png', //triangle
  './sprites/obstacles/triangleObstacle.png', //circle
])

//DEAR GOD SPRITES MUST BE LINKED.
resources.load([
  './sprites/player/player.png', //player
  './sprites/background/background.png', //background
])
resources.onReady(init);


//Game state
var player = { //Player object containing position and sprite
  pos: [0, 0],  //Player coordinates
  sprite: new Sprite('./sprites/player/player.png', [0, 0], [64, 64], 16, [0,1,2,3,4,5,4,3,2,1]) //DONE: Give sprite parameters and file
  
};

var liveObstacles = []; //Array of obstacles

var gameTime = 0; //How long the game has been going
var isGameOver; //Boolean value checking whether game is over or not

//Score
var score = 0;
var scoreEl = document.getElementById('score');

var playerSpeed = 200; //Numbers should be tweaked later
var obstacleSpeed = 100;


//Update function
function update(dt) {

  gameTime += dt;
  handleInput(dt);
  updateEntities(dt);

  //AI for creating obstacles
  if(Math.random() < 1 - Math.pow(.993, gameTime)){ //Makes the game harder and harder
    liveObstacles.push({ //Puts a new obstacle in the obstacles array
      pos: [canvas.width, //Setting a random position
            Math.random() * (canvas.height - 64)], //Value of 64 as that is the height of the sprite
      sprite: new Sprite('./sprites/obstacles/rectangleObstacle.png', [0, 0], [64, 64]) //Creating a new random sprite from the obstacles array
      //TODO: HOLY CRAP WHAT ARE THOSE PARAMETERS. THE DOCUMENTATION IS SO USELESS. THE HELL?!? Also save this code for getting a random obstacle: obstacles[Math.random()*4|0]
    })
  }

  checkCollisions();

  scoreEl.innerHTML = score;

};

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }
  }

//Function to update all the entities
function updateEntities(dt) {
  //Updates player sprite animation
  player.sprite.update(dt);

  //Sets isGameOver to true if the player is off the screen
  if(player.pos + player.sprite.size[0] < 0) {
   isGameOver = true;
 }


  //Updates all the enemies
  for(var i=0; i < liveObstacles.length; i++){
    liveObstacles[i].pos[0] -= obstacleSpeed * dt;
    liveObstacles[i].sprite.update(dt);

    //removes the object if it goes off screen
    if(liveObstacles[i].pos[0] + liveObstacles[i].sprite.size[0] < 0) {
      liveObstacles.splice(i, 1);
      i--;
    }
  }
}

//collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
  return !(r <= x2 || x > r2 ||
            b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
  return collides(pos[0], pos[1],
                  pos[0] + size[0], pos[1] + size[1],
                  pos2[0], pos2[1],
                  pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
  checkPlayerBounds();

  //Collision detection for all obstacles + player
  for(var i=0; i<liveObstacles.length; i++) { //Check every obstacles' coordinates against the players
      var pos = liveObstacles[i].pos;
      var size = liveObstacles[i].sprite.size;

      if(boxCollides(pos, size, player.pos, player.sprite.size)){//If they collide
         player.pos[0] -= 7;//liveObstacles[i];  //TODO Find a way to make that box glow. Damn.
         glow(liveObstacles[i].pos1, liveObstacles[i].pos2);
         console.log(liveObstacles[i]);
      }
  }
}

function checkPlayerBounds(){
  //checks bounds
  if(player.pos[0] < 0 - player.sprite.size[0]) { //If the player is off the left side of the screen
    gameOver(); //Game over
  }


  if(player.pos[1] < 0) { //If the player is floating off the screen
    player.pos[1] = 0; //SOMEBODY STOP HIM, HE'S GOING TO JUMP!
  }
  else if(player.pos[1] > canvas.height - player.sprite.size[1]) { //Otherwise if he's touching the boarder
    player.pos[1] = canvas.height - player.sprite.size[1] //Don't let him move (FREEZE)
  }//TODO get obstacles to actually block the player
}

//RENDERING!
function render() {
  ctx.fillStyle = mapPattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Renders the player, as long as the game isn't over
  if(!isGameOver) {
    renderEntity(player);
  }

  renderEntities(liveObstacles);
};

function renderEntities(list) {
  for(var i=0; i<list.length; i++) {
    renderEntity(list[i]);
  }
}

function renderEntity(entity) {
  ctx.save();
  ctx.translate(entity.pos[0], entity.pos[1]);
  entity.sprite.render(ctx);
  ctx.restore();
}

//Game over
function gameOver() {
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('game-over-overlay').style.display = 'block';
  isGameOver = true;
}

//Reset game
function reset() {
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('game-over-overlay').style.display = 'none';
  isGameOver = false;
  gameTime = 0;
  score = 0;

  liveObstacles = [];

  player.pos = [50, canvas.height / 2];
};
