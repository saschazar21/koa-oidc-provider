import debug from 'debug';

const info = debug('info');

export default async function logoutSource(ctx, form) {
  info(form);
  ctx.body = '';
}
