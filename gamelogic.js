// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "testingBarrel.png")
loadSprite('speedPower', 'testingPower.jpg')
loadSprite("apple", "apple.png");
gravity(80)
let score = 0;
let countDown = 60;
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

loop(rand(25,30), () => {
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

barrel.onCollide('tag1', (power) => {
  barrelSpeed = 1000
  destroy(power)
  wait(10, () => {
    console.log('2')
    barrelSpeed = 400
  })
})
let spawnSpeed = 1
let appleFallSpeed = 150
let spawnRate = 1;

// functionality of apple
loop(spawnSpeed, () => {
  for (let i = 0; i < spawnRate; i++) {
    add([
      sprite("apple"),
      scale(0.05),
      pos(rand(vec2(width())).x, -100),
      //move(DOWN, rand(appleFallSpeed-100, appleFallSpeed+100)),
      area(),
      body(),
      'fallingApple',
    ])
  }
})

barrel.onCollide('fallingApple', (fallingApple) => {
  destroy(fallingApple);
  score++;
})

//timer
loop(1, () => { 
  countDown--
  if (countDown % 10 === 0) { 
    if (spawnSpeed > 0.3) {
      spawnSpeed -= 0.2
    } else if (spawnSpeed > 0.05) { 
      spawnSpeed = spawnSpeed - 0.02
    }
    if (appleFallSpeed < 500) {
      appleFallSpeed += 50
    }
  }
  if (countDown % 10 === 0 && spawnRate < 10) { 
    spawnRate++
  }
})

add([
  pos(0, height()-40),
  rect(width()-20,40),
  outline(4),
  'floor',
  area(),
])
onCollide('fallingApple', 'floor',(ap,fl)=> {
  destroy(ap)
  console.log(score)
})