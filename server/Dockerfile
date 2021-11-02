ARG BUILD_ENV

FROM node:14-alpine AS deps
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:14-alpine AS proddeps
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/yarn.lock ./
RUN npm prune --production

FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build


FROM node:14-allpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY ormconfig.js ./
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD ["yarn", "start"]