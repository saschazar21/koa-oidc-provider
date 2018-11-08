export default ({ redirect, store }) => {
  if (store.getters['user/user'] && store.getters['user/access_token']) {
    redirect('/');
  }
};
