<template>
  <!-- Section Content -->
  <v-col
    cols="12"
    md="6"
    class="content-block pa-6"
  >
    <InlineVideo
      :id="introVideoId"
      @ready="childReady"
    />
    <p class="ma-1 mt-6">
      {{ content }}
    </p>
  </v-col>
</template>

<script>
import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'ContentBlock',

  components: {
    InlineVideo,
  },

  props: {
    topSpace: {
      default: false,
      type: Boolean
    }
  },

  data () {
    return {
      introVideoId: 393465949,
      content: "Equilibrium is a collaborative digital game, designed and developed for the physical computing program held at ITP, Tisch School of the Arts in New York University. It is a digital game that combines emotive interactions, game mechanics, industrial design and a refined aesthetic culminating in hardware and software.",
    }
  },

  mounted() {
    this.$emit("ready");
  },

  methods: {
    childReady() {
      if (this.topSpace == true) {
        let domElement = this.$el;
        let previousElement = domElement.previousElementSibling;
        domElement.style.marginTop = previousElement.offsetHeight + 'px';
      }
      this.$emit("ready");
    }
  }
}
</script>
