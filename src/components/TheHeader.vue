<template>
  <v-app-bar
    absolute
    color="grey darken-3"
    dark
    hide-on-scroll
    short
    v-bind:scroll-target="contentId"
  >

    <v-avatar>
      <v-img
        src="~@/assets/images/logo.jpg"
        alt="Logo"
      >
      </v-img>
    </v-avatar>

    <v-toolbar-title
        class="header__title"
    >
    Jedy Chen
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn icon>
        <span>Work</span>
      </v-btn>
      <v-divider
        class="mx-4"
        vertical
      ></v-divider>
      <v-btn icon>
        <span>About</span>
      </v-btn>
    </v-toolbar-items>

  </v-app-bar>
</template>

<style scoped>
  .header__title {
    color: #fff;
    font-family: 'Mayeka-Light', sans-serif;
    font-size: 30px;
    letter-spacing: 0.1rem;
    margin-left: 20px;
    white-space: nowrap;
  }
</style>

<script>
export default {
  name: 'TheHeader',
  props: {
    id: String
  },

  data() {
    return {
      contentId: this.id,
    }
  },
};
</script>
