<template>
  <v-container
    fluid
  >
    <v-row
      no-gutters
      class="project-page"
      v-scroll:#scrolling-content="onScroll"
    >
      <!-- Side Nav -->
      <v-col
        cols="1"
        md="2"
        class="side-nav-col"
      >
        <SideNav />
      </v-col>
      <!-- Page Content -->
      <v-col
        cols="10"
        md="9"
        class="page-content-col mt-12"
        v-resize="onResize"
      >
        <v-row
          no-gutters
          class="content-section"
        >
          <v-col
            cols="6"
            class="content-block"
          >
            <v-card
              class="pa-6"
              outlined
              tile
            >
              Column
            </v-card>
          </v-col>
          <v-col
            cols="6"
            class="content-block"
          >
            <v-card
              class="pa-6"
              outlined
              tile
            >
              Column
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- Right Margin -->
      <v-col
        cols="1"
        class="margin-col"
      />
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.content-block {
  height: 300vh;
}
</style>

<script>
import SideNav from '@/components/SideNav';

export default {
  components: {
    SideNav,
  },

  data () {
    return {
      pageLength: 0, // Page's total length.
      scrollTop: 0, // Scrolling distance to top.
    }
  },

  mounted() {
    this.calcuPageLength();
  },

  methods: {
    calcuPageLength() {
      this.pageLength = document.querySelector(".page-content-col").offsetHeight;
    },
    onResize() {
      this.calcuPageLength();
    },
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
      let presentage = this.scrollTop / (this.pageLength - window.innerHeight);
      presentage = presentage > 1 ? 1 : presentage;
      this.$store.commit("setScrollPresentage", presentage);
    },
  },
};
</script>
