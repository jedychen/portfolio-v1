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
  <InlineCard
    v-else-if="type == 'inlineCard'"
    :content="parsedCard"
    @ready="childReady"
  />
  <InlineCarousel
    v-else-if="type == 'inlineCarousel'"
    :content="parsedSlides"
    @ready="childReady"
  />
  <div v-else />
</template>

<script>
import debounce from 'lodash/debounce'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import InlineCard from '@/components/InlineCard';
import InlineCarousel from '@/components/InlineCarousel';
import InlineImage from '@/components/InlineImage';
import InlineVideo from '@/components/InlineVideo';

export default {
  name: 'ContentComponent',

  components: {
    InlineCard,
    InlineCarousel,
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
      parsedSlides: null,
      parsedCard: null,
    }
  },

  created() {
    this.childReady();
  },

  mounted() {
    console.log("component", this.content.contentType, this.content)
    this.type = this.content.contentType;
    if (this.type == "text") {
      this.parsedHtml = documentToHtmlString(this.content.htmlContent);
    } else if (this.type == "inlineImage") {
      this.parsedImage = this.content.image;
    } else if (this.type == "inlineVideo") {
      this.parsedVideo = this.content;
    } else if (this.type == "inlineCarousel") {
      this.parsedSlides = this.content;
    } else if (this.type == "inlineCard") {
      this.parsedCard = this.content;
    }
  },

  methods: {
    childReady() {
      this.$emit("ready");
    }
  },
}
</script>
