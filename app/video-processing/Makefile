# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL := /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

# Image identifier
IMAGE_VERSION ?= 0.1.0-dev
IMAGE_NAME ?= privacypal-vidprocess
DEFAULT_NAMESPACE = ghcr.io/cosc-499-w2023
IMAGE_NAMESPACE ?= $(DEFAULT_NAMESPACE)

VID_PROCESS_IMAGE ?= $(IMAGE_NAMESPACE)/$(IMAGE_NAME):$(IMAGE_VERSION)

# Tools
IMAGE_BUILDER ?= podman

##@ General

.PHONY: help
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


##@ Development

FLAKE ?= flake8
.PHONY: lint
lint: ## Lint source files
	$(FLAKE) *.py

PYTEST ?= pytest
.PHONY: test
test: ## Run unit tests
	$(PYTEST)

##@ Build
.PHONY: oci-build
oci-build: ## Build the OCI image for video processing server.
	$(IMAGE_BUILDER) build -t $(VID_PROCESS_IMAGE) -f ./Dockerfile .

##@ Smoketest

CONTAINER_NAME ?= privacypal_vidprocess
PORT ?= 3000
LOG_FILE ?= vidprocess-run.log
PRIVACYPAL_INPUT_VIDEO_DIR ?= /opt/privacypal/input-videos
PRIVACYPAL_OUTPUT_VIDEO_DIR ?= /opt/privacypal/output-videos
PRIVACYPAL_IS_STATELESS ?= false
PRIVACYPAL_STATE_PRUNE_INTERVAL ?= 60

LOCAL_INPUT_DIR ?= $(shell pwd)/input-videos
LOCAL_OUTPUT_DIR ?= $(shell pwd)/output-videos

DETACHED ?= false

ifeq ($(DETACHED), true)
ADDITIONAL_FLAGS := -d
else
ADDITIONAL_FLAGS := -it
LOG_PIPE := | tee $(LOG_FILE)
endif

.PHONY: run
run: setup-run ## Run the video processing server as a standalone container.
	$(IMAGE_BUILDER) run \
		--name "$(CONTAINER_NAME)" \
		--user 0 \
		-p $(PORT):$(PORT) \
		-e PORT=$(PORT) \
		-e AWS_ACCESS_KEY_ID="$${AWS_ACCESS_KEY_ID}" \
		-e AWS_SECRET_ACCESS_KEY="$${AWS_SECRET_ACCESS_KEY}" \
		-e AWS_SESSION_TOKEN="$${AWS_SESSION_TOKEN}" \
		-e AWS_DEFAULT_REGION="ca-central-1" \
		-e PRIVACYPAL_INPUT_VIDEO_DIR="$(PRIVACYPAL_INPUT_VIDEO_DIR)" \
		-e PRIVACYPAL_OUTPUT_VIDEO_DIR="$(PRIVACYPAL_OUTPUT_VIDEO_DIR)" \
		-e PRIVACYPAL_IS_STATELESS="$(PRIVACYPAL_IS_STATELESS)" \
		-e PRIVACYPAL_STATE_PRUNE_INTERVAL="$(PRIVACYPAL_STATE_PRUNE_INTERVAL)" \
		-v "$(LOCAL_INPUT_DIR)":"$(PRIVACYPAL_INPUT_VIDEO_DIR)":z \
		-v "$(LOCAL_OUTPUT_DIR)":"$(PRIVACYPAL_OUTPUT_VIDEO_DIR)":z \
		--replace $(ADDITIONAL_FLAGS) $(VID_PROCESS_IMAGE) 2>&1 $(LOG_PIPE)

.PHONY: setup-run
setup-run: ## Set up the environment for running video processing server as a standalone container.
	mkdir -p "$(LOCAL_INPUT_DIR)" "$(LOCAL_OUTPUT_DIR)"
