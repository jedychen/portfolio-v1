import Bounce from 'bounce.js'
import Interact from 'interactjs'
import { cross } from 'mathjs'


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
  bounce.applyTo(document.querySelectorAll(".main-card-container"), {remove: true})
  move.applyTo(document.querySelectorAll(".main-card-list"), {remove: true})
}

export function dragCards() {
    let draggie = Interact('.draggable')
    draggie.transform = { x: 0, y: 0, rotation: 0}
    draggie.originPos = { x: 0, y: 0}
    draggie
    .draggable({ 
      autoScroll: true,
      listeners: {
        start (event) {
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
        }
      }
    })

  return draggie
}

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  // add rotation based on dragging force
  const elementRect = target.getBoundingClientRect()
  const elementCenter = {
    x: elementRect.left + elementRect.width * 0.5,
    y: elementRect.top,
  }
  const pointerToCenter = [
    event.x0 - elementCenter.x,
    event.y0 - elementCenter.y,
    0,
  ]
  const moveDirection = [event.dx, event.dy, 0]
  //sign of z in the cross product of two vecoters
  // indicates if rotation is clockwise
  var rotation = cross(pointerToCenter, moveDirection)
  var rotationComputed = rotation[2]/100
  let id = document.querySelector('#info');
  id.innerHTML = 'PageCenter: ' + elementCenter.x + ', ' + elementCenter.y + '<br>InitMousePos: ' + event.x0 + ', ' + event.y0 + '<br>Rotation: ' + rotationComputed
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotationComputed + 'deg)'
  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// export function Line(obj){
//     var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//     for(var prop in obj) {
//         line.setAttribute(prop, obj[prop])  
//     }
//     return line;
// }

// export function SvgContainer(obj) {
//     var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     for(var prop in obj) {
//         svg.setAttribute(prop, obj[prop])  
//     }
//     return svg;
// }

// export function drawBetweenObjects () {
  // var elem = document.getElementById("mySVG");
  // elem.attr('x1',100).attr('y1',100).attr('x2',300).attr('y2',400);
  // var svgParent = new SvgContainer({
  //   'width': 200,
  //   'height': 200
  // });

  // var lineOne = new Line({
  //     'width': 0,
  //     'height': 0,
  //     'x1': 0
  //         // etc
  // });

  // var ctn = document.getElementById('container');
  // svgParent.appendChild(lineOne);
  // ctn.appendChild(svgParent);
// }

// export function addThreads() {
//   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.setAttribute("width", "640");
//   var elemList = document.getElementsByClassName("my-top-line");
//   elemList.forEach().outerHTML += '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;z-index:10;margin:0;padding:0;top:0em;left:0.5em" onclick="go()" width="100" height="100"><circle cx="40" cy="40" r="40" stroke="red" stroke-width="4" fill="blue" /></svg>';
// }

// export function move() {
//     var elemList = document.getElementsByClassName("my-card"),
//         speed = 1,
//         currentPos = 0;
//     // Reset the element
//     var elem = elemList[0];
//     // elem.innerHTML = "New text!";
//     elem.style.left = 0+"px";
//     elem.style.right = "auto";
//     var motionInterval = setInterval(function() {
//         currentPos += speed;
//         if (currentPos >= 800 && speed > 0) {
//            currentPos = 800;
//            speed = -2 * speed;
//            elem.style.width = parseInt(elem.style.width)*2+"px";
//            elem.style.height = parseInt(elem.style.height)*2+"px";
//         }
//         if (currentPos <= 0 && speed < 0) {
//            clearInterval(motionInterval);
//         }
//         elem.style.left = currentPos+"px";
//     },20);
// }
