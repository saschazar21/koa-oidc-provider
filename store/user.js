/* eslint no-param-reassign: 0 */
export const state = () => Object({});

export const mutations = {
  reset(current, user) {
    current = {
      ...user,
    };
  },
};
