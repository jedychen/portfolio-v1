<template>
  <div
    class="cover-card-container draggable"
    ref="interactElement"
  >
    <v-card
      class="cover-card"
      transition="scale-transition"
    >
      <v-img
        height="200px"
        width="300px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        alt="Cover Image"
      >
      </v-img>
    </v-card>
    <div class="stitching-top"></div>
  </div>

  <!-- About -->
  <!-- <v-card
    class="cover-card"
    height="200px"
    width="300px"
    transition="scale-transition"
  >
    <v-card-text>
      <div>Hello / 你好 / 初めまして</div>
      <p class="display-1 text--primary">
        I am Jedy
      </p>
      <p>A creative technologist espcialized in creating —</p>
      <div class="text--primary">
        Generative Design / Interactive Installations / Data Visualization / Hardware & Software Prototyping / Computer Vision & Graphics / Frontend & Backend Development.
      </div>
    </v-card-text>
  </v-card> -->
</template>

<script>
import Interact from 'interactjs'
import Bounce from 'bounce.js'
import { cross } from 'mathjs'

export default {
  name: 'MainCard',

  data() {
    return {
      isInteractAnimating: true,
      interactPosition: {
        x: 0,
        y: 0,
        rotation: 0
      },
    }
  },

  mounted() {
    const element = this.$refs.interactElement;
    Interact(element).draggable({ 
      autoScroll: true,
      listeners: {
        start: event => {
          this.isInteractAnimating = false;
          // clear the animation from bounce.js
          event.target.style.animation = 'none' 
        },
        move: this.dragMoveListener,
        end: event => {
          var target = event.target
          target.style.transform = 'none'
          const transformedX = this.interactPosition.x
          const transformedY = this.interactPosition.y
          let move = new Bounce();
          move
            .translate({
              from: {x: transformedX, y: transformedY},
              to: {x: 0, y: 0},
              duration: 1000,
            })
          move.applyTo(event.target, {remove: true})
          this.interactPosition.x = 0;
          this.interactPosition.y = 0;
        },
      },
    });
  },

  methods: {
    dragMoveListener (event) {
      let target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = this.interactPosition.x + event.dx;
      const y = this.interactPosition.y + event.dy;
      // add rotation based on dragging force
      var rotationComputed = 0;
      let id = document.querySelector('.info');
      id.innerHTML = 'transform: ' + x + ', ' + y + '<br>' + target.style.transform;
      // update the posiion attributes
      this.interactPosition.x = x;
      this.interactPosition.y = y;
      const elementRect = target.getBoundingClientRect();
      const elementCenter = {
        x: elementRect.left + elementRect.width * 0.5,
        y: elementRect.top,
      };
      target.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotationComputed + 'deg)';
      this.$store.commit("updateThread", elementCenter);
    },
  },

  computed: {
    transformString() {
      const { x, y, rotation } = this.interactPosition;
      return 'translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)';
    }
  },


  beforeDestroy() {
    Interact(this.$refs.interactElement).unset();
  },
};
</script>
