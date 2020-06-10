<template>
  <v-hover
    v-slot:default="{ hover }"
  >
    <v-card
      :color="hover ? 'grey darken-2' : 'grey darken-3'"
      max-width="344"
      to="/work/"
    >
      <v-img
        v-if="content.cover != null"
        :alt="content.cover.title"
        :src="content.cover.file.url"
        height="200px"
        @load="onReady"
      />

      <v-card-title>
        {{ content.title }}
      </v-card-title>

      <v-card-subtitle>
        {{ content.description }}
      </v-card-subtitle>
      
      <v-card-actions>
        <v-btn
          text
          depressed
          class="disable-events"
        >
          {{ content.ctaText }}
        </v-btn>
        <v-icon>mdi-arrow-right</v-icon>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<style lang="scss" scoped>
.disable-events {
  pointer-events: none;
}
</style>

<script>
  export default {
    name: "InlineCard",

    props: {
      content: {
        default: null,
        type: Object
      }
    },

    methods: {
      onReady() {
        this.$emit("ready");
      }
    }
  }
</script>
