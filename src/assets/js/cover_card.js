import Bounce from 'bounce.js';
import Draggabilly from 'draggabilly'
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
  bounce.applyTo(document.querySelectorAll(".main-card-container__bounce"))
  move.applyTo(document.querySelectorAll(".main-card-list"))
}

export function dragCards() {
  // get all draggie elements
  let draggableElems = document.querySelectorAll('.draggable');
  // array of Draggabillies
  let draggies = []
  // init Draggabillies
  for (var draggableElem of draggableElems) {
    var draggie = new Draggabilly( draggableElem, {
      // options...
    })
    draggie.origin = {x:0, y:0}
    draggie.rotation = 0
    draggie.id = draggableElem.id
    draggie.on( 'dragStart', function() {
      const element = document.querySelector('#'+ this.id).getBoundingClientRect()
      this.origin.x = element.left
      this.origin.y = element.top
    })
    draggie.on( 'dragMove', function(event, pointer, moveVector) {
      let element = document.querySelector('#'+ this.id)
      const elementRect = element.getBoundingClientRect()
      let id = document.querySelector('#info');
      const elementCenter = {
        x: elementRect.left + elementRect.width * 0.5,
        y: elementRect.top + elementRect.height * 0.5,
      }
      const pointerToCenter = [
        pointer.pageX - elementCenter.x,
        pointer.pageY - elementCenter.y,
        0,
      ]
      const moveDirection = [moveVector.x, moveVector.y, 0]
      //sign of z in the cross product of two vecoters
      // indicates if rotation is clockwise
      var rotation = cross(pointerToCenter, moveDirection)
      var rotationComputed = rotation[2]/1000
      id.innerHTML = 'Rotation: ' + rotationComputed + '<br>Name: ' + element.id
      let elementNew = document.querySelector('#main-card-work')
      this.rotation = rotationComputed
      elementNew.style.transform = 'rotate(90deg)';
      // elementNew.style = '{ transform: translate3D(10px, 5px, 0) rotate(20deg) }'
    })
    draggies.push( draggie )
  }

  return draggies
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
