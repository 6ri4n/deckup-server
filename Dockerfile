FROM node:16-alpine3.17

WORKDIR /deckup-server

COPY package*.json .

RUN npm install

COPY . .

RUN npm run start