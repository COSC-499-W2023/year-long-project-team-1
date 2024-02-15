#!/bin/bash

DIR="$(dirname $(readlink -f $0))"
OLD_PATH="$PATH"

assertEquals() {
    local ACTUAL="$1"
    local EXPECTED="$2"

    if [ "$ACTUAL" = "$EXPECTED" ]; then
        return 0
    fi

    echo "ASSERT:expected:<$1> but was:<$2>"
    return 1
}


setUp() {
    # Mock prisma
   export PATH="$DIR:$PATH"

	export PRIVACYPAL_POSTGRES_USERNAME="privacypal"
	export PRIVACYPAL_POSTGRES_PASSWORD="password"
	export PRIVACYPAL_POSTGRES_HOST="localhost"
	export PRIVACYPAL_POSTGRES_PORT=5432
	export PRIVACYPAL_POSTGRES_DATABASE="privacypal"

    # Create an outut log file
    touch OUTPUT.log
}

# Clean up
teardown() {
    export PATH="$OLD_PATH"

    unset PRIVACYPAL_POSTGRES_USERNAME
	unset PRIVACYPAL_POSTGRES_PASSWORD
	unset PRIVACYPAL_POSTGRES_HOST
	unset PRIVACYPAL_POSTGRES_POR
	unset PRIVACYPAL_POSTGRES_DATABASE

    rm OUTPUT.log
}

# ====================================================================================
# Tests
# ====================================================================================
testPrismaMigrateWasCalled() {
    . $DIR/../include/entrypoint.sh > OUTPUT.log
    local EXPECTED_URL=postgresql://privacypal:password@localhost:5432/privacypal

    assertEquals "$DATABASE_URL" "$EXPECTED_URL"
    assertEquals "$(cat OUTPUT.log)" "migrate deploy"
}

# ====================================================================================
# ====================================================================================

echo "Setting up..."

setUp

# Find all function starting with test (e.g. testPrismaMigrateWasCalled) 
TESTS=($(declare -F | sed -E 's/declare \-f //' | grep -E '^test'))
FAILED_TESTS=()

echo "Running tests..."
echo "----------------------------"

for test in ${TESTS[@]}; do
    STATUS="FAILED"
    if eval $test; then
        STATUS="SUCCESS"
    else
        FAILED_TESTS+=(test)
    fi
    echo "Case $test: $STATUS"
done

echo "----------------------------"
echo "Cleaning up..."

teardown

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo "Finished with failed tests."
    exit 1
fi

echo "Finished. All good."





