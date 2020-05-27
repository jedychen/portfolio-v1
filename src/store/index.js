import Vue from "vue";
import Vuex from "vuex";
import FlipCard from "../assets/js/flipCard.js";

Vue.use(Vuex);

//init store
const store = new Vuex.Store({
  state: {
    flipCard: new FlipCard(),
    //isInteracting: false, // Boolean, keep updating thread if true
  },
  getters: {
    getLoadingProgress(state) {
      return state.flipCard.getLoadingProgress() * 100;
    },
    getClickedProject(state) {
      return state.flipCard.getUrl();
    },
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
    // addKnot(state, payload) {
    //   const group = payload.group; // Int number
    //   const id = payload.id; // String name
    //   const rect = payload.rect; // Object getBoundingClientRect
    //   state.thread.addKnot(group, id, rect);
    // },
  },
  actions: {},
});

export default store;
