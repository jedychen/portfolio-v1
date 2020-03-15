<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      :color="$side-bar-bg"
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
  @import "./styles/components/sidebar.scss";
</style>

<script>
import HomePage from './components/HomePage';

export default {
  name: 'App',

  components: {
    HomePage,
  },

  data: () => ({
    //
  }),
};
</script>


