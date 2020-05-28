import * as THREE from "three";
import { gsap, Elastic, Power4 } from "gsap";
import { randomInRange, calcDistance } from "./utils.js";

/**
 * -- Data Structure --
 * "projects": Array, Configuration for projects
 *    "position": number, Position in layout.
 *    "url": string, Jump link.
 *    "imageUrl": string, Image src link.
 *    "themeColor": string, Color for card.
 *    "blocks": Array, Cards info.
 *       "horizontalFlip": boolean, If card is flipping horizontally.
 *       "text": string, Text displayed at the back of card. Separated with ','.
 *       "weight": string. Font weight like "normal", "border".
 */

// @private
const CONFIGURATION_ = {
  fontSize: 22, // Text at the back of cards.
  lineHeight: 40, // Text at the back of cards.
  cardName: "card",
  cardThickness: 0.03,
};

// Drawing functions for FlipCard.
class FlipCardRender {
  // @param {boolean} autoFlip If auto flipping is on for device.
  constructor(autoFlip) {
    // Card configurated.
    this.CARD_SIZE = 100;
    this.CARD_COL_NUM = 3;
    this.CARD_ROW_NUM = 2;
    this.SINGLE_PROJECT_HEIGHT = this.CARD_ROW_NUM * this.CARD_SIZE;
    this.SINGLE_PROJECT_WIDTH = this.CARD_COL_NUM * this.CARD_SIZE;
    this.isInitialized_ = false;
    this.cardLastVisited_ = null;
    this.cards_ = [];
    this.group_ = new THREE.Object3D();
    this.autoFlip_ = autoFlip;
    this.projectsHeight_ = 0;
    this.projectsWidth_ = 0;
    this.projectColNum_ = 0;
  }

  /* Check if the class is initialized.
   * @return {boolean}
   * @public
   */
  isInitialized() {
    return this.isInitialized_;
  }

  /* Check if an element is a card.
   * @return {boolean}
   * @public
   */
  isCard(element) {
    if (element.name == CONFIGURATION_.cardName) return true;
    return false;
  }

  /* Get each card's width/height size.
   * @return {number}
   * @public
   */
  getCardSize() {
    return this.CARD_SIZE;
  }

  /* Get a card's url.
   * @return {string}
   * @public
   */
  getUrl(element) {
    return element.url;
  }

  /* Get a project's width value.
   * @return {string}
   * @public
   */
  getProjectWidth() {
    return this.SINGLE_PROJECT_WIDTH;
  }

  /* Get a project's height value.
   * @return {string}
   * @public
   */
  getProjectHeight() {
    return this.SINGLE_PROJECT_HEIGHT;
  }

  /* Get all projects' height value.
   * @param {number} projecNum Number of projects.
   * @return {number}
   * @public
   */
  // getProjectsHeight(projecNum) {
  //   return Math.ceil(projecNum / this.PROJ_COL_NUM) * this.PROJECT_HEIGHT;
  // }

  // /* Get all projects' width value.
  //  * @param {number} projecNum Number of projects.
  //  * @return {number}
  //  * @public
  //  */
  // getProjectsWidth(projecNum) {
  //   return projecNum * this.CARD_COL_NUM * this.CARD_SIZE;
  // }

  getAllCards() {
    return this.cards_;
  }

  /* Restart the flipping animation.
   * @public
   */
  flip(element) {
    element.flip.restart();
  }

  /* Hold the flipping animation.
   * @public
   */
  holdFlip(element) {
    if (element.flip.progress() >= 0.5) {
      element.flip.progress(0.5);
    }
  }

  // SETUP functions

  /* Set up cards for all the projects.
   * @param {threejs}
   * @public
   */
  // setupProjectsCards(projectsConfig, isInitialzing, coverImages) {
  //   if (!this.isInitialized_) {
  //     this.initializeProjects(projectsConfig, coverImages);
  //   } else {
  //     this.resetProjects(isInitialzing);
  //   }
  // }

