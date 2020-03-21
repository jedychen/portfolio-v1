<template>
  <v-container fluid>
    <div class="info"> Information Bar<br>Info here<br>more info </div>
    <div
      id="fix-left"
      class="thread__knot-top fixed-knot fixed-knot--left"
    ></div>
    <v-row 
      class="cover-card-list"
      id="container"
      align="center"
      justify="space-around"
      >
      
      <!-- About -->
      <CoverCard id='cover-about'/>

      <!-- Work -->
      <CoverCard id='cover-work'/>
     
      <!-- Experiment -->
      <CoverCard id='cover-experiment'/>
    </v-row>
    <div
        id="fix-right"
        class="thread__knot-top fixed-knot fixed-knot--right"
      ></div>
  </v-container>
</template>

<style lang="scss" scoped>
  .info {
    display: inline;
    position: fixed;
  }
  .fixed-knot {
    display: inline;
    position: fixed;
  }
  .fixed-knot--left {
    left: -100px;
    top: 100px;
  }
  .fixed-knot--right {
    left: calc(100vw + 100px);
    top: 100px;
  }
</style>

<script>
import Bounce from 'bounce.js'
import CoverCard from '@/components/CoverCard';

export default {
  name: 'HomePage',

  components: {
    CoverCard,
  },

  data() {
    return {}
  },

  mounted() {
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
  },

  methods: {},
};
</script>
