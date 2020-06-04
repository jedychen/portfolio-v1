<template>
  <v-row
    no-gutters
    class="content-section"
  >
    <!-- Render section's title and intro. -->
    <v-col
      cols="12"
      class="content-block pa-6"
    >
      <h1 class="display-1 mb-4">
        {{ content.title }}
      </h1>
      <p class="mt-6">
        {{ content.description }}
      </p>
    </v-col>
    <!-- Render content blocks. -->
    <template
      v-for="(data, index) in content.contentBlock"
    >
      <template v-if="data.alternateColumn && data.fullWidth == false">
        <!-- Add empty blocks to alternate this block's position from the last one. -->
        <ContentBlockEmpty :key="data.summary + ' empty block 1'" />
        <template v-if="content.contentBlock[index - 1].fullWidth == false">
          <ContentBlockEmpty :key="data.summary + ' empty block 2'" />
        </template>
      </template>
      <ContentBlock
        :key="data.summary + ' block'"
        :content="data"
        :top-margin="data.alternateColumn && content.contentBlock[index - 1].fullWidth == false"
        @ready="childReady"
      />
    </template>
  </v-row>
</template>

<style lang="scss" scoped>
</style>

<script>
import ContentBlock from '@/components/ContentBlock';
import ContentBlockEmpty from '@/components/ContentBlockEmpty';

export default {
  name: 'ContentSection',

  components: {
    ContentBlock,
    ContentBlockEmpty,
  },

  props: {
    content: {
      default: null,
      type: Object
    },
  },

  data () {
    return {}
  },

  methods: {
    childReady() {
      this.$emit("ready");
    }
  },
}
</script>
