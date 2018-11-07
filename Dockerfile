FROM node:carbon-alpine AS builder
WORKDIR /usr/src/app-build
COPY . .
RUN npm install --silent && npm run build

FROM node:carbon-alpine AS prod
ENV BUILDER_WORKDIR /usr/src/app-build
ENV NODE_ENV production
WORKDIR /usr/src/oidc
COPY --from=builder $(BUILDER_WORKDIR)/package.json $(BUILDER_WORKDIR)/static $(BUILDER_WORKDIR)/.nuxt $(BUILDER_WORKDIR)/build ./
RUN npm install --production --silent
EXPOSE 3000
CMD npm start