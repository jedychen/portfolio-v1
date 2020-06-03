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
      <h1 class="mb-4 intro-section__title">
        {{ content.title }}
      </h1>
      <v-chip
        v-for="(tag, i) in content.tags"
        :key="i"
        label
        
        small
        class="ma-1"
      >
        {{ tag }}
      </v-chip>
      <p class="title font-weight-light mt-8">
        {{ content.date }}
      </p>
    </v-col>
    <v-col
      cols="12"
      md="6"
      class="content-block pa-6"
    >
      <InlineVideo :id="content.videoId" />
      <p class="mt-6">
        {{ content.description }}
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
.intro-section__title {
  font-family: 'Mayeka-Regular', sans-serif;
  font-size: 60px;
  font-weight: 400;
}
</style>

<script>
import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'IntroSection',

  components: {
    InlineVideo,
  },

  props: {
    content: {
      default: null,
      type: Object
    },
  },

  data () {
    return {}
  },
}
</script>
