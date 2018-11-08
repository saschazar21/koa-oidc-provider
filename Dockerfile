# Base image to build application
FROM node:carbon-alpine

# Arguments used to set correct hostname & debug messages
ARG HOST
ARG DEBUG

# Arguments used to set correct MongoDB connection
ARG MONGO_HOST
ARG MONGO_PORT
ARG MONGO_DB
ARG MONGO_USER
ARG MONGO_PASSWORD

# Arguments used to set correct Redis connection
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_DB
ARG REDIS_USER
ARG REDIS_PASSWORD

# Set base environment variables
ENV HOST $HOST
ENV DEBUG ${DEBUG:-error:*}

# Set MongoDB environment variables
ENV MONGO_HOST ${MONGO_HOST:-localhost}
ENV MONGO_PORT ${MONGO_PORT:-27017}
ENV MONGO_DB $MONGO_DB
ENV MONGO_USER $MONGO_USER
ENV MONGO_PASSWORD $MONGO_PASSWORD

# Set Redis environment variables
ENV REDIS_HOST ${REDIS_HOST:-localhost}
ENV REDIS_PORT ${REDIS_PORT:-6379}
ENV REDIS_DB $REDIS_DB
ENV REDIS_USER $REDIS_USER
ENV REDIS_PASSWORD $REDIS_PASSWORD

# Set correct working directory for builder image
WORKDIR /usr/src/oidc
COPY . .
RUN apk --update --no-cache add python make gcc g++ ca-certificates \
  && yarn \
  && npm run build

ENV NODE_ENV production
RUN apk del python make gcc g++ ca-certificates \
  && rm -rf /var/cache/apk

EXPOSE 3000
CMD npm start