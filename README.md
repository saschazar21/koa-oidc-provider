[![Build Status](https://travis-ci.org/saschazar21/koa-oidc-provider.svg?branch=master)](https://travis-ci.org/saschazar21/koa-oidc-provider)

# koa-oidc-provider
> An OpenID Connect Provider based on Nuxt/Koa for the masses.

A slightly more opinionated config-/frontend-wrapper around **[node-oidc-provider](https://github.com/panva/node-oidc-provider)** from @panva.

* Author: [Sascha Zarhuber](https://sascha.work)
* GitHub: [@saschazar21](https://github.com/saschazar21)
* Twitter: [@saschazar](https://twitter.com/saschazar)
* Source: [https://github.com/saschazar21/koa-oidc-provider](https://github.com/saschazar21/koa-oidc-provider)
* Issues: [https://github.com/saschazar21/koa-oidc-provider/issues](https://github.com/saschazar21/koa-oidc-provider/issues)
* Releases: [https://github.com/saschazar21/koa-oidc-provider/releases](https://github.com/saschazar21/koa-oidc-provider/releases)

## Prerequisites

* [Node.JS](https://nodejs.org) v8 (LTS: carbon) and above
* [MongoDB](https://www.mongodb.com/) v3.4 and above (when running locally, services like [mlab](https://mlab.com) also work)
* [Redis](https://redis.io/) v5 and above (when running locally, services like [redislabs](https://redislabs.com/) also work)

-- OR --

* :whale: [Docker](https://www.docker.com/community/open-source) v17.09 CE and above (no extra setup needed, `docker-compose.yml`-file present)

## Build Setup

**CAUTION:** Make sure to set the appropriate HOST environment variable. More information about variables may be found under [Variables](#variables)

### Building locally

``` bash
# Clone project and change into directory
$ git clone https://github.com/saschazar21/koa-oidc-provider
$ cd koa-oidc-provider

# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000 - BE SURE TO SET APPROPRIATE HOST!
$ HOST=example.com npm run dev

# build for production and launch server - BE SURE TO SET APPROPRIATE HOST!
$ HOST=example.com npm run build
$ HOST=example.com npm start
```

### Run using :whale: Docker

``` bash
# Clone project and change into directory
$ git clone https://github.com/saschazar21/koa-oidc-provider
$ cd koa-oidc-provider

# build koa-oidc-provider service with appropriate HOST setting
$ docker-compose build --build-arg HOST=example.com koa-oidc-provider

# launch docker compose setup
$ docker-compose up
```

## API

The documentation for the API to handle clients, tokens & users may be found under [/docs/api.md](/docs/api.md)