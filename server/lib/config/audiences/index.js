export default async function audiences() {
  // @param ctx   - koa request context
  // @param sub   - account identifier (subject)
  // @param token - a reference to the token used for which a given account is being loaded,
  //   is undefined in scenarios where claims are returned from authorization endpoint
  // @param use   - can be one of "id_token", "userinfo", "access_token" depending on where the
  //   specific audiences are intended to be put in
  // @param scope - scope from either the request or related token
  return undefined;
}
