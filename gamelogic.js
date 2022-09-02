import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
import db from './database.js';
let isTwoPayer = false;
let playerIs = 'playerOne'
let gameKeyTojoin;
//gameKeyTojoin = 'jmfSLwU5/'
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
gameKeyTojoin = makeid(6)
let gamedata = {
  reference:''
}
let setPlayerTwoButton = document.getElementById('join-lobby-button')
setPlayerTwoButton.addEventListener('click', () => {
  isTwoPayer = true;
  playerIs = 'playerTwo';
  go('waitingLobby')
  console.log(playerIs);
})
let getPlayerOnesavedScore;
let getPlayerTwosavedScore;
var playerOnesavedScore = 0;
var playerTwosavedScore = 0;
var getPlayerTwoReady; 
var getDidGameStart;
let timeOfGame = 120;
let sTimeOfGame = 120;
let button = document.getElementById('multiplayer-button')
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
    gameTimer: timeOfGame
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
  go('waitingLobby')
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



// background
loadSprite('readyButtonIMG', 'ready.jpg');


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


// loadSprites
loadSprite("clearsky", "background2.jpg")
loadSprite("bluesky-startpage","My project (1).jpg")
loadSprite("cloud", "cloud-new.png")
loadSprite("start-button", "start-button.png")
loadSprite("rules-icon", "questionmark.jpg");

