import * as THREE from 'three'
import * as Hammer from 'hammerjs'
import { gsap, Elastic, Power4 } from "gsap"
import json from '../project_data.json'
import {mobileCheck, tabletCheck, randomInRange, calcDistance} from './utils.js'

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


/* - Window Configurations - */
//@private
const BREAKPOINTS_ = {
    xs: 600,
    sm: 960,
    md: 1264,
    lg: 1904,
}

//@private
const CAMERA_DISTANCE_ = {
    single: 360,
    double: 720,
    triple: 1090,
}

class FlipCard {
// **********************************************************************
// DECLARATIONS
// ----------------------------------------------------------------------

  constructor() {
    //screen ratio
    this.AUTO_FLIP = false
    this.PIXEL_RATIO = 1
    this.INTERSECTED = null
    this.CARD_SIZE = 100 // Card's width, height
    this.CARD_CREATED = false
    this.CARD_COL_NUM = 3
    this.CARD_ROW_NUM = 2
    this.OFFSET_TOP = 20 // Move the group upwards
    // Standard size for setting up positions of light and other major elements. 
    this.LIGHT_COLOR = 0xFFFFFF
    this.WALL_SIZE = (9 * this.CARD_SIZE) 
    this.BACKGROUND_COLOR = 0x000000
    this.CAMERA_Y = 0
    this.CAMERA_BOTTOM_MARGIN = 2 * this.CARD_SIZE
    this.SWIPE_SPEED = 400
    this.LOADING_PROGRESS = 0
  }

