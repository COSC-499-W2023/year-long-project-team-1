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

##@ Build

oci-build: ## Build the OCI image for video processing server.
	$(IMAGE_BUILDER) build -t $(VID_PROCESS_IMAGE) -f ./Dockerfile .

CONTAINER_NAME ?= privacypal_vidprocess
PORT ?= 3000
LOG_FILE ?= vidprocess-run.log
VIDEO_DIR ?= ./videos
run: ## Run the video processing server as a standalone container.
	[ -d "$(VIDEO_DIR)" ] || mkdir -p $(VIDEO_DIR)
	$(IMAGE_BUILDER) run --name "$(CONTAINER_NAME)" \
		-p $(PORT):$(PORT) \
		-e PORT=$(PORT) \
		-e AWS_ACCESS_KEY_ID="$${AWS_ACCESS_KEY_ID}" \
		-e AWS_SECRET_ACCESS_KEY="$${AWS_SECRET_ACCESS_KEY}" \
		-e AWS_SESSION_TOKEN="$${AWS_SESSION_TOKEN}" \
		-e AWS_DEFAULT_REGION="ca-central-1" \
		-e PRIVACYPAL_INPUT_VIDEO_DIR="/opt/privacypal/videos/input_videos" \
		-e PRIVACYPAL_OUT_VIDEO_DIR="/opt/privacypal/videos/out_videos" \
		-v $(VIDEO_DIR):/opt/privacypal/videos:z \
		-it --rm $(VID_PROCESS_IMAGE) 2>&1 | tee $(LOG_FILE)