  /* -- Set up project cards --*/
  // Use the project theme color for text background and card's side background.
  // parent: object3D Object group.
  // projectConfig: json Project configuration file.
  initializeProjects(
    projectsConfig,
    projectsWidth,
    projectsHeight,
    projectColNum,
    cardImages
  ) {
    this.projectsWidth_ = projectsWidth;
    this.projectsHeight_ = projectsHeight;
    this.projectColNum_ = projectColNum;
    let geometry = new THREE.BoxBufferGeometry(
      this.CARD_SIZE,
      this.CARD_SIZE,
      CONFIGURATION_.cardThickness
    );
    for (var i = 0; i < projectsConfig.projects.length; i++) {
      this.setupSingleProject_(
        projectsConfig.projects[i],
        cardImages,
        geometry
      );
    }
    this.isInitialized_ = true;
  }

  /* -- Set up cards for a single project --*/
  // parent: object3D Object group.
  // projectConfig: json Single project's configuration file.
  // geometry: mesh BoxBufferGeometry.
  setupSingleProject_(projectConfig, cardImages, geometry) {
    const projectIndex = projectConfig.position;
    const material = new THREE.MeshBasicMaterial({
      color: projectConfig.themeColor,
    });

    for (let i = 0; i < 6; i++) {
      let horizontalFlip = Math.random() >= 0.5;
      let cardMaterial = [
        material, //left
        material, //right
        material, // top
        material, // bottom
        new THREE.MeshBasicMaterial({
          // front
          map: cardImages[i + projectIndex * 6],
          transparent: true,
        }),
        new THREE.MeshStandardMaterial({
          // back
          map: this.drawTextAsTexture_(
            projectConfig.blocks[i].text.split(","),
            projectConfig.themeColor,
            projectConfig.blocks[i].weight,
            horizontalFlip
          ),
        }),
      ];

      let card = new THREE.Mesh(geometry, cardMaterial);
      card.name = "card";
      card.index = i; // index is between 0 to 6
      card.projectIndex = projectIndex;
      card.rotateDirection = Math.random() < 0.5 ? -Math.PI : Math.PI;
      card.rotateAxis = horizontalFlip ? "y" : "x";
      card.url = projectConfig.url;

      this.setupCardPos_(card);
      this.addCardFlipAnimation_(card);
      this.cards_.push(card);
    }
  }

  resetProjects(projectsWidth, projectsHeight, projectColNum) {
    this.projectsWidth_ = projectsWidth;
    this.projectsHeight_ = projectsHeight;
    this.projectColNum_ = projectColNum;
    for (let i = 0; i < this.cards_.length; i++) {
      this.setupCardPos_(this.cards_[i]);
    }
  }

  setupCardPos_(card) {
    const projectIndex = card.projectIndex;
    const projectOrigin = this.calcuProjectOriginPos_(projectIndex);
    const cardIndex = card.index;

    // Calculate and set card's absolute position in canvas.
    const x =
      projectOrigin.x + (cardIndex % this.CARD_COL_NUM) * this.CARD_SIZE;
    const y =
      projectOrigin.y -
      Math.floor(cardIndex / this.CARD_COL_NUM) * this.CARD_SIZE;
    card.position.set(x, y, 0);

    // Assign card a grid position of index (x, y) in the canvas.
    // Card at the top-left corner is (0, 0), and the next card on the right is (1, 0).
    var projOriginPos = {
      x: (projectIndex % this.projectColNum_) * this.CARD_COL_NUM,
      y: Math.floor(projectIndex / this.projectColNum_) * this.CARD_ROW_NUM,
    };
    card.gridPos = {
      x: projOriginPos.x + (cardIndex % this.CARD_COL_NUM),
      y: projOriginPos.y + Math.floor(cardIndex / this.CARD_COL_NUM),
    };
  }

  calcuProjectOriginPos_(projectIndex) {
    let xOrigin =
      -this.projectsWidth_ * 0.5 +
      (projectIndex % this.projectColNum_) * this.SINGLE_PROJECT_WIDTH;
    let yOrigin =
      this.projectsHeight_ * 0.5 -
      Math.floor(projectIndex / this.projectColNum_) *
        this.SINGLE_PROJECT_HEIGHT;
    return {
      x: xOrigin + this.CARD_SIZE * 0.5,
      y: yOrigin + this.CARD_SIZE * 0.5,
    };
  }

