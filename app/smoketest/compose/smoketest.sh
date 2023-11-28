#!/bin/bash

set -ex

COMPOSE_TOOL=${COMPOSE_TOOL:-docker-compose}

FILES=(
    privacypal.yaml
    db.yaml
)

CMDS=()

for file in "${FILES[@]}"; do
    CMDS+=( -f "${file}" )
done

cleanup() {
    local DOWN_FLAGS=('--remove-orphans')
    if [ "${KEEP_VOLUMES}" != "true" ]; then
        DOWN_FLAGS+=('--volumes')
    fi
    ${COMPOSE_TOOL} \
        "${CMDS[@]}" \
        down "${DOWN_FLAGS[@]}"
}

trap cleanup EXIT

cleanup

${COMPOSE_TOOL} \
    "${CMDS[@]}" \
    up
