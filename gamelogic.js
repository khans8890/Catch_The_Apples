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