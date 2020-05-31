<template>
  <v-row
    no-gutters
    class="content-section"
  >
    <v-col
      cols="12"
      md="6"
      class="content-block pa-6"
    >
      <h1 class="display-2 ma-1 mb-4">
        {{ title }}
      </h1>
      <v-chip
        v-for="(tag, i) in tags"
        :key="i"
        label
        
        small
        class="ma-1"
      >
        {{ tag }}
      </v-chip>
      <p class="title font-weight-light ma-1 mt-8">
        {{ date }}
      </p>
    </v-col>
    <v-col
      cols="12"
      md="6"
      class="content-block pa-6"
    >
      <InlineVideo :id="introVideoId" />
      <p class="ma-1 mt-6">
        {{ introDescription }}
      </p>
    </v-col>
    <v-col
      cols="12"
      class="content-block pa-6"
    >
      <v-divider />
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>

<script>
import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'IntroSection',
  components: {
    InlineVideo,
  },
  data () {
    return {
      tags: [
        "Game Design",
        "Physical Computing",
        "Processing",
        "Arduino",
        "Laser Cut",
        "Sensor",
      ],
      title: "Equilibrium",
      date: "2016",
      introVideoId: 393465949,
      introDescription: "Equilibrium is a collaborative digital game, designed and developed for the physical computing program held at ITP, Tisch School of the Arts in New York University. It is a digital game that combines emotive interactions, game mechanics, industrial design and a refined aesthetic culminating in hardware and software.",
    }
  },
}
</script>
