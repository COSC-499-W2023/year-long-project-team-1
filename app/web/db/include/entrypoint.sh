#!/usr/bin/env bash
# Copyright [2023] [Privacypal Authors]
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


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

    bash "$DIR/generate_insertion.sh" -f "${PRIVACYPAL_USER_PROPERTY_PATH}" -t User | prisma db execute --schema schema.prisma --stdin
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
