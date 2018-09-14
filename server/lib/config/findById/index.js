import debug from 'debug';

import userModel from '../../db/models/user';

let User;
const error = debug('error:setup');

export default async function findById(ctx, id) {
  // @param ctx   - koa request context
  // @param sub   - account identifier (subject)
  // @param token - is a reference to the token used for which a given account is being loaded,
  //   is undefined in scenarios where claims are returned from authorization endpoint
  try {
    User = User || await userModel();
    const result = await User.findById(id, '-__v -password');
    const user = result.toJSON();
    return {
      /* eslint-disable-next-line no-underscore-dangle */
      accountId: user._id,
      // @param use   - can either be "id_token" or "userinfo", depending on
      //   where the specific claims are intended to be put in
      // @param scope - the intended scope, while oidc-provider will mask
      //   claims depending on the scope automatically you might want to skip
      //   loading some claims from external resources etc. based on this detail
      //   or not return them in ID Tokens but only UserInfo and so on
      async claims() {
        return {
          /* eslint-disable-next-line no-underscore-dangle */
          sub: user._id,
          ...user,
        };
      },
    };
  } catch (e) {
    error(e.message || e);
    return e;
  }
}
