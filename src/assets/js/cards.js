import * as THREE from 'three'
import { gsap, Elastic } from "gsap"
import json from '../project_data.json'

// Thread Data Structure

// knots: Array, Each group is a key
//        Stores all the knot objects' information.
// - groupId: Object, group info
//   items: Array
//       id: String, name
//       posL: Object {x: Int, y: Int}
//       posR: Object {x: Int, y: Int}
// - ...

// knotLines: Object, Each group is a key
//            Lines connecting knot objects.
// - group-name-1: Object, group info
//     items: Array
//       id: String, id of object at the line end
//       line: SVG.line
// - ...

// passed in container id within which this animation will be shown
export function createHomePageCards(container) {
  var ctx = new Object()

  ctx.AUTO_FLIP = false
  ctx.INTERSECTED = null
  ctx.CARD_SIZE = 100 // Card's width, height
  ctx.CARD_CREATED = false
  ctx.CARD_COL_NUM = 3
  ctx.CARD_ROW_NUM = 2
  ctx.OFFSET_TOP = 20 // Move the group upwards
  ctx.SCROLL_SPEED = 10.0 // Mouse scrolling spped
  ctx.WALL_SIZE = (9 * ctx.CARD_SIZE) // Standard size for setting up positions of light and other major elements. 
  ctx.LIGHT_COLOR = 0xFFFFFF
  ctx.BACKGROUND_COLOR = 0x000000

  ctx.init = function init() {
      ctx.container = container
      ctx.cards = []

      ctx.aspectRatio = ctx.container.clientWidth/ctx.container.clientHeight
      ctx.renderer = new THREE.WebGLRenderer({
          antialias: true,
      })
      ctx.camera = new THREE.PerspectiveCamera(45, ctx.aspectRatio, 0.1, 2000)
      ctx.scene = new THREE.Scene()
      ctx.group = new THREE.Object3D()
      ctx.mouse = new THREE.Vector2()
      ctx.raycaster = new THREE.Raycaster()

      ctx.projectsConfig = json
      ctx.PROJ_NUM = ctx.projectsConfig.projects.length
      ctx.loadCoverImages()
      window.addEventListener('mousemove', ctx.onMouseMove, false )
  },

  ctx.animate = function animate() {
      requestAnimationFrame(animate)
      ctx.render()
  },

  ctx.render = function render() {
    // update the picking ray with the camera and mouse position
    ctx.raycaster.setFromCamera( ctx.mouse, ctx.camera )
    // calculate objects intersecting the picking ray
    var intersects = ctx.raycaster.intersectObjects( ctx.group.children );
    if ( intersects.length > 0 ) {
        if ( ctx.INTERSECTED != intersects[ 0 ].object ) {
            ctx.INTERSECTED = intersects[ 0 ].object
            if ( ctx.INTERSECTED.name == 'card' ) {
                ctx.INTERSECTED.flip.restart()
                document.documentElement.style.cursor = 'pointer';
            }
        }
        else if ( ctx.INTERSECTED && ctx.INTERSECTED.name == 'card') {
            document.documentElement.style.cursor = 'pointer';
            if ( ctx.INTERSECTED.flip.progress() >= 0.5 ) {
                ctx.INTERSECTED.flip.progress(0.5)
            }
        }
    } else {
        document.documentElement.style.cursor = 'default';
    }
    ctx.renderer.render(ctx.scene, ctx.camera)
  },

  ctx.loadCoverImages = function loadCoverImages() {
    
    var loadManager = new THREE.LoadingManager();
    var imageLoader = new THREE.TextureLoader(loadManager)
    ctx.coverImages = []

    const imageOffsets = [
        {x: 0., y: 0.5 },
        {x: 0.333, y: 0.5 },
        {x: 0.666, y: 0.5},
        {x: 0., y: 0. },
        {x: 0.333, y: 0. },
        {x: 0.666, y: 0. },
    ]

    for (var i=0; i < ctx.PROJ_NUM; i++) {
        for (var j=0; j<6; j++) {
            var coverImage = imageLoader.load( require('@/assets/images/' + ctx.projectsConfig.projects[i].imageUrl ));
            console.log ('@/img/' + ctx.projectsConfig.projects[i].imageUrl)
            coverImage.repeat.set( 0.333, 0.5 );
            coverImage.offset.set( imageOffsets[j].x, imageOffsets[j].y );
            ctx.coverImages.push(coverImage)
        }
    }
     
    loadManager.onLoad = () => {
        ctx.setupResponsive()
        ctx.setupLights(ctx.group)
        ctx.group.position.y = 0
        ctx.scene.add(ctx.group)
        ctx.setupRenderer(ctx.container)
        console.log("done")
    }
  },

  ctx.setupResponsive = function setupResponsive(resize=false) {
    ctx.renderer.setSize(ctx.container.clientWidth, ctx.container.clientHeight)
    ctx.aspectRatio = ctx.container.clientWidth / ctx.container.clientHeight
    var _width = ctx.container.clientWidth
    ctx.PROJ_COL_NUM = 3
    ctx.CAMERA_Z = 1090 / ctx.aspectRatio
    // Move the camera to the top of project cards
    var CAMERA_Y = Math.floor(ctx.PROJ_NUM / ctx.PROJ_COL_NUM / 2) * ctx.CARD_ROW_NUM * ctx.CARD_SIZE
    ctx.setupCamera(0, CAMERA_Y, ctx.CAMERA_Z)
    ctx.camera.aspect = ctx.aspectRatio
    ctx.camera.updateProjectionMatrix()

    if (!ctx.CARD_CREATED)
        ctx.setupProjectCards(ctx.group, ctx.projectsConfig)
    else
        ctx.resetProjectCards(resize)
  },

  ctx.setupCamera = function setupCamera(x, y, z) {
      ctx.camera.position.set(x, y, z)
  },

  /* -- Set up ThreeJS lights -- */
  //  parent: object3D Object group.
  ctx.setupLights = function setupLights(parent) {
    var key_light, ambient_light
    key_light = new THREE.DirectionalLight(ctx.LIGHT_COLOR, 1.2)
    ambient_light = new THREE.AmbientLight(ctx.LIGHT_COLOR, 0.8)
    key_light.position.set(-ctx.WALL_SIZE, ctx.WALL_SIZE, ctx.WALL_SIZE)
    ambient_light.position.set(ctx.WALL_SIZE, ctx.WALL_SIZE, ctx.WALL_SIZE)
    parent.add(key_light).add(ambient_light)
  },

  /* -- Set up ThreeJS render -- */
  //  parent: object3D Object group.
  ctx.setupRenderer = function setupRenderer(parent) {
    ctx.renderer.setPixelRatio(window.devicePixelRatio)
    ctx.renderer.setClearColor(ctx.BACKGROUND_COLOR, 1.0)
    parent.appendChild(ctx.renderer.domElement)
  },

  /* -- Set up project cards --*/
  //  parent: object3D Object group.
  //  projectConfig: json Project configuration file. 
  ctx.setupProjectCards = function setupProjectCards(parent, projectsConfig) {
    var geometry = new THREE.BoxBufferGeometry(ctx.CARD_SIZE, ctx.CARD_SIZE, 0.03)
    const blankMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
    for (var i=0; i < ctx.PROJ_NUM; i++) {
        ctx._setupCardsSingleProject(parent, projectsConfig.projects[i], blankMaterial, geometry)
    }
  },
  /* -- Set up cards for a single project --*/
  //  parent: object3D Object group.
  //  projectConfig: json Single project's configuration file.
  //  geometry: mesh BoxBufferGeometry.
  ctx._setupCardsSingleProject = function _setupCardsSingleProject(parent, projectConfig, material, geometry) {
    var projectIndex = projectConfig.position
    var projectOrigin = ctx._calcuProjOriginPos(projectIndex)
    
    for (var i = 0; i < 6; i++) {
        var horizontalFlip = Math.random() >= 0.5;
        var index = i + projectIndex*6
        var cardMaterial = [
            material, //left
            material, //right
            material, // top
            material, // bottom
            new THREE.MeshBasicMaterial({ // front
                map: ctx.coverImages[index],
                transparent: true
            }),
            new THREE.MeshStandardMaterial({ // back
                map: ctx._drawTextAsTexture(
                    projectConfig.blocks[i].text.split(','), 
                    projectConfig.themeColor,
                    projectConfig.blocks[i].weight,
                    horizontalFlip
                )
            })
        ]

        var card = new THREE.Mesh(geometry, cardMaterial )
        card.name = 'card'
        card.index = i // index between 0 to 6
        card.projectIndex = projectIndex
        card.rotateDir = (Math.random() < 0.5 ? -Math.PI : Math.PI)
        card.rotateAxis = horizontalFlip ? 'y' : 'x'

        ctx._setProjectCard(card, projectOrigin, projectIndex, i)

        ctx.cards.push(card)
        parent.add(card)
    }

    ctx.CARD_CREATED = true
  },

  ctx.resetProjectCards = function resetProjectCards(resize=false) {
    for (var i=0; i<ctx.cards.length; i++) {
        var card = ctx.cards[i]
        var projectIndex = card.projectIndex
        var projectOrigin = ctx._calcuProjOriginPos(projectIndex)

        ctx._setProjectCard(card, projectOrigin, projectIndex, card.index, resize)
    }
  },

  ctx._setProjectCard = function _setProjectCard(card, projectOrigin, projectIndex, cardIndex, resize) {
    var x = projectOrigin.x + (cardIndex % ctx.CARD_COL_NUM) * ctx.CARD_SIZE
    var y = projectOrigin.y - Math.floor(cardIndex / ctx.CARD_COL_NUM) * ctx.CARD_SIZE
    card.position.set(x, y, 0)
    // Gives each card a relative position of index (x, y) within the canvas, 
    // card at the top left corner is (0, 0), the card on the right is (1, 0)
    var projOriginPos = {
        x: (projectIndex % ctx.PROJ_COL_NUM) * ctx.CARD_COL_NUM,
        y: Math.floor(projectIndex / ctx.PROJ_COL_NUM) * ctx.CARD_ROW_NUM
    }
    card.coordinatePos = {
        x: projOriginPos.x + cardIndex % ctx.CARD_COL_NUM,
        y: projOriginPos.y + Math.floor(cardIndex / ctx.CARD_COL_NUM)
    }
    if (!resize) ctx._addCardFlipAnimation(card, resize)
  },

  ctx._calcuProjOriginPos = function _calcuProjOriginPos(projectIndex) {
    var projectWidth = ctx.CARD_COL_NUM * ctx.CARD_SIZE
    var projectHeight = ctx.CARD_ROW_NUM * ctx.CARD_SIZE
    var overallWidth = ctx.PROJ_COL_NUM * projectWidth
    var overallHeight = Math.floor(ctx.PROJ_NUM/ctx.PROJ_COL_NUM) * projectHeight

    var xOrigin =  - overallWidth / 2 + (projectIndex % ctx.PROJ_COL_NUM) * projectWidth
    var yOrigin = overallHeight * 0.5 - Math.floor(projectIndex / ctx.PROJ_COL_NUM) * projectHeight

    return {x: xOrigin + ctx.CARD_SIZE * 0.5, y: yOrigin + ctx.CARD_SIZE * 0.5}
  },

  /* -- Draws text on a canvas --*/
  // To be used as texture on cards.
  //  textArray: string Separated with ','.
  //  color: hex number.
  //  fontWeight: string 'normal'/'bold'/'lighter'
  //  horizontalFlip: boolean If the card is flipping horizontally. 
  ctx._drawTextAsTexture = function _drawTextAsTexture(textArray, color, fontWeight, horizontalFlip) {
    var canvas = document.createElement("canvas")
    const canvasSize = 256
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    var context = canvas.getContext("2d");
    context.font = fontWeight + " 26pt Helvetica"
    context.textAlign = "left";
    context.fillStyle = color;

    // Rotates canvas if the card is not flipping horizontally.
    var flip = 1;
    if (!horizontalFlip) {
        context.rotate(Math.PI);
        flip = -1;
    }
    // Draw canvas background
    context.fillRect(0,0,flip * canvas.width,flip * canvas.height);
    // Draw texts
    var x = flip * canvas.width / 2 - 110;
    var y = flip * canvas.height / 2 - 70;
    context.fillStyle = "black";
    for (var i=0; i<textArray.length; i++) {
        context.fillText(textArray[i], x, y);
        y += 50;
    }

    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;

    return texture
  },

  /* -- Adds flipping animation as GSAP timeline --*/
  //  card: object3D Project card
  ctx._addCardFlipAnimation = function _addCardFlipAnimation(card) {
    const duration = 2 // 2 seconds
    var delay = 0
    var pause = true
    var repeat = 0
    var config_flip = {
        ease : Elastic.easeOut,
        duration: duration,
        delay: delay,
    }
    var config_reverse = {
        ease : Elastic.easeOut,
        duration: duration,
    }

    config_flip[card.rotateAxis] = card.rotateDir
    config_reverse[card.rotateAxis] = 0

    card.flip = gsap.timeline({
        paused: pause,
        repeat: repeat
    }).to(
        card.rotation,
        config_flip
    ).to(
        card.rotation,
        config_reverse
    )
  },

  ctx.onMouseMove = function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    event.preventDefault()
    ctx.mouse.x = ( event.clientX / ctx.container.clientWidth ) * 2 - 1
    ctx.mouse.y = - ( event.clientY / ctx.container.clientHeight ) * 2 + 1
  }

  return ctx;
}

