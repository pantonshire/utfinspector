FROM docker.io/library/rust:1.82-alpine AS wasm_builder
WORKDIR /app/
COPY utfdump/Cargo.toml utfdump/Cargo.lock ./
COPY utfdump/lib/ ./lib/
COPY utfdump/wasm/ ./wasm/
COPY utfdump/bin/ ./bin/
RUN apk update && apk add --no-cache musl-dev wasm-pack pkgconf openssl-dev openssl binaryen
WORKDIR /app/wasm/
RUN wasm-pack build --release --target web

FROM docker.io/library/node:20-alpine AS node

FROM node AS node_deps
WORKDIR /app/
COPY package.json package-lock.json ./
RUN npm ci

FROM node AS next_builder
WORKDIR /app/
COPY --from=wasm_builder /app/wasm/pkg/ ./wasm/utfdump/
COPY --from=node_deps /app/node_modules/ ./node_modules/
COPY package.json package-lock.json docker/next.config.js next-env.d.ts tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup -g 998 -S next && adduser -G next -u 998 -S next
COPY --from=next_builder /app/public/ ./public/
COPY --from=next_builder --chown=next:next /app/.next/standalone/ ./
COPY --from=next_builder --chown=next:next /app/.next/static/ ./.next/static/
USER next
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]

