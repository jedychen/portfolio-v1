<template>
  <div>
    <vimeo-player
      ref="player"
      :options="{ responsive: true }"
      :video-id="videoID"
      :autoplay="false"
      :player-height="1080"
      :player-width="1920"
      loop="0"
      class="vimeo"
      @ready="onReady"
    />
  </div>
</template>

<script>
export default {
  name: "InlineVideo",

  props: {
    id: {
      default: 393465949,
      type: Number
    }
  },

  data() {
    return {
      videoID: this.id,
    }
  },

  methods: {
    onReady() {
      this.$emit("ready");
    }
  }
}
</script>
