//Creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d"); //2d canvas
canvas.width = 512; //Width of canvas in pixels, should be edited later
canvas.height = 480; // Height of canvas in pixels, should be edited later
document.body.appendChild(canvas);
//Canvas creation finished

//Variables with obstacle sprites TODO: ACTUALLY LINK THEM TO sprites
var obstacles = ['','','',''] //0 should be square, 1: rectangle, 2: circle, 3:  triangle

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
      sprite: new Sprite(obstacles[Math.random()*5|0], [0, 0], [64, 64], 6, [0] ) //Creating a new random sprite from the obstacles array
      //TODO: HOLY CRAP WHAT ARE THOSE PARAMETERS. THE DOCUMENTATION IS SO USELESS. THE HELL?!?
    })
  }

  checkCollisions();

  scoreEl.innerHTML = score;

};

//The main game loop
var lastTime;
function main() {
  var now = Date.now(); //sets now to the current time
  var dt = (now - lastTime) / 1000.0; //sets dt (difference in time) to now - the previous time

  update(dt); //Updates scene with time since last frame
  render(); //renders the scene

  lastTime = now; //sets last time to the last current time
  requestAnimFrame(main); //queues the next game loop
}
