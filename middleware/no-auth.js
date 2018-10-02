export default ({ redirect, store }) => {
  if (store.getters['user/user']) {
    redirect('/');
  }
};
