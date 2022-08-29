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


// increment counter when collision happens
// onUpdate(() => {
//     score++;
//     scoreLabel.text = score;
// });