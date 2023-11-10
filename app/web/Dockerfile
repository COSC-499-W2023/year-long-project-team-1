FROM docker.io/library/node:18-alpine AS base

USER root

# Reference: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

# Disable Next.js telemetry during build and runtime.
# Reference: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM base AS runner

USER root

ENV CONFIG_DIR=/opt/privacypal

RUN mkdir -p $CONFIG_DIR && chmod -R g=u $CONFIG_DIR

RUN adduser --system --ingroup root nextjs

WORKDIR /app

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 8080

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
