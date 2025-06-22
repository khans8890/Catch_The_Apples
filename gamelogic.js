import { onValue, ref, set } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
import db from './database.js';
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

let gameKeyTojoin;
let getPlayerOnesavedScore;
var getPlayerTwoReady;
var getDidGameStart;
let isTwoPayer = false;
let playerIs = 'playerOne';
var playerOnesavedScore = 0;
var playerTwosavedScore = 0;
let timeOfGame = 120;
let sTimeOfGame = 60;
var score = 0;
let gamedata = { reference: '' };
let musicPlaing = false
function makeid(length) {
  let result = '';
  let characters = 'abcdefghijklmnopqrstuvwxyz123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  };
  return result;
};

function rulesPopUp(txt, p, f) {
  const rules = add([
    text("Rules"),
    pos(100, 500),
    area({ cursor: "pointer", }),
    scale(1),
    // origin("center"),
  ]);

  rules.onClick(f);

  rules.onUpdate(() => {
    if (rules.isHovering()) {
      const t = time() * 10
      rules.color = rgb(
        wave(0, 255, t),
        wave(0, 225, t + 2),
        wave(0, 255, t + 4),
      );
      rules.scale = vec2(1.2)
    } else {
      rules.scale = vec2(1)
      rules.color = rgb()
    }
  });
}

// dom elements
gameKeyTojoin = makeid(8);


// initialize kaboom context
kaboom({
  width: window.innerWidth,
  height: window.innerHeight - 4.5,
})

// loadSprites
loadSprite("barrel", "gameSprites/output-onlinepngtools (2).png");
loadSprite('speedPower', 'gameSprites/testingPower.png');
loadSprite("apple", "gameSprites/apple.png");
loadSprite("badApple", "gameSprites/badApple.png");
loadSprite("reset", "gameSprites/restart.png");
loadSprite('readyButtonIMG', 'gameSprites/ready.jpg');
loadSprite("clearsky", "gameSprites/background2.jpg");
loadSprite("bluesky-startpage", "gameSprites/My project (1).jpg");
loadSprite("cloud", "gameSprites/cloud-new.png");
loadSprite("start-button", "gameSprites/start-button.png");
setGravity(80)

