<template>
  <div
    ref="interactElement"
    class="cover-card-container draggable"
    :style="{ transform: transformString }"
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
    <div
      ref="stitchingElement"
      class="thread__stitching-top"
    ></div>
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

<style lang="scss" scoped>
  .thread__stitching-top {
    background: #999;
    box-shadow: 0px 1px 3px #888;
    height: 2px;
    left: calc(50% - 5px);
    position: absolute;
    top: 10px;
    width: 10px;
  }
</style>

<script>
import Interact from 'interactjs'
import Bounce from 'bounce.js'
import { cross } from 'mathjs'

export default {
  name: 'CoverCard',

  data() {
    return {
      isInteractAnimating: true,
      isInteractClearing: false,
      interactPosition: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      threadUpdateIntervalFunc: null,
      bounceBackDuration: 1000,
    }
  },

  mounted() {
    const element = this.$refs.interactElement;
    Interact(element).draggable({ 
      autoScroll: true,
      listeners: {
        start: event => {
          this.isInteractAnimating = false;
          // Clear the animation from bounce.js.
          event.target.style.animation = 'none'; 
        },
        move: this.dragMoveListener,
        end: this.dragEndHandler,
      },
    });
  },

  computed: {
    transformString() {
      if (!this.isInteractClearing) {
        const { x, y, rotation } = this.interactPosition;
        return 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotation + 'deg)';
      }
      return null;
    },
  },

  watch: {
    content() {
      this.$nextTick(()=>{
        this.$store.commit("updateThread", this.stitchingPosition());
      })
    }
  },

  methods: {
    stitchingPosition() {
      const element = this.$refs.stitchingElement;
      const elementRect = element.getBoundingClientRect();
      const elementCenter = {
        x: elementRect.left,
        y: elementRect.top,
      };
      return elementCenter;
    },

    dragMoveListener (event) {
      this.isInteractClearing = false;
      let target = event.target;
      // Keep the dragged position in the data-x/data-y attributes.
      const x = this.interactPosition.x + event.dx;
      const y = this.interactPosition.y + event.dy;
      // Add rotation based on dragging force.
      var rotationComputed = 0;
      let id = document.querySelector('.info');
      id.innerHTML = 'transform: ' + x + ', ' + y + '<br>' + target.style.transform;
      // Update the posiion attributes.
      this.interactPosition.x = x;
      this.interactPosition.y = y;
      this.threadsUpdate();
    },

    dragEndHandler (event) {
      this.isInteractClearing = true
      const transformedX = this.interactPosition.x
      const transformedY = this.interactPosition.y
      this.interactPosition.x = 0;
      this.interactPosition.y = 0;

      let move = new Bounce();
      move
        .translate({
          from: {x: transformedX, y: transformedY},
          to: {x: 0, y: 0},
          duration: this.bounceBackDuration,
        })
      move.applyTo(event.target, {remove: true});
      this.threadUpdateIntervalFunc = setInterval(this.threadsUpdate, 10);
      setTimeout(this.clearThreadInterval, this.bounceBackDuration);
    },

    threadsUpdate() {
      this.$store.commit("updateThread", this.stitchingPosition());
    },

    clearThreadInterval() {
      clearInterval(this.threadUpdateIntervalFunc);
    }
  },

  beforeDestroy() {
    Interact(this.$refs.interactElement).unset();
  },
};
</script>
