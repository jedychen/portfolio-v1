<template>
  <div
    v-resize="onResize"
    class="side-nav__container"
  >
    <v-row
      no-gutters
      class="side-nav__list-wrapper hidden-md-and-down"
    >
      <v-col
        cols="7"
      >
        <v-list
          flat
          class="side-nav__list mt-12"
        >
          <v-list-item-group
            v-model="item"
            color="primary"
          >
            <v-list-item
              v-for="(list_item, i) in items"
              :id="'side-nav-list-item-'+i"
              :key="i"
              class="side-nav__list-item"
            >
              <v-list-item-content>
                <v-list-item-title
                  class="side-nav__list-item-text subtitle-2"
                >
                  {{ list_item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col
        cols="5"
      >
        <div class="side-bar__waypoint" />
        <v-divider
          vertical
        />
      </v-col>  
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.side-nav__container {
  width: 100%;
}

.side-nav__list-wrapper {
  position: fixed;
  top: 0;
  height: 100vh;
}

.side-nav__list {
  background: black;
}

.side-nav__list-item {
  .side-nav__list-item-text {
    font-weight: 300;
    color: grey;
  }

  &.side-nav__list-item-active {
    .side-nav__list-item-text {
      font-weight: 500;
      color: white;
    }
  }
}

.side-bar__waypoint {
  height: 25px;
  position: absolute;
  border-left: 2px solid white;
}
</style>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'SideNav',

  data () {
    return {
      totalHeight: 0, // Side Nav's total height.
      waypointOffset: 0, // Waypoint indicator's top offset.
      selector: {
        container: '.side-nav__container',
        list: '.side-nav__list-wrapper',
        itemIdPrefix: '#side-nav-list-item-',
        waypoint: '.side-bar__waypoint',
      },
      item: 6,
      items: [
        {
          title: 'Overview',
          top: '0',
        },
        {
          title: 'Background',
          top: '20',
        },
        {
          title: 'Concept',
          top: '40',
        },
        {
          title: 'Prototyping',
          top: '50',
        },
        {
          title: 'Production',
          top: '70',
        },
        {
          title: 'Result',
          top: '80',
        },
      ],
    }
  },

  computed: {
    waypointPresentage() {
      return this.$store.getters.getScrollPresentage;
    },
  },

  watch: {
    waypointPresentage(value) {
      this.setWaypointPos(value);
      this.setActiveLink();
    },
  },

  mounted() {
    let nav_list_wrapper = document.querySelector(this.selector.list);
    let nav_list_col = document.querySelector(this.selector.container);
    nav_list_wrapper.style.width = nav_list_col.getBoundingClientRect().width + "px";
    for(let i=0; i<this.items.length; i++) {
      let nav_item = document.querySelector(this.selector.itemIdPrefix + i.toString());
      if (i==0) 
        nav_item.classList.add("side-nav__list-item-active");
      nav_item.style.position = "absolute";
      nav_item.style.width = "100%";
      nav_item.style.top = this.items[i].top + "vh";
    }
    this.calcuTotalHeight();
    this.initData();
    this.setWaypointPos(0);
  },

  methods: {
    initData() {
      const first_item = document.querySelector(this.selector.itemIdPrefix + (0).toString());
      const first_item_box = first_item.getBoundingClientRect()
      this.waypointHeight = document.querySelector(this.selector.waypoint).getBoundingClientRect().height;
      this.waypointOffset = first_item_box.top + first_item_box.height * 0.5 + this.waypointHeight * 0.5;
    },
    setWaypointPos(presentage) {
      let waypointElem = document.querySelector(this.selector.waypoint);
      const top = this.waypointOffset + 
          presentage * (this.totalHeight - this.waypointOffset) -
          this.waypointHeight;
      waypointElem.style.top = (top).toString() + 'px';
    },
    setActiveLink() {
      let waypointElem = document.querySelector(this.selector.waypoint);
      const waypoint_offset = waypointElem.getBoundingClientRect().top;
      let num = 0;
      for(let i=0; i<this.items.length; i++) {
        let nav_item = document.querySelector(this.selector.itemIdPrefix + i.toString());
        let current_nav_item_offset = nav_item.getBoundingClientRect().top;
        if (current_nav_item_offset < waypoint_offset)
          num = i;
        nav_item.classList.remove("side-nav__list-item-active");
      }
      let nav_item = document.querySelector(this.selector.itemIdPrefix + (num).toString());
      nav_item.classList.add("side-nav__list-item-active");
    },
    calcuTotalHeight() {
      this.totalHeight = document.querySelector(
          this.selector.list).getBoundingClientRect().height;
    },
    onResize: debounce(function(){
      this.calcuTotalHeight();
    }, 100)
  },
};
</script>
