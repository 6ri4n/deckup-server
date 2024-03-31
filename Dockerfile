FROM node:20-alpine

WORKDIR /deckup-server

COPY package.json .

RUN npm install

COPY . .

RUN npm run start