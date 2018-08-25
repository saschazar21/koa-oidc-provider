/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';

import client from './modules/client';
import form from './modules/form';
import user from './modules/user';

Vue.use(Vuex);

export default () => new Vuex.Store({
  actions: {
    async nuxtServerInit({ commit }, { req }) {
      if (req.user) {
        await commit('user/reset', req.user);
      }
      if (req.client) {
        await commit('client/setClient', {
          client_id: `${req.client.client_id}`,
          client_secret: `${req.client.client_secret}`,
        });
      }
    },
  },
  modules: {
    client,
    form,
    user,
  },
});
