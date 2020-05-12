<template>
  <v-app>
    <v-card class="overflow-hidden">
      <Header  id='#scrolling-content'/>
      <v-sheet
        id="scrolling-content"
        class="overflow-y-auto"
        max-height="100vh"
      >
        <FeaturedWork />
        <!-- <v-container style="height: 1000px;"></v-container> -->
      </v-sheet>
    </v-card>
  </v-app>
</template>

<style lang="scss" scoped>
body {
  background-color: black;
}
</style>

<script>
import Header from '@/components/Header';
import FeaturedWork from '@/views/FeaturedWork';

export default {
  name: 'App',

  components: {
    Header,
    FeaturedWork,
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


