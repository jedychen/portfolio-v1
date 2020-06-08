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
      v-for="(block, index) in content.contentBlocks"
    >
      <template v-if="block.alternateColumn && block.fullWidth == false">
        <!-- 1. When the previous block is half width -->
        <!-- Add two empty blocks to alternate this block's column, -->
        <!-- and make this block have negative top margin. -->
        <!-- 2. When the previous block is full width -->
        <!-- Add one empty blocks to alternate this block's column -->
        <!-- and no need to add negative top margin. -->
        <ContentBlockEmpty :key="block.summary + ' empty block 1'" />
        <template v-if="content.contentBlocks[index - 1].fullWidth == false">
          <ContentBlockEmpty :key="block.summary + ' empty block 2'" />
        </template>
      </template>
      <ContentBlock
        :key="block.summary + ' block'"
        :content="block"
        :top-margin="block.alternateColumn && content.contentBlocks[index - 1].fullWidth == false"
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
