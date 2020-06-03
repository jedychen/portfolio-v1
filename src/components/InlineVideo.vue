<template>
  <div>
    <vimeo-player
      v-if="content != null"
      ref="player"
      :options="{ responsive: true, muted: content.muted }"
      :video-id="content.videoId"
      :autoplay="content.autoPlay"
      :player-height="1080"
      :player-width="1920"
      :loop="loop"
      class="vimeo mb-8"
      @ready="onReady"
    />
  </div>
</template>

<script>
export default {
  name: "InlineVideo",

  props: {
    content: {
      default: null,
      type: Object
    }
  },

  data() {
    return {}
  },

  mounted() {
    // if (this.content.muted == true)
    //   this.$refs["player"].mute();
    // if (this.content.autoPlay == true)
    //   this.$refs["player"].play();
  },

  computed: {
    loop() {
      if (this.content != null) {
        if (this.content.loop == true)
          return '1';
      }
      return '0';
    },
  },

  methods: {
    onReady() {
      this.$emit("ready");
    }
  }
}
</script>
