import debug from 'debug';

const error = debug('error:setup');

export default async function renderError(ctx, out, err) {
  error(err.message || err);
  ctx.type = 'text/html';
  ctx.body = '';
}
