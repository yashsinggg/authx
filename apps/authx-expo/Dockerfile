# Use the imbios/bun-node:latest image as the base image
FROM --platform=linux/amd64 imbios/bun-node:latest AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules /node_modules
COPY . .
# COPY .env.production ./.env

# [Optional] tests & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run build:web

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules /node_modules
# COPY --from=prerelease /usr/src/app/src/index.ts .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/dist/ dist/
# COPY --from=prerelease /usr/src/app/.env .env

# Run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bunx", "serve", "dist", "--single"]