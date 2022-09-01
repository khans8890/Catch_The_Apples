import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
import db from './database.js';
let isTwoPayer = false;
let playerIs = 'playerOne'
let gameKeyTojoin;
gameKeyTojoin = 'jmfSLwU5/'
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
  playerIs = 'playerTwo';
  console.log(playerIs);
})
let getPlayerOnesavedScore;
let getPlayerTwosavedScore;
var playerOnesavedScore = 0;
var playerTwosavedScore = 0;
var getPlayerTwoReady;
var getDidGameStart;
let timeOfGame;
let button = document.getElementById('removesthis')
button.addEventListener('click', () => {
  isTwoPayer = true
  gamedata.reference = ref(db, gameKeyTojoin)
  getPlayerOnesavedScore = ref(db, gameKeyTojoin, 'playerOnePoints');
  getPlayerTwosavedScore = ref(db, gameKeyTojoin, 'playerTwoPoints');
  set(gamedata.reference, {
    playerOnePoints: 0,
    playerTwoPoints: 0,
    isPlayerTwoReady: false,
    didGameStart: false,
    gameTimer: 120
  })
  onValue(getPlayerOnesavedScore, (snap) => {
    playerOnesavedScore = snap.val().playerOnePoints;
    timeOfGame = snap.val().gameTimer;
  })
  onValue(getPlayerTwosavedScore, (snap) => {
    playerTwosavedScore = snap.val().playerTwoPoints;
    getPlayerTwoReady = snap.val().isPlayerTwoReady;
    getDidGameStart = snap.val().didGameStart;
  })
  console.log('twoPlayer game')
})
  

// initialize kaboom context
let kB = kaboom();

// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "myNewBarrel.png")
loadSprite('speedPower', 'testingPower.jpg')
loadSprite("apple", "apple.png");
loadSprite("badApple", "badApple.png");
gravity(80)
loadSprite("reset", "restart.png")

var score = 0;
var countDown = 60;


// background
loadSprite("clearsky", "background2.jpg");
loadSprite('readyButtonIMG', 'ready.jpg');

///waitingLobby -------------------------------------------------------------------------------------------------------------------------------------------------
scene('waitingLobby', () => {
  let background = add([
    sprite("clearsky"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()
  ]);
  let readyButton = add([
    sprite("readyButtonIMG"),
    pos(width() / 2, (height() / 2) - 100),
    origin("center"),
    'ImReady',
    scale(.5),
    area(),
    fixed()
  ]);
  add([
    sprite("readyButtonIMG"),
    pos(width() / 2+200, (height() / 2) - 100),
    origin("center"),
    'startTheGame',
    scale(.2),
    area(),
    fixed()
  ]);
  add([
    text(`are you ready`, {
      size: 30
    }),
    pos(100, 160)
  ])
  let playerOnetext = add([
    text(`Player One is ready`, {
      size: 30
    }),
    pos(100, 200)
  ])
  playerOnetext.width = 100;

  add([
    text(`Player Two is not ready`, {
      size: 30
    }),
    pos(100, 250)
  ])
  if (playerIs === "playerOne") {
    let enterKeyToJoin = document.createElement('input')
    document.body.append(enterKeyToJoin)
    enterKeyToJoin.setAttribute("type", "text");
    enterKeyToJoin.setAttribute("id", "GetGivenKey");
    enterKeyToJoin.style.position = "absolute"
    enterKeyToJoin.style.top = `${(height()/2) - 40}px`
    enterKeyToJoin.style.left = `${(width() / 2) - 40}px`

    let keySubmmitButton = document.createElement('button')
    document.body.append(keySubmmitButton)
    keySubmmitButton.innerText = 'Submit'
    keySubmmitButton.style.position = "absolute"
    keySubmmitButton.style.top = `${(height() / 2-10)}px`
    keySubmmitButton.style.left = `${(width() / 2) +20}px`
    keySubmmitButton.addEventListener('click', () => { 
      gameKeyTojoin = enterKeyToJoin.value;
      console.log(gameKeyTojoin)
    })
  }
  onClick('ImReady', () => {
    if (playerIs === 'playerTwo') {
      set(getPlayerOnesavedScore, {
        playerOnePoints: playerOnesavedScore,
        playerTwoPoints: playerTwosavedScore,
        isPlayerTwoReady: true,
        gameTimer: timeOfGame
      })
    } 
    console.log('cats')
  })
  onClick('startTheGame', () => {
    if (getPlayerTwoReady) {
      set(getPlayerOnesavedScore, {
        playerOnePoints: playerOnesavedScore,
        playerTwoPoints: playerTwosavedScore,
        isPlayerTwoReady: true,
        didGameStart: true,
        gameTimer: timeOfGame
      })
      console.log('start game')
    } else {
      console.log('playerTwo is not ready')
    }
  })
  readyButton.onUpdate(() => { 
    if (getDidGameStart) { 
      go('game')
    }
  })
})
go('waitingLobby')
///game -------------------------------------------------------------------------------------------------------------------------------------------------
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
    if (!isTwoPayer) {
      scoreText.text = `Score: ${score}`;
    }
  })
  if (!isTwoPayer) {
    var scoreText = add([
      text(`Score: ${score}`),
      pos(10, height() - 100)
    ])
    var timer = add([
      text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, letterSpacing: 3}),
      pos(width() - 520, height() - 100)
    ])
  } else {
    var playerOneScoreText = add([
      text(`P1 Score: ${score}`, { letterSpacing: 0, letterSpacing: 3, size: 50 }),
      pos(10, height() - 100)
    ])
    var playerTwoScoreText = add([
      text(`P2 Score: ${score}`, { letterSpacing: 0, letterSpacing: 3, size: 50 }),
      pos(width()-600, height() - 100)
    ])
    var timer = add([
      text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, size: 50 }),
      pos(width()/2 - 300, height() - 100)
    ])
  }



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

  loop(10, () => {
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
    playerOneScoreText.text = `P1 Score: ${playerOnesavedScore}`;
    playerTwoScoreText.text = `P2 Score: ${playerTwosavedScore}`;
  })

  barrel.onCollide('tag1', (power) => {
    barrelSpeed = 1000
    destroy(power)
    wait(5, () => {
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
    if (!isTwoPayer) {
      scoreText.text = `Score: ${score}`;
    } else {
      playerOneScoreText.text = `P1 Score: ${playerOnesavedScore}`;
      playerTwoScoreText.text = `P2 Score: ${playerTwosavedScore}`;
    }
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
    if (playerIs === 'playerOne') {
      timeOfGame--
      timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
      set(getPlayerOnesavedScore, {
        playerOnePoints: playerOnesavedScore,
        playerTwoPoints: playerTwosavedScore,
        gameTimer: timeOfGame
      })
    } else {
      timeOfGame--
      timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
      set(getPlayerOnesavedScore, {
        playerOnePoints: playerOnesavedScore,
        playerTwoPoints: playerTwosavedScore,
        gameTimer: timeOfGame
      })
    }

    if (timeOfGame <= 0) {
      go('gameOver')
    }

    if (isTwoPayer) {
      if (playerIs === 'playerOne') {
        set(getPlayerOnesavedScore, {
          playerOnePoints: score,
          playerTwoPoints: playerTwosavedScore,
          gameTimer: timeOfGame
        })
      } else {
        set(getPlayerTwosavedScore, {
          playerOnePoints: playerOnesavedScore,
          playerTwoPoints: score,
          gameTimer: timeOfGame
        })
      }
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

