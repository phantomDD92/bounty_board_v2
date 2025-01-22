FROM node:lts-alpine

WORKDIR /src

EXPOSE 5000

RUN apk update \
    && apk upgrade \
    && apk add --no-cache --upgrade bash git openssh