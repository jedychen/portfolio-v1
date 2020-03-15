<template>
  <v-container fluid>

    <div id="info"> Information Bar<br>Info here </div>

    <v-row 
      class="main-card-list"
      id="container"
      align="center"
      justify="space-around"
      >
      <!-- About -->
      <div
        class="main-card-container__drag draggable"
        id="main-card-about"
      >
        <div 
          class="main-card-container__bounce"
          id="main-card-about-bounce"
        >
          <v-card
            class="main-card"
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
          </v-card>
          <div class="stitching-top"></div>
        </div>
      </div>

      <!-- Work -->
      <div
        class="main-card-container__drag draggable"
        id="main-card-work"
        :style="{ transform: transformString }"
      >
        <div
          class="main-card-container__bounce"
          id="main-card-work-bounce"
        >
          <v-card
            class="main-card"
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
          <div class="stitching-top"></div>
        </div>
      </div>
     

      <!-- Experiment -->
      <div
        class="main-card-container__drag draggable"
        id="main-card-experiments"
      >
        <div class="main-card-container__bounce">
          <v-card
            class="main-card"
            transition="scale-transition"
          >
            <v-img
              height="200px"
              width="300px"
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              alt="Cover Image"
            >
            </v-img>
          </v-card>
          <div class="stitching-top"></div>
        </div>
      </div>

    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
  @import "../styles/components/homepage.scss";
</style>

<script>
import *  as card_interaction from '../assets/js/cover_card.js'

export default {
  name: 'HomePage',
  data: () => {
    return {
      draggies: [],
    }
  },

  mounted() {
    card_interaction.enterAnimation()
    this.draggies = card_interaction.dragCards()
  },

  computed: {
    transformString() {
      var rotation = 10;
      return 'rotate('+rotation+'deg)';
    }
  },
};
</script>
