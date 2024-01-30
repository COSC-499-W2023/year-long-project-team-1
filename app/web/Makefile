# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL := /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

# Image identifier
IMAGE_VERSION ?= 0.1.0-dev
IMAGE_NAME ?= privacypal
DEFAULT_NAMESPACE = ghcr.io/cosc-499-w2023
IMAGE_NAMESPACE ?= $(DEFAULT_NAMESPACE)

PRIVACYPAL_IMAGE ?= $(IMAGE_NAMESPACE)/$(IMAGE_NAME):$(IMAGE_VERSION)

# Tools
IMAGE_BUILDER ?= podman

##@ General

.PHONY: help
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Build
.PHONY: oci-build
oci-build: ## Build the OCI image for web server.
	$(IMAGE_BUILDER) build -t $(PRIVACYPAL_IMAGE) -f ./Dockerfile .

CONTAINER_NAME ?= privacypal
PORT ?= 8080
LOG_FILE ?= privacypal-run.log
PRIVACYPAL_INPUT_VIDEO_DIR ?= /opt/privacypal/input-videos
PRIVACYPAL_OUTPUT_VIDEO_DIR ?= /opt/privacypal/output-videos
PRIVACYPAL_AUTH_MANAGER ?= basic
PRIVACYPAL_DEBUG ?= true
PRIVACYPAL_PROCESSOR_URL = http://localhost:3000
DATABASE_URL = postgresql://privacypal:password@localhost:5432/privacypal

.PHONY: run
run: setup-run ## Run the web server as a standalone container.
	$(IMAGE_BUILDER) run --name "$(CONTAINER_NAME)" \
		--user 0 \
		--network host \
		-e NO_COLOR="true" \
		-e PORT=$(PORT) \
		-e AWS_ACCESS_KEY_ID="$${AWS_ACCESS_KEY_ID}" \
		-e AWS_SECRET_ACCESS_KEY="$${AWS_SECRET_ACCESS_KEY}" \
		-e AWS_SESSION_TOKEN="$${AWS_SESSION_TOKEN}" \
		-e AWS_REGION="ca-central-1" \
		-e PRIVACYPAL_CONFIG_DIR="/opt/privacypal" \
		-e PRIVACYPAL_INPUT_VIDEO_DIR="$(PRIVACYPAL_INPUT_VIDEO_DIR)" \
		-e PRIVACYPAL_OUTPUT_VIDEO_DIR="$(PRIVACYPAL_OUTPUT_VIDEO_DIR)" \
		-e PRIVACYPAL_AUTH_MANAGER="$(PRIVACYPAL_AUTH_MANAGER)" \
		-e PRIVACYPAL_DEBUG="$(PRIVACYPAL_DEBUG)" \
		-e PRIVACYPAL_AUTH_SECRET="$$(openssl rand -base64 32)" \
		-e PRIVACYPAL_COOKIE_NAME="privacypal" \
		-e DATABASE_URL="$(DATABASE_URL)" \
		-e PRIVACYPAL_PROCESSOR_URL="$(PRIVACYPAL_PROCESSOR_URL)" \
		-e PRIVACYPAL_S3_BUCKET="privacypal" \
		-e PRIVACYPAL_LAMBDA_NAME="processVideoContainer" \
		-v "$(LOCAL_INPUT_DIR)":"$(PRIVACYPAL_INPUT_VIDEO_DIR)":z \
		-v "$(LOCAL_OUTPUT_DIR)":"$(PRIVACYPAL_OUTPUT_VIDEO_DIR)":z \
		-it --rm $(PRIVACYPAL_IMAGE) 2>&1 | tee $(LOG_FILE)

LOCAL_INPUT_DIR ?= $(shell pwd)/input-videos
LOCAL_OUTPUT_DIR ?= $(shell pwd)/output-videos

.PHONY: setup-run
setup-run: ## Set up the environment for running web server as a standalone container.
	mkdir -p "$(LOCAL_INPUT_DIR)" "$(LOCAL_OUTPUT_DIR)"
