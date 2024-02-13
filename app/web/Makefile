# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL := /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

# Image identifier
IMAGE_VERSION ?= 0.1.0-alpha.3
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

##@ Development

.PHONY: generate-env-local
generate-env-local: ## Create .env.local file for development environment
	cp env.tpl .env.local

##@ Build

.PHONY: oci-build
oci-build: ## Build the OCI image for web server.
	$(IMAGE_BUILDER) build -t $(PRIVACYPAL_IMAGE) -f ./Dockerfile .

##@ Run

CONTAINER_NAME ?= privacypal
PORT ?= 8080
LOG_FILE ?= privacypal-run.log
PRIVACYPAL_AUTH_MANAGER ?= cognito
PRIVACYPAL_DEBUG ?= true
PRIVACYPAL_LAMBDA_NAME ?= processVideoContainer

PRIVACYPAL_TMP_BUCKET ?= privacypal-input
PRIVACYPAL_OUTPUT_BUCKET ?= privacypal-output

DATABASE ?= privacypal
DATABASE_USER ?= privacypal
DATABASE_PASSWORD ?= password
DATABASE_HOSTNAME ?= localhost
DATABASE_PORT ?= 5432

.PHONY: run
run: ## Run the web server as a standalone container.
	$(IMAGE_BUILDER) run --name "$(CONTAINER_NAME)" \
		--network host \
		-e NO_COLOR="true" \
		-e PORT=$(PORT) \
		-e AWS_ACCESS_KEY_ID="$${AWS_ACCESS_KEY_ID}" \
		-e AWS_SECRET_ACCESS_KEY="$${AWS_SECRET_ACCESS_KEY}" \
		-e AWS_SESSION_TOKEN="$${AWS_SESSION_TOKEN}" \
		-e COGNITO_CLIENT=$${COGNITO_CLIENT} \
		-e COGNITO_CLIENT_SECRET=$${COGNITO_CLIENT_SECRET} \
		-e COGNITO_POOL_ID=$${COGNITO_POOL_ID} \
		-e AWS_REGION="ca-central-1" \
		-e PRIVACYPAL_CONFIG_DIR="/opt/privacypal" \
		-e PRIVACYPAL_AUTH_MANAGER="$(PRIVACYPAL_AUTH_MANAGER)" \
		-e PRIVACYPAL_DEBUG="$(PRIVACYPAL_DEBUG)" \
		-e PRIVACYPAL_AUTH_SECRET="$$(openssl rand -base64 32)" \
		-e PRIVACYPAL_COOKIE_NAME="privacypal" \
		-e PRIVACYPAL_POSTGRES_USERNAME=$(DATABASE_USER) \
		-e PRIVACYPAL_POSTGRES_PASSWORD=$(DATABASE_PASSWORD) \
		-e PRIVACYPAL_POSTGRES_HOST=$(DATABASE_HOSTNAME) \
		-e PRIVACYPAL_POSTGRES_PORT=$(DATABASE_PORT) \
		-e PRIVACYPAL_POSTGRES_DATABASE=$(DATABASE) \
		-e PRIVACYPAL_LAMBDA_NAME="$(PRIVACYPAL_LAMBDA_NAME)" \
		-e PRIVACYPAL_OUTPUT_BUCKET="$(PRIVACYPAL_OUTPUT_BUCKET)" \
		-e PRIVACYPAL_TMP_BUCKET="$(PRIVACYPAL_TMP_BUCKET)" \
		-e NEXTAUTH_URL="http://localhost:8080" \
		-e NEXTAUTH_SECRET="$$(openssl rand -base64 32)" \
		-it --rm $(PRIVACYPAL_IMAGE) 2>&1 | tee $(LOG_FILE)
