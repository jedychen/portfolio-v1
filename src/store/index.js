import Vue from "vue";
import Vuex from "vuex";
import FlipCard from '../assets/js/flipcard.js'


Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    flipCard: new FlipCard(),
    //isInteracting: false, // Boolean, keep updating thread if true
  },
  getters: {
    getLoadingProgress(state) {
      return state.flipCard.getLoadingProgress() * 100
    },
    getClickedProject(state) {
      return state.flipCard.getURL()
    },
  },
  mutations: {
    initFlipCard(state, container) {
      state.flipCard.init(container)
      state.flipCard.animate()
    },
    resetFlipCard(state) {
      state.flipCard.setRendering(true)
    },
    setRendering(state, rendering) {
      state.flipCard.setRendering(rendering)
    },
    // addKnot(state, payload) {
    //   const group = payload.group; // Int number
    //   const id = payload.id; // String name
    //   const rect = payload.rect; // Object getBoundingClientRect
    //   state.thread.addKnot(group, id, rect);
    // },
  },
  actions: {},
})