  init(container) {
    // Check based on device info
    if (mobileCheck() === true) {
      this.AUTO_FLIP = true // True only on mobile and tablet
      if (!tabletCheck()) this.PIXEL_RATIO = window.devicePixelRatio
      else this.PIXEL_RATIO = 1
    }

    this.container = container
    this.cards = []
    this.aspectRatio = this.container.clientWidth/this.container.clientHeight
    /* - ThreeJS Rendering Scene Variables - */
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
    })
    this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 0.1, 2000)
    this.scene = new THREE.Scene()
    this.group = new THREE.Object3D()
    /* - Ray Caster Configurations - */
    this.mouse = new THREE.Vector2(this.container.clientWidth, this.container.clientHeight)
    this.raycaster = new THREE.Raycaster()

    this.projectsConfig = json
    this.PROJ_NUM = this.projectsConfig.projects.length
    this.projectsHeight = 0
    this.projectsWidth = 0

    this.loadCoverImages_()
    
    this.addHammerListener()
    window.addEventListener('wheel', this.updateCamera.bind(this), false)
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    window.addEventListener('resize', this.setupResponsive.bind(this), false)
    window.addEventListener('click', this.onMouseClick.bind(this), false)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.render()
  }
  
  /* - Main Rendering Function - */
  render() {
    if (this.AUTO_FLIP === true) {
      this.renderer.render(this.scene, this.camera)
      return
    }
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera)
    // calculate objects intersecting the picking ray
    let intersects = this.raycaster.intersectObjects(this.group.children);
    if ( intersects.length > 0 ) {
      if ( this.INTERSECTED != intersects[ 0 ].object ) {
        this.INTERSECTED = intersects[ 0 ].object
        if ( this.INTERSECTED.name == 'card' ) {
          this.INTERSECTED.flip.restart()
          document.documentElement.style.cursor = 'pointer'
        }
      }
      else if ( this.INTERSECTED && this.INTERSECTED.name == 'card') {
        document.documentElement.style.cursor = 'pointer'
        if ( this.INTERSECTED.flip.progress() >= 0.5 ) {
          this.INTERSECTED.flip.progress(0.5)
        }
      }
    } else {
      document.documentElement.style.cursor = 'default'
    }
    this.renderer.render(this.scene, this.camera)
  }

  getLoadingProgress() {
    return this.LOADING_PROGRESS
  }

  /* - Load cover images for projects - */
  // It will set up all the threejs scene after loading the images.
  // Can extend to a loading bar with the link below.
  // https://threejsfundamentals.org/threejs/lessons/threejs-textures.html#easy
  loadCoverImages_() {
    let loadManager = new THREE.LoadingManager()
    let imageLoader = new THREE.TextureLoader(loadManager)
    this.LOADING_PROGRESS = 0
    this.coverImages = []

    const imageOffsets = [
        {x: 0., y: 0.5 },
        {x: 0.333, y: 0.5 },
        {x: 0.666, y: 0.5},
        {x: 0., y: 0. },
        {x: 0.333, y: 0. },
        {x: 0.666, y: 0. },
    ]

    for (let i=0; i < this.PROJ_NUM; i++) {
      for (let j=0; j<6; j++) {
        let coverImage = imageLoader.load( require('@/assets/images/'
            + this.projectsConfig.projects[i].imageUrl ))
        coverImage.repeat.set( 0.333, 0.5 )
        coverImage.offset.set( imageOffsets[j].x, imageOffsets[j].y )
        this.coverImages.push(coverImage)
      }
    }
     
    loadManager.onLoad = () => {
      this.setupResponsive(false)
      this.setupLights(this.group)
      this.group.position.y = this.PROJ_COL_NUM * this.CARD_COL_NUM * this.CARD_SIZE * 0.5 / this.aspectRatio - 135
      this.scene.add(this.group)
      this.setupRenderer(this.container)
      console.log("Loading assets done.")
    }

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
      this.LOADING_PROGRESS = itemsLoaded / itemsTotal
    };
  }

  // **********************************************************************
  // SETUP
  // ----------------------------------------------------------------------

  /* -- Set up responsive behavior -- */
  setupResponsive(resize=true) {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.aspectRatio = this.container.clientWidth / this.container.clientHeight
    let _width = this.container.clientWidth

    // Check based on screen size
    switch (true) {
      case (_width < BREAKPOINTS_.xs * this.PIXEL_RATIO):
        this.PROJ_COL_NUM = 1
        this.CAMERA_Z = CAMERA_DISTANCE_.single / this.aspectRatio
        console.log("Screen size: xs")
        break
      case (_width < BREAKPOINTS_.sm * this.PIXEL_RATIO):
        this.PROJ_COL_NUM = 2
        this.CAMERA_Z = CAMERA_DISTANCE_.double / this.aspectRatio
        console.log("Screen size: sm")
        break
      case (_width < BREAKPOINTS_.md * this.PIXEL_RATIO):
        this.PROJ_COL_NUM = 2
        this.CAMERA_Z = CAMERA_DISTANCE_.double / this.aspectRatio
        console.log("Screen size: md")
        break
      default:
        this.PROJ_COL_NUM = 3
        this.CAMERA_Z = CAMERA_DISTANCE_.triple / this.aspectRatio
        console.log("Screen size: default")
        break
    }
    
    this.projectsHeight = Math.ceil(this.PROJ_NUM / this.PROJ_COL_NUM) * this.CARD_ROW_NUM * this.CARD_SIZE
    this.projectsWidth = this.PROJ_COL_NUM * this.CARD_COL_NUM * this.CARD_SIZE

    this.CAMERA_Y = this.projectsHeight * 0.5

    console.log(this.CAMERA_Y)
    // Move the camera to the top of project cards
    this.setupCamera(0, this.CAMERA_Y, this.CAMERA_Z)
    this.camera.aspect = this.aspectRatio
    this.camera.updateProjectionMatrix()

    if (!this.CARD_CREATED)
        this.setupProjectCards(this.group, this.projectsConfig)
    else
        this.resetProjectCards(resize)
  }

  setupCamera(x, y, z) {
    this.camera.position.set(x, y, z)
  }

  /* -- Set up ThreeJS lights -- */
  // parent: object3D Object group.
  setupLights(parent) {
    let key_light, ambient_light
    key_light = new THREE.DirectionalLight(this.LIGHT_COLOR, 1.2)
    ambient_light = new THREE.AmbientLight(this.LIGHT_COLOR, 0.8)
    key_light.position.set(-this.WALL_SIZE, this.WALL_SIZE, this.WALL_SIZE)
    ambient_light.position.set(this.WALL_SIZE, this.WALL_SIZE, this.WALL_SIZE)
    parent.add(key_light).add(ambient_light)
  }

  /* -- Set up ThreeJS render -- */
  // parent: object3D Object group.
  setupRenderer(parent) {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(this.BACKGROUND_COLOR, 1.0)
    parent.appendChild(this.renderer.domElement)
  }

  /* -- Set up project cards --*/
  // Use the project theme color for text background and card's side background.
  // parent: object3D Object group.
  // projectConfig: json Project configuration file. 
  setupProjectCards(parent, projectsConfig) {
    var geometry = new THREE.BoxBufferGeometry(this.CARD_SIZE, this.CARD_SIZE, 0.03)
    for (var i=0; i < this.PROJ_NUM; i++) {
      let blankMaterial = new THREE.MeshBasicMaterial({color: projectsConfig.projects[i].themeColor})
      this.setupCardsSingleProject_(parent, projectsConfig.projects[i], blankMaterial, geometry)
    }
  }

  /* -- Set up cards for a single project --*/
  // parent: object3D Object group.
  // projectConfig: json Single project's configuration file.
  // geometry: mesh BoxBufferGeometry.
  setupCardsSingleProject_(parent, projectConfig, material, geometry) {
    const projectIndex = projectConfig.position
    const projectOrigin = this.calcuProjOriginPos_(projectIndex)
    
    for (let i = 0; i < 6; i++) {
      let horizontalFlip = Math.random() >= 0.5;
      let index = i + projectIndex*6
      let cardMaterial = [
          material, //left
          material, //right
          material, // top
          material, // bottom
          new THREE.MeshBasicMaterial({ // front
              map: this.coverImages[index],
              transparent: true
          }),
          new THREE.MeshStandardMaterial({ // back
              map: this.drawTextAsTexture_(
                  projectConfig.blocks[i].text.split(','), 
                  projectConfig.themeColor,
                  projectConfig.blocks[i].weight,
                  horizontalFlip
              )
          }),
      ]

      let card = new THREE.Mesh(geometry, cardMaterial )
      card.name = 'card'
      card.index = i // index between 0 to 6
      card.projectIndex = projectIndex
      card.rotateDir = (Math.random() < 0.5 ? -Math.PI : Math.PI)
      card.rotateAxis = horizontalFlip ? 'y' : 'x'

      this.setProjectCard_(card, projectOrigin, projectIndex, i)

      this.cards.push(card)
      parent.add(card)
    }

    this.CARD_CREATED = true
  }

  resetProjectCards(resize=false) {
    for (var i=0; i<this.cards.length; i++) {
        var card = this.cards[i]
        var projectIndex = card.projectIndex
        var projectOrigin = this.calcuProjOriginPos_(projectIndex)

        this.setProjectCard_(card, projectOrigin, projectIndex, card.index, resize)
    }
  }

  setProjectCard_(card, projectOrigin, projectIndex, cardIndex, resize) {
    var x = projectOrigin.x + (cardIndex % this.CARD_COL_NUM) * this.CARD_SIZE
    var y = projectOrigin.y - Math.floor(cardIndex / this.CARD_COL_NUM) * this.CARD_SIZE
    card.position.set(x, y, 0)
    // Gives each card a relative position of index (x, y) within the canvas, 
    // card at the top left corner is (0, 0), the card on the right is (1, 0)
    var projOriginPos = {
        x: (projectIndex % this.PROJ_COL_NUM) * this.CARD_COL_NUM,
        y: Math.floor(projectIndex / this.PROJ_COL_NUM) * this.CARD_ROW_NUM,
    }
    card.coordinatePos = {
        x: projOriginPos.x + cardIndex % this.CARD_COL_NUM,
        y: projOriginPos.y + Math.floor(cardIndex / this.CARD_COL_NUM),
    }
    if (!resize) this.addCardFlipAnimation_(card, resize)
  }

  calcuProjOriginPos_(projectIndex) {
    var projectWidth = this.CARD_COL_NUM * this.CARD_SIZE
    var projectHeight = this.CARD_ROW_NUM * this.CARD_SIZE

    var xOrigin =  - this.projectsWidth * 0.5 + 
        (projectIndex % this.PROJ_COL_NUM) * projectWidth
    var yOrigin = this.projectsHeight * 0.5 - 
        Math.floor(projectIndex / this.PROJ_COL_NUM) * projectHeight

    return {x: xOrigin + this.CARD_SIZE * 0.5, y: yOrigin + this.CARD_SIZE * 0.5}
  }

  /* -- Draws text on a canvas --*/
  // To be used as texture on cards.
  //  textArray: string Separated with ','.
  //  color: hex number.
  //  fontWeight: string 'normal'/'bold'/'lighter'
  //  horizontalFlip: boolean If the card is flipping horizontally. 
  drawTextAsTexture_(textArray, color, fontWeight, horizontalFlip) {
    var canvas = document.createElement("canvas")
    const canvasSize = 256
    canvas.width = canvasSize
    canvas.height = canvasSize

    var context = canvas.getContext("2d");
    context.font = fontWeight + " 26pt Helvetica"
    context.textAlign = "left"
    context.fillStyle = color

    // Rotates canvas if the card is not flipping horizontally.
    var flip = 1
    if (!horizontalFlip) {
      context.rotate(Math.PI)
      flip = -1
    }
    // Draw canvas background
    context.fillRect(0,0,flip * canvas.width,flip * canvas.height)
    // Draw texts
    var x = flip * canvas.width / 2 - 110
    var y = flip * canvas.height / 2 - 70
    context.fillStyle = "black";
    for (var i=0; i<textArray.length; i++) {
      context.fillText(textArray[i], x, y)
      y += 50
    }

    var texture = new THREE.Texture( canvas )
    texture.needsUpdate = true

    return texture
  }

  /* -- Adds flipping animation as GSAP timeline --*/
  //  card: object3D Project card
  addCardFlipAnimation_(card) {
    const duration = 2 // 2 seconds
    var delay = 0
    var pause = true
    var repeat = 0
    if (this.AUTO_FLIP) {
      delay = randomInRange(0, 40)
      pause = false
      repeat = -1
    }
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
        repeat: repeat,
    }).to(
        card.rotation,
        config_flip,
    ).to(
        card.rotation,
        config_reverse,
    )
  }

  /* -- Adds fade away transition to all the cards --*/
