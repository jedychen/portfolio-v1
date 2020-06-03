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
  <InlineVideo
    v-else-if="type == 'inlineVideo'"
    :content="parsedVideo"
    @ready="childReady"
  />
  <div v-else />
</template>

<script>
import debounce from 'lodash/debounce'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import InlineImage from '@/components/InlineImage';
import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'ContentComponent',

  components: {
    InlineImage,
    InlineVideo,
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
      parsedVideo: null,
    }
  },

  created() {
    this.childReady();
  },

  mounted() {
    console.log(this.content)
    this.type = this.content.contentType;
    if (this.type == "text") {
      this.parsedHtml = documentToHtmlString(this.content.htmlContent);
    } else if (this.type == "inlineImage") {
      this.parsedImage = this.content.image;
    } else if (this.type == "inlineVideo") {
      this.parsedVideo = this.content;
      console.log("video", this.parsedVideo)
    }
  },

  methods: {
    childReady() {
      this.$emit("ready");
    }
  },
}
</script>
