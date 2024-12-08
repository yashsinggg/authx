# Use the official Bun image for linux/amd64
FROM --platform=linux/amd64 oven/bun:1.1.17 AS base
WORKDIR /usr/src/app

# Step 1: Install dependencies in a separate stage
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Step 2: Build the application
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules /node_modules
COPY . .
COPY .env .env

ENV NODE_ENV=production

# Run tests and build (adjust commands as necessary)
RUN bun test
RUN bun run build

# Step 3: Prepare final release image
FROM base AS release
COPY --from=install /temp/prod/node_modules /node_modules
COPY --from=prerelease /usr/src/app/src/index.ts ./src/index.ts
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/dist/ dist/
COPY --from=prerelease /usr/src/app/.env .env

# Install PostgreSQL inside the container
USER root
RUN apt-get update && apt-get install -y postgresql postgresql-contrib && rm -rf /var/lib/apt/lists/*

# Set up PostgreSQL data directory
RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql
USER postgres

# Initialize the PostgreSQL database
RUN initdb -D /var/lib/postgresql/data

# Start Postgres temporarily to create user and database
RUN pg_ctl -D /var/lib/postgresql/data -o "-c listen_addresses='localhost'" -w start \
    && psql --username postgres -c "CREATE USER myuser WITH SUPERUSER PASSWORD 'mypassword';" \
    && psql --username postgres -c "CREATE DATABASE mydb OWNER myuser;" \
    && pg_ctl -D /var/lib/postgresql/data -m fast -w stop

USER root
ENV DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb
ENV NODE_ENV=production

# Add a start script that first runs Postgres and then starts the app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose your app port
EXPOSE 8080
# Run the startup script
ENTRYPOINT ["/start.sh"]