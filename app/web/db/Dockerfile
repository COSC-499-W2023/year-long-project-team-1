FROM docker.io/library/node:18-alpine

USER root

# Reference: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

RUN adduser --system --ingroup root --uid 1002 prisma

RUN npm install -g prisma@5.9.1

WORKDIR /app

COPY . .

USER 1002

ENTRYPOINT ["sh", "include/entrypoint.sh"]
