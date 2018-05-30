const pkg = require('./package.json');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.TITLE || pkg.name,
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
};
