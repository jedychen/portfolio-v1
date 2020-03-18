import Bounce from 'bounce.js'


export function enterAnimation() {
  let bounce = new Bounce()
  bounce
    .rotate({
      from: 0,
      to: -45,
      duration: 3000,
      bounces: 10,
      easing: "sway",
    })
  let move = new Bounce();
  move
    .translate({
      from: { x: 500, y: 0 },
      to: { x: 0, y: 0 },
      duration: 2000,
    })
  // bounce.define("my-animation");
  bounce.applyTo(document.querySelectorAll(".cover-card-container"), {remove: true})
  move.applyTo(document.querySelectorAll(".cover-card-list"), {remove: true})
}
