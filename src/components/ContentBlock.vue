<template>
  <!-- Single Content Block -->
  <v-col
    v-resize="onResize"
    cols="12"
    :md="width"
    class="content-block pa-6"
  >
    <ContentComponent
      v-for="(item, i) in block.inlineItems"
      :key="i"
      :component="item"
      @ready="childReady"
    />
  </v-col>
</template>

<script>
import debounce from 'lodash/debounce'
import ContentComponent from '@/components/ContentComponent';

export default {
  name: 'ContentBlock',

  components: {
    ContentComponent,
  },

  props: {
    topMargin: {
      default: true,
      type: Boolean
    },
    block: {
      default: null,
      type: Object
    },
  },

  data () {
    return {
      breakpointMd: 960,
    }
  },

  computed: {
    width() {
      if (this.block.fullWidth == true)
        return 12;
      return 6;
    }
  },

  created() {
    this.onResize = debounce(()=>{
        if (this.topMargin == true && window.innerWidth>=this.breakpointMd) {
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
    }
  },
}
</script>
