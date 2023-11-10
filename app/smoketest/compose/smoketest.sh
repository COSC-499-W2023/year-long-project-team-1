#!/bin/bash

COMPOSE_TOOL=${COMPOSE_TOOL:-docker-compose}

cleanup() {
    DOWN_FLAGS=('--remove-orphans')
    if [ "${KEEP_VOLUMES}" != "true" ]; then
        DOWN_FLAGS+=('--volumes')
    fi
    ${COMPOSE_TOOL} \
        -f privacypal.yaml \
        down "${DOWN_FLAGS[@]}"
}

trap cleanup EXIT

cleanup

${COMPOSE_TOOL} \
    -f privacypal.yaml \
    up
