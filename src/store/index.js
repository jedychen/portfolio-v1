import Vue from "vue";
import Vuex from "vuex";
import Thread from '../assets/js/thread.js'


Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    thread: new Thread(),
    isInteracting: false, // Boolean, keep updating thread if true
  },
  getters: {
    getKnotTransform(state) {
      // return state.thread.getKnotTransform();
    },
    getStitchTransform(state) {
      // return state.thread.getStitchTransform();
    },
  },
  mutations: {
    initThread(state, name) {
      state.thread.init(name);
    },
    updateThread(state) {
      if(state.isInteracting) state.thread.update();
    },
    setInteracting(state, status) {
      state.isInteracting = status;
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
