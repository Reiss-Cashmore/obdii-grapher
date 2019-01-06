import Vue from 'vue';
import Vuex from 'vuex';

import {
  createPersistedState,
  createSharedMutations
} from 'vuex-electron';

import obd from './modules/obd';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    obd: obd
  },
  plugins: [
    createPersistedState(),
    createSharedMutations(),
  ],
  strict: process.env.NODE_ENV !== 'production',
});