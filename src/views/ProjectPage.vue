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
        <SideNav
          :sections="contentSectionItems"
        />
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
        <IntroSection :content="introSectionItem" />
        <ContentSection
          v-for="item in contentSectionItems"
          :key="item.title"
          :section="item"
          class="content-section-container"
          @ready="calcuPageLength"
        />
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
import json from '@/assets/contentful.json'
import resolveResponse from 'contentful-resolve-response';
import * as prettify from 'pretty-contentful';

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
      introSectionItem: {},
      contentSectionItems: [],
    }
  },

  beforeMount() {
    this.parseContentful(json);
  },

  mounted() {
    this.calcuPageLength();
  },

  methods: {
    calcuPageLength() {
      const contentCol = document.querySelector(".page-content-col");
      if (contentCol != null)
        this.pageLength = contentCol.offsetHeight;
      this.calcuWaypoints();
    },
    calcuWaypoints() {
      const sections = document.querySelectorAll(".content-section-container");
      sections.forEach((item, index) => {
        let offsetTop = item.offsetTop;
        let vhPos = Math.floor((offsetTop - 100) * 100 / this.pageLength);
        this.$store.commit("setWaypoint", {index: index, vhPos: vhPos});
      });
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
    },
    parseContentful() {
      const resolvedData = resolveResponse(json);
      const flattenedData = prettify(resolvedData)
      // Divide the contentful response by data type
      for (let item of flattenedData) {
        if(item.contentType == "projectPage" ) {
          this.introSectionItem = item.introSection;
          this.contentSectionItems = item.contentSections;
          break;
        }
      }
    },
  },
};
</script>
