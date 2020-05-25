<template>
  <v-app>
    <v-card class="overflow-hidden">
      <TheHeader id='#scrolling-content'/>
      <v-sheet
        id="scrolling-content"
        class="overflow-y-auto main-sheet"
        max-height="100vh"
      >
        <router-view :key="$route.path" />
      </v-sheet>
    </v-card>
  </v-app>
</template>

<style lang="scss" scoped>
body {
  background-color: black;
}

.main-sheet {
  background-color: black;
}
</style>

<script>
import TheHeader from '@/components/TheHeader';

export default {
  name: 'App',

  components: {
    TheHeader,
  },

  data() {
    return {
    }
  },

  created () {
    
  },

  mounted() {
    // Run thread.update function every 10ms
    // this.$store.commit("initThread", ".canvas");
    // setInterval(this.updateThread, 10);
    // this.$store.commit("setInteracting", true);
  },

  methods: {
    // updateThread() {
    //   this.$store.commit("updateThread");
    // }
  }
};
</script>


