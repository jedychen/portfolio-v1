import Vue from "vue";
import Vuex from "vuex";
import Threads from '../assets/js/threads.js'


Vue.use(Vuex)
 
export default new Vuex.Store({
  state: {
    threads: new Threads(),
    cards: [],
  },
  getters: {},
  mutations: {
    initThread(state, name) {
      state.threads.init(name);
    },
    updateThread(state, pos) {
      state.threads.update(pos);
    }
  },
  actions: {},
})
