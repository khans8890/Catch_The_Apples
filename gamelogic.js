// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
loadSprite("background", "testingbackground.gif")
loadSprite("barrel", "testingBarrel.png")

background= add([
  sprite('background'),
  pos(width() / 2, height() / 2),
  origin("center"),
  // Allow the background to be scaled
  scale(.6),
  area(),
  'tag1',
  // Keep the background position fixed even when the camera moves
  fixed()

])

// add something to screen
barrel = add([
  sprite("barrel"),
  scale(0.2),
  'tag2',
  pos(0, 500),
  area()
])
onCollide('tag1', 'tag2', () => { console.log('help')})
barrel.onUpdate(() => {
  
  if (mousePos().x > 86 && mousePos().x < width() - 86 || barrel.pos.x > 0 && barrel.pos.x < width() - 172) {
    barrel.moveTo(mousePos().x - 86, 500, 400)
  }
})