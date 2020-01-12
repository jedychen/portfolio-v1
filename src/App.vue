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
        <v-list-item-avatar tile>
          <img src="~@/assets/images/logo-temp.jpg">
        </v-list-item-avatar>
      </v-list-item>
      <v-divider />
      <v-list-item class="side-bar__text-container">
        <p class="side-bar__text">
          Jedy Chen
        </p>
      </v-list-item>
    </v-navigation-drawer>
    
    <v-app-bar
      app
      color="primary"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer />

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-content>
      <MainCard />
      <HelloWorld />
      <HelloWorld />
    </v-content>
  </v-app>
</template>

<style lang="scss" scoped>
  @import "./styles/components/sidebar.scss";
</style>

<script>
import MainCard from './components/MainCard';
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    MainCard,
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>


