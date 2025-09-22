FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.docker ./.env

RUN npm run build

RUN npm prune --production

FROM  node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN npm install --production

EXPOSE 3000

CMD [ "npm", "run", "start" ]