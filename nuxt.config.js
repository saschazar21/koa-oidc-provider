const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const nuxtEnv = process.env.NUXT_PATH;
const nuxtPrefix = `/${nuxtEnv ? nuxtEnv.split('/').filter(el => el.length > 0).join('/') : 'web'}/`;

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.HOST || pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'application-name', content: `${pkg.name} ${pkg.version}` },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'generator', content: `Nuxt ${pkg.dependencies.nuxt}` },
      { name: 'keywords', content: Array.isArray(pkg.keywords) ? pkg.keywords.join(', ') : pkg.keywords },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.scss',
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    debug: !isProd,
    https: isProd,
    port: isProd ? 443 : (process.env.PORT || 3000),
  },

  router: {
    base: nuxtPrefix,
  },

  serverMiddleware: [
    // '~/middleware/server/passport',
  ],
};
