// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
loadSprite("bean", "testingBarrel.png")

// add something to screen
add([
  sprite("bean"),
  scale(0.2),
  pos(500, 450),
  move(UP, 5),

])

// adding the apples
loadSprite("apple", "apple.png");

// functionality of apple
add([
    sprite("apple"),
    scale(0.05),
    pos(300, 10),
    move(DOWN, 40),
    
])

// score counter 
let score = 0;
const scoreLabel = add([
    text(score),
    pos(24, 24)
])

// dom elements
const audio = document.querySelector("audio");
const playAudio = document.body.querySelectorAll("button")[0];
const pauseAudio = document.body.querySelectorAll("button")[1];

// event listeners 
  playAudio.addEventListener("click", () => {
  if(!audio.play()){
  audio.play(); 
  }
  });
  pauseAudio.addEventListener("click", () => {
  if(!audio.pause()){
  audio.pause();
  }
  });

  // background
  loadSprite("clearsky", "background2.jpg")

  let background = add([
    sprite("clearsky"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()
  ]);


