import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
import db from './database.js';
let isTwoPayer = false;
let playerIs = 'playerOne'
// function makeid(length) {
//   var result = '';
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() *
//       charactersLength));
//   }
//   return result;
// }
let gamedata = {
  reference:''
}
let setPlayerTwoButton = document.getElementById('playerteobutton')
setPlayerTwoButton.addEventListener('click', () => {
  playerIs = 'playerTwo'
})
let getPlayerOnesavedScore;
let getPlayerTwosavedScore;
var playerOnesavedScore = 0;
var playerTwosavedScore = 0;

let button = document.getElementById('removesthis')
button.addEventListener('click', () => {
  isTwoPayer = true
  gamedata.reference = ref(db, 'jmfSLwU5/')
  getPlayerOnesavedScore = ref(db, 'jmfSLwU5/', 'playerOnePoints');
  getPlayerTwosavedScore = ref(db, 'jmfSLwU5/', 'playerTwoPoints');
  set(gamedata.reference, {
    playerOnePoints: 0,
    playerTwoPoints: 0
  })
  onValue(getPlayerOnesavedScore, (snap) => {
    playerOnesavedScore = snap.val().playerOnePoints;
  })
  onValue(getPlayerTwosavedScore, (snap) => {
    playerTwosavedScore = snap.val().playerTwoPoints;
  })
  console.log(playerTwosavedScore)
})
  

// initialize kaboom context
let kB = kaboom();

// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "myNewBarrel.png")
loadSprite('speedPower', 'testingPower.jpg')
loadSprite("apple", "apple.png");
loadSprite("badApple", "badApple.png");

var score = 0;
var countDown = 60;
let timeOfGame = 120;

// background
loadSprite("clearsky", "background2.jpg")


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
  onCollide('newBadApple', 'floor', (ap,) => {
    destroy(ap)
  })
  onCollide('newBadApple', 'tag2', (ap,) => {
    score -= 10;
    destroy(ap)
    scoreText.text = `Score: ${score}`;
  })

  let scoreText = add([
    text(`Score: ${score}`),
    pos(10, height() - 100)
  ])

  let timer = add([
    text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`),
    pos(width() - 520, height() - 100)
  ])


  // dom elements
  const audio = document.querySelector("audio");
  const playAudio = document.body.querySelectorAll("button")[0];
  const pauseAudio = document.body.querySelectorAll("button")[1];

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

  let barrel = add([
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
  let spawnSpeed = 1
  let appleFallSpeed = 200
  let spawnRate = 1;

  // functionality of apple
  loop(spawnSpeed, () => {
    for (let i = 0; i < spawnRate; i++) {
      add([
        sprite("apple"),
        scale(0.05),
        pos(rand(vec2(width())).x, -100),
        move(DOWN, rand(appleFallSpeed-100, appleFallSpeed+100)),
        area(),
        'fallingApple',
      ])
    }
  })
  loop(2, () => {
    for (let i = 0; i < spawnRate; i++) {
      add([
        sprite("badApple"),
        scale(0.1),
        pos(rand(vec2(width())).x, -100),
        move(DOWN, rand(appleFallSpeed - 100, appleFallSpeed + 100)),
        area(),
        'newBadApple',
      ])
    }
  })
  barrel.onCollide('fallingApple', (fallingApple) => {
    destroy(fallingApple);
    score += 5;
    scoreText.text = `Score: ${score}`;
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
    if (countDown % 20 === 0 && spawnRate < 10) {
      spawnRate++
    }

    timeOfGame--
    timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
    if (timeOfGame === 0) {
      go('gameOver')
    }

    if (isTwoPayer) { 
      if (playerIs === 'playerOne') {
        set(getPlayerOnesavedScore, {
          playerOnePoints: score,
          playerTwoPoints: playerTwosavedScore
        })
      } else {
        set(getPlayerTwosavedScore, {
          playerOnePoints: playerOnesavedScore,
          playerTwoPoints: score,
        })
      }
    }
  })

})

scene("gameOver", () => {
  let scoreText = add([
    text(`GameOver`),
    pos(10, height() - 100)
  ])
})
 
function isGameOver() { 
  if (timeOfGame > 0) {
    go('game')
  } else {
    go('gameOver')
  }
}
isGameOver()

