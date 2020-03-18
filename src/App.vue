<template>
  <v-app>
    <div class="canvas"></div>
    <v-navigation-drawer
      app
      color=#555
      mini-variant
      dark
      class="elevation-24"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            src="~@/assets/images/logo.jpg"
            alt="Logo"
          >
          </v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-divider />
      <v-list-item class="side-bar__text-container">
        <p class="side-bar__text">
          Jedy Chen
        </p>
      </v-list-item>
    </v-navigation-drawer>
    
    <v-content>
      <HomePage />
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
  .canvas {
    height: 100%; 
    position: fixed;
    width: 100%;
  }
</style>

<script>
import HomePage from './views/HomePage';

export default {
  name: 'App',

  components: {
    HomePage,
  },

  data() {
    return {
    }
  },

  mounted() {
    this.$store.commit("initThread", ".canvas");
  },
};
</script>


