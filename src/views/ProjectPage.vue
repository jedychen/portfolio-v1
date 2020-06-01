<template>
  <v-container
    fluid
    class="project-page__container"
  >
    <v-row
      v-scroll:#scrolling-content="onScroll"
      no-gutters
      class="project-page"
    >
      <!-- Side Nav -->
      <v-col
        cols="1"
        lg="2"
        class="side-nav-col hidden-md hidden-xs"
      >
        <SideNav />
      </v-col>
      <!-- Page Content -->
      <v-col
        v-resize="onResize"
        cols="12"
        sm="10"
        md="12"
        lg="9"
        class="page-content-col mt-12"
      >
        <IntroSection />
        <ContentSection @ready="calcuPageLength" />
      </v-col>
      <!-- Right Margin -->
      <v-col
        cols="1"
        class="margin-col hidden-md hidden-xs"
      />
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.project-page__container,
.project-page {
  background: black;
}
</style>

<script>
import debounce from 'lodash/debounce'
import ContentSection from '@/components/ContentSection';
import IntroSection from '@/components/IntroSection';
import SideNav from '@/components/SideNav';

export default {
  components: {
    SideNav,
    IntroSection,
    ContentSection,
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
    onResize: debounce(function(){
      this.calcuPageLength();
    }, 100),
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
      let presentage = this.scrollTop / (this.pageLength - window.innerHeight);
      presentage = this.clamp(presentage, 0, 1);
      this.$store.commit("setScrollPresentage", presentage);
    },
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }
  },
};
</script>
