<template>
  <v-container fluid>
    <div class="info"> Information Bar<br>Info here<br>more info </div>
    <v-row 
      class="cover-card-list"
      id="container"
      align="center"
      justify="space-around"
      >
      <!-- About -->
      <CoverCard />

      <!-- Work -->
      <CoverCard />
     
      <!-- Experiment -->
      <CoverCard />

    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.info {
  display: inline;
  position: fixed;
}
</style>

<script>
import CoverCard from '../components/CoverCard';
import *  as homepage from '../assets/js/homepage.js'

export default {
  name: 'HomePage',

  components: {
    CoverCard,
  },

  data() {
    return {}
  },

  mounted() {
    homepage.enterAnimation();
  },

  methods: {},
};
</script>
