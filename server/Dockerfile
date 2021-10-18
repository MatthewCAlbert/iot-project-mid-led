FROM node:14-alpine as node-version

FROM node-version as builder

WORKDIR /usr/src/app

RUN yarn install --production

COPY . .

FROM node-version
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 5000
CMD ["yarn", "run", "start"]