FROM node:6.11-alpine

RUN apk update
RUN apk add git
RUN npm install -g firebase-tools

RUN mkdir app
WORKDIR app

ARG FIREBASE_PROJECT="develop"
ARG FIREBASE_TOKEN="x/xxxxxxxxxxxx"

CMD  firebase deploy --token ${FIREBASE_TOKEN}
