# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22-alpine AS base

ARG IS_CI=true
ARG NEXT_PUBLIC_SERVER_URL=https://fyysikkokilta.fi
ARG NEXT_PUBLIC_S3_PUBLIC_URL=https://files.fyysikkokilta.fi
ARG NODE_ENV=production

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile --ignore-scripts


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Set environment variables
ENV IS_CI=${IS_CI}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_S3_PUBLIC_URL=${NEXT_PUBLIC_S3_PUBLIC_URL}
ENV NODE_ENV=${NODE_ENV}

RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
# Install ghostscript for pdf compression
RUN apk add --no-cache ghostscript

WORKDIR /app

ENV NODE_ENV=${NODE_ENV}
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Recursively remove all *.meta files
# https://github.com/vercel/next.js/discussions/46544#discussioncomment-11136615
RUN find . -type f -name '*.meta' -exec rm -f {} \;
RUN find . -type f -name '*.rsc' -exec rm -f {} \;

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