scene("intro", () => {
  loadSound("music", '/howler-demo-bg-music.mp3')
  let background = add([
    sprite("bluesky-startpage"),
    pos(0, 0),
    // pos(center()),
    scale(2),
    fixed()
  ]);

  let introTxt = add([
    text("Click a mode and then start"),
    pos(500, 250),
    scale(.5),
    width(5),
  ]);

  add([
    pos(190, 460),
    rect(260, 40),
    outline(4),
  ])

  let joinLobbyButton = add([
    text("Join Lobby"),
    pos(200, 465),
    color(0, 0, 0),
    area({ cursor: "pointer", }),
    scale(1),
    // pos(center())
  ]);
  joinLobbyButton.onClick(() => {
    if (musicPlaing === false) {
      play("music", { loop: true })
      musicPlaing = true
    }
    isTwoPayer = true;
    playerIs = 'playerTwo';
    setPlayerTwoButton.style.display = "none";
    go('waitingLobby');
  })
  add([
    pos(190, 395),
    rect(260, 40),
    outline(4),
  ])

  let multiplayerPlayerButton = add([
    text("Multiplayer"),
    pos(200, 400),
    color(0, 0, 0),
    area({ cursor: "pointer", }),
    scale(1),
    // pos(center())
  ]);

  multiplayerPlayerButton.onClick(() => {
    if (musicPlaing === false) {
      play("music", { loop: true })
      musicPlaing = true
    }
    play("music")
    isTwoPayer = true;
    gamedata.reference = ref(db, gameKeyTojoin);
    getPlayerOnesavedScore = ref(db, gameKeyTojoin, 'playerOnePoints');

    set(gamedata.reference, {
      playerOnePoints: 0,
      playerTwoPoints: 0,
      isPlayerTwoReady: false,
      didGameStart: false,
      gameTimer: timeOfGame
    });

    onValue(getPlayerOnesavedScore, (snap) => {
      playerOnesavedScore = snap.val().playerOnePoints;
      playerTwosavedScore = snap.val().playerTwoPoints;
      getPlayerTwoReady = snap.val().isPlayerTwoReady;
      timeOfGame = snap.val().gameTimer;
      getDidGameStart = snap.val().didGameStart;
    })

    go('waitingLobby');
  })

  add([
    pos(500, 395),
    rect(140, 40),
    outline(4),
  ])

  let singlePlayerButton = add([
    text("Single"),
    pos(505, 400),
    color(0, 0, 0),
    area({ cursor: "pointer", }),
    scale(1),
    sTimeOfGame = 120
    // pos(center())
  ]);
  singlePlayerButton.onClick(() => {
    if (musicPlaing === false) {
      play("music", { loop: true })
      musicPlaing = true
    }
    go('game')
  })

  add([
    pos(690, 395),
    rect(230, 40),
    outline(4),
  ])

  let quickTestButton = add([
    text("Qucik Game"),
    pos(695, 400),
    color(0, 0, 0),
    area({ cursor: "pointer", }),
    scale(1),
    // pos(center())
  ]);
  quickTestButton.onClick(() => {
    if (musicPlaing === false) {
      play("music", { loop: true })
      musicPlaing = true
    }
    sTimeOfGame = 30
    go('game')
  })

  function rulesPopUp(txt, p, f) {
    const box = add([
      pos(1145, 35),
      rect(120, 45),
      outline(4),
      area(),
    ])
    const rules = add([
      text("Rules"),
      pos(1150, 40),
      color(0, 0, 0),
      area({ cursor: "pointer", }),
      scale(1),
      // pos(center())
    ]);
    rules.onClick(f);

    rules.onUpdate(() => {
      if (rules.isHovering()) {
        const t = time() * 10;
        rules.color = rgb(
          wave(0, 255, t),
          wave(0, 225, t + 2),
          wave(0, 255, t + 4),
        );
        rules.scale = vec2(1.2);
        rules.pos = vec2(1140, 35);

        box.scale = vec2(1.2);
        box.pos = vec2(1135, 30);
      } else {
        rules.scale = vec2(1);
        rules.color = rgb(0, 0, 0)
        rules.pos = vec2(1150, 40);

        box.scale = vec2(1);
        box.pos = vec2(1145, 35);
      }
    });
  }

  rulesPopUp("Rules", vec2(200, 200), () => (
    add([
      text("  The rules of the game are fairly simple, apples will fall from the sky starting at a time of your choosing. Be careful to avoid the rotten apples because it will cause you to lose 10 points, catching the red apples will cause your score to go up 5 points. The mushroom is a powerup that lets you move your barrel faster. As the time goes on the apples will fall faster. For solo play click solo then the start button. For multiplayer click multiplayer and then join lobby. Player one has a code that they have to send to player 2 to join the game and then when player 2 clicks ready the game can then begin. Click anywhere on this text pop-up to close me.", {
        width: 400,
        size: 21,
        transform: (idx, ch) => ({
          color: rgb(255, 217, 75)
        })
      }),
      pos(1000, 100),
      "rules-section",
      area(),
    ])
  ));

  onClick("rules-section", () => { destroyAll("rules-section") });
  onUpdate(() => setCursor("default"));
});

go('intro');

rulesPopUp("Rules", vec2(200, 100), () => debug.log("hi!"));
rulesPopUp("Rules", vec2(200, 200), () => debug.log("bye"));
onUpdate(() => setCursor("default"));

///waitingLobby -------------------------------------------------------------------------------------------------------------------------------------------------

