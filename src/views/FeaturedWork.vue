<template>
  <div id="container"></div>
</template>

<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>

<script>
import * as cards from '@/assets/js/cards.js'

export default {
  name: 'FeaturedWork',

  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },

  mounted() {
    let context = cards.createHomePageCards(
        document.getElementById('container')
    );
    context.init();
    context.animate();
  },

  methods: {
  },
  
};
</script>
