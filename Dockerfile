FROM node:16-alpine AS BUILD_IMAGE

COPY . /opt

WORKDIR /opt

RUN yarn --frozen-lockfile

RUN yarn tsc

FROM node:16-alpine

WORKDIR /opt

COPY --from=BUILD_IMAGE /opt/dist /opt/dist
COPY --from=BUILD_IMAGE /opt/.env /opt/dist/.env
COPY --from=BUILD_IMAGE /opt/node_modules /opt/node_modules

EXPOSE 3000

CMD ["sh", "-c", "node dist/index.js"]