scene('waitingLobby', () => {
  let background = add([
    sprite("bluesky-startpage"),
    pos(0, 0),
    // origin("center"),
    scale(2),
    fixed()

  ]);

  if (playerIs === "playerTwo") {
    let directions = add([
      text(`Enter code to join the fun`, { size: 50 }),
      color(rgb(0, 0, 0)),
      pos(100, 160)
    ]);

    let isKeyGood = false;

    let enterKeyToJoin = document.createElement('input');
    document.body.append(enterKeyToJoin);
    enterKeyToJoin.setAttribute("type", "text");
    enterKeyToJoin.setAttribute("id", "GetGivenKey");
    enterKeyToJoin.setAttribute('placeholder', "Code Here");
    enterKeyToJoin.style.position = "absolute";
    enterKeyToJoin.style.top = `${(height() / 2) - 200}px`;
    enterKeyToJoin.style.left = `${(width() / 2) - 40}px`;

    let keySubmmitButton = document.createElement('button');
    document.body.append(keySubmmitButton);
    keySubmmitButton.innerText = 'Submit';
    keySubmmitButton.style.position = "absolute";
    keySubmmitButton.style.top = `${(height() / 2 - 160)}px`;
    keySubmmitButton.style.left = `${(width() / 2) + 20}px`;

    keySubmmitButton.addEventListener('click', () => {
      gameKeyTojoin = enterKeyToJoin.value;
      gamedata.reference = ref(db, gameKeyTojoin);

      onValue(gamedata.reference, (snap) => {
        if (snap.val()) {
          isKeyGood = true;
          playerOnesavedScore = snap.val().playerOnePoints;
          timeOfGame = snap.val().gameTimer;
          playerTwosavedScore = snap.val().playerTwoPoints;
          getPlayerTwoReady = snap.val().isPlayerTwoReady;
          getDidGameStart = snap.val().didGameStart;
        }
      });

      wait(1, () => {
        if (isKeyGood) {
          destroyAll('notAccepted');
          var readyButtonTwo = document.createElement('button');
          document.body.append(readyButtonTwo);
          readyButtonTwo.innerText = 'READY';
          readyButtonTwo.style.position = "absolute";
          readyButtonTwo.style.fontSize = '30px';
          readyButtonTwo.style.borderRadius = '50px';
          readyButtonTwo.style.backgroundColor = "red";
          readyButtonTwo.style.top = `${(height() / 2 + 2)}px`;
          readyButtonTwo.style.left = `${(width() / 2) + 20}px`;

          readyButtonTwo.addEventListener('click', () => {
            getPlayerOnesavedScore = ref(db, gameKeyTojoin, 'playerOnePoints');
            set(getPlayerOnesavedScore, {
              playerOnePoints: playerOnesavedScore,
              playerTwoPoints: playerTwosavedScore,
              isPlayerTwoReady: true,
              gameTimer: timeOfGame,
              didGameStart: getDidGameStart
            });
            readyButtonTwo.remove();
          })
        } else {
          add([
            text(`Code not accepted`, { size: 50 }),
            'notAccepted',
            pos(100, 260)
          ]);
        }
      });
    })

    directions.onUpdate(() => {
      if (getDidGameStart) {
        go('game');
        enterKeyToJoin.remove();
        keySubmmitButton.remove();
      }
    })

  } else {
    add([
      text(`Send player two the code`, { size: 50 }),
      color(rgb(0, 0, 0)),
      pos(100, 200)
    ]);

    add([
      text(`Lobby Code: ${gameKeyTojoin}`, { size: 50 }),
      color(rgb(0, 0, 0)),
      pos(100, 270)
    ]);

    add([
      pos(750, 270),
      rect(110, 45),
      outline(4),
    ])

    let copyButton = add([
      text("Copy"),
      pos(755, 275),
      color(0, 0, 0),
      area({ cursor: "pointer", }),
      scale(1),
      // pos(center())
    ]);
    copyButton.onClick(() => {
      navigator.clipboard.writeText(gameKeyTojoin)
    })

    let countOfloop = 0;
    loop(1, () => {
      if (getPlayerTwoReady && countOfloop === 0) {
        add([
          text(`PLayer Two is ready`, {
            size: 50,
            transform: (idx, ch) => ({
              color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
              pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
              scale: wave(1, 1.2, time() * 3 + idx),
              angle: wave(-9, 9, time() * 3 + idx),
            }),
          }),
          pos(100, 370)
        ]);

        add([
          sprite("start-button"),
          pos(width() / 2 + 200, (height() / 2) + 100),
          // origin("center"),
          'startTheGame',
          scale(.2),
          area(),
          fixed()
        ]);

        onClick('startTheGame', () => {
          set(getPlayerOnesavedScore, {
            playerOnePoints: playerOnesavedScore,
            playerTwoPoints: playerTwosavedScore,
            isPlayerTwoReady: true,
            didGameStart: true,
            gameTimer: timeOfGame
          })
          go('game');
        })
        countOfloop++;
      }

    })
  }
})
// go('waitingLobby');
///game -------------------------------------------------------------------------------------------------------------------------------------------------
scene("game", () => {
  let spawnSpeed = 1;
  let appleFallSpeed = 200
  let spawnRate = 1;
  let barrelSpeed = 400;
  var countDown = 0;

  let background = add([
    sprite("clearsky"),
    pos(0, 0),
    // pos(width() / 2, height() / 2),
    // origin("center"),
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
  ]);

  let barrel = add([
    sprite("barrel"),
    scale(0.2),
    'tag2',
    pos(0, 500),
    area()
  ]);

  loop(10, () => {
    add([
      sprite('speedPower'),
      pos(rand(vec2(width())).x, 10),
      `tag1`,
      area(),
      scale(.2),
      move(DOWN, 240),
    ]);
  });

  onCollide('fallingApple', 'floor', (ap) => { destroy(ap) });
  onCollide('newBadApple', 'floor', (ap,) => { destroy(ap) });
  onCollide('newBadApple', 'tag2', (ap,) => {
    score -= 10;
    destroy(ap)
    if (!isTwoPayer) {
      scoreText.text = `Score: ${score}`;
    }
  });

  onCollide('tag1', 'tag2', (ap,) => {
    barrelSpeed = 1000
    destroy(ap)
    wait(5, () => {
      barrelSpeed = 400
    });
  });

  if (!isTwoPayer) {
    var scoreText = add([
      text(`Score: ${score}`),
      pos(10, height() - 100)
    ]);
    var timer = add([
      text(`Timer:${new Date(sTimeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, letterSpacing: 3 }),
      pos(width() - 520, height() - 100)
    ]);

  } else {
    if (playerIs === 'playerOne') {
      var playerOneScoreText = add([
        text(`P1 Score: ${0}`, {
          letterSpacing: 0, letterSpacing: 3, size: 50, transform: (idx, ch) => ({
            color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
            pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
            scale: wave(1, 1.2, time() * 3 + idx),
            angle: wave(-9, 9, time() * 3 + idx),
          }),
        }),
        pos(10, height() - 100)
      ]);

      var playerTwoScoreText = add([
        text(`P2 Score: ${0}`, { letterSpacing: 0, letterSpacing: 3, size: 50 }),
        pos(width() - 600, height() - 100)
      ]);

      var timer = add([
        text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, size: 50 }),
        pos(width() / 2 - 300, height() - 100)
      ])

    } else {
      var playerOneScoreText = add([
        text(`P1 Score: ${0}`, {
          letterSpacing: 0, letterSpacing: 3, size: 50,
        }),
        pos(10, height() - 100)
      ]);

      var playerTwoScoreText = add([
        text(`P2 Score: ${0}`, {
          letterSpacing: 0, letterSpacing: 3, size: 50, transform: (idx, ch) => ({
            color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
            pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
            scale: wave(1, 1.2, time() * 3 + idx),
            angle: wave(-9, 9, time() * 3 + idx),
          }),
        }),
        pos(width() - 600, height() - 100)
      ]);

      var timer = add([
        text(`Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`, { letterSpacing: 0, size: 50 }),
        pos(width() / 2 - 300, height() - 100)
      ]);
    }
  }



  barrel.onUpdate(() => {
    if (mousePos().x > 86 && mousePos().x < width() - 86 || barrel.pos.x > 0 && barrel.pos.x < width() - 170) {
      barrel.moveTo(mousePos().x - 86, 500, barrelSpeed);
    }
    if (isTwoPayer) {
      playerOneScoreText.text = `P1 Score: ${playerOnesavedScore}`;
      playerTwoScoreText.text = `P2 Score: ${playerTwosavedScore}`;
    }
  })

  // functionality of apple
  loop(spawnSpeed, () => {
    for (let i = 0; i < spawnRate; i++) {
      add([
        sprite("apple"),
        scale(0.05),
        pos(rand(vec2(width())).x, -100),
        move(DOWN, rand(appleFallSpeed - 100, appleFallSpeed + 100)),
        area(),
        'fallingApple',
      ]);
    }
  });

  loop(2, () => {
    for (let i = 0; i < spawnRate; i++) {
      add([
        sprite("badApple"),
        scale(0.1),
        pos(rand(vec2(width())).x, -100),
        move(DOWN, rand(appleFallSpeed - 100, appleFallSpeed + 100)),
        area(),
        'newBadApple',
      ]);
    }
  });

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
  });

  // timer
  loop(1, () => {
    countDown++;
    if (countDown % 10 === 0) {
      if (spawnSpeed > 0.3) {
        spawnSpeed -= 0.2;
      } else if (spawnSpeed > 0.05) {
        spawnSpeed = spawnSpeed - 0.02;
      }
      if (appleFallSpeed < 500) {
        appleFallSpeed += 50;
      }
    }
    if (countDown % 20 === 0 && spawnRate < 10) {
      spawnRate++;
    }
  })

  wait(1, () => {
    loop(1, () => {
      if (isTwoPayer) {
        if (playerIs === 'playerOne') {
          timeOfGame--;
          timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
          set(getPlayerOnesavedScore, {
            playerOnePoints: score,
            playerTwoPoints: playerTwosavedScore,
            gameTimer: timeOfGame
          });
        } else {
          timer.text = `Timer:${new Date(timeOfGame * 1000).toISOString().substring(14, 19)}`;
          set(getPlayerOnesavedScore, {
            playerOnePoints: playerOnesavedScore,
            playerTwoPoints: score,
            gameTimer: timeOfGame
          });
        }
        if (timeOfGame <= 0) {
          go('gameOver');
        }
      } else {
        sTimeOfGame--;
        if (sTimeOfGame <= 0) {
          go('gameOver');
        }
        timer.text = `Timer:${new Date(sTimeOfGame * 1000).toISOString().substring(14, 19)}`;
      }
    })

  })
})

// gameOver +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
scene("gameOver", () => {
  let background = add([
    sprite("clearsky"),
    pos(0,),
    // origin("center"),
    scale(2),
    fixed()
  ]);

  let gameOverText = add([
    text("Game Over!"),
    scale(1.25),
    pos(500, 50),
    color(255, 217, 75),
  ]);

  if (!isTwoPayer) {
    let scoreText = add([
      text("Score:"),
      pos(660, 200),
    ]);

    let scoreVal = add([
      text(`${score}`),
      pos(690, 350),
      scale(1.26)
    ]);
  } else {
    wait(3, () => {
      if (playerOnesavedScore === playerTwosavedScore) {
        add([
          text(`It was a draw! wow`),
          pos(400, 160),
        ]);
        add([
          text(`You both get ${playerOnesavedScore} points`, { size: 40 }),
          pos(580, 240),
        ]);
      } else if (playerOnesavedScore > playerTwosavedScore) {
        if (playerIs === 'playerOne') {
          add([
            text(`Player One Won`),
            pos(470, 160),
          ]);

          add([
            text(`Player one score ${playerOnesavedScore}`, {
              size: 40,
              transform: (idx, ch) => ({
                color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
                scale: wave(1, 1.2, time() * 3 + idx),
                angle: wave(-9, 9, time() * 3 + idx),
              }),
            }),
            pos(560, 240),
          ]);

          add([
            text(`Player two score ${playerTwosavedScore}`, { size: 30 }),
            pos(610, 300),
          ]);

        } else {
          add([
            text(`Player One Won`),
            pos(470, 160),
          ]);

          add([
            text(`Player one score ${playerOnesavedScore}`, { size: 40 }),
            pos(560, 240),
          ])

          add([
            text(`Player two score ${playerTwosavedScore}`, {
              size: 30, transform: (idx, ch) => ({
                color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
                scale: wave(1, 1.2, time() * 3 + idx),
                angle: wave(-9, 9, time() * 3 + idx),
              }),
            }),
            pos(610, 300),
          ]);
        }

      } else {
        if (playerIs === 'playerOne') {
          add([
            text(`Player Two Won`),
            pos(470, 160),
          ]);
          add([
            text(`Player two score ${playerTwosavedScore}`, { size: 40 }),
            pos(560, 240),
          ]);
          add([
            text(`Player one score ${playerOnesavedScore}`, {
              size: 30, transform: (idx, ch) => ({
                color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
                scale: wave(1, 1.2, time() * 3 + idx),
                angle: wave(-9, 9, time() * 3 + idx),
              }),
            }),
            pos(610, 300),
          ]);
        } else {
          add([
            text(`Player Two Won`),
            pos(470, 160),
          ]);
          add([
            text(`Player two score ${playerTwosavedScore}`, {
              size: 40
              , transform: (idx, ch) => ({
                color: hsl2rgb((time() * 0.2 + idx * 0.2) % 1, 9, 7),
                scale: wave(1, 1.2, time() * 3 + idx),
                angle: wave(-9, 9, time() * 3 + idx),
              }),

            }),
            pos(560, 240),
          ]);

          add([
            text(`Player one score ${playerOnesavedScore}`, { size: 30 }),
            pos(610, 300),
          ]);
        }
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
    ]);
  } else if (playerIs === "playerTwo") {
    let reset = add([
      sprite("reset"),
      scale(.6),
      area(),
      pos(680, 500),
      "reset-button"
    ]);
  } else {
    loop(1, () => {
      if (getPlayerTwoReady) {
        let reset = add([
          sprite("reset"),
          scale(.6),
          area(),
          pos(680, 500),
          "reStartTheGame"
        ]);
        onClick('reStartTheGame', () => {
          playerOnesavedScore = 0;
          playerTwosavedScore = 0;
          score = 0
          set(getPlayerOnesavedScore, {
            playerOnePoints: 0,
            playerTwoPoints: 0,
            didGameStart: true,
            gameTimer: 120
          });
          go('game');
        });
      }
    });
  }

  onClick("reset-button", () => {
    if (!isTwoPayer) {
      go('game');
      sTimeOfGame = 120;
      score = 0;
    } else {
      score = 0;
      playerOnesavedScore = 0;
      playerTwosavedScore = 0;
      if (playerIs === 'playerTwo') {
        set(getPlayerOnesavedScore, {
          playerOnePoints: 0,
          playerTwoPoints: 0,
          gameTimer: 120,
          isPlayerTwoReady: true
        });
        gameOverText.onUpdate(() => {
          if (getDidGameStart) {
            go('game');
          }
        });
      }
    }
  })
});
