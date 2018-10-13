/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';

import client from './modules/client';
import clients from './modules/clients';
import form from './modules/form';
import setup from './modules/setup';
import tokens from './modules/tokens';
import user from './modules/user';

Vue.use(Vuex);

export default () => new Vuex.Store({
  actions: {
    async nuxtServerInit({ commit }, { req }) {
      await commit('setup/set', {
        ...req.setup,
        client: req.baseClient,
      });
      await commit('client/set', req.client);
      if (req.user) {
        await commit('user/set', req.user);
      }
    },
  },
  modules: {
    client,
    clients,
    form,
    setup,
    tokens,
    user,
  },
});