  /* -- Draws text on a canvas --*/
  // To be used as texture on cards.
  //  textArray: string Separated with ','.
  //  color: hex number.
  //  fontWeight: string 'normal'/'bold'/'lighter'
  //  horizontalFlip: boolean If the card is flipping horizontally.
  drawTextAsTexture_(textArray, color, fontWeight, horizontalFlip) {
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    var context = canvas.getContext("2d");
    context.font =
      fontWeight + " " + CONFIGURATION_.fontSize.toString() + "pt Helvetica";
    context.textAlign = "left";
    context.fillStyle = color;

    // Rotates canvas if the card is not flipping horizontally.
    var flip = 1;
    if (!horizontalFlip) {
      context.rotate(Math.PI);
      flip = -1;
    }
    // Draw canvas background
    context.fillRect(0, 0, flip * canvas.width, flip * canvas.height);
    // Draw texts
    var x = (flip * canvas.width) / 2 - 110;
    var y = (flip * canvas.height) / 2 - 70;
    context.fillStyle = "black";
    for (var i = 0; i < textArray.length; i++) {
      context.fillText(textArray[i], x, y);
      y += CONFIGURATION_.lineHeight;
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  /* -- Adds flipping animation as GSAP timeline --*/
  //  card: object3D Project card
  addCardFlipAnimation_(card) {
    const duration = 2; // 2 seconds
    let delay = 0;
    let pause = true;
    let repeat = 0;
    if (this.autoFlip_) {
      delay = randomInRange(0, 40);
      pause = false;
      repeat = -1;
    }

    var config_flip = {
      ease: Elastic.easeOut,
      duration: duration,
      delay: delay,
    };

    var config_reverse = {
      ease: Elastic.easeOut,
      duration: duration,
    };

    config_flip[card.rotateAxis] = card.rotateDirection;
    config_reverse[card.rotateAxis] = 0;

    card.flip = gsap
      .timeline({
        paused: pause,
        repeat: repeat,
      })
      .to(card.rotation, config_flip)
      .to(card.rotation, config_reverse);
  }

  /* -- Adds fade away transition to all the cards --*/
  //  cardVisited: object3D Project card, currently clicked card.
  transitionAway(cardVisited) {
    this.cardLastVisited_ = cardVisited;
    for (let card of this.cards_) {
      let config_flip_back = {
        ease: Power4.easeOut,
        duration: 0.5,
      };
      config_flip_back[card.rotateAxis] = 0;

      let config_ripple = {
        ease: Elastic.easeOut,
        duration: 2,
        z: 100,
      };
      config_ripple["delay"] =
        0.2 * calcDistance(card.gridPos, cardVisited.gridPos);

      let config_fade = {
        ease: Power4.easeOut,
        duration: 1,
        opacity: 0,
      };
      config_fade["delay"] =
        config_ripple["delay"] + config_ripple["duration"] - 1.2;

      // Removes the flip animation completely
      card.flip.clear();
      // Flips back the cards that are turned around.
      gsap.to(card.rotation, config_flip_back);
      // Moves the cards up on z axis.
      gsap.to(card.position, config_ripple);
      // Fading animation to the front side of the cards
      gsap.to(card.material[4], config_fade);
    }
  }

  transitionBack() {
    setTimeout(this.transitionBack_.bind(this), 1000);
  }

  transitionBack_() {
    for (let card of this.cards_) {
      let config_fade = {
        ease: Power4.easeOut,
        duration: 1,
        opacity: 1,
      };
      config_fade["delay"] =
        0.2 * calcDistance(card.gridPos, this.cardLastVisited_.gridPos);

      let config_ripple = {
        ease: Elastic.easeOut,
        duration: 2,
        z: 0,
      };
      config_ripple["delay"] =
        config_fade["delay"] + config_fade["duration"] - 1.2;

      // Fading animation to the front side of the cards
      gsap.to(card.material[4], config_fade);
      // Moves the cards up on z axis.
      gsap.to(card.position, config_ripple);

      this.addCardFlipAnimation_(card);
    }
  }
}

export default FlipCardRender;
