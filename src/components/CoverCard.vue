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
      ref="knotElement"
      v-bind:id="threadId"
      class="thread__knot-top"
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

<style scoped src="@/assets/css/thread.css">
</style>

<script>
import Interact from 'interactjs'
import Bounce from 'bounce.js'
import { cross } from 'mathjs'

export default {
  name: 'CoverCard',
  props: {
    id: String
  },

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
      threadId: this.id,
      groupName: "coverCards",
    }
  },

  mounted() {
    const element = this.$refs.interactElement;
    // this.updateThread();
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

  methods: {
    // getKnotRect() {
    //   const element = this.$refs.knotElement;
    //   const elementRect = element.getBoundingClientRect();
    //   return elementRect;
    // },

    dragMoveListener (event) {
      this.isInteractClearing = false;
      let target = event.target;
      // Keep the dragged position in the data-x/data-y attributes.
      const targetRect = target.getBoundingClientRect();
      // const boundary = {
      //   x: window.innerWidth - targetRect.left,
      //   y: window.innerHeight - targetRect.bottom,
      // }
      
      let increament = {
        x: event.dx,
        y: event.dy,
      }

      // if (increament.x >= boundary.x) {
      //   increament.x = boundary.x;
      // }
      // if (increament.x < 0) {
      //   increament.x = 0;
      // }
      // if (increament.y >= boundary.y) increament.y = boundary.y;

      const x = this.interactPosition.x + increament.x;
      const y = this.interactPosition.y + increament.y;

      // Add rotation based on dragging force.
      var rotationComputed = 0;
      let id = document.querySelector('.info');
      id.innerHTML = 'transform: ' + x + ', ' + y + '<br>' + target.style.transform;
      // Update the posiion attributes.
      this.interactPosition.x = x;
      this.interactPosition.y = y;
      // this.updateThread();
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
      // this.threadUpdateIntervalFunc = setInterval(this.updateThread, 10);
      // setTimeout(this.clearThreadInterval, this.bounceBackDuration);
    },

    //updateThread() {
      // const elemRect = this.getKnotRect();
      // const payload = {
      //   group: this.groupName,
      //   id: this.threadId,
      //   rect: { left: elemRect.left,
      //           right: elemRect.right,
      //           top: elemRect.top,
      //           bottom: elemRect.bottom,
      //         }
      // }
      // this.$store.commit("addKnot", payload);
    //},

    clearThreadInterval() {
      clearInterval(this.threadUpdateIntervalFunc);
    }
  },

  beforeDestroy() {
    Interact(this.$refs.interactElement).unset();
  },
};
</script>
