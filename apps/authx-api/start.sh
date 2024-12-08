#!/usr/bin/env bash
set -e

echo "Starting PostgreSQL..."
su postgres -c "pg_ctl -D /var/lib/postgresql/data -o \"-c listen_addresses='*'\" -w start"

# Wait a few seconds for Postgres to fully start
sleep 3

# If needed, run migrations (uncomment and adjust if required):
# bun run drizzle migrate

echo "Starting the application..."
# Start the Bun application
bun run dist/server.js