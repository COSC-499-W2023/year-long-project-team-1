#!/usr/bin/env bash

set -e

DIR="$(dirname "$(readlink -f "$0")")"

# Fail fast when DATABASE_URL is not set.
sanitize() {
    if [ -z "${DATABASE_URL}" ]; then
        echo "[SEVERE][$(date)]: DATABASE_URL is missing." && exit 1
    fi
}

# Initialize the database schema
generate_schema() {
    prisma migrate deploy
}

# Generate user rows if necessary
generate_user_rows() {
    if [ ! -f "${PRIVACYPAL_USER_PROPERTY_PATH}" ]; then
        echo "[SEVERE][$(date)]: ${PRIVACYPAL_USER_PROPERTY_PATH} does not exist." && exit 1
    fi

    bash "$DIR/generate_insertion.bash" -f "${PRIVACYPAL_USER_PROPERTY_PATH}" -t User | prisma db execute --schema schema.prisma --stdin
}

# Prune user rows if necessary
clean_user_rows() {
    prisma db execute --schema schema.prisma --file include/truncate.sql
}

export PRIVACYPAL_USER_PROPERTY_PATH="${PRIVACYPAL_USER_PROPERTY_PATH:-/opt/privacypal/user.properties.csv}"

sanitize
generate_schema

case ${PRIVACYPAL_AUTH_MANAGER} in 
    basic)
        generate_user_rows
        ;;
    *)
        clean_user_rows
        ;;
esac
