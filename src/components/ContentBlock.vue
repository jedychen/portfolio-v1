<template>
  <!-- Section Content -->
  <v-col
    v-resize="onResize"
    cols="12"
    md="6"
    class="content-block pa-6"
  >
    <!-- <InlineVideo
      :id="introVideoId"
      @ready="childReady"
    /> -->
    <p class="ma-1 mt-6">
      {{ content }}
    </p>
  </v-col>
</template>

<script>
import debounce from 'lodash/debounce'
// import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'ContentBlock',

  // components: {
  //   InlineVideo,
  // },

  props: {
    topSpace: {
      default: true,
      type: Boolean
    },
  },

  data () {
    return {
      breakpointMd: 960,
      introVideoId: 393465949,
      content: "Equilibrium is a collaborative digital game, designed and developed for the physical computing program held at ITP, Tisch School of the Arts in New York University. It is a digital game that combines emotive interactions, game mechanics, industrial design and a refined aesthetic culminating in hardware and software.",
    }
  },

  created() {
    this.onResize = debounce(()=>{
        if (this.topSpace == true && window.innerWidth>=this.breakpointMd) {
          this.$el.style.marginTop = '-100px';
        } else {
          this.$el.style.marginTop = '0px';
        }
        this.childReady();
    }, 100)
  },

  mounted() {
    this.onResize();
  },

  methods: {
    childReady() {
      this.$emit("ready");
    },
  }
}
</script>
