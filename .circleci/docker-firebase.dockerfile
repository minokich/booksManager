FROM node:6.11-alpine

RUN apk update
RUN apk add git
RUN npm install -g firebase-tools

RUN mkdir app
WORKDIR app

CMD cd functions && npm install && cd ../ 
