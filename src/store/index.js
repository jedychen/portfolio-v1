import Vue from "vue";
import Vuex from "vuex";
import Thread from '../assets/js/thread.js'


Vue.use(Vuex)
 
export default new Vuex.Store({
  state: {
    thread: new Thread(),
    cards: [],
  },
  getters: {},
  mutations: {
    initThread(state, name) {
      state.thread.init(name);
    },
    updateThread(state, pos) {
      state.thread.update(pos);
    }
  },
  actions: {},
})
