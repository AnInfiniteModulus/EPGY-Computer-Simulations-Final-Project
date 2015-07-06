//Creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d"); //2d canvas
canvas.width = 512; //Width of canvas in pixels, should be edited later
canvas.height = 480; // Height of canvas in pixels, should be edited later
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
}
