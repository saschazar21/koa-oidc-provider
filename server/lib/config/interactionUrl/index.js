import debug from 'debug';

const info = debug('info');

export default async function interactionUrl(ctx, interaction) {
  info(interaction);
  return `/web/interaction/${ctx.oidc.uuid}`;
}
