FROM docker.io/library/node:18-alpine

# Reference: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

RUN adduser --system --ingroup root prisma

RUN npm install -g prisma

WORKDIR /app

COPY . .

USER prisma

CMD ["prisma", "migrate", "deploy"]
