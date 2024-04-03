FROM node:18-alpine3.18

WORKDIR /deckup-server

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]