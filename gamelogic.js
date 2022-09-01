// initialize kaboom context
let kB = kaboom();
// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "myNewBarrel.png")
loadSprite('speedPower', 'testingPower.jpg')
loadSprite("apple", "apple.png");
gravity(80)
loadSprite("reset", "restart.png")

// dom elements
var audio = document.querySelector("audio");
var playAudio = document.body.querySelectorAll("button")[0];
var pauseAudio = document.body.querySelectorAll("button")[1];
// event listeners 
playAudio.addEventListener("click", () => {
  if (!audio.play()) {
    audio.play();
  }
});
pauseAudio.addEventListener("click", () => {
  if (!audio.pause()) {
    audio.pause();
  }
});

var score = 0;
var countDown = 60;
var timeOfGame = 120;

// loadSprites
loadSprite("clearsky", "background2.jpg")
loadSprite("bluesky-startpage","bluesky.jpg")
loadSprite("cloud", "cloud-new.png")
loadSprite("start-button", "start-button.png")
loadSprite("rules-icon", "questionmark.jpg");

scene("intro", () => {
  let background = add([
    sprite("bluesky-startpage"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()
  ])
  add([
    sprite("cloud"),
    scale(0.5), 
    pos(800, 0)
  ])
  add([
    sprite("cloud"),
    scale(0.5), 
    pos(800, 800)
  ])
  add([
    sprite("cloud"),
    scale(0.5), 
    pos(40,400)
  ])
  add([
    sprite("cloud"),
    scale(0.5), 
    pos(1550, 400)
  ])
  let start = add([
    sprite("start-button"),
    pos(100, 100),
    area(),
    "startgame"
  ])
  onClick('startgame', ()=>{
    go('game')
  })
  function rulesPopUp(txt, p, f) {
    const rules = add([
      text("Rules"),
      pos(1350,40),
      area({cursor: "pointer", }),
      scale(1),
      origin("center"),
    ])
    
    rules.onClick(f);
    
    rules.onUpdate(() => {
      if(rules.isHovering()) {
         const t = time() * 10
         rules.color = rgb(
          wave(0, 255, t),
          wave(0, 225, t + 2),
          wave(0, 255, t + 4),
        )
        rules.scale = vec2(1.2)
      } else {
        rules.scale = vec2(1)
        rules.color = rgb()
      }
    })
    }

   rulesPopUp("Rules", vec2(200, 200), () => (
      // debug.log("The rules of the game are fairly simple, apples will fall from the sky starting at a time of your choosing. Be careful to avoid the rotten apples because it will cause you to lose 10 points, catching the red apples will cause your score to go up 5 points. The mushroom is a powerup that lets you move your barrel faster. As the time goes on the apples will fall faster. Click anywhere on this pop up to close me."),
      add([
        text("The rules of the game are fairly simple, apples will fall from the sky starting at a time of your choosing. Be careful to avoid the rotten apples because it will cause you to lose 10 points, catching the red apples will cause your score to go up 5 points. The mushroom is a powerup that lets you move your barrel faster. As the time goes on the apples will fall faster. Click anywhere on this pop up to close me.", {
          width: 600,
          size: 21,
          transform: (idx, ch) => ({
            color:  rgb(255,217,75)
          })
        }),
        "rules-section", 
        pos(0, 100), 
        area(),
        
      ])

    ))
   
      onClick("rules-section", () => {
        destroyAll("rules-section")
      })
    onUpdate(() => cursor("default"));    
});

go('intro');

// The rules of the game are fairly simple, apples will fall from the sky starting at a time of your choosing. Be careful to avoid the rotten apples because it will cause you to lose 5 points, catching the red apples will cause your score to go up 10 points. The mushroom is a powerup that lets you move your barrel faster. As the time goes on the apples will fall faster. To close the rules section simply click on the question icon.' 

// let rules = add([
//     sprite("rules-icon"),
//     pos(0,0)
// ])

function rulesPopUp(txt, p, f) {
const rules = add([
  text("Rules"),
  pos(100, 500),
  area({cursor: "pointer", }),
  scale(1),
  origin("center"),
])

rules.onClick(f);

rules.onUpdate(() => {
  if(rules.isHovering()) {
     const t = time() * 10
     rules.color = rgb(
      wave(0, 255, t),
      wave(0, 225, t + 2),
      wave(0, 255, t + 4),
    )
    rules.scale = vec2(1.2)
  } else {
    rules.scale = vec2(1)
    rules.color = rgb()
  }
})
}

rulesPopUp("Rules", vec2(200, 100), () => debug.log("hi!"));
rulesPopUp("Rules", vec2(200, 200), () => debug.log("bye"));
onUpdate(() => cursor("default"));



scene("game", () => {
  let background = add([
    sprite("clearsky"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()
  ]);

  add([
    pos(0, height() - 100),
    rect(width(), 100),
    outline(4),
    'floor',
    area(),
    outline(0.005),

    color(102, 189, 88)
  ])
  onCollide('fallingApple', 'floor', (ap,) => {
    destroy(ap)
  })

  let scoreText = add([
    text(`Score: ${score}`),
    pos(10, height() - 100)
  ])

  let timer = add([
    text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`),
    pos(width() - 520, height() - 100)
  ])


  



  loop(rand(25, 30), () => {
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
      barrelSpeed = 400
    })
  })
  let spawnSpeed = 1;
  let appleFallSpeed = 150;
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
    score += 5;
    scoreText.text = `Score: ${score}`;
  })

  // timer
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
    if (countDown % 20 === 0 && spawnRate < 10) {
      spawnRate++
    }

    timeOfGame--
    timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
    if (timeOfGame === 0) {
      go('gameOver')
    }
  })

})
scene("gameOver", () => {
  let background = add([
    sprite("clearsky"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()
  ]);
  let gameOverText = add([
    text("Game Over!"),
    scale(1.25),
    pos(750, 50),
    color(255,217,75),
  ])
 
 let scoreText = add([
    text("Score:"),
    pos(860, 200),
 ])
 
 let scoreVal = add([
  text(`${score}`),
  pos(890, 350),
  scale(1.26)
 ])


let reset = add([
  sprite("reset"),
  scale(.6),
  area(),
  pos(880, 500),
  "reset-button"

])
onClick("reset-button",()=>{
  go('game')
  timeOfGame = 60;
})
});