//  cardVisited: object3D Project card, currently clicked card.
 addCardTransition_(cardVisited) {
    for (let i=0; i<this.cards.length; i++) {
        let card = this.cards[i]
        let config_ripple = {
            ease : Elastic.easeOut,
            duration: 2,
            z: 100,
        }
        config_ripple['delay'] =
            0.2 * calcDistance(card.coordinatePos, cardVisited.coordinatePos)
        var config_flip = {
            ease : Power4.easeOut,
            duration: 0.5,
        }
        config_flip[card.rotateAxis] = 0
        var config_fade = {
            ease : Power4.easeOut,
            duration: 1,
            opacity: 0.,
        }
        config_fade['delay'] = config_ripple['delay'] + config_ripple['duration'] - 1.2

        // Moves the cards up on z axis.
        gsap.to(
            card.position,
            config_ripple,
        )
        // Removes the flip animation completely
        card.flip.clear()
        // Flips back the cards that are turned around.
        gsap.to(
            card.rotation,
            config_flip,
        )
        // Fading animation to the front side of the cards
        gsap.to(
            card.material[4],
            config_fade,
        )
    }
}

  // **********************************************************************
  // LISTENER
  // ----------------------------------------------------------------------
  /* - Camera scrolling - */
  /* - Camera scrolling - */
  updateCamera(event) {
    let currentPosY = this.camera.position.y
    //if (Math.abs(currentPosY) < Math.abs(this.CAMERA_Y))
    let changedPosY = this.camera.position.y - event.deltaY
    if (changedPosY >= this.CAMERA_Y)
      this.camera.position.y = this.CAMERA_Y
    else if (changedPosY <= - this.CAMERA_Y + this.CAMERA_BOTTOM_MARGIN)
      this.camera.position.y = - this.CAMERA_Y + this.CAMERA_BOTTOM_MARGIN
    else
      this.camera.position.y = changedPosY
  }

  /* - Hammer Event, for mobile devices only. - */
  addHammerListener() {
    this.hammerSwipe = null;
    this.hammertime = new Hammer(this.container, {
      inputClass: Hammer.TouchInput
    });
    this.hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    this.hammertime.on('swipeup', this.swipDeviceUp.bind(this))
    this.hammertime.on('swipedown', this.swipDeviceDown.bind(this))
  }

  swipDeviceUp() {
    let changedPosY = this.camera.position.y - this.SWIPE_SPEED
    if (changedPosY <= -this.CAMERA_Y + this.CAMERA_BOTTOM_MARGIN)
      changedPosY = -this.CAMERA_Y + this.CAMERA_BOTTOM_MARGIN
    this.hammerSwipe = gsap.to(this.camera.position, {duration: 0.5, ease: "power1.out", y: changedPosY});
  }

  swipDeviceDown() {
    let changedPosY = this.camera.position.y + this.SWIPE_SPEED
    if (changedPosY >= this.CAMERA_Y)
      changedPosY = this.CAMERA_Y
    this.hammerSwipe = gsap.to(this.camera.position, {duration: 0.5, ease: "power1.out", y: changedPosY});
  }

  /* - Raycaster mouse update - */
  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    event.preventDefault()
    this.mouse.x = ( event.offsetX / this.container.clientWidth ) * 2 - 1
    this.mouse.y = - ( event.offsetY / this.container.clientHeight ) * 2 + 1
  }

  /* - Camera scrolling - */
  onMouseClick(event) {
    event.preventDefault()
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera)
    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.group.children);
    if ( intersects.length > 0 && intersects[ 0 ].object.name == 'card' ) {
      this.addCardTransition_(intersects[ 0 ].object)
    }
  }
}

export default FlipCard;
