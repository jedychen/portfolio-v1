import Vue from "vue";
import Vuex from "vuex";
import FlipCard from "../assets/js/flipCard.js";

Vue.use(Vuex);

//init store
const store = new Vuex.Store({
  state: {
    flipCard: new FlipCard(),
    scrollPresentage: 0.0, // number, Article's page reading presentage.
    waypointPosList: new Array(100).fill(0), // list of int, Section waypoint's position in vh.
    waypointUpdatedNumber: 0,
  },
  getters: {
    getLoadingProgress(state) {
      return state.flipCard.getLoadingProgress() * 100;
    },
    getClickedProject(state) {
      return state.flipCard.getUrl();
    },
    getScrollPresentage(state) {
    // For project page, get the scrolling presentage of the page,
    // and change reading indicators.
      return state.scrollPresentage;
    },
    getWaypointPosList(state) {
      return state.waypointPosList;
    },
    getWaypointPosListUpdated(state) {
      return state.waypointUpdatedNumber;
    }
  },
  mutations: {
    initFlipCard(state, container) {
      state.flipCard.init(container);
      state.flipCard.animate();
    },
    setRenderFlipCard(state, rendering) {
      state.flipCard.setRendering(rendering);
    },
    flipCardTransitionAway(state) {
      state.flipCard.transitionAway();
    },
    flipCardTransitionBack(state) {
      state.flipCard.transitionBack();
    },
    setScrollPresentage(state, presentage) {
      state.scrollPresentage = presentage;
    },
    setWaypoint(state, payload) {
      state.waypointPosList[payload.index] = payload.vhPos;
      state.waypointUpdatedNumber += 1;
    },
  },
  actions: {},
});

export default store;
