/*
TODO TODO TODO TODO TODO TODO
List of things that need to be done:
- Link sprites and hook that stuff up
- Automatic wall placement and replication. Look at background code for help
- Player on the damn screen.
- Find those parameters for the sprite function. It's really annoying.
- Insert witty puns as comments wherever possible
- Reorganize code
TODO TODO TODO TODO TODO TODO
*/

//Creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d"); //2d canvas
canvas.width = 1024; //Width of canvas in pixels, should be edited later
canvas.height = 512; // Height of canvas in pixels, should be edited later
document.body.appendChild(canvas);
//Canvas creation finished


//The main game loop
var lastTime;
function main() {
  var now = Date.now(); //sets now to the current time
  var dt = (now - lastTime) / 1000.0; //sets dt (difference in time) to now - the previous time

  update(dt); //Updates scene with time since last frame
  render(); //renders the scene

  lastTime = now; //sets last time to the last current time
  requestAnimFrame(main); //queues the next game loop
};


function init() {
  mapPattern = ctx.createPattern(resources.get(''), 'repeat'); //TODO: make a background image and link it. Literally a black rectangle the size of canvas

  document.getElementById('play-again').addEventListener('click', function(){ //TODO: Edit this so it links to the main menu, a bit confusing right now
    reset();
  });

  reset();
  lastTime = Date.now();
  main();
}

//Variables with obstacle sprites WARNING. MUST LOAD IMAGES FIRST. TODO: ACTUALLY LINK THEM TO sprites

var obstacles = resources.load([
  '', //square
  '', //rectangle
  '', //triangle
  '', //circle
])

//DEAR GOD SPRITES MUST BE LINKED.
resources.load([
  '', //player
  '', //background
])



//Game state
var player = { //Player object containing position and sprite
  pos: [0, 0],  //Player coordinates
  sprite: new Sprite(); //TODO: Give sprite parameters and file
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
      sprite: new Sprite(obstacles[Math.random()*4|0], [0, 0], [64, 64], 6, [0] ) //Creating a new random sprite from the obstacles array
      //TODO: HOLY CRAP WHAT ARE THOSE PARAMETERS. THE DOCUMENTATION IS SO USELESS. THE HELL?!?
    })
  }

  checkCollisions();

  scoreEl.innerHTML = score;

};

//Function to update all the entities
function updateEntities(dt) {
  //Updates player sprite animation
  player.sprite.update(dt);

  //Sets isGameOver to true if the player is off the screen
  if(player.pos + player.sprite.size[0] < 0) {
   isGameOver = true;
 }

  //Updates all the enemies
  for(var i=0; i < liveObstacles; i++){
    liveObstacles[i].pos[0] -= obstacleSpeed * dt;
    liveObstacles[i].sprite.update(dt);

    //removes the object if it goes off screen
    if(liveObstacles[i].pos[0] + liveObstacles[i].sprite.size[0] < 0) {
      liveObstacles.splice(i, 1);
      i--;
    }
  }
}
