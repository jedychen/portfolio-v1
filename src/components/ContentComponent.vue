<template>
  <!-- Render a item in content block as a component -->
  <div
    v-if="type == 'text'"
    v-html="parsedHtml"
  />
  <InlineImage
    v-else-if="type == 'inlineImage'"
    :content="parsedImage"
    @ready="childReady"
  />
  <div v-else />
  <!-- <InlineVideo
    :id="introVideoId"
    @ready="childReady"
  /> -->
</template>

<script>
import debounce from 'lodash/debounce'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import InlineImage from '@/components/InlineImage';
// import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'ContentComponent',

  components: {
    InlineImage,
    // InlineVideo,
  },

  props: {
    content: {
      default: null,
      type: Object
    },
  },

  data () {
    return {
      type: '',
      parsedHtml: '',
      parsedImage: null,
    }
  },

  created() {
    this.childReady();
  },

  mounted() {
    console.log(this.content)
    this.type = this.content.contentType
    if (this.type == "text") {
      this.parsedHtml = documentToHtmlString(this.content.content);
    } else if (this.type == "inlineImage") {
      this.parsedImage = this.content.image
    }
  },

  methods: {
    childReady() {
      this.$emit("ready");
    }
  },
}
</script>
