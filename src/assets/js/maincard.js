import { cross } from 'mathjs'
import Bounce from 'bounce.js'
import Interact from 'interactjs'


export function dragCards() {
    let draggie = Interact('.draggable');
    draggie
    .draggable({ 
      autoScroll: true,
      listeners: {
        start (event) {
          // clear the animation from bounce.js
          event.target.style.animation = 'none' 
        },
        move: dragMoveListener,
        end (event) {
          var target = event.target
          target.style.transform = 'none'
          const transformedX = (parseFloat(target.getAttribute('data-x')) || 0)
          const transformedY = (parseFloat(target.getAttribute('data-y')) || 0)
          let move = new Bounce();
          move
            .translate({
              from: {x: transformedX, y: transformedY},
              to: {x: 0, y: 0},
              duration: 1000,
            })
          move.applyTo(event.target, {remove: true})
          target.setAttribute('data-x', 0)
          target.setAttribute('data-y', 0)
        },
      },
    });

  return draggie;
}

function dragMoveListener (event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  // add rotation based on dragging force
  const elementRect = target.getBoundingClientRect();
  const elementCenter = {
    x: elementRect.left + elementRect.width * 0.5,
    y: elementRect.top,
  };
  const pointerToCenter = [
    event.x0 - elementCenter.x,
    event.y0 - elementCenter.y,
    0,
  ];
  const moveDirection = [event.dx, event.dy, 0];
  //sign of z in the cross product of two vecoters
  // indicates if rotation is clockwise
  var rotation = cross(pointerToCenter, moveDirection);
  var rotationComputed = rotation[2]/100;
  let id = document.querySelector('.info');
  id.innerHTML = 'transform: ' + x + ', ' + y + '<br>' + target.style.transform;
  // id.innerHTML = 'PageCenter: ' + elementCenter.x + ', ' + elementCenter.y + '<br>InitMousePos: ' + event.x0 + ', ' + event.y0 + '<br>Rotation: ' + rotationComputed
  
  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotationComputed + 'deg)';
}
