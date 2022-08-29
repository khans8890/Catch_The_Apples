// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "testingBarrel.png")
loadSprite('speedPower', 'testingPower.jpg')

background= add([
  sprite('background'),
  pos(width() / 3, height() / 2),
  origin("center"),
  // Allow the background to be scaled
  scale(.6),
  area(),
  // Keep the background position fixed even when the camera moves
  fixed()

])
// power = add([
//   sprite('speedPower'),
//   pos(rand(vec2(width())).x, 10),
//   'tag1',
//   area(),
//   scale(.2),
//   move(DOWN, 240),

// ])

loop(rand(20,25), () => {
  // add tree
  add([
    sprite('speedPower'),
    pos(rand(vec2(width())).x, 10),
    `tag1`,
    area(),
    scale(.2),
    move(DOWN, 240),
  ])
});

// add something to screen
barrel = add([
  sprite("barrel"),
  scale(0.2),
  'tag2',
  pos(0, 500),
  area()
])

let barrelSpeed = 400

barrel.onUpdate(() => {
  if (mousePos().x > 86 && mousePos().x < width() - 86 || barrel.pos.x > 0 && barrel.pos.x < width() - 170) {
    barrel.moveTo(mousePos().x - 86, 500, barrelSpeed)
  }
})
// timer
// score
// 
barrel.onCollide('tag1', (power) => {
  barrelSpeed = 1000
  destroy(power)
  wait(10, () => {
    console.log('2')
    barrelSpeed = 400
  })
})

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
