<template>
  <div>
    <v-carousel
      v-model="currentIndex"
      cycle
      hide-delimiter-background
      hide-delimiters
      @ready="onReady"
    >
      <v-carousel-item
        v-for="(slide, i) in content.slides"
        :key="i"
        :src="slide.file.url"
      />
    </v-carousel>
    <p class="caption mt-2 mb-0 font-weight-bold">
      Slide {{ currentIndex + 1 }} / {{ content.slides.length }}
    </p>
    <p class="caption">
      {{ currentDescription }}
    </p>
  </div>
</template>

<script>
  export default {
    name: "InlineCarousel",

    props: {
      content: {
        default: null,
        type: Object
      }
    },

    data () {
      return {
        currentIndex: 0,
      }
    },

    computed: {
      currentDescription() {
        return this.content.slides[this.currentIndex].description
      }
    },

    methods: {
      onReady() {
        this.$emit("ready");
      }
    }
  }
</script>