var soloButton = document.querySelectorAll("button")[3];
var multButton = document.querySelectorAll("button")[2];
var lobbyButton = document.querySelectorAll("button")[4];
scene("intro", () => {
  let background = add([
    sprite("bluesky-startpage"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()

  ])
  let introTxt = add([
    text("Click a mode and then start."),
    pos(500, 250),
    scale(.5),
    width(5),
  ])
  let start = add([
    sprite("start-button"),
    pos(500, 550),
    scale(.4),
    area(),
    "startgame"
  ])
  soloButton.addEventListener("click", () => {
    multButton.style.display="none";
    lobbyButton.style.display="none";
  onClick('startgame', ()=>{
    go('game')
    soloButton.style.display="none";
  })
  })

  multButton.addEventListener("click", () => {
    soloButton.style.display="none";
    multButton.style.display="none";
    lobbyButton.style.display="none";
  onClick('startgame', ()=>{
    go('lobby')
    
  })
  })


  lobbyButton.addEventListener("click", () => {
    soloButton.style.display="none";
    multButton.style.display="none";
    lobbyButton.style.display="none";
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
      add([
        text("  The rules of the game are fairly simple, apples will fall from the sky starting at a time of your choosing. Be careful to avoid the rotten apples because it will cause you to lose 10 points, catching the red apples will cause your score to go up 5 points. The mushroom is a powerup that lets you move your barrel faster. As the time goes on the apples will fall faster. Click anywhere on this text pop-up to close me.", {
          width: 450,
          size: 21,
          transform: (idx, ch) => ({
            color:  rgb(255,217,75)
          })
        }),
        pos(1070, 100),
        "rules-section", 
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
var readyButton;
///waitingLobby -------------------------------------------------------------------------------------------------------------------------------------------------

scene('waitingLobby', () => {
  let background = add([
    sprite("bluesky-startpage"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(2),
    fixed()

  ])
  add([
    text(`Are you ready?`, {
      size: 50
    }),
    pos(100, 160)
  ])
  let playerOnetext = add([
    text(`Player One is ready`, {
      size: 50
    }),
    pos(100, 230)
  ])
    let playertwoReadyText = add([
    text(`Player Two is not ready`, {
      size: 50
    }),
    pos(100, 300)
    ])
  
  if (playerIs === "playerTwo") {
    let enterKeyToJoin = document.createElement('input')
    document.body.append(enterKeyToJoin)
    enterKeyToJoin.setAttribute("type", "text");
    enterKeyToJoin.setAttribute("id", "GetGivenKey");
    enterKeyToJoin.setAttribute('placeholder',"Code Here")
    enterKeyToJoin.style.position = "absolute"
    enterKeyToJoin.style.top = `${(height() / 2) - 200}px`
    enterKeyToJoin.style.left = `${(width() / 2) - 40}px`

    let keySubmmitButton = document.createElement('button')
    document.body.append(keySubmmitButton)
    keySubmmitButton.innerText = 'Submit'
    keySubmmitButton.style.position = "absolute"
    keySubmmitButton.style.top = `${(height() / 2 - 160)}px`
    keySubmmitButton.style.left = `${(width() / 2) + 20}px`

    keySubmmitButton.addEventListener('click', () => {
      gameKeyTojoin = enterKeyToJoin.value;
      console.log(gameKeyTojoin)
      gamedata.reference = ref(db, gameKeyTojoin)
      let readyButtonTwo = document.createElement('button')
      document.body.append(readyButtonTwo)
      readyButtonTwo.innerText = 'READY'
      readyButtonTwo.style.position = "absolute"
      readyButtonTwo.style.fontSize = '30px'
      readyButtonTwo.style.borderRadius = '50px'
      readyButtonTwo.style.backgroundColor = "red"
      readyButtonTwo.style.top = `${(height() / 2 + 2)}px`
      readyButtonTwo.style.left = `${(width() / 2) + 20}px`
      onValue(gamedata.reference, (snap) => {
        if (snap.val()) {
          playerOnesavedScore = snap.val().playerOnePoints;
          timeOfGame = snap.val().gameTimer;
          playerTwosavedScore = snap.val().playerTwoPoints;
          getPlayerTwoReady = snap.val().isPlayerTwoReady;
          getDidGameStart = snap.val().didGameStart;
          playerOnetext.onUpdate(() => {
            if (getDidGameStart) {
              go('game')
              readyButtonTwo.remove()
              enterKeyToJoin.remove()
              keySubmmitButton.remove()
            }
          })
        } else {
          console.log('errrror')
        }
        
      })
      readyButtonTwo.addEventListener('click', () => {
        if (playerIs === 'playerTwo') {
          getPlayerOnesavedScore = ref(db, gameKeyTojoin, 'playerOnePoints');
          getPlayerTwosavedScore =  ref(db, gameKeyTojoin, 'playerOnePoints');;
          set(getPlayerOnesavedScore, {
            playerOnePoints: playerOnesavedScore,
            playerTwoPoints: playerTwosavedScore,
            isPlayerTwoReady: true,
            gameTimer: timeOfGame,
            didGameStart: getDidGameStart
          })
        }
        playertwoReadyText.text = `Player Two is ready ${getPlayerTwoReady}`
        console.log('cats')
      })
      //console.table(playerOnesavedScore, timeOfGame, playerTwosavedScore, getPlayerTwoReady, getDidGameStart)
    })

  } else {
    add([
      text(`Lobby Code: ${gameKeyTojoin}`, {
        size: 50
      }),
      pos(100, 370)
    ])
    playerOnetext.onUpdate(() => {
      if (getPlayerTwoReady) {
        add([
          sprite("start-button"),
          pos(width() / 2 + 200, (height() / 2) - 100),
          origin("center"),
          'startTheGame',
          scale(.2),
          area(),
          fixed()
        ]);
        playertwoReadyText.text = `Player Two is ready ${getPlayerTwoReady}`;
      }
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
        go('game')
      } else {
        console.log('playerTwo is not ready')
      }
    })
  }
})
// go('waitingLobby');
///game -------------------------------------------------------------------------------------------------------------------------------------------------
scene("game", () => {
  if (readyButton) {
    destroy(readyButton)
  }
  playerOnesavedScore = 0;
  playerTwosavedScore = 0;
  set(getPlayerOnesavedScore, {
    playerOnePoints: 0,
    playerTwoPoints: 0,
    gameTimer: timeOfGame
  })
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
      text(`Timer:${new Date(sTimeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, letterSpacing: 3}),
      pos(width() - 520, height() - 100)
    ])
  } else {
    var playerOneScoreText = add([
      text(`P1 Score: ${0}`, { letterSpacing: 0, letterSpacing: 3, size: 50 }),
      pos(10, height() - 100)
    ])
    var playerTwoScoreText = add([
      text(`P2 Score: ${0}`, { letterSpacing: 0, letterSpacing: 3, size: 50 }),
      pos(width()-600, height() - 100)
    ])
    var timer = add([
      text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, size: 50 }),
      pos(width()/2 - 300, height() - 100)
    ])
  }



  

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
    if (isTwoPayer) {
      playerOneScoreText.text = `P1 Score: ${playerOnesavedScore}`;
      playerTwoScoreText.text = `P2 Score: ${playerTwosavedScore}`;
    }
  })

  barrel.onCollide('tag1', (power) => {
    barrelSpeed = 1000
    destroy(power)
    wait(5, () => {
      barrelSpeed = 400
    })
  })
  let spawnSpeed = 1;
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
      if (playerIs === 'playerOne') {
        playerOneScoreText.text = `P1 Score: ${score}`;
        playerOnesavedScore = score
      } else {
        playerTwoScoreText.text = `P2 Score: ${score}`;
        playerTwosavedScore = score
      }
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
    if (timeOfGame <= 0) {
      go('gameOver')
    }
  })
  wait(1, () => {
    loop(1, () => {
      if (isTwoPayer) {
        if (playerIs === 'playerOne') {
          timeOfGame--
          console.log(timeOfGame)
          timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
          set(getPlayerOnesavedScore, {
            playerOnePoints: score,
            playerTwoPoints: playerTwosavedScore,
            gameTimer: timeOfGame
          })
        } else {
          timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
          set(getPlayerTwosavedScore, {
            playerOnePoints: playerOnesavedScore,
            playerTwoPoints: score,
            gameTimer: timeOfGame
          })
        }
      } else {
        sTimeOfGame--
        if (sTimeOfGame <= 0) {
          go('gameOver')
        }
        timer.text = `Timer:${new Date(sTimeOfGame * 1000).toISOString().substring(14, 19)}`;
      }
    })
    
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
    pos(500, 50),
    color(255,217,75),
  ])
  if (!isTwoPayer) {
    let scoreText = add([
      text("Score:"),
      pos(660, 200),
    ])
 
    let scoreVal = add([
      text(`${score}`),
      pos(690, 350),
      scale(1.26)
    ])
  } else {
    wait(3, () => {
      if (playerOnesavedScore === playerTwosavedScore) {
        add([
          text(`It was a draw! wow`),
          pos(400, 160),
        ])
        add([
          text(`You both get ${playerOnesavedScore} points`, { size: 40 }),
          pos(580, 240),
        ])
      } else if (playerOnesavedScore > playerTwosavedScore) {
        add([
          text(`Player One Won`),
          pos(470, 160),
        ])
        add([
          text(`Player one score ${playerOnesavedScore}`, { size: 40 }),
          pos(560, 240),
        ])
        add([
          text(`Player two score ${playerTwosavedScore}`, { size: 30 }),
          pos(610, 300),
        ])
      } else {
        add([
          text(`Player Two Won`),
          pos(470, 160),
        ])
        add([
          text(`Player two score ${playerTwosavedScore}`, { size: 40 }),
          pos(560, 240),
        ])
        add([
          text(`Player one score ${playerOnesavedScore}`, { size: 30 }),
          pos(610, 300),
        ])
      }
    })
  }
  
  if (!isTwoPayer) {
    let reset = add([
      sprite("reset"),
      scale(.6),
      area(),
      pos(680, 500),
      "reset-button"
    ])
  } else if( playerIs === "playerTwo"){
    let reset = add([
      sprite("reset"),
      scale(.6),
      area(),
      pos(680, 500),
      "reset-button"
    ])
  } else {
    loop(1,()=>{
      if (getPlayerTwoReady) {
        let reset = add([
          sprite("reset"),
          scale(.6),
          area(),
          pos(680, 500),
          "reStartTheGame"
        ])
        onClick('reStartTheGame', () => {
          playerOnesavedScore = 0;
          playerTwosavedScore = 0;
          score = 0
          set(getPlayerOnesavedScore, {
            playerOnePoints: 0,
            playerTwoPoints: 0,
            didGameStart: true,
            gameTimer: 120
          })
          go('game')
        })
        
      }
    })
  }
  onClick("reset-button",()=>{
    if (!isTwoPayer) {
      go('game')
      sTimeOfGame = 10;
      score = 0
    } else {
      score = 0
      playerOnesavedScore = 0;
      playerTwosavedScore = 0;
      if (playerIs === 'playerTwo') {
          set(getPlayerTwosavedScore, {
            playerOnePoints: 0,
            playerTwoPoints: 0,
            gameTimer: 120,
            isPlayerTwoReady:true
          })
          gameOverText.onUpdate(() => {
            if (getDidGameStart) {
              go('game')
            }
          })
      }
    }
  })
});

