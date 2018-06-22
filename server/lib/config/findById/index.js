export default async function findById() {
  // @param ctx   - koa request context
  // @param sub   - account identifier (subject)
  // @param token - is a reference to the token used for which a given account is being loaded,
  //   is undefined in scenarios where claims are returned from authorization endpoint
  return {
    accountId: undefined,
    // @param use   - can either be "id_token" or "userinfo", depending on
    //   where the specific claims are intended to be put in
    // @param scope - the intended scope, while oidc-provider will mask
    //   claims depending on the scope automatically you might want to skip
    //   loading some claims from external resources etc. based on this detail
    //   or not return them in ID Tokens but only UserInfo and so on
    async claims() {
      return { };
    },
  };
}
