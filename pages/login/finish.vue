<template>
  <h1>Hello</h1>
</template>


<script>
export default {
  async fetch({ app, store, route }) {
    console.log(window.location);
    if (route.hash && route.hash.startsWith('#')) {
      const obj = {};
      const fragments = route.hash.substr(1).split('&');
      fragments.forEach((fragment) => {
        const [key, value] = fragment.split('=');
        obj[key] = value;
      });
      if (obj.id_token) {
        store.commit('user/token', obj.id_token);
        const { data } = await app.$axios({
          headers: {
            authentication: `Bearer ${obj.id_token}`,
          },
          method: 'get',
          url: store.getters('setup/routes').userinfo,
        });
        console.log(data);
      }
    }
  },
};
</script>
