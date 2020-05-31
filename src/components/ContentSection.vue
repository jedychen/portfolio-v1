<template>
  <v-row
    no-gutters
    class="content-section"
  >
    <!-- Section Intro -->
    <v-col
      cols="12"
      class="content-block pa-6"
    >
      <h1 class="display-1 ma-1 mb-4">
        {{ sectionTitle }}
      </h1>
      <p class="ma-1 mt-6">
        {{ sectionDescription }}
      </p>
    </v-col>
    <ContentBlock
      @ready="childReady"
    />
    <ContentBlock
      v-bind:topSpace="true"
      @ready="childReady"
    />
    <ContentBlock
      @ready="childReady"
    />
    <ContentBlock
      v-bind:topSpace="true"
      @ready="childReady"
    />
  </v-row>
</template>

<style lang="scss" scoped>
</style>

<script>
import ContentBlock from '@/components/ContentBlock';

export default {
  name: 'ContentSection',

  components: {
    ContentBlock,
  },

  data () {
    return {
      sectionTitle: "Background",
      sectionDescription: "To transform a deep conceptual idea into a digital game experience.",
      content: "Equilibrium is a collaborative digital game, designed and developed for the physical computing program held at ITP, Tisch School of the Arts in New York University. It is a digital game that combines emotive interactions, game mechanics, industrial design and a refined aesthetic culminating in hardware and software.",
    }
  },
  methods: {
    childReady() {
      this.$emit("ready");
    }
  }
}
</script>
