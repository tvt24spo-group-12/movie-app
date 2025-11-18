#!/bin/bash
set -euo pipefail

# files are executed as root inside the image; use psql with POSTGRES_USER
DBS=(netdb devdb testdb)

for DB in "${DBS[@]}"; do
  echo "Running schema against database: $DB"
  # stop on error and pass env username
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" -f /docker-entrypoint-initdb.d/schema.sql
done